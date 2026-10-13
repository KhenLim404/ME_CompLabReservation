const express = require('express');
const fs = require('fs');

const app = express();
app.use(express.json());
app.use(express.static('public'));

function readData() {
  return JSON.parse(fs.readFileSync('data.json'));
}
function saveData(data) {
  fs.writeFileSync('data.json', JSON.stringify(data, null, 2));
}

app.get('/api/reservations', (req, res) => {
  res.json(readData());
});

app.get('/api/reservations/:id', (req, res) => {
  const reservation = readData().find(r => r.id === Number(req.params.id));
  if (!reservation) {
    return res.status(404).json({ error: 'Reservation not found.' });
  }
  res.json(reservation);
});

app.post('/api/reservations', (req, res) => {
  const { student_name, lab, date, number_of_seats, purpose } = req.body;

  if (!student_name || !lab || !date || !purpose) {
    return res.status(400).json({ error: 'All fields are required.' });
  }

  const seats = Number(number_of_seats);
  if (!Number.isInteger(seats) || seats <= 0) {
    return res.status(400).json({ error: 'Seats must be a whole number greater than 0.' });
  }
  if (seats > 30) {
    return res.status(400).json({ error: 'Seats cannot be more than 30.' });
  }

  const data = readData();
  const newReservation = {
    id: Math.max(0, ...data.map(r => r.id)) + 1,
    student_name,
    lab,
    date,
    number_of_seats: seats,
    purpose
  };

  data.push(newReservation);
  saveData(data);
  res.status(201).json(newReservation);
});

app.delete('/api/reservations/:id', (req, res) => {
  const data = readData();
  const index = data.findIndex(r => r.id === Number(req.params.id));
  if (index === -1) {
    return res.status(404).json({ error: 'Reservation not found.' });
  }

  data.splice(index, 1);
  saveData(data);
  res.json({ message: 'Reservation deleted.' });
});

app.listen(3000, () => {
  console.log('Server running at http://localhost:3000');
});
