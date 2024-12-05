const express = require('express');
const app = express();
const path = require('path');

app.use(express.urlencoded({ extended: true }));

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

let expenses = [];

app.get('/', (req, res) => {
    const currentDate = new Date();
    const istOffset = 5.5 * 60 * 60 * 1000; // 5 hours 30 minutes in milliseconds
    const istDate = new Date(currentDate.getTime() + istOffset);

    const currentDateString = istDate.toISOString().split('T')[0]; // YYYY-MM-DD format
    const currentTimeString = istDate.toISOString().split('T')[1].split('.')[0]; // HH:MM:SS format
    
    res.render('index', { currentDate: currentDateString, currentTime: currentTimeString });
});

app.post('/submit-expense', (req, res) => {
    const { expenseName, expenseType, expenseAmount, expenseDate, expenseTime } = req.body;

    // Server-side validation
    if (!expenseName || !expenseAmount || expenseAmount <= 0) {
        return res.status(400).send('Invalid data! Ensure all fields are filled correctly.');
    }

    const newExpense = {
        expenseName,
        expenseType,
        expenseAmount,
        expenseDate,
        expenseTime,
    };

    expenses.push(newExpense);
    console.log(expenses)
    res.send('Expense submitted successfully!');
});

app.listen(5000, () => {
    console.log('Server is running on http://localhost:5000');
});
