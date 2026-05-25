<div align="center">

# 🍱 TiffinBox
### Homemade Meal Kit Marketplace

[![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://react.dev)
[![Vite](https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev)
[![Firebase](https://img.shields.io/badge/Firebase-FFCA28?style=for-the-badge&logo=firebase&logoColor=black)](https://firebase.google.com)
[![Cloudinary](https://img.shields.io/badge/Cloudinary-3448C5?style=for-the-badge&logo=cloudinary&logoColor=white)](https://cloudinary.com)
[![React Router](https://img.shields.io/badge/React_Router-CA4245?style=for-the-badge&logo=react-router&logoColor=white)](https://reactrouter.com)

*A multi-role e-commerce platform connecting home cooks with customers who love homemade food.*

**Submitted to:** Department of Computer Science & Software Engineering, Jinnah University for Women, Karachi  
**Course:** Web Development / Software Engineering Project · **May 2026**

</div>

---

## 📌 Table of Contents

- [About](#-about)
- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [System Architecture](#-system-architecture)
- [Getting Started](#-getting-started)
- [Firebase Setup](#-firebase-setup)
- [Cloudinary Setup](#-cloudinary-setup)
- [Project Structure](#-project-structure)
- [User Roles & Flows](#-user-roles--flows)
- [Screenshots](#-screenshots)
- [Challenges & Solutions](#-challenges--solutions)
- [Future Enhancements](#-future-enhancements)
- [Team](#-team)

---

## 🥘 About

TiffinBox bridges the gap between home cooks and food lovers by offering a transparent, personal alternative to traditional meal delivery. Home cooks can list their weekly meal kits, set allergen info, and manage orders — while customers browse, filter, and checkout with ease.

---

## ✨ Features

### 👤 Customer
- Register and log in with email/password
- Browse all available meal kits
- Filter by cook name, allergen exclusion, and price (low → high / high → low)
- View detailed product pages with allergen information
- Add items to a persistent cart (saved across page refreshes via localStorage)
- Simulated checkout with order confirmation

### 🧑‍🍳 Home Cook
- Register as a cook and await admin approval
- Add, edit, and delete meal kit listings
- Upload product images via Cloudinary
- Set allergen tags and available delivery days

### 🛡️ Admin *(partially implemented — future work)*
- Approve or reject home cook registrations
- Manage categories
- View platform-wide analytics

---

## 🛠 Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 18 + Vite |
| Routing | React Router v6 |
| State Management | Context API |
| Authentication | Firebase Auth (Email/Password) |
| Database | Firestore (NoSQL) |
| Image Storage | Cloudinary (free tier) |
| Styling | CSS Modules / Custom CSS |

---

## 🏗 System Architecture

```
┌─────────────────────────────────────────────┐
│               React (Vite) SPA              │
│  ┌──────────┐  ┌───────────┐  ┌──────────┐ │
│  │ AuthCtx  │  │ CartCtx   │  │  Pages   │ │
│  └──────────┘  └───────────┘  └──────────┘ │
└────────────────────┬────────────────────────┘
                     │
        ┌────────────┼────────────┐
        ▼            ▼            ▼
  ┌──────────┐ ┌──────────┐ ┌──────────┐
  │ Firebase │ │Firestore │ │Cloudinary│
  │   Auth   │ │  (NoSQL) │ │  Images  │
  └──────────┘ └──────────┘ └──────────┘
```

### Firestore Collections

| Collection | Key Fields | Purpose |
|---|---|---|
| `users` | uid, email, fullName, role, approved | User profiles & approval status |
| `products` | name, price, cookId, allergens[], availableDays[], imageUrl | Meal kit listings |
| `orders` | userId, items[], total, status, createdAt | Checkout history |

---

## 🚀 Getting Started

### Prerequisites
- Node.js **v18+**
- A [Firebase](https://console.firebase.google.com) project
- A [Cloudinary](https://cloudinary.com) account (free)

### Installation

```bash
# 1. Clone the repository
git clone https://github.com/your-username/tiffinbox.git
cd tiffinbox

# 2. Install dependencies
npm install

# 3. Start the development server
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

---

## 🔥 Firebase Setup

1. Go to [Firebase Console](https://console.firebase.google.com) → Create a new project.
2. Enable **Authentication** → Sign-in method → **Email/Password**.
3. Create a **Firestore Database** → Start in **test mode**.
4. Copy your Firebase config into `src/firebase.js`:

```js
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT.firebasestorage.app",
  messagingSenderId: "YOUR_SENDER_ID",
  appId: "YOUR_APP_ID"
};
```

> ⚠️ **Security:** Firestore rules are currently open for development. Tighten them before deploying to production.

---

## ☁️ Cloudinary Setup

1. Sign up at [cloudinary.com](https://cloudinary.com) (free tier is sufficient).
2. Go to **Settings → Upload → Upload Presets** → Add an **unsigned** preset named `tiffinbox_preset`.
3. Update your cloud name in `src/pages/AddEditProduct.jsx`:

```js
formData.append("cloud_name", "YOUR_CLOUD_NAME");
```

> Firebase Storage was replaced with Cloudinary to avoid CORS issues in local development.

---

## 📁 Project Structure

```
src/
├── components/
│   ├── Navbar.jsx
│   ├── ProtectedRoute.jsx
│   ├── PendingApproval.jsx
│   ├── ProductCard.jsx
│   ├── FilterBar.jsx
│   └── MyProductsList.jsx
├── context/
│   ├── AuthContext.jsx        # Auth state + register/login/logout
│   └── CartContext.jsx        # Cart state + localStorage persistence
├── pages/
│   ├── Login.jsx
│   ├── Register.jsx
│   ├── ProductListing.jsx     # Browse + filter meal kits
│   ├── ProductDetail.jsx      # Single product + add to cart
│   ├── Cart.jsx
│   ├── Checkout.jsx           # Simulated checkout + Firestore order
│   ├── OrderConfirmation.jsx
│   ├── SellerDashboard.jsx
│   ├── AddEditProduct.jsx     # Cloudinary upload + product CRUD
│   └── AdminDashboard.jsx     # Placeholder
├── firebase.js
├── App.jsx
└── main.jsx
```

---

## 👥 User Roles & Flows

```
Customer  →  Register/Login  →  Browse & Filter  →  Add to Cart  →  Checkout  →  Order Confirmation
Cook      →  Register        →  Await Approval   →  Add Products →  Manage Listings
Admin     →  Login           →  Approve Cooks    →  Manage Categories  (future)
```

> **To manually approve a cook:** Go to Firestore → `users` collection → find the cook document → set `approved: true`.

---

## 📸 Screenshots

### 🔐 Authentication

| Register <img width="614" height="346" alt="image" src="https://github.com/user-attachments/assets/0cbccaa4-641b-4f84-a079-e927e4c7a1a1" /> | 

|Login <img width="614" height="346" alt="image" src="https://github.com/user-attachments/assets/8fdf1677-b185-4230-97e1-67a4f7567180" /> |

---

### 🛡️ Admin Panel

| Dashboard – Part 1 | Dashboard – Part 2 |
|:---:|:---:|
| ![Admin 1](screenshots/image3.png) | ![Admin 2](screenshots/image4.png) |

| Dashboard – Part 3 | Browse Meals |
|:---:|:---:|
| ![Admin 3](screenshots/image5.png) | ![Admin Browse](screenshots/image6.png) |

---

### 🛒 Customer Experience

| Home / Browse | Product Detail & Add to Cart |
|:---:|:---:|
| ![Customer 1](screenshots/image7.png) | ![Customer 2](screenshots/image8.png) |

| Cart | Checkout |
|:---:|:---:|
| ![Cart](screenshots/image9.png) | ![Checkout](screenshots/image10.png) |

<div align="center">

**Order Confirmation**

![Order Confirmation](screenshots/image11.png)

</div>

---

### 🧑‍🍳 Cook Dashboard

| My Products | Add / Edit Product |
|:---:|:---:|
| ![Cook 1](screenshots/image12.png) | ![Cook 2](screenshots/image13.png) |

<div align="center">

**Browse Meal Section**

![Cook Browse](screenshots/image14.png)

</div>

---

## ⚡ Challenges & Solutions

| Challenge | Solution |
|---|---|
| Firebase Storage CORS blocking uploads from localhost | Switched to Cloudinary free tier — no CORS issues, simpler integration |
| Role-based routing for unapproved cooks | Added `isApproved` field to user doc; `ProtectedRoute` redirects to a pending page |
| Cart not persisting on page refresh | Used `localStorage` inside `CartContext` to save and reload cart state |
| Real-time product updates for sellers | Combined Firestore real-time listeners with `getDocs` on component mount |

---

## 🔮 Future Enhancements

- [ ] **Admin Dashboard** — full cook approval workflow, category management, sales analytics
- [ ] **Real Payment Gateway** — Stripe or EasyPaisa integration
- [ ] **Email Notifications** — order confirmation & cook approval via Firebase Cloud Functions
- [ ] **Advanced Search** — full-text search on dish names and ingredients (Algolia)
- [ ] **Mobile Responsiveness** — refined CSS for all screen sizes
- [ ] **Cook Ratings & Reviews** — customer feedback visible on product pages

---

## 👩‍💻 Team

| Name | 
|---|---|
| Faryal Khan | 
| Fatima Ahmed |
| Syeda Fatima Rafat |

**Department of Computer Science & Software Engineering**  
Jinnah University for Women, Karachi · May 2026

---

<div align="center">

Made with ❤️ by the TiffinBox Team

</div>
