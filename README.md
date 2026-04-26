# 🛒 ShopFlux – Full-Stack E-Commerce Web App

A full-stack e-commerce platform built with React, Node.js, Express, and MySQL.
Supports product browsing, cart, wishlist, authentication, and a robust review system with duplicate handling.

---

## 🚀 Features

* 🔐 User Authentication (JWT-based)
* 🛍 Product Listing & Filtering
* 🛒 Add to Cart functionality
* ❤️ Wishlist management
* ⭐ Review & Rating system (1 review per user per product)
* 📦 Order management & history
* 📱 Responsive UI (Tailwind CSS)

---

## 🧠 Key Highlights

* Prevents duplicate reviews using conditional insert/update logic
* RESTful API design with modular backend architecture
* Clean separation of controllers, routes, and middleware
* Error handling and validation across all endpoints
* Optimized frontend-backend communication using Axios

---

## 🛠 Tech Stack

**Frontend**

* React.js
* Tailwind CSS
* Axios

**Backend**

* Node.js
* Express.js

**Database**

* MySQL

**Authentication**

* JSON Web Tokens (JWT)

---

## ⚙️ Setup Instructions

### 1️⃣ Clone Repository

```
git clone https://github.com/your-username/shopflux.git
cd shopflux
```

---

### 2️⃣ Setup Backend

```
cd server
npm install
```

Create `.env` file:

```
PORT=5000
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=your_database
JWT_SECRET=your_secret_key
```

Run backend:

```
node server.js
```

---

### 3️⃣ Setup Frontend

```
cd client
npm install
```

Create `.env` file:

```
REACT_APP_API_URL=http://localhost:5000/api
```

Run frontend:

```
npm start
```

---

## 🗄 Database Schema (Simplified)

### Users

```
id | name | email | password
```

### Products

```
id | name | price | category | image
```

### Reviews

```
id | product_id | user_id | rating | review | created_at
```

### Orders

```
id | user_id | total_price | status
```

---

## 🔗 API Endpoints

### Auth

* `POST /api/auth/register`
* `POST /api/auth/login`

### Products

* `GET /api/products`

### Cart

* `POST /api/cart`
* `GET /api/cart/:userId`

### Wishlist

* `POST /api/wishlist`
* `DELETE /api/wishlist/:id`

### Reviews

* `GET /api/reviews/product/:productId`
* `GET /api/reviews/check?productId=&userId=`
* `POST /api/reviews`
* `PUT /api/reviews/:reviewId`
* `DELETE /api/reviews/:reviewId`

---

## ⭐ Review System Logic

* One user can submit only one review per product
* If review exists → it updates instead of inserting
* Prevents duplicate entries at database level

---

## 📸 Screenshots

<img width="618" height="594" alt="image" src="https://github.com/user-attachments/assets/ca1ac026-2a2a-4f37-97df-972bfa0af4bb" />
<img width="721" height="592" alt="image" src="https://github.com/user-attachments/assets/2ab8aa4e-7388-4565-96ae-29ff7469a982" />
<img width="1360" height="613" alt="image" src="https://github.com/user-attachments/assets/7bbc15ba-7aab-478d-b6b5-49643993bb52" />
<img width="1256" height="625" alt="image" src="https://github.com/user-attachments/assets/aefb0755-90c6-4058-ad08-746ee29ba20b" />
<img width="1287" height="537" alt="image" src="https://github.com/user-attachments/assets/2c678a7c-15ab-4486-ab4a-e1d0a3a53df4" />
<img width="376" height="522" alt="image" src="https://github.com/user-attachments/assets/36a8ef57-3219-4b70-9d0a-bb132aa3ac3a" />
<img width="952" height="432" alt="image" src="https://github.com/user-attachments/assets/6ce8a15f-2913-4554-b445-27af5e5e9ac0" />
<img width="1241" height="531" alt="image" src="https://github.com/user-attachments/assets/ef0c4483-b676-4c51-b07e-421b13a517da" />


---

## 🚀 Future Improvements

* Payment gateway integration (Stripe/Razorpay)
* Admin dashboard
* Product search & filters (advanced)
* Pagination & lazy loading
* Deployment (AWS / Vercel / Render)

---

## 📌 Author

**Prerna Ranjan**
IT Undergraduate | Full-Stack Developer

---

## 📄 License

This project is licensed under the MIT License.
