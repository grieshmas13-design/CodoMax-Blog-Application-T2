@'
# Blog Application – CRUD Operations

## 📌 Project Overview

This is a full-stack Blog Application developed as part of **Module 4 – CRUD Operations**.

The application allows users to register and log in securely, create blog posts, view blogs, search blogs, filter blogs by category, update existing blogs, delete blogs, and view individual blog details.

## 🚀 Features

- User Registration
- User Login
- Create Blog Posts
- View All Blog Posts
- View Individual Blog Details
- Update/Edit Blog Posts
- Delete Blog Posts
- Search Blogs
- Filter Blogs by Category
- Combined Search and Category Filtering
- MongoDB Database Integration
- Password Hashing using bcrypt
- REST API using Express.js

## 🛠️ Technologies Used

### Frontend
- HTML5
- CSS3
- JavaScript

### Backend
- Node.js
- Express.js
- Mongoose

### Database
- MongoDB

### Tools
- Visual Studio Code
- Git
- GitHub

## 🔗 CRUD API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/blogs` | Create a new blog |
| GET | `/api/blogs` | Retrieve all blogs |
| GET | `/api/blogs/:id` | Retrieve a single blog |
| PUT | `/api/blogs/:id` | Update an existing blog |
| DELETE | `/api/blogs/:id` | Delete a blog |

## 🔎 Search and Category Filter

The dashboard provides users with:

- Search by blog title
- Search by blog content
- Search by author
- Filter by blog category
- Combine search and category filters

## 📂 Project Structure

```text
Blog-Application/
├── index.html
├── login.html
├── register.html
├── dashboard.html
├── create-blog.html
├── blog-details.html
├── style.css
├── script.js
├── server.js
├── models/
│   ├── Blog.js
│   └── User.js
├── package.json
├── package-lock.json
├── .gitignore
└── README.md