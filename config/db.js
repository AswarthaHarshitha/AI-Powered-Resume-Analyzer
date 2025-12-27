const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();

const useInMemory = process.env.USE_IN_MEMORY_DB === 'true';

async function startInMemoryMongo() {
  // lazy-load to avoid requiring heavy package when not used
  const { MongoMemoryServer } = require('mongodb-memory-server');
  const mongod = await MongoMemoryServer.create();
  const uri = mongod.getUri();
  return { uri, stop: () => mongod.stop() };
}

const connectDB = async () => {
  try {
    let uri = process.env.MONGODB_URI;
    if (!uri && useInMemory) {
      console.log('Starting in-memory MongoDB for demo/testing...');
      const mem = await startInMemoryMongo();
      uri = mem.uri;
      // keep reference so process doesn't exit; attach to mongoose for potential cleanup
      mongoose._inMemoryStop = mem.stop;
    }

    uri = uri || 'mongodb://localhost:27017/resume_analyzer';
    await mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });
    console.log('MongoDB connected to', uri);
  } catch (err) {
    console.error('MongoDB connection error:', err.message || err);
    // do not exit; let health endpoint report error and server continue for debugging
  }
};

module.exports = connectDB;
