# SmartBank — Enterprise FinTech & Distributed Core Banking Platform

![SmartBank Banner](https://images.unsplash.com/photo-1559526324-4b87b5e36e44?auto=format&fit=crop&w=1200&q=80)

[![React](https://img.shields.io/badge/React-18.0-61dafb?logo=react)](https://reactjs.org/)
[![Node.js](https://img.shields.io/badge/Node.js-Express-339933?logo=node.js)](https://nodejs.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-ACID_Transactions-47A248?logo=mongodb)](https://www.mongodb.com/)
[![TailwindCSS](https://img.shields.io/badge/TailwindCSS-v3.0-38bdf8?logo=tailwind-css)](https://tailwindcss.com/)
[![Security](https://img.shields.io/badge/Security-OWASP_Hardened-emerald)](#security-architecture)

SmartBank is a production-grade FinTech Core Banking simulation architected to solve critical real-world financial software challenges: **distributed concurrency, double-spending immunity, atomic rollbacks, and zero-trust identity isolation**.

---

## 🏛️ Core Architectural Highlights

### 1. Dual-Safety ACID & Atomic Transaction Engine
Traditional CRUD banking clones update sender and receiver balances sequentially, exposing funds to race conditions or silent deduction upon network failure. 
- **Atomic Concurrency**: Utilizes conditional operations `{ balance: { $gte: amount } }` paired with atomic `$inc` operators.
- **ACID Session Fallback**: Implements multi-document `mongoose.startSession()` transactions with automated rollback guards so that sender balances are never lost during partition errors.
- **Idempotency Safeguards**: Enforces `Idempotency-Key` headers to eliminate duplicate payments on network retries or double-clicks.

### 2. Immutable Double-Entry Financial Ledger
Replaces unbounded array anti-patterns with a dedicated, indexed `Transactions` collection:
- Unique cryptographic reference code (`TXN-YYYYMMDD-...`)
- Source & beneficiary account identifiers
- Exact debit/credit amounts and post-transaction balance snapshot
- Searchable audit trail accessible via `/api/account/ledger/:id`

### 3. Zero-Trust Access Control (IDOR Elimination)
- All user resource endpoints (`/api/users/:id`, `/api/account/:id`) enforce object-level token authorization against `req.user.id`.
- Transfer origins are strictly checked against authenticated customer ownership.
- Public administrative takeover routes (`/api/admins/owner/create`) auto-lock permanently with `403 Forbidden` once the primary owner is initialized.

---

## 🚀 Key Features

- **Integrated Payment Gateway Sandbox**: Interactive deposit flow simulating UPI (Google Pay, PhonePe, Paytm), Credit/Debit Cards, and NetBanking with Customer ID & Bank OTP verification.
- **Two-Factor Authentication (2FA)**: Interactive 6-digit OTP/PIN handshake modal required before executing any wire transfer or cashout disbursal.
- **Virtual Platinum Debit Card Manager**: Real-time card locking (Freeze/Unfreeze), CVV reveal toggle, and interactive daily spending limit slider.
- **Official Statement PDF Generation**: Instant generation of branded bank statements with IFSC (`SMBK0002026`), SWIFT routing, itemized ledger, and cryptographic verification seal.
- **Instant Scan & Pay QR**: Personalized VPA (`username@smartbank`) and dynamic high-resolution QR codes for frictionless peer-to-peer transfers.
- **Tiered Administrative Portal**: Comprehensive dashboard for KYC approvals, user status management (Active, Suspended), and audit logs.

---

## 🛠️ Tech Stack

- **Frontend**: React 18, Vite, Redux Toolkit, React Router v6, Tailwind CSS, React Icons
- **Backend**: Node.js, Express.js, MongoDB, Mongoose, JWT (JSON Web Tokens), Bcrypt.js
- **Architecture**: Distributed RESTful APIs, Double-Entry Ledger, Atomic Conditional Concurrency Control

---

## ⚙️ Installation & Local Setup

### Prerequisites
- Node.js (v18+)
- MongoDB running locally on port `27017` or MongoDB Atlas URI

### 1. Clone & Install Dependencies
```bash
# Clone the repository
git clone https://github.com/<your-username>/smartbank.git
cd smartbank

# Install Backend dependencies
npm install

# Install Frontend dependencies
cd Frontend
npm install
cd ..
```

### 2. Environment Configuration
Create a `.env` file in the `Backend/` directory:
```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/smartbank
JWT_SECRET=your_ultra_secure_jwt_secret_key_2026
CORS_DOMAINS=http://localhost:3000
```

### 3. Run the Platform
```bash
# Run both Backend & Frontend simultaneously
npm run both
```
- **User Banking App**: [http://localhost:3000](http://localhost:3000)
- **Admin & Owner Portal**: [http://localhost:3000/admins/login](http://localhost:3000/admins/login)
- **Core API Server**: [http://localhost:5000](http://localhost:5000)

---

## 🔒 Security & Compliance Disclosures

SmartBank software specifications simulate enterprise-grade financial regulations:
- Passwords salted with adaptive Bcrypt (cost factor 10).
- Rate-limiting enabled across public API routes.
- Strict cross-origin resource sharing (CORS) whitelisting.
- No real customer funds are held; sandbox simulation operates purely for demonstration, testing, and portfolio audit.

---

## 📄 License
This project is licensed under the ISC License.
