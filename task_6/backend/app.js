const verifyToken = require("./middleware/verifyToken");
const express = require("express");
const cors = require("cors");
const jwt = require("jsonwebtoken");
const app = express();
const connectToDatabase = require("./db");

const JWT_SECRET = "jwtsecret"; //Use ENV for better approach

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("API is working!");
});

app.post("/signup", async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || name.length < 3) {
    return res.status(400).json({ error: "Name must be at least 3 characters long." });
  }
  if (!email || !email.includes("@")) {
    return res.status(400).json({ error: "Invalid email." });
  }
  if (!password || password.length < 6) {
    return res.status(400).json({ error: "Password must be at least 6 characters long." });
  }

  try {
    const { users } = await connectToDatabase();
    const existingUser = await users.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: "User already exists." });
    }

    await users.insertOne({ name, email, password });
    res.status(201).json({ message: "Signup successful!" });
  } catch (error) {
    console.error("Error during signup:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.post("/login", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: "Email and password are required." });
  }

  try {
    const { users } = await connectToDatabase();
    const user = await users.findOne({ email, password });
    if (!user) {
      return res.status(401).json({ error: "Invalid credentials." });
    }

    // Generate JWT token
    const token = jwt.sign({ email: user.email, name: user.name }, JWT_SECRET, { expiresIn: "1h" });
    res.status(200).json({ message: "Login successful!", token });
  } catch (error) {
    console.error("Error during login:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.get("/expenses", verifyToken, async (req, res) => {
  try {
    const { expensesdb } = await connectToDatabase();
    const expenses = await expensesdb.find({ email: req.user.email }).toArray();
    res.status(200).json({ message: "Expenses fetched successfully!", expenses });
  } catch (error) {
    console.error("Error fetching expenses:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

app.post("/expenses", verifyToken, async (req, res) => {
  const { expenseName, expenseType, expenseAmount, expenseDate, expenseTime } = req.body;

  if (!expenseName || expenseName.length < 3) {
    return res.status(400).json({ error: "Expense name must be at least 3 characters long." });
  }
  if (!expenseType) {
    return res.status(400).json({ error: "Expense type is required." });
  }
  if (!expenseAmount || expenseAmount <= 0) {
    return res.status(400).json({ error: "Expense amount must be greater than 0." });
  }

  try {
    const { expensesdb } = await connectToDatabase();
    await expensesdb.insertOne({
      email: req.user.email,
      expenseName,
      expenseType,
      expenseAmount,
      expenseDate,
      expenseTime,
    });

    const expenses = await expensesdb.find({ email: req.user.email }).toArray();
    res.status(201).json({ message: "Expense added successfully!", expenses });
  } catch (error) {
    console.error("Error adding expense:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.delete("/expenses/:id", verifyToken, async (req, res) => {
  const { id } = req.params;
  try {
    const { expensesdb, ObjectId } = await connectToDatabase();
    const result = await expensesdb.deleteOne({ _id: new ObjectId(id), email: req.user.email });
    if (result.deletedCount === 0) {
      return res.status(404).json({ message: "Expense not found." });
    }

    res.status(200).json({ message: "Expense deleted successfully!" });
  } catch (error) {
    console.error("Error deleting expense:", error);
    res.status(500).json({ message: "Failed to delete expense" });
  }
});


app.put("/expenses/:id", verifyToken, async (req, res) => {
  const { id } = req.params;
  const { expenseName, expenseType, expenseAmount, expenseDate, expenseTime } = req.body;
  const { expensesdb, ObjectId } = await connectToDatabase();

  if (!ObjectId.isValid(id)) {
    return res.status(400).json({ message: "Invalid expense ID." });
  }

  try {
    const result = await expensesdb.updateOne(
      { _id: new ObjectId(id) },
      {
        $set: {
          expenseName,
          expenseType,
          expenseAmount,
          expenseDate,
          expenseTime,
        },
      }
    );

    if (result.matchedCount === 0) {
      return res.status(404).json({ message: "Expense not found." });
    }

    const expenses = await expensesdb.find({ email: req.user.email }).toArray();
    res.status(201).json({ message: "Expense Edited successfully!", expenses });

  } catch (error) {
    console.error("Error updating expense:", error);
    res.status(500).json({ message: "Internal server error." });
  }
});


const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
