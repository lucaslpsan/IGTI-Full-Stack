import express from 'express';
import grades from '../routes/grades.js';

const app = express();
app.use(express.json());
app.use('/grades', grades);

app.listen(3000, () => {
  console.log('App started!');
});
