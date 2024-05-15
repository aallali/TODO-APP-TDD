import express from 'express';
import dotenv from 'dotenv';


const app = express();
 
dotenv.config(); // 3afak khdmi

const PORT = process.env.PORT || 4242;

app.get('/health', (req, res) => {
  res.send('Good!');
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
