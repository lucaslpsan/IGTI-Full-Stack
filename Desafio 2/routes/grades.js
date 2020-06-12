import express from 'express';
import { promises } from 'fs';

const router = express.Router();
const { readFile, writeFile } = promises;

async function readGrades() {
  let data = await readFile('./grades.json', 'utf8');
  return JSON.parse(data);
}

router.get('/', async (req, res) => {
  try {
    res.send(await readGrades());
  } catch (err) {
    res.status(400).send({ erro: err.message });
  }
});

router.get('/sum', async (req, res) => {
  let { student, subject } = req.body;
  try {
    let json = await readGrades();
    let sum = json.grades.reduce((acc, curr) => {
      if (curr.student == student && curr.subject == subject)
        return acc + curr.value;
      return acc;
    }, 0);

    res.send({ sum: sum });
  } catch (err) {
    res.status(400).send({ erro: err.message });
  }
});

router.get('/avg', async (req, res) => {
  let { subject, type } = req.body;
  try {
    let json = await readGrades();
    let count = 0;
    let sum = json.grades.reduce((acc, curr) => {
      if (curr.subject == subject && curr.type == type) {
        count++;
        return acc + curr.value;
      }
      return acc;
    }, 0);

    res.send({ avg: sum / count, sum: sum, count: count });
  } catch (err) {
    res.status(400).send({ erro: err.message });
  }
});

router.get('/best', async (req, res) => {
  let { subject, type } = req.body;
  try {
    let json = await readGrades();
    let top3 = [];

    let grades = json.grades.filter(
      (grade) => grade.subject == subject && grade.type == type
    );

    grades.sort((a, b) => {
      return b.value - a.value;
    });

    top3.push(grades[0]);
    top3.push(grades[1]);
    top3.push(grades[2]);

    res.send(top3);
  } catch (err) {
    res.status(400).send({ erro: err.message });
  }
});

router.get('/:id', async (req, res) => {
  let { id } = req.params;
  try {
    let json = await readGrades();
    let grade = json.grades.find((grade) => grade.id == id);

    if (!grade) throw new Error('Grade not found!');

    res.send(grade);
  } catch (err) {
    res.status(400).send({ erro: err.message });
  }
});

router.post('/', async (req, res) => {
  let { student, subject, type, value } = req.body;
  try {
    let json = await readGrades();

    json.grades.push({
      id: json.nextId++,
      student: student,
      subject: subject,
      type: type,
      value: value,
      timestamp: new Date(),
    });

    await writeFile('grades.json', JSON.stringify(json));

    res.send(json.grades.pop()); //retorna o grade inserido
  } catch (err) {
    res.status(400).send({ erro: err.message });
  }
});

router.put('/', async (req, res) => {
  let { id, student, subject, type, value } = req.body;
  try {
    let json = await readGrades();
    let index = json.grades.findIndex((grade) => grade.id == id);

    if (index === -1) throw new Error('Grade not found!');

    json.grades[index] = {
      id: id,
      student: student ? student : json.grades[index].student,
      subject: subject ? subject : json.grades[index].subject,
      type: type ? type : json.grades[index].type,
      value: value ? value : json.grades[index].value,
      timestamp: new Date(),
    };

    await writeFile('grades.json', JSON.stringify(json));

    res.send(json.grades[index]); //retorna o grade inserido
  } catch (err) {
    res.status(400).send({ erro: err.message });
  }
});

router.delete('/:id', async (req, res) => {
  let { id } = req.params;
  try {
    let json = await readGrades();
    let grades = json.grades.filter((grade) => grade.id != id);
    json.grades = grades;

    await writeFile('grades.json', JSON.stringify(json));

    res.end();
  } catch (err) {
    res.status(400).send({ erro: err.message });
  }
});

export default router;
