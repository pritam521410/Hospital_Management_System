# 🏥 Hospital Management System

A full-featured Hospital Management System built with the MERN-inspired stack using Node.js, Express.js, MongoDB, and EJS. 
This application provides robust user authentication, secure session handling, image uploads, and a complete CRUD interface for managing hospital listings and user accounts.

---

## 🛠️ Technologies & Packages Used

### 📦 Backend & Server
- **Node.js** – Runtime environment
- **Express.js** – Web framework
- **MongoDB** – NoSQL database
- **Mongoose** – MongoDB object modeling

### 🔐 Authentication & Security
- **Passport.js** – Authentication middleware
- **Passport Local & Passport Local Mongoose** – Local strategy integration with MongoDB
- **Express Session** – Session management
- **Connect-Mongo** – Store sessions in MongoDB
- **Cookie Parser** – Parse cookie headers
- **Joi** – Schema-based request validation
- **Dotenv** – Manage environment variables

### 📤 File Handling & Media
- **Multer** – Handle image/file uploads
- **Cloudinary** – Store images in the cloud

### ⚙️ Utilities
- **EJS** – Template rendering engine
- **Connect-Flash** – Display flash messages

---

## 🌟 Key Features

- 🔐 **User Authentication**
  - Register, login, logout
  - Secure password hashing & encryption
  - User profile section

- 🏥 **Hospital Management**
  - Add, edit, view, and delete hospital listings (CRUD operations)
  - Upload hospital images using Multer & Cloudinary

- 💬 **Review System**
  - Users can add and delete reviews for hospitals

- 👤 **Account Management**
  - Update account details and passwords
  - View personal listings and reviews

- 🔒 **User Data Security**
  - Passwords are securely hashed using Passport Local Mongoose
  - Validation using Joi

- 💡 **Flash Messaging**
  - Instant feedback on user actions (e.g., login failed, review added)

--
Live Link of Project 
https://hospital-management-system-q8bp.onrender.com
