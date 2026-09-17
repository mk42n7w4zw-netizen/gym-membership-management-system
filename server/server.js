const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const Database = require('better-sqlite3');

const app = express();
const PORT = 3001;
const dataDir = path.join(__dirname, '..', 'data');
fs.mkdirSync(dataDir, { recursive: true });

const db = new Database(path.join(dataDir, 'gym.db'));

const initializeDb = () => {
  db.exec(`
    CREATE TABLE IF NOT EXISTS members (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      email TEXT,
      phone TEXT,
      plan TEXT,
      status TEXT,
      renewal TEXT,
      trainer TEXT,
      joined TEXT
    );

    CREATE TABLE IF NOT EXISTS attendance (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      member_name TEXT,
      type TEXT,
      time TEXT
    );

    CREATE TABLE IF NOT EXISTS classes (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT,
      coach TEXT,
      time TEXT,
      seats INTEGER,
      intensity TEXT
    );

    CREATE TABLE IF NOT EXISTS payments (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      member_name TEXT,
      amount TEXT,
      due TEXT
    );
  `);

  const memberCount = db.prepare('SELECT COUNT(*) AS count FROM members').get()?.count || 0;
  if (memberCount === 0) {
    const insertMember = db.prepare('INSERT INTO members (id, name, email, phone, plan, status, renewal, trainer, joined) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)');
    const insertAttendance = db.prepare('INSERT INTO attendance (member_name, type, time) VALUES (?, ?, ?)');
    const insertClass = db.prepare('INSERT INTO classes (name, coach, time, seats, intensity) VALUES (?, ?, ?, ?, ?)');
    const insertPayment = db.prepare('INSERT INTO payments (member_name, amount, due) VALUES (?, ?, ?)');

    db.transaction(() => {
      for (const member of [
        ['MEM-2049', 'Addison Lee', 'addison@example.com', '+1 555 0101', 'Gold', 'Active', 'Sep 28', 'Nina Patel', '2025-01-12'],
        ['MEM-1187', 'Marcus Chen', 'marcus@example.com', '+1 555 0102', 'Platinum', 'Pending', 'Sep 30', 'Theo Walker', '2025-02-04'],
        ['MEM-3321', 'Riya Shah', 'riya@example.com', '+1 555 0103', 'Elite', 'Active', 'Oct 04', 'Maya Brooks', '2025-03-19'],
        ['MEM-4470', 'Daniel Kim', 'daniel@example.com', '+1 555 0104', 'Basic', 'Expired', 'Sep 11', 'Nina Patel', '2024-11-28'],
        ['MEM-6715', 'Olivia Brooks', 'olivia@example.com', '+1 555 0105', 'Gold', 'Active', 'Oct 08', 'Theo Walker', '2025-04-02'],
        ['MEM-8922', 'Sofia Green', 'sofia@example.com', '+1 555 0106', 'Premium', 'Active', 'Oct 14', 'Maya Brooks', '2025-05-16'],
      ]) insertMember.run(...member);

      insertAttendance.run('Mila Torres', 'Strength', '7:12 AM');
      insertAttendance.run('Noah Patel', 'Cardio', '7:30 AM');
      insertAttendance.run('Emma Ross', 'Yoga', '8:05 AM');
      insertAttendance.run('Liam Foster', 'HIIT', '8:15 AM');

      insertClass.run('HIIT Burn', 'Maya Brooks', '6:30 AM', 6, 'High');
      insertClass.run('Strength Lab', 'Theo Walker', '9:00 AM', 4, 'Moderate');
      insertClass.run('Cycle Sprint', 'Nina Patel', '12:15 PM', 8, 'High');
      insertClass.run('Mobility Flow', 'Maya Brooks', '6:00 PM', 11, 'Low');

      insertPayment.run('Jasper Nash', '$94.00', 'Today');
      insertPayment.run('Chloe Griffin', '$120.00', 'Tomorrow');
      insertPayment.run('Owen Bennett', '$88.00', 'Thu');
      insertPayment.run('Harper James', '$142.00', 'Fri');
    })();
  }
};

initializeDb();
app.use(cors());
app.use(express.json());

app.get('/api/dashboard', (req, res) => {
  const members = db.prepare('SELECT * FROM members ORDER BY joined DESC').all();
  const attendance = db.prepare('SELECT * FROM attendance ORDER BY id DESC LIMIT 4').all();
  const classes = db.prepare('SELECT * FROM classes ORDER BY id ASC').all();
  const payments = db.prepare('SELECT * FROM payments ORDER BY id ASC').all();

  res.json({
    stats: [
      { label: 'Active Members', value: '1,284', change: '+12.4%', trend: 'up', detail: 'vs last month' },
      { label: 'Monthly Revenue', value: '$84.8K', change: '+8.7%', trend: 'up', detail: 'across all plans' },
      { label: 'Avg. Attendance', value: '76%', change: '-2.1%', trend: 'down', detail: 'this week' },
      { label: 'Renewals Due', value: '48', change: '+5.2%', trend: 'up', detail: 'next 7 days' },
    ],
    revenueData: [
      { month: 'Jan', value: 54 }, { month: 'Feb', value: 68 }, { month: 'Mar', value: 62 },
      { month: 'Apr', value: 82 }, { month: 'May', value: 74 }, { month: 'Jun', value: 90 }, { month: 'Jul', value: 88 },
    ],
    members,
    attendance,
    classes,
    payments,
  });
});

app.get('/api/members', (req, res) => {
  res.json(db.prepare('SELECT * FROM members ORDER BY joined DESC').all());
});

app.post('/api/members', (req, res) => {
  const { name, email, phone, plan } = req.body || {};
  if (!name) return res.status(400).json({ error: 'Member name is required.' });

  const member = {
    id: `MEM-${Math.floor(1000 + Math.random() * 8999)}`,
    name,
    email: email || `${name.toLowerCase().replace(/\s+/g, '.')}@example.com`,
    phone: phone || '+1 555 0100',
    plan: plan || 'Gold',
    status: 'Active',
    renewal: 'Oct 30',
    trainer: 'Unassigned',
    joined: new Date().toISOString().slice(0, 10),
  };

  db.prepare('INSERT INTO members (id, name, email, phone, plan, status, renewal, trainer, joined) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)')
    .run(member.id, member.name, member.email, member.phone, member.plan, member.status, member.renewal, member.trainer, member.joined);

  res.status(201).json(member);
});

app.delete('/api/members/:id', (req, res) => {
  const result = db.prepare('DELETE FROM members WHERE id = ?').run(req.params.id);
  if (result.changes === 0) return res.status(404).json({ error: 'Member not found.' });
  res.json({ removed: req.params.id });
});

app.get('/api/classes', (req, res) => {
  res.json(db.prepare('SELECT * FROM classes ORDER BY id ASC').all());
});

app.get('/api/attendance', (req, res) => {
  res.json(db.prepare('SELECT * FROM attendance ORDER BY id DESC LIMIT 8').all());
});

app.get('/api/payments', (req, res) => {
  res.json(db.prepare('SELECT * FROM payments ORDER BY id ASC').all());
});

app.listen(PORT, () => {
  console.log(`Gym API listening on http://localhost:${PORT}`);
});
