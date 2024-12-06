const express = require('express');
const cors = require('cors'); // To enable cross-origin requests
const app = express();

// Temporary in-memory storage for users and expenses
let users = [];
let expenses = [];

// Middleware
app.use(cors());
app.use(express.json()); // To parse JSON request bodies

app.get('/', (req, res) => {
    res.send('API is working!');
});

// User Signup
app.post('/signup', (req, res) => {
    const { name, email, password } = req.body;

    // Validation
    if (!name || name.length < 3) {
        return res.status(400).json({ error: 'Name must be at least 3 characters long.' });
    }
    if (!email || !email.includes('@')) {
        return res.status(400).json({ error: 'Invalid email.' });
    }
    if (!password || password.length < 6) {
        return res.status(400).json({ error: 'Password must be at least 6 characters long.' });
    }

    // Check if user already exists
    if (users.some((user) => user.email === email)) {
        return res.status(400).json({ error: 'User already exists.' });
    }

    // Save user
    users.push({ name, email, password });
    res.status(201).json({ message: 'Signup successful!' });
});

// User Login
app.post('/login', (req, res) => {
    const { email, password } = req.body;

    // Validation
    if (!email || !password) {
        return res.status(400).json({ error: 'Email and password are required.' });
    }

    // Authenticate user
    const user = users.find((user) => user.email === email && user.password === password);
    if (!user) {
        return res.status(401).json({ error: 'Invalid credentials.' });
    }

    res.status(200).json({ message: 'Login successful!', user: { name: user.name, email: user.email } });
});

// Add Expense
app.post('/expenses', (req, res) => {
    const { expenseName, expenseType, expenseAmount, expenseDate, expenseTime } = req.body;

    // Validation
    if (!expenseName || expenseName.length < 3) {
        return res.status(400).json({ error: 'Expense name must be at least 3 characters long.' });
    }
    if (!expenseType) {
        return res.status(400).json({ error: 'Expense type is required.' });
    }
    if (!expenseAmount || expenseAmount <= 0) {
        return res.status(400).json({ error: 'Expense amount must be greater than 0.' });
    }

    // Add expense to the list
    expenses.push({ expenseName, expenseType, expenseAmount, expenseDate, expenseTime });
    res.status(201).json({ message: 'Expense added successfully!', expenses });
});

// Get All Expenses
app.get('/expenses', (req, res) => {
    res.status(200).json({ expenses });
});

// Delete an Expense
app.delete('/expenses/:id', (req, res) => {
    const { id } = req.params;

    // Check if the expense exists
    if (id < 0 || id >= expenses.length) {
        return res.status(404).json({ error: 'Expense not found.' });
    }

    // Remove expense
    expenses.splice(id, 1);
    res.status(200).json({ message: 'Expense deleted successfully!', expenses });
});

// Start the server
const PORT = 5000;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
