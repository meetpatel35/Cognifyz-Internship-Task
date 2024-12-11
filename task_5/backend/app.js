const express = require('express');
const cors = require('cors');
const app = express();
const connectToDatabase = require('./db')

let users = [];

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
    res.send('API is working!');
});

app.post('/signup', (req, res) => {
    const { name, email, password } = req.body;

    if (!name || name.length < 3) {
        return res.status(400).json({ error: 'Name must be at least 3 characters long.' });
    }
    if (!email || !email.includes('@')) {
        return res.status(400).json({ error: 'Invalid email.' });
    }
    if (!password || password.length < 6) {
        return res.status(400).json({ error: 'Password must be at least 6 characters long.' });
    }

    if (users.some((user) => user.email === email)) {
        return res.status(400).json({ error: 'User already exists.' });
    }

    users.push({ name, email, password });
    console.log(users)
    res.status(201).json({ message: 'Signup successful!' });
});


app.post('/login', (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ error: 'Email and password are required.' });
    }

    const user = users.find((user) => user.email === email && user.password === password);
    if (!user) {
        return res.status(401).json({ error: 'Invalid credentials.' });
    }
    console.log("login success")
    res.status(200).json({ message: 'Login successful!', user: { name: user.name, email: user.email } });
});

app.post('/expenses', async(req, res) => {
    const {email, expenseName, expenseType, expenseAmount, expenseDate, expenseTime } = req.body;

    if (!expenseName || expenseName.length < 3) {
        return res.status(400).json({ error: 'Expense name must be at least 3 characters long.' });
    }
    if (!expenseType) {
        return res.status(400).json({ error: 'Expense type is required.' });
    }
    if (!expenseAmount || expenseAmount <= 0) {
        return res.status(400).json({ error: 'Expense amount must be greater than 0.' });
    }
    const {users, expensesdb} = await connectToDatabase();
    const addNote = await expensesdb.insertOne(
        {email, expenseName, expenseType, expenseAmount, expenseDate, expenseTime}
    )

    expenses =  await expensesdb.find({email}).toArray()

    res.status(201).json({ message: 'Expense added successfully!', expenses});
});

app.get('/expenses', async (req, res) => {
    const email = req.query.email; // Extract email from query
    try {
        const { expensesdb } = await connectToDatabase(); // Connect to DB
        const expenses = await expensesdb.find({ email }).toArray(); // Fetch expenses
        res.status(200).json({ message: 'Expenses fetched successfully!', expenses });
    } catch (error) {
        console.error('Error fetching expenses:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});


app.delete('/expenses/:id', async (req, res) => {
    const { id } = req.params;
    try {
      const { expensesdb ,ObjectId } = await connectToDatabase();
      const result = await expensesdb.deleteOne({ _id: new ObjectId(id) });
      if (result.deletedCount === 0) {
        return res.status(404).json({ message: 'Expense not found.' });
      }
  
      res.status(200).json({ message: 'Expense deleted successfully!' });
    } catch (error) {
      console.error("Error deleting expense:", error);
      res.status(500).json({ message: 'Failed to delete expense' });
    }
  });
  

const PORT = 5000;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
