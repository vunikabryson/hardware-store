# 🏗️ BuildRight Hardware — E-Commerce Platform

A complete, production-ready hardware store website built with **Next.js 14, TypeScript, Tailwind CSS, PostgreSQL, and Prisma**.

---

## ✨ Features

- 🛍️ **Product Catalog** — Categories, brands, search, filters, pagination
- 📦 **Stock Management** — Track stock, low-stock alerts, status badges
- 📋 **Quote Request System** — Customers build a quote list and submit
- 🔐 **Authentication** — Role-based (Admin/Customer) with NextAuth
- 🖥️ **Admin Dashboard** — Manage everything without touching code
- 📸 **Image Uploads** — Auto-resized to WebP via Sharp
- 💬 **WhatsApp Integration** — Floating button + product inquiries
- 📱 **Mobile-Responsive** — Works on all screen sizes
- 🔍 **SEO Optimized** — Metadata, JSON-LD schema, Open Graph

---

## 📚 Documentation

| Document | For | Description |
|----------|-----|-------------|
| **[HOW-TO-GUIDE.md](./HOW-TO-GUIDE.md)** | Store owners / Admins | Step-by-step guide to managing products, categories, quotes, and settings — no coding required |
| **[DEPLOYMENT.md](./DEPLOYMENT.md)** | Developers | Setup, database, and deployment instructions (Vercel & VPS) |

---

## 🚀 Quick Start

```bash
# 1. Install dependencies
npm install

# 2. Configure environment
cp .env.example .env
# Edit .env with your DATABASE_URL and NEXTAUTH_SECRET

# 3. Set up the database
npm run db:push
npm run db:seed

# 4. Run the dev server
npm run dev
```

Visit **http://localhost:3000**

### Default Admin Login
```
Email:    admin@hardwarestore.com
Password: admin123
```
⚠️ **Change this password immediately** — see HOW-TO-GUIDE.md → FAQ

---

## 🗂️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 14 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS + Radix UI |
| Database | PostgreSQL |
| ORM | Prisma |
| Auth | NextAuth.js (JWT, Credentials) |
| Image processing | Sharp |
| Validation | Zod |

---

## 📁 Project Structure

```
hardware-store/
├── prisma/
│   ├── schema.prisma     # Database models
│   └── seed.ts           # Sample data
├── public/
│   ├── images/           # Logo, favicon, placeholders
│   └── uploads/products/ # Admin-uploaded images
├── src/
│   ├── app/
│   │   ├── admin/        # Admin dashboard (protected)
│   │   ├── api/          # API routes (REST)
│   │   ├── auth/         # Login / Register
│   │   ├── categories/   # Category pages
│   │   ├── contact/      # Contact page
│   │   ├── products/     # Product listing & detail
│   │   └── quote/        # Quote request page
│   ├── components/       # UI components
│   └── lib/               # Utilities, Prisma client, data fetchers
├── DEPLOYMENT.md
├── HOW-TO-GUIDE.md
└── README.md
```

---

## 🔑 Useful Scripts

```bash
npm run dev          # Start dev server
npm run build        # Production build
npm run start        # Start production server
npm run db:studio    # Visual database editor
npm run db:push      # Sync schema to database
npm run db:seed      # Load sample data
```

---

## 📄 License
This project was generated for your business use. Customize freely.
