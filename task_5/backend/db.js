const { MongoClient ,ObjectId } = require('mongodb');

// MongoDB connection string
const uri = 'mongodb://localhost:27017'; // Replace with your MongoDB URI
const client = new MongoClient(uri);

async function connectToDatabase() {
    try {
        await client.connect();
        console.log('Connected to MongoDB!');

       
        const db = client.db('expensetracker'); // Replace with your database name
        const expensesdb = db.collection('expenses');
        const users = db.collection('users');
        return {users,expensesdb,ObjectId}
    } catch (error) {
        console.error('Error connecting to MongoDB:', error);
    }
}

connectToDatabase();
module.exports = connectToDatabase