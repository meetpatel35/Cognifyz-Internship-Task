const { MongoClient } = require('mongodb');

// MongoDB connection string
const uri = 'mongodb://localhost:27017'; // Replace with your MongoDB URI

// Create a new MongoClient
const client = new MongoClient(uri);

async function connectToDatabase() {
    try {
        // Connect the client to the server
        await client.connect();
        console.log('Connected to MongoDB!');

        // Access the database
        const db = client.db('expensetracker'); // Replace with your database name

        // Example: Access a collection and insert a document
        const expensesCollection = db.collection('expenses');

        console.log('Expense added:', result.insertedId);
    } catch (error) {
        console.error('Error connecting to MongoDB:', error);
    } finally {
        // Close the connection
        await client.close();
    }
}

connectToDatabase();
