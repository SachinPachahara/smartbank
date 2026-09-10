# SmartBank — Full-Stack FinTech Core Banking Simulation

![SmartBank Banner](https://images.unsplash.com/photo-1559526324-4b87b5e36e44?auto=format&fit=crop&w=1200&q=80)

[![React](https://img.shields.io/badge/React-18.0-61dafb?logo=react)](https://reactjs.org/)
[![Node.js](https://img.shields.io/badge/Node.js-Express-339933?logo=node.js)](https://nodejs.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-ACID_Transactions-47A248?logo=mongodb)](https://www.mongodb.com/)
[![TailwindCSS](https://img.shields.io/badge/TailwindCSS-v3.0-38bdf8?logo=tailwind-css)](https://tailwindcss.com/)
[![Security](https://img.shields.io/badge/Security-IDOR_Hardened-emerald)](#security-architecture)

SmartBank is a full-stack FinTech core banking simulation engineered to solve real-world financial software challenges: **atomic multi-document transactions, double-entry ledger bookkeeping, integer paise precision, idempotency, and object-level authorization (IDOR protection)**.

---

## 🏛️ Core Engineering Highlights

### 1. MongoDB Multi-Document ACID Transactions
Transfers execute inside atomic multi-document MongoDB transactions (`session.startTransaction()`), ensuring that sender debit and beneficiary credit either succeed together or rollback completely with zero intermediate state.
- **Atomic Balance Guards**: Uses `{ balance: { $gte: amountInPaise } }` with `$inc` operators.
- **Idempotency Guarantees**: Enforces a database unique constraint on `idempotencyKey` to prevent duplicate transfers on network retries or double clicks.
- **No Insecure Fallbacks**: Removes manual "debit → credit → refund" workarounds in favor of native ACID isolation.

### 2. Strict Double-Entry Ledger Bookkeeping
Separates business transaction events (`Transaction`) from atomic accounting entries (`LedgerEntry`). Every financial movement produces paired entries:
- **Debit**: ₹X (stored in integer paise)
- **Credit**: ₹X (stored in integer paise)
- **Guarantee**: Total Debit strictly equals Total Credit (`Total Debit === Total Credit`).
- **Lean Documents**: Eliminates unbounded subdocument arrays (`in`, `out`, `deposit_logs`, `withdraw_logs`) from the `Accounts` collection, maintaining lean documents and querying transaction history on demand.

### 3. Integer Paise Money Handling
To eliminate IEEE 754 floating-point rounding errors common in currency arithmetic, all monetary balances and transfers are stored as integer paise (e.g. ₹100.50 → 10,050 paise) and cleanly converted at the API boundary.

### 4. Object-Level Access Control (IDOR Prevention)
- All account endpoints (`GET /api/account/:id`, `DELETE /api/account/:id`, `PUT /deposit/:id`, `PUT /withdraw/:id`, `PUT /transfer/:from_id/:to_id`) verify ownership against `req.user.id` or require admin privileges.
- Public first-owner initialization (`/api/admins/owner/create`) permanently locks with `403 Forbidden` once an initial owner exists.

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
- **Architecture**: RESTful APIs, MongoDB ACID Transactions, Double-Entry Ledger, Integer Precision Accounting

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
