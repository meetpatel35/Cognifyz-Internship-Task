const express = require('express');
const path = require('path');
const app = express();

let expenses = []; // Temporary server-side storage

// Middleware to parse form data
app.use(express.urlencoded({ extended: true }));

// Set EJS as the templating engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Routes
app.get('/', (req, res) => {
    res.render('home');
});

app.get('/about', (req, res) => {
    res.render('about');
});

app.post('/submit-expense', (req, res) => {
    const { expenseName, expenseType, expenseAmount, expenseDate, expenseTime } = req.body;

    // Server-side validation
    if (!expenseName || expenseName.length < 3) {
        return res.status(400).send('Expense name must be at least 3 characters long.');
    }
    if (!expenseType) {
        return res.status(400).send('Expense type is required.');
    }
    if (expenseAmount <= 0) {
        return res.status(400).send('Expense amount must be greater than 0.');
    }

    // Add the validated data to the server-side storage
    expenses.push({
        expenseName,
        expenseType,
        expenseAmount: parseFloat(expenseAmount),
        expenseDate,
        expenseTime,
    });

    console.log(expenses); // Debugging: Print stored expenses
    res.send('Expense submitted successfully!');
});


// Start the server
const PORT = 5000;
app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
});
