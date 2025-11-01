# 🧩 MEAN Stack Employee Management System

This project is an **enhanced version** of the official [MongoDB Developer MEAN Stack Example](https://github.com/mongodb-developer/mean-stack-example).  
It’s a **full-stack CRUD application** built using **MongoDB, Express, Angular, and Node.js**, with additional features and Docker support for easier deployment.

---

## 🚀 Features

### 🔹 Original Functionality
- Full **CRUD (Create, Read, Update, Delete)** operations for employees
- RESTful API built with **Express.js**
- Angular-based frontend for managing employees
- MongoDB integration for persistent data storage

### 🔹 Added / Improved Features
- 🆕 **Employee ID field**: Each employee now has a unique Employee ID (entered by the user and stored in DB).
- 🔍 **Search functionality**: Search employees by **name** or **employee ID**.
- 🏢 **Department module**: New Department collection with full CRUD functionality.
- 🔗 **Employee–Department relationship**: Each employee is linked to a department.
- 🐳 **Dockerized client and server**: Easily run both frontend and backend using Docker.

---

## 🧱 Tech Stack

| Layer | Technology |
|-------|-------------|
| Frontend | Angular |
| Backend | Node.js, Express.js |
| Database | MongoDB |
| Containerization | Docker |

---

---

## 🧩 Running the Project Locally (without Docker)

### 1. Clone the repository
```bash
git clone https://github.com/<your-username>/mean-stack-example.git
cd mean-stack-example
```
### 2. Set up and run the backend
```bash
cd server
npm install
npm start
```
Server will start on:
👉 http://localhost:3000
### 3. Set up and run the frontend
```bash
cd ../client
npm install
npm start
```
Frontend will start on:
👉 http://localhost:4200
### 4. Connect with MongoDB
Set your [Atlas URI connection string](https://docs.atlas.mongodb.com/getting-started/) as a parameter in `server/.env`. Make sure you replace the username and password placeholders with your own credentials.

```
ATLAS_URI=mongodb+srv://<username>:<password>@cluster0.lal82g6.mongodb.net/?appName=Cluster0
```

## 🐳 Running with Docker

You can run the entire application using Docker — either by using pre-built images from Docker Hub or by building them locally.

---

### 🧩 Option 1 — Use Pre-Built Images from Docker Hub

If you’ve already pushed the images to your Docker Hub account (`gowrisrivani`):

```bash
docker pull gowrisrivani/mean-stack-example-client
docker pull gowrisrivani/mean-stack-example-server
docker pull mongo:6
```
Then run:
```
# Start MongoDB
docker run -d -p 27017:27017 --name mongo mongo:6
# Start Backend Server
docker run -d -p 5200:5200 --name mean-stack-example-server gowrisrivani/mean-stack-example-server
# Start Frontend Client
docker run -d -p 4200:80 --name mean-stack-example-client gowrisrivani/mean-stack-example-client
```
Access:
Frontend: http://localhost:4200
Backend: http://localhost:5200
MongoDB: mongodb://localhost:27017

### 🧩 Option 2 — Build and Run Locally
From the root folder of your project:
```
# Build backend image
docker build -t mean-stack-example-server ./server

# Build frontend image
docker build -t mean-stack-example-client ./client
```
Then run them locally:
```
# Start MongoDB
docker run -d -p 27017:27017 --name mongo mongo:6

# Start Backend Server
docker run -d -p 5200:5200 --name mean-stack-example-server mean-stack-example-server

# Start Frontend Client
docker run -d -p 4200:80 --name mean-stack-example-client mean-stack-example-client
```
Access:
Frontend: http://localhost:4200
Backend: http://localhost:5200

## 🤝 Contributing

Feel free to **fork** this repository, **enhance features**, or **open issues and pull requests** to improve the project!

Your contributions are always welcome 💡

---

## 🧾 License

This project is based on the original **MongoDB Developer MEAN Stack Example** and follows the same license terms.

For more details, refer to the [MongoDB Developer MEAN Stack Example Repository](https://github.com/mongodb-developer/mean-stack-example).
