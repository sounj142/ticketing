import express from 'express';

const app = express();
app.use(express.json());

app.get('/api/users/currentuser', (req, res) => {
  res.send('Xin chao!');
});

const port = 3000;
app.listen(port, () => {
  console.log(`Listening on port ${port}...`);
});
