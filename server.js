/**
 * Bhakti Construction – Website + Enquiry Backend
 * ------------------------------------------------
 * - Serves the static website from /public
 * - POST /api/enquiry  -> validates & stores form submissions (data/enquiries.json)
 *                         and (optionally) emails them if SMTP env vars are set
 * - GET  /admin        -> password-protected dashboard to view enquiries
 * - GET  /admin/export.csv -> download all enquiries as CSV
 *
 * Env vars (all optional):
 *   PORT=3000
 *   ADMIN_USER=admin   ADMIN_PASSWORD=bhakti@123
 *   SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, MAIL_TO   (for email notifications)
 */
try { require('dotenv').config(); } catch (_) {}
const dns = require('dns');
if (dns.setDefaultResultOrder) dns.setDefaultResultOrder('ipv4first');

const express = require('express');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const app = express();
const PORT = process.env.PORT || 3000;
const ADMIN_USER = process.env.ADMIN_USER || 'admin';
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'bhakti@123';

const DATA_DIR = path.join(__dirname, 'data');
const DATA_FILE = path.join(DATA_DIR, 'enquiries.json');
if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
if (!fs.existsSync(DATA_FILE)) fs.writeFileSync(DATA_FILE, '[]');

const readAll = () => { try { return JSON.parse(fs.readFileSync(DATA_FILE, 'utf8')); } catch { return []; } };
const saveAll = (list) => fs.writeFileSync(DATA_FILE, JSON.stringify(list, null, 2));

// ---------- Optional email (nodemailer) ----------
let transporter = null;
if (process.env.GMAIL_USER && process.env.GMAIL_APP_PASSWORD) {
  const nodemailer = require('nodemailer');
  transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    family: 4, // Force IPv4 to prevent IPv6 ECONNREFUSED issues on ISP/router
    auth: {
      user: process.env.GMAIL_USER,
      pass: process.env.GMAIL_APP_PASSWORD.replace(/\s+/g, ''),
    },
    tls: {
      rejectUnauthorized: false,
    },
  });
  console.log('✉️  Gmail notifications enabled for ' + process.env.GMAIL_USER);
} else if (process.env.SMTP_HOST && process.env.SMTP_USER) {
  const nodemailer = require('nodemailer');
  transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT || 587),
    secure: Number(process.env.SMTP_PORT) === 465,
    family: 4,
    auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
    tls: {
      rejectUnauthorized: false,
    },
  });
  console.log('✉️  Email notifications enabled');
}

app.use(express.json({ limit: '50kb' }));
app.use(express.urlencoded({ extended: true, limit: '50kb' }));
app.use(express.static(path.join(__dirname, 'public'), { maxAge: '1h' }));

// ---------- Simple in-memory rate limiter ----------
const hits = new Map();
function rateLimit(req, res, next) {
  const ip = req.headers['x-forwarded-for']?.split(',')[0].trim() || req.socket.remoteAddress;
  const now = Date.now();
  const arr = (hits.get(ip) || []).filter((t) => now - t < 10 * 60 * 1000);
  if (arr.length >= 10) return res.status(429).json({ ok: false, message: 'Too many requests. Please try again later or call us directly.' });
  arr.push(now); hits.set(ip, arr); next();
}

const SERVICES = ['Building Construction', 'Renovation', 'Civil Works', 'Farm Land Development', 'Manpower Supply', 'Heavy Machinery Hiring', 'Other'];
const clean = (v, max = 500) => String(v ?? '').replace(/[<>]/g, '').trim().slice(0, max);

// ---------- Enquiry API ----------
app.post('/api/enquiry', rateLimit, async (req, res) => {
  const b = req.body || {};
  if (b.website) return res.json({ ok: true, message: 'Thank you!' }); // honeypot -> silently drop bots

  const entry = {
    id: crypto.randomUUID(),
    name: clean(b.name, 100),
    phone: clean(b.phone, 20).replace(/[^\d+\s-]/g, ''),
    email: clean(b.email, 120),
    service: clean(b.service, 60),
    location: clean(b.location, 150),
    budget: clean(b.budget, 60),
    message: clean(b.message, 2000),
    source: clean(b.source, 30) || 'contact-form',
    createdAt: new Date().toISOString(),
    status: 'new',
  };

  const errors = [];
  if (entry.name.length < 2) errors.push('Please enter your full name.');
  const digits = entry.phone.replace(/\D/g, '');
  if (digits.length < 10 || digits.length > 13) errors.push('Please enter a valid 10-digit mobile number.');
  if (entry.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(entry.email)) errors.push('Please enter a valid email address.');
  if (!SERVICES.includes(entry.service)) errors.push('Please select a service.');
  if (errors.length) return res.status(400).json({ ok: false, message: errors.join(' ') });

  const list = readAll();
  list.unshift(entry);
  saveAll(list);
  console.log(`📩 New enquiry from ${entry.name} (${entry.phone}) – ${entry.service}`);

  if (transporter) {
    const sender = process.env.GMAIL_USER || process.env.SMTP_USER;
    transporter.sendMail({
      from: `"Bhakti Construction Website" <${sender}>`,
      to: process.env.MAIL_TO || sender,
      replyTo: entry.email || undefined,
      subject: `New Enquiry: ${entry.service} – ${entry.name}`,
      text: Object.entries(entry).map(([k, v]) => `${k}: ${v}`).join('\n'),
    })
      .then(() => console.log(`✉️  Notification email sent to ${process.env.MAIL_TO || sender}`))
      .catch((e) => console.error('Email failed:', e.message));
  }

  res.json({ ok: true, message: `Thank you ${entry.name.split(' ')[0]}! Your enquiry has been received. Our team will call you shortly.` });
});

// ---------- Admin (Basic Auth) ----------
function auth(req, res, next) {
  const [type, token] = (req.headers.authorization || '').split(' ');
  if (type === 'Basic' && token) {
    const [u, p] = Buffer.from(token, 'base64').toString().split(':');
    if (u === ADMIN_USER && p === ADMIN_PASSWORD) return next();
  }
  res.set('WWW-Authenticate', 'Basic realm="Bhakti Admin"').status(401).send('Authentication required');
}
const esc = (s) => String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

app.get('/admin', auth, (req, res) => {
  const list = readAll();
  const rows = list.map((e, i) => `
    <tr class="${e.status}">
      <td>${list.length - i}</td>
      <td>${new Date(e.createdAt).toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })}</td>
      <td><b>${esc(e.name)}</b><br><small>${esc(e.source)}</small></td>
      <td><a href="tel:${esc(e.phone)}">${esc(e.phone)}</a><br><a href="https://wa.me/91${esc(e.phone.replace(/\D/g, '').slice(-10))}" target="_blank">WhatsApp</a></td>
      <td>${esc(e.email)}</td><td>${esc(e.service)}</td><td>${esc(e.location)}</td><td>${esc(e.budget)}</td>
      <td style="max-width:320px">${esc(e.message)}</td>
      <td><form method="post" action="/admin/toggle/${e.id}"><button>${e.status === 'new' ? 'Mark Done' : 'Reopen'}</button></form>
          <form method="post" action="/admin/delete/${e.id}" onsubmit="return confirm('Delete this enquiry?')"><button class="del">Delete</button></form></td>
    </tr>`).join('');
  res.send(`<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
  <title>Enquiries – Bhakti Construction</title><link rel="icon" href="/images/favicon.png">
  <style>body{font-family:system-ui,Segoe UI,Arial;margin:0;background:#f4f5f7;color:#1c2331}
  header{background:#0b0b0d;color:#fff;padding:18px 24px;display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:10px}
  header a{color:#0b0b0d;background:#c9a24d;padding:8px 14px;border-radius:6px;text-decoration:none;font-weight:600}
  .wrap{padding:20px;overflow-x:auto}table{border-collapse:collapse;width:100%;background:#fff;font-size:14px;box-shadow:0 2px 10px #0001}
  th,td{padding:10px;border-bottom:1px solid #e6e8ec;text-align:left;vertical-align:top}th{background:#16161a;color:#fff;position:sticky;top:0}
  tr.new{background:#fbf7ee}tr.done{opacity:.6}button{cursor:pointer;border:0;background:#16161a;color:#fff;padding:5px 10px;border-radius:4px;margin:2px 0;width:90px}
  button.del{background:#c0392b}.stats{display:flex;gap:12px;margin-bottom:16px}.stat{background:#fff;padding:14px 20px;border-radius:8px;box-shadow:0 2px 10px #0001}
  .stat b{font-size:24px;display:block;color:#c9a24d}</style></head><body>
  <header><h2 style="margin:0;display:flex;align-items:center;gap:12px"><img src="/images/logo-200.png" alt="" style="width:52px;height:52px;border-radius:50%;background:#fff;box-shadow:0 0 0 2px #c9a24d"> Bhakti Construction – Enquiries</h2><div><a href="/admin/export.csv">⬇ Export CSV</a> <a href="/" style="background:#fff">View Site</a></div></header>
  <div class="wrap"><div class="stats"><div class="stat"><b>${list.length}</b>Total</div><div class="stat"><b>${list.filter((e) => e.status === 'new').length}</b>New</div></div>
  ${list.length ? `<table><tr><th>#</th><th>Date</th><th>Name</th><th>Phone</th><th>Email</th><th>Service</th><th>Location</th><th>Budget</th><th>Message</th><th>Action</th></tr>${rows}</table>` : '<p>No enquiries yet.</p>'}
  </div></body></html>`);
});

app.post('/admin/toggle/:id', auth, (req, res) => {
  const list = readAll(); const e = list.find((x) => x.id === req.params.id);
  if (e) { e.status = e.status === 'new' ? 'done' : 'new'; saveAll(list); }
  res.redirect('/admin');
});
app.post('/admin/delete/:id', auth, (req, res) => {
  saveAll(readAll().filter((x) => x.id !== req.params.id)); res.redirect('/admin');
});
app.get('/admin/export.csv', auth, (req, res) => {
  const cols = ['createdAt', 'name', 'phone', 'email', 'service', 'location', 'budget', 'message', 'source', 'status'];
  const q = (v) => `"${String(v ?? '').replace(/"/g, '""')}"`;
  const csv = [cols.join(','), ...readAll().map((e) => cols.map((c) => q(e[c])).join(','))].join('\n');
  res.set({ 'Content-Type': 'text/csv', 'Content-Disposition': 'attachment; filename="bhakti-enquiries.csv"' }).send(csv);
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
