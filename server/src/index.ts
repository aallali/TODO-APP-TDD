import express from 'express';
import dotenv from 'dotenv';
import connectionDB from './database/config';

const app = express();

dotenv.config(); // 3afak khdmi

const PORT = process.env.PORT || 4242;

// console.log(process.env.MONGO_URL, process.env.PORT)
connectDB();
app.get('/health', (req, res) => {
    res.json({
        status: 'OK',
        message: "Nadi Kanadi"
    });
});


app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});

export default app;
