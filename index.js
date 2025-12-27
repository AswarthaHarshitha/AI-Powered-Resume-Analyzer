const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config();
const connectDB = require('./config/db');
const authRoutes = require('./routes/auth');
const resumeRoutes = require('./routes/resume');
const healthRoutes = require('./routes/health');

const app = express();
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(morgan('dev'));

connectDB();

app.use('/api/auth', authRoutes);
app.use('/api/resumes', resumeRoutes);
app.use('/api/health', healthRoutes);

app.get('/', (req, res) => res.json({ message: 'Resume Analyzer API' }));

const PORT = parseInt(process.env.PORT || '5000', 10);

// health endpoint
app.get('/api/health', async (req, res) => {
	const mongoose = require('mongoose');
	const dbState = mongoose.connection.readyState; // 0 disconnected, 1 connected
	const openaiConfigured = !!process.env.OPENAI_API_KEY;
	res.json({ ok: true, dbState, openaiConfigured });
});

function tryListen(port, triesLeft = 10) {
	if (process.env.NODE_ENV === 'test') return;
	const server = app.listen(port, () => {
		console.log(`Server running on port ${port}`);
	});

	server.on('error', (err) => {
		if (err.code === 'EADDRINUSE' && triesLeft > 0) {
			console.warn(`Port ${port} in use, trying ${port + 1}...`);
			setTimeout(() => tryListen(port + 1, triesLeft - 1), 200);
		} else {
			console.error('Server failed to start:', err.message || err);
			process.exit(1);
		}
	});
}

tryListen(PORT, 10);

module.exports = app;
