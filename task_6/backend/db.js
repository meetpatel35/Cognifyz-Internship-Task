const { MongoClient ,ObjectId } = require('mongodb');

const uri = 'mongodb://localhost:27017';
const client = new MongoClient(uri);

async function connectToDatabase() {
    try {
        await client.connect();
        // console.log('Connected to MongoDB!');

        const db = client.db('expensetracker'); 
        const expensesdb = db.collection('expenses');
        const users = db.collection('users');
        return {users,expensesdb,ObjectId}
    } catch (error) {
        console.error('Error connecting to MongoDB:', error);
    }
}

connectToDatabase();
module.exports = connectToDatabase