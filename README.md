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
| `PORT` | Server port (default 3000 / Render sets automatically) |
| `ADMIN_USER`, `ADMIN_PASSWORD` | Admin login (default: admin / bhakti@123) |
| `RESEND_API_KEY` | **Recommended for Render** (Free from [resend.com](https://resend.com)) – sends over HTTPS port 443, never blocked by Render |
| `MAIL_TO` | Email address where you want to receive new leads (e.g. `bhakticonstructions98@gmail.com`) |
| `MAIL_FROM` | Sender address (e.g. `Bhakti Construction <onboarding@resend.dev>` or your domain) |
| `BREVO_API_KEY` | Alternative HTTP API for Render (Free from [brevo.com](https://brevo.com)) |
| `GMAIL_USER`, `GMAIL_APP_PASSWORD` | Gmail SMTP (works for local development or Render paid plans) |
| `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS` | Custom SMTP settings |

## 🚀 Deploying to Render & Email Setup
1. Render Free Tier blocks outbound SMTP ports (`25`, `465`, `587`). Direct Gmail SMTP will fail with `Connection timeout` or `ENETUNREACH`.
2. **Fix (100% Free & Takes 1 minute)**:
   - Create a free account at [Resend](https://resend.com) (gives 3,000 emails/month free).
   - Generate an API Key (starts with `re_...`).
   - In your **Render Dashboard** → Your Web Service → **Environment Variables**:
     - `RESEND_API_KEY` = `re_xxxxxxxxxxxx`
     - `MAIL_TO` = `bhakticonstructions98@gmail.com`
   - Render will automatically restart and emails will deliver in real time without any port issues!

