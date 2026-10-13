const API = '/api/reservations';

function showMessage(text, type) {
  const box = document.getElementById('message');
  box.textContent = text;
  box.className = type;
}

async function loadReservations() {
  const res = await fetch(API);
  const reservations = await res.json();

  let rows = '';
  for (const r of reservations) {
    rows += `<tr>
      <td>${r.id}</td>
      <td>${r.student_name}</td>
      <td>${r.lab}</td>
      <td>${r.date}</td>
      <td>${r.number_of_seats}</td>
      <td>${r.purpose}</td>
      <td><button onclick="deleteReservation(${r.id})">Delete</button></td>
    </tr>`;
  }
  document.getElementById('tableBody').innerHTML = rows;
}

document.getElementById('addForm').addEventListener('submit', async (e) => {
  e.preventDefault();

  const reservation = {
    student_name: document.getElementById('student_name').value,
    lab: document.getElementById('lab').value,
    date: document.getElementById('date').value,
    number_of_seats: document.getElementById('number_of_seats').value,
    purpose: document.getElementById('purpose').value
  };

  const res = await fetch(API, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(reservation)
  });
  const data = await res.json();

  if (res.status === 201) {
    showMessage('Reservation added!', 'success');
    e.target.reset();
    loadReservations();
  } else {
    showMessage(data.error, 'error');
  }
});

async function searchById() {
  const id = document.getElementById('searchId').value;
  const res = await fetch(API + '/' + id);
  const data = await res.json();

  if (res.ok) {
    document.getElementById('searchResult').textContent =
      `ID ${data.id}: ${data.student_name}, ${data.lab}, ${data.date}, ${data.number_of_seats} seats, ${data.purpose}`;
    showMessage('Reservation found.', 'success');
  } else {
    document.getElementById('searchResult').textContent = '';
    showMessage(data.error, 'error');
  }
}

async function deleteReservation(id) {
  const res = await fetch(API + '/' + id, { method: 'DELETE' });
  const data = await res.json();

  if (res.ok) {
    showMessage(data.message, 'success');
    loadReservations();
  } else {
    showMessage(data.error, 'error');
  }
}

loadReservations();
