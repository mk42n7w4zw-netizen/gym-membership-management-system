const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Stripe = require('stripe');
const Database = require('better-sqlite3');

const app = express();
const PORT = 3001;
const dataDir = path.join(__dirname, '..', 'data');
const JWT_SECRET = process.env.JWT_SECRET || 'pulsefit-dev-secret';
const stripe = Stripe(process.env.STRIPE_SECRET_KEY || 'sk_test_dummy');

fs.mkdirSync(dataDir, { recursive: true });
const db = new Database(path.join(dataDir, 'gym.db'));

const initializeDb = () => {
  db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      email TEXT UNIQUE NOT NULL,
      role TEXT NOT NULL,
      password_hash TEXT NOT NULL
    );

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

  const existingAdmin = db.prepare('SELECT * FROM users WHERE email = ?').get('admin@pulsefit.com');
  if (!existingAdmin) {
    const adminId = 'admin-001';
    const adminHash = bcrypt.hashSync('admin123', 10);
    db.prepare('INSERT INTO users (id, name, email, role, password_hash) VALUES (?, ?, ?, ?, ?)')
      .run(adminId, 'System Admin', 'admin@pulsefit.com', 'admin', adminHash);
  }

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

function signToken(user) {
  return jwt.sign({ id: user.id, email: user.email, name: user.name, role: user.role }, JWT_SECRET, { expiresIn: '8h' });
}

function authRequired(req, res, next) {
  const header = req.headers.authorization || '';
  const token = header.startsWith('Bearer ') ? header.slice(7) : null;

  if (!token) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ error: 'Invalid token' });
  }
}

app.get('/api/health', (req, res) => {
  res.json({ ok: true, service: 'pulsefit-api' });
});

app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body || {};
  const normalizedEmail = String(email || '').trim().toLowerCase();
  const user = db.prepare('SELECT * FROM users WHERE email = ?').get(normalizedEmail);

  if (!user || !bcrypt.compareSync(String(password || ''), user.password_hash)) {
    return res.status(401).json({ error: 'Invalid email or password' });
  }

  const token = signToken(user);
  const safeUser = { id: user.id, name: user.name, email: user.email, role: user.role };
  return res.json({ token, user: safeUser });
});

app.get('/api/auth/me', authRequired, (req, res) => {
  const user = db.prepare('SELECT id, name, email, role FROM users WHERE id = ?').get(req.user.id);
  if (!user) return res.status(404).json({ error: 'User not found' });
  res.json({ user });
});

app.get('/api/dashboard', authRequired, (req, res) => {
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

app.get('/api/billing/plans', authRequired, (req, res) => {
  res.json({
    plans: [
      { name: 'Basic', price: 3900, description: 'Gym floor access' },
      { name: 'Gold', price: 7900, description: 'Gym + group classes' },
      { name: 'Premium', price: 11900, description: 'Classes + 2 PT sessions' },
      { name: 'Elite', price: 17900, description: 'Unlimited coaching' },
    ],
  });
});

app.post('/api/billing/create-checkout', authRequired, async (req, res) => {
  const { plan = 'Gold', memberName = 'Gym Member' } = req.body || {};

  if (!process.env.STRIPE_SECRET_KEY || process.env.STRIPE_SECRET_KEY === 'sk_test_dummy') {
    return res.status(400).json({ error: 'Stripe is not configured. Add STRIPE_SECRET_KEY to your environment.' });
  }

  const pricing = {
    Basic: 3900,
    Gold: 7900,
    Premium: 11900,
    Elite: 17900,
  };

  const unitAmount = pricing[plan] || pricing.Gold;

  try {
    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      line_items: [{
        price_data: {
          currency: 'usd',
          product_data: {
            name: `PulseFit ${plan} Membership`,
            description: `Membership for ${memberName}`,
          },
          unit_amount: unitAmount,
        },
        quantity: 1,
      }],
      success_url: `${process.env.APP_URL || 'http://localhost:3000'}/billing?success=true`,
      cancel_url: `${process.env.APP_URL || 'http://localhost:3000'}/billing?canceled=true`,
      metadata: {
        plan,
        memberName,
        userId: req.user.id,
      },
    });

    return res.json({ url: session.url });
  } catch (error) {
    return res.status(500).json({ error: 'Stripe checkout failed', details: error.message });
  }
});

app.get('/api/members', authRequired, (req, res) => {
  res.json(db.prepare('SELECT * FROM members ORDER BY joined DESC').all());
});

app.post('/api/members', authRequired, (req, res) => {
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

app.delete('/api/members/:id', authRequired, (req, res) => {
  const result = db.prepare('DELETE FROM members WHERE id = ?').run(req.params.id);
  if (result.changes === 0) return res.status(404).json({ error: 'Member not found.' });
  res.json({ removed: req.params.id });
});

app.get('/api/classes', authRequired, (req, res) => {
  res.json(db.prepare('SELECT * FROM classes ORDER BY id ASC').all());
});

app.get('/api/attendance', authRequired, (req, res) => {
  res.json(db.prepare('SELECT * FROM attendance ORDER BY id DESC LIMIT 8').all());
});

app.get('/api/payments', authRequired, (req, res) => {
  res.json(db.prepare('SELECT * FROM payments ORDER BY id ASC').all());
});

app.listen(PORT, () => {
  console.log(`Gym API listening on http://localhost:${PORT}`);
  console.log('Default admin credentials: admin@pulsefit.com / admin123');
});
