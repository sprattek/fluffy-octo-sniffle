import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();

app.use(cors({ origin: true, credentials: true }));
app.use(express.json());

app.get('/', (_req, res) => {
	res.json({ message: 'API running' });
});

app.listen(4000, () => {
	console.log('🚀 API server listening on http://localhost:4000');
});
