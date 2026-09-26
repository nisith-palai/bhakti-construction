# Bhakti Construction – Website
**Complete Civil Construction Solution** · Bhubaneswar · 📞 7735446710

## Run
```bash
npm install
npm start          # http://localhost:3000
```

## Features
- Sections: Home, About, Services, Projects (filterable), Contact
- 2 enquiry forms (hero quick-quote + full contact form) → `POST /api/enquiry` (Node/Express backend)
- Server-side validation, honeypot anti-spam, rate limiting
- Enquiries saved to `data/enquiries.json`
- Admin dashboard: `/admin` (default login **admin / bhakti@123** – change via env vars) with Mark Done / Delete / CSV export
- 📞 Call Now & 💬 WhatsApp Now buttons (header, hero, CTA, contact, floating buttons, mobile sticky bar)
- Embedded Google Map of Bijipur, Tamando, Bhubaneswar 751019
- Fully responsive

## Environment variables (optional)
| Var | Purpose |
|---|---|
| `PORT` | Server port (default 3000) |
| `ADMIN_USER`, `ADMIN_PASSWORD` | Admin login |
| `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS`, `MAIL_TO` | Email each enquiry to you (e.g. Gmail: smtp.gmail.com / 587 / app password) |
