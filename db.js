const { MongoClient } = require('mongodb');

const uri = `mongodb+srv://${process.env.MONGO_DB_USER}:${process.env.MONGO_DB_PASSWORD}@${process.env.MONGO_DB_APP}.rvlhej8.mongodb.net/?retryWrites=true&w=majority&appName=${process.env.MONGO_DB_APP}`;
const client = new MongoClient(uri);

let db;

async function connectToDatabase() {
  if (db) return db;
  try {
    await client.connect();
    db = client.db(process.env.MONGO_DB_DATABASE);
    console.log('✅ Connected to MongoDB Atlas');
    return db;
  } catch (err) {
    console.error('❌ MongoDB connection error:', err);
    throw err;
  }
}

module.exports = connectToDatabase;
