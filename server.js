require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");

const User = require("./models/User");
const Blog = require("./models/Blog");

const app = express();
const PORT = 3000;


// =========================
// MIDDLEWARE
// =========================

app.use(express.json());


// =========================
// CONNECT TO MONGODB
// =========================

mongoose
    .connect(process.env.MONGODB_URI)
    .then(() => {
        console.log("MongoDB connected successfully!");
    })
    .catch((error) => {
        console.error("MongoDB connection failed:", error.message);
    });


// =========================
// TEST ROUTE
// =========================

app.get("/", (req, res) => {
    res.send("CodoMax Blog Backend is running!");
});


// =========================
// USER REGISTRATION API
// =========================

app.post("/api/register", async (req, res) => {
    try {

        const { name, email, password } = req.body;

        // Check required fields
        if (!name || !email || !password) {
            return res.status(400).json({
                message: "All fields are required"
            });
        }

        // Check existing user
        const existingUser = await User.findOne({ email });

        if (existingUser) {
            return res.status(400).json({
                message: "User already exists"
            });
        }

        // Create new user
        const user = new User({
            name,
            email,
            password
        });

        await user.save();

        res.status(201).json({
            message: "User registered successfully",
            user
        });

    } catch (error) {

        res.status(500).json({
            message: "Registration failed",
            error: error.message
        });

    }
});


// =========================
// USER LOGIN API
// =========================

app.post("/api/login", async (req, res) => {
    try {

        const { email, password } = req.body;

        // Check required fields
        if (!email || !password) {
            return res.status(400).json({
                message: "Email and password are required"
            });
        }

        // Find user
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(401).json({
                message: "Invalid email or password"
            });
        }

        // Check password
        if (user.password !== password) {
            return res.status(401).json({
                message: "Invalid email or password"
            });
        }

        res.status(200).json({
            message: "Login successful",
            user
        });

    } catch (error) {

        res.status(500).json({
            message: "Login failed",
            error: error.message
        });

    }
});


// =========================
// CREATE BLOG API
// =========================

app.post("/api/blogs", async (req, res) => {
    try {

        const {
            title,
            category,
            content,
            author,
            status
        } = req.body;

        // Check required fields
        if (!title || !category || !content || !author) {
            return res.status(400).json({
                message: "All required fields must be filled"
            });
        }

        // Create blog
        const blog = new Blog({
            title,
            category,
            content,
            author,
            status: status || "Published"
        });

        await blog.save();

        res.status(201).json({
            message: "Blog created successfully",
            blog
        });

    } catch (error) {

        res.status(500).json({
            message: "Blog creation failed",
            error: error.message
        });

    }
});


// =========================
// GET ALL BLOGS API
// =========================

app.get("/api/blogs", async (req, res) => {
    try {

        const blogs = await Blog.find()
            .sort({ createdAt: -1 });

        res.status(200).json({
            blogs
        });

    } catch (error) {

        res.status(500).json({
            message: "Failed to fetch blogs",
            error: error.message
        });

    }
});


// =========================
// START SERVER
// =========================

app.listen(PORT, () => {
    console.log(
        `Server running on http://localhost:${PORT}`
    );
});