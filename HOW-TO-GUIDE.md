# 📘 BuildRight Hardware — How-To Guide
### For Admin Users (No Coding Knowledge Required)

---

## Table of Contents
1. [Getting Started — Logging In](#1-getting-started)
2. [Dashboard Overview](#2-dashboard-overview)
3. [Managing Products](#3-managing-products)
   - Adding a New Product
   - Editing a Product
   - Archiving vs Deleting
   - Managing Stock & Status
4. [Managing Categories](#4-managing-categories)
5. [Managing Brands](#5-managing-brands)
6. [Handling Quote Requests](#6-handling-quote-requests)
7. [Reading Customer Messages](#7-reading-customer-messages)
8. [Updating Site Settings](#8-updating-site-settings)
9. [What Customers See](#9-what-customers-see)
10. [Frequently Asked Questions](#10-frequently-asked-questions)

---

## 1. Getting Started

### How to Log In
1. Go to your website and add **/auth/login** at the end of the URL
   - Example: `https://yourdomain.com/auth/login`
2. Enter your admin email and password
3. Click **Sign In**
4. You will be taken to the homepage

### How to Open the Admin Dashboard
After logging in, click on the **person icon** (top right corner of the website) and select **Admin Dashboard** — or go directly to:
```
https://yourdomain.com/admin
```

> 🔒 **Security tip:** If you share your website URL with customers, they cannot access the admin area unless they have an admin account.

---

## 2. Dashboard Overview

When you first open the Admin Dashboard, you will see a summary of your store:

| Card | What it means |
|------|--------------|
| **Total Products** | How many products are live on your store |
| **Quote Requests** | Total number of quote requests received |
| **Unread Messages** | Customer contact form messages you haven't read |
| **Low Stock Alerts** | Products running low or out of stock |

### Stock Alerts
If any products are low on stock or out of stock, you will see a **yellow warning banner**. Click the link inside to see exactly which products need restocking.

### Recent Products
A quick list of the last 5 products you added, with their price and status.

### Recent Quote Requests
The last 5 quote requests, with customer name and status.

---

## 3. Managing Products

### ➕ Adding a New Product

1. In the left sidebar, click **Products**
2. Click the orange **Add Product** button (top right)
3. Fill in the product details:

#### Product Information
| Field | What to enter | Example |
|-------|--------------|---------|
| **Product Name** | Full name of the product | Portland Cement 50kg |
| **Description** | Describe what it is, what it's used for | High-quality Portland cement for all construction needs... |

#### Product Images
1. Click the **Upload** box (the dashed square with an arrow)
2. Select one or more photos from your computer or phone
3. Your images will appear as thumbnails
4. The **first image** uploaded will be the main/primary image shown to customers
5. To remove an image, click the **red X** on it

> 📷 **Image tips:**
> - Use clear, well-lit photos of the actual product
> - Accepted formats: JPG, PNG, WebP
> - Images are automatically resized — any size works
> - Multiple images are recommended (front, side, packaging)

#### Pricing
| Field | What to enter | Example |
|-------|--------------|---------|
| **Price (MWK)** | Selling price | 18500 |
| **Compare-at Price** | Optional — original/crossed-out price | 21000 |
| **Unit** | What the price is per | bag, ton, litre, each |
| **Weight (kg)** | Optional product weight | 50 |

#### Inventory
| Field | What to enter | Example |
|-------|--------------|---------|
| **SKU / Product Code** | Your internal product code | CEM-POR-50 |
| **Stock Quantity** | How many units you currently have | 200 |
| **Low Stock Alert** | Alert me when stock drops to this number | 10 |
| **Stock Status** | Current availability | ✅ In Stock |

**Stock Status options:**
- ✅ **In Stock** — Product is available
- ⚠️ **Low Stock** — Running low, but still available
- ❌ **Out of Stock** — Not currently available (still visible to customers)
- 🚫 **Discontinued** — No longer sold

#### Organisation
| Field | What to enter |
|-------|--------------|
| **Category** | Select from your categories (e.g. Building Materials) |
| **Brand** | Optional — select if the product has a brand (e.g. Lafarge) |

#### Product Settings
- **Featured Product** toggle — Turn ON to show this product on the homepage

4. Click **Publish Product** — it immediately appears on your website!

---

### ✏️ Editing a Product

1. Go to **Admin → Products**
2. Find the product you want to edit
3. Click the **⋮** (three dots) button on the right
4. Select **Edit**
5. Make your changes
6. Click **Save Changes**

> Changes appear on the website immediately after saving.

---

### 🗄️ Archiving vs Deleting

| Action | What happens | When to use |
|--------|-------------|-------------|
| **Archive** | Product is hidden from the store but NOT deleted. You can recover it later by contacting your developer. | Seasonal products, temporarily out of production |
| **Delete Permanently** | Product is permanently removed. Cannot be undone. | Duplicate products, wrong entries |

**To archive or delete:**
1. Go to **Admin → Products**
2. Click the **⋮** button on the product row
3. Choose **Archive** or **Delete Permanently**
4. Confirm the action

---

### 📊 Updating Stock Levels

**Quick way (Edit Product):**
1. Open the product edit page
2. Change the **Stock Quantity** number
3. Change the **Stock Status** if needed
4. Click **Save Changes**

**Stock Status guidance:**
- When stock reaches your **Low Stock Alert** number → change status to ⚠️ Low Stock
- When stock hits 0 → change status to ❌ Out of Stock
- After restocking → change back to ✅ In Stock

---

### 🔍 Finding Products

Use the **search bar** at the top of the Products page to search by name or SKU.

Use the **filter buttons** to show only:
- In Stock products
- Low Stock products
- Out of Stock products

Use the **category dropdown** to filter by category.

---

## 4. Managing Categories

Categories help customers browse your products (e.g. Building Materials, Plumbing, Electrical).

### ➕ Adding a New Category
1. Go to **Admin → Categories**
2. Click **New Category**
3. Fill in:
   - **Category Name** — e.g. "Waterproofing"
   - **Icon (emoji)** — e.g. 💧 (copy and paste any emoji)
   - **Description** — Brief description of what products are in this category
4. Click **Create**

### ✏️ Editing a Category
1. Go to **Admin → Categories**
2. Click the **pencil icon** next to the category
3. Make changes and click **Save Changes**

### 🗑️ Deleting a Category
1. Go to **Admin → Categories**
2. Click the **trash icon** next to the category

> ⚠️ **Note:** You cannot delete a category that has products in it. Move or delete the products first.

---

## 5. Managing Brands

Brands help customers filter by manufacturer (e.g. Dulux, Lafarge, Bosch).

### ➕ Adding a New Brand
1. Go to **Admin → Brands**
2. Click **New Brand**
3. Enter the brand name (e.g. "Gyproc")
4. Click **Create**

### ✏️ Editing / Deleting
Click the pencil or trash icon on any brand card.

---

## 6. Handling Quote Requests

When a customer fills out a quote request on your website, it appears here.

### Viewing Quote Requests
1. Go to **Admin → Quote Requests**
2. You'll see a list with: customer name, quote number, number of items, date, and status

### Opening a Quote
Click **View** on any row to see:
- Customer's name, email, phone, company
- The products they requested with quantities and estimated prices
- Any notes they wrote

### Updating Quote Status
On the quote detail page, use the **Status** dropdown to update progress:

| Status | Meaning |
|--------|---------|
| **PENDING** | New request, not yet reviewed |
| **REVIEWING** | You are looking into it |
| **QUOTED** | You have sent them a price |
| **ACCEPTED** | Customer accepted your quote |
| **REJECTED** | Customer declined |
| **EXPIRED** | Quote is no longer valid |

1. Select the new status
2. Click **Update Status**

### Responding to a Quote
Currently, respond to customers by:
- Calling or texting their phone number
- Emailing them directly at their email address

---

## 7. Reading Customer Messages

When a customer fills in the Contact form on your website:

1. Go to **Admin → Messages**
2. The left panel shows all messages — **bold** ones are unread
3. Click a message to open it on the right
4. Read the customer's name, email, phone, and message
5. Click **Reply by Email** to open your email app with a reply pre-addressed

**Unread messages** show a blue envelope icon. They automatically become "read" when you click on them.

To **delete** a message, click the trash icon in the top right of the open message.

---

## 8. Updating Site Settings

Change your store's name, contact info, and business hours.

1. Go to **Admin → Settings**
2. Update any of the following:

| Setting | What to change |
|---------|---------------|
| **Site Name** | Your store's name (e.g. "BuildRight Hardware") |
| **Tagline** | Short slogan (e.g. "Your Trusted Building Partner") |
| **Contact Email** | Email shown in footer and contact page |
| **Contact Phone** | Phone number shown in header and footer |
| **WhatsApp Number** | Your WhatsApp number — customers can tap to chat. Format: country code + number, no spaces (e.g. `265999000111`) |
| **Address** | Your physical store address |
| **Business Hours** | Your opening hours |
| **Currency Symbol** | Currency code shown with prices (e.g. `MWK`) |

3. Click **Save Settings**

> Changes take effect immediately across the entire website.

---

## 9. What Customers See

### Homepage
- Your featured products (products with "Featured" turned ON)
- All categories in a grid
- Hero banner with your tagline
- A "Request Bulk Quote" call-to-action

### Products Page
Customers can:
- Browse all products
- Filter by category, brand, price range, and stock status
- Sort by price or newest
- Search by name

### Product Detail Page
Customers see:
- Product images (gallery)
- Price and stock status
- Description and specifications
- **Add to Quote List** button
- **Ask on WhatsApp** button (opens WhatsApp chat with your number)

### Quote Page
Customers build a list of products they want quotes for, then fill in their details and submit. You receive it in Admin → Quote Requests.

### WhatsApp Button
A green WhatsApp chat button floats on every page. When clicked, it opens WhatsApp with a pre-filled message to your number.

---

## 10. Frequently Asked Questions

**Q: I uploaded a product but it's not showing on the website. What's wrong?**
A: Check the product's **Status** — if it's set to "Out of Stock" or "Discontinued", it still shows on the website, but with a status badge. Products are only hidden if they are **Archived**. Make sure Status is set to "In Stock".

---

**Q: How do I change the price of a product?**
A: Go to Admin → Products → click ⋮ → Edit → change the Price field → Save Changes.

---

**Q: A customer asked for a product I don't have. How do I add it quickly?**
A: Go to Admin → Products → Add Product. The minimum required is: Name, Price, Category, and Stock. You can add images and more details later.

---

**Q: Can I have the same product in two categories?**
A: No — each product belongs to one category. If a product fits two categories, put it in the most relevant one.

---

**Q: How do I change the WhatsApp number?**
A: Go to Admin → Settings → update the **WhatsApp Number** field → Save Settings.

---

**Q: A customer says they can't find a product. What do I check?**
A: 
1. Make sure the product isn't Archived (Admin → Products — search for it)
2. Check the Status isn't "Discontinued"
3. Check if their search term matches the product name or SKU

---

**Q: How do I make a product appear on the homepage?**
A: Edit the product → turn ON the **Featured Product** toggle → Save Changes.

---

**Q: Can I add a video instead of an image?**
A: Currently only images (JPG, PNG, WebP) are supported. Videos are not supported.

---

**Q: How do I export a list of all my products?**
A: This isn't available from the admin panel yet. Ask your developer to run a database export, or use **Prisma Studio** (`npm run db:studio`) for a visual database view.

---

**Q: I accidentally deleted a product. Can I get it back?**
A: If you **Archived** it — contact your developer to restore it. If you **Permanently Deleted** it — unfortunately it cannot be recovered. That's why we recommend Archiving instead of Deleting.

---

**Q: How do I add more admin users?**
A: Currently, to give someone admin access:
1. Ask them to register at `/auth/register`
2. Give their email to your developer to run:
   ```sql
   UPDATE users SET role = 'ADMIN' WHERE email = 'their@email.com';
   ```
   Or use Prisma Studio: `npm run db:studio`

---

*Last updated: June 2026 | BuildRight Hardware Store Documentation*
