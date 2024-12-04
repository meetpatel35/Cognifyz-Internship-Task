// app.js
const express = require('express');
const app = express();
const path = require('path');

app.use(express.urlencoded({ extended: true }));
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
    const currentDate = new Date()
    console.log(currentDate)
    const istOffset = 5.5 * 60 * 60 * 1000; // 5 hours 30 minutes in milliseconds
    const istDate = new Date(currentDate.getTime() + istOffset); // Convert to IST

    const currentDateString = istDate.toString().split('T')[0]; 
    const currentTimeString = istDate.toISOString().split('T')[1].split('.')[0];
    
    res.render('index', { currentDate: currentDateString, currentTime: currentTimeString });
});

app.post('/submit-expense', (req, res) => {
    const { expenseName, expenseType, expenseAmount, expenseDate, expenseTime } = req.body;

    console.log('Expense Submitted:', { expenseName, expenseType, expenseAmount, expenseDate, expenseTime });
    res.send('Expense submitted successfully!');
});


app.listen(5000, () => {
    console.log('Server is running on http://localhost:5000');
});
