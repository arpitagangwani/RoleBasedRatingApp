# 💻 Coding Challenge – Role-Based Store Rating Platform

A full-stack web application built to fulfill the **Coding Challenge** requirements. The app supports **role-based access**, allowing System Admins, Store Owners, and Normal Users to interact with the platform through unique functionalities. Users can register, log in, rate stores, and manage data accordingly.

---

## 🛠️ Tech Stack

| Layer      | Technology          |
|------------|---------------------|
| Backend    | Node.js (Express.js)|
| Database   | MySQL               |
| Frontend   | React.js            |
| Auth       | JSON Web Tokens     |
| Styling    | CSS (with modular structure) |

---

## 👥 User Roles and Functionalities

### 👨‍💼 1. System Administrator
- Can **add**:
  - Stores
  - Normal Users
  - Admin Users
- Can **view dashboards** showing:
  - Total number of users
  - Total number of stores
  - Total number of ratings
- Can **view** and **filter**:
  - All users (Name, Email, Address, Role, and Store Rating if owner)
  - All stores (Name, Email, Address, Average Rating)
  - All submitted ratings
- Can **log out**

---

### 🧑 2. Normal User
- Can **register** (with fields: Name, Email, Address, Password)
- Can **log in**
- Can **update password**
- Can **view all stores** with:
  - Store Name
  - Address
  - Overall Rating
  - User's Submitted Rating
  - Submit/Update Rating (1 to 5)
- Can **search** by Name and Address
- Can **log out**

---

### 🏪 3. Store Owner
- Can **log in**
- Can **update password**
- Can **view dashboard** with:
  - Average rating of their store
  - List of users who submitted ratings
- Can **add store**
- Can **log out**

---

## ✅ Form Validations

| Field     | Rule                                                                 |
|-----------|----------------------------------------------------------------------|
| Name      | Min 20, Max 60 characters                                            |
| Address   | Max 400 characters                                                   |
| Password  | 8-16 characters, at least one uppercase & one special character      |
| Email     | Must be a valid email format                                         |

---

## 📋 Functional Features

- 🔐 Single login system with role-based redirection
- 🌐 Dynamic Dashboards for each role
- 📦 Stores and ratings linked relationally
- ⭐ Real-time rating updates
- 🔍 Filtering and Sorting (Name, Email, Address, Role)
- 🧪 Validation on all forms
- 🌈 Clean and responsive UI

---

## ⚙️ Database Schema Overview

- **users**: id, name, email, password, address, role
- **stores**: id, name, email, address, owner_id
- **ratings**: id, rating (1-5), user_id, store_id, created_at

---

## 🏁 Getting Started

### 📦 Backend Setup

```bash
cd backend
npm install
node index.js


💻 Frontend Setup

cd frontend
npm install
npm start


📂 Folder Structure

fullstack-role/
├── backend/
│   ├── routes/
│   ├── controllers/
│   └── db.js
├── frontend/
│   ├── pages/
│   ├── components/
│   └── services/api.js
└── README.md



🧑‍💻 Author

Made with ❤️ by Arpita Gangwani