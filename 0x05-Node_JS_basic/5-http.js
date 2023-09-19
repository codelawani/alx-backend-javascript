const http = require('http');

const host = '127.0.0.1';
const port = 1245;

const fs = require('fs');

function handleData(data) {
  const lines = data.split('\n').filter((line) => line !== 'firstname,lastname,age,field');
  const cs = [];
  const swe = [];
  const students = lines.map((line) => line.split(','));
  for (const student of students) {
    if (student) {
      if (student[3] === 'CS') {
        cs.push(student[0]);
      } else if (student[3] === 'SWE') {
        swe.push(student[0]);
      }
    }
  }

  return (
    `Number of students: ${cs.length + swe.length}\n`
    + `Number of students in CS: ${cs.length}. List: ${cs.join(', ')}\n`
    + `Number of students in SWE: ${swe.length}. List: ${swe.join(', ')}`
  );
}
function countStudents(filePath) {
  return new Promise((resolve, reject) => {
    fs.readFile(filePath, 'utf8', (error, data) => {
      if (error) {
        reject(new Error('Cannot load database'));
      } else {
        resolve(handleData(data));
      }
    });
  });
}
const app = http.createServer(async (req, res) => {
  res.statusCode = 200;
  res.setHeader('Content-Type', 'text/plain; charset=utf-8');
  if (req.url === '/students') {
    res.write('This is the list of our students\n');
    countStudents(process.argv[2])
      .then((data) => res.end(data))
      .catch((error) => res.end(error.message));
  } else if (req.url === '/') {
    res.end('Hello Holberton School!');
  }
});
app.listen(port, host, () => {
  console.log(`server running on http://${host}:${port}`);
});

module.exports = app;
