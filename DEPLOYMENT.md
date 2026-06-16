# BuildRight Hardware Store — Deployment Guide

## 🏗️ Project Structure
```
hardware-store/
├── prisma/               # Database schema + seed
├── public/uploads/       # Uploaded product images
├── src/
│   ├── app/              # Next.js App Router pages
│   │   ├── admin/        # Admin dashboard (protected)
│   │   ├── api/          # API routes
│   │   ├── auth/         # Login/register
│   │   ├── categories/   # Category pages
│   │   ├── contact/      # Contact page
│   │   ├── products/     # Product pages
│   │   └── quote/        # Quote request
│   ├── components/       # React components
│   │   ├── admin/        # Admin UI components
│   │   ├── auth/         # Auth forms
│   │   ├── contact/      # Contact form
│   │   ├── layout/       # Header, footer, etc.
│   │   ├── products/     # Product components
│   │   ├── quote/        # Quote form
│   │   └── ui/           # Shared UI primitives
│   └── lib/              # Utilities, data fetchers
├── .env.example
└── package.json
```

---

## 🚀 Local Development Setup

### 1. Prerequisites
- Node.js 18+
- PostgreSQL 14+
- npm or yarn

### 2. Clone and install dependencies
```bash
git clone <your-repo>
cd hardware-store
npm install
```

### 3. Configure environment
```bash
cp .env.example .env
```

Edit `.env`:
```env
DATABASE_URL="postgresql://postgres:password@localhost:5432/hardware_store"
NEXTAUTH_SECRET="generate-with: openssl rand -base64 32"
NEXTAUTH_URL="http://localhost:3000"
NEXT_PUBLIC_SITE_URL="http://localhost:3000"
```

### 4. Set up database
```bash
# Create the database
createdb hardware_store

# Push schema
npm run db:push

# Generate Prisma client
npm run db:generate

# Seed with sample data
npm run db:seed
```

### 5. Run development server
```bash
npm run dev
```

Open http://localhost:3000

### 6. Admin login
- Email: `admin@hardwarestore.com`
- Password: `admin123`
- **Change this immediately after setup!**

---

## 🌐 Production Deployment (Vercel — Recommended)

### 1. Push to GitHub
```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/yourname/hardware-store.git
git push -u origin main
```

### 2. Create PostgreSQL database
Recommended: **Neon** (free tier, Vercel-compatible)
- Go to https://neon.tech
- Create a new project
- Copy the connection string

### 3. Deploy to Vercel
- Go to https://vercel.com/new
- Import your GitHub repository
- Add environment variables:
  ```
  DATABASE_URL=postgresql://...  (from Neon)
  NEXTAUTH_SECRET=<generated>
  NEXTAUTH_URL=https://your-domain.vercel.app
  NEXT_PUBLIC_SITE_URL=https://your-domain.vercel.app
  ```
- Deploy!

### 4. Run migrations on production
After deploying, run in Vercel CLI:
```bash
npx vercel env pull .env.production.local
DATABASE_URL=<prod-url> npx prisma db push
DATABASE_URL=<prod-url> npx tsx prisma/seed.ts
```

---

## 🐧 Production Deployment (VPS / Ubuntu)

### 1. Server setup
```bash
sudo apt update && sudo apt upgrade -y
sudo apt install nodejs npm postgresql nginx -y
sudo npm install -g pm2
```

### 2. PostgreSQL setup
```bash
sudo -u postgres createuser --superuser hardwareuser
sudo -u postgres createdb hardware_store -O hardwareuser
sudo -u postgres psql -c "ALTER USER hardwareuser PASSWORD 'securepassword';"
```

### 3. Clone and build
```bash
git clone <your-repo> /var/www/hardware-store
cd /var/www/hardware-store
npm install
cp .env.example .env
# Edit .env with production values
npm run db:push
npm run db:seed
npm run build
```

### 4. Start with PM2
```bash
pm2 start npm --name hardware-store -- start
pm2 save
pm2 startup
```

### 5. Nginx configuration
```nginx
server {
    listen 80;
    server_name yourdomain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
    }

    location /uploads {
        alias /var/www/hardware-store/public/uploads;
        expires 30d;
        add_header Cache-Control "public, immutable";
    }
}
```

### 6. SSL with Certbot
```bash
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d yourdomain.com
```

---

## 🔧 Admin Dashboard Guide

### Access
Navigate to `/admin` — only users with `ADMIN` role can access this.

### Features
| Section | What you can do |
|---------|----------------|
| **Dashboard** | View stats: total products, quote requests, messages, low-stock alerts |
| **Products** | Add, edit, archive, delete products. Upload images, set prices, manage stock |
| **Categories** | Create/edit/delete categories with emoji icons |
| **Brands** | Create/edit/delete brands |
| **Quote Requests** | View all quote requests, update status (Pending → Reviewing → Quoted → Accepted) |
| **Messages** | Read customer contact form submissions, reply via email |
| **Settings** | Update site name, contact info, WhatsApp number, business hours |

### Adding a Product
1. Go to Admin → Products → Add Product
2. Fill in: Name, Description, Price, Category, Stock
3. Upload product images
4. Set status: In Stock / Low Stock / Out of Stock
5. Toggle "Featured" to show on homepage
6. Click **Publish Product**

---

## 📱 WhatsApp Integration
- Set your WhatsApp number in Admin → Settings → WhatsApp Number
- Format: country code + number, no spaces (e.g., `265999000111`)
- A floating WhatsApp button appears on all pages
- Product pages have an "Ask on WhatsApp" button with pre-filled product info

---

## 🔒 Security Checklist
- [ ] Change admin password from `admin123`
- [ ] Set a strong `NEXTAUTH_SECRET` (32+ random chars)
- [ ] Enable HTTPS (SSL certificate)
- [ ] Keep `DATABASE_URL` secret
- [ ] Back up database regularly
- [ ] Update `public/uploads/` permissions: `chmod 755`

---

## 📦 Environment Variables Reference
| Variable | Required | Description |
|----------|----------|-------------|
| `DATABASE_URL` | ✅ | PostgreSQL connection string |
| `NEXTAUTH_SECRET` | ✅ | Random secret for JWT signing |
| `NEXTAUTH_URL` | ✅ | Your site's base URL |
| `NEXT_PUBLIC_SITE_URL` | ✅ | Public site URL (for SEO/metadata) |

---

## 🔄 Common Commands
```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run db:studio    # Open Prisma Studio (visual DB editor)
npm run db:push      # Push schema changes to database
npm run db:seed      # Seed sample data
npm run db:migrate   # Create a new migration
```
