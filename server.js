require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const User = require("./models/User");
const Blog = require("./models/Blog");

const app = express();

const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());


// ===============================
// MONGODB CONNECTION
// ===============================

mongoose
    .connect(process.env.MONGODB_URI)
    .then(() => {
        console.log("MongoDB connected successfully!");
    })
    .catch((error) => {
        console.error("MongoDB connection error:", error.message);
    });


// ===============================
// HOME
// ===============================

app.get("/", (req, res) => {
    res.send("CodoMax Blog Backend is running!");
});


// ===============================
// REGISTER
// ===============================

app.post("/api/register", async (req, res) => {
    try {

        const { name, email, password } = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({
                message: "All fields are required"
            });
        }

        const existingUser = await User.findOne({ email });

        if (existingUser) {
            return res.status(400).json({
                message: "User already exists"
            });
        }

        const user = new User({
            name,
            email,
            password
        });

        await user.save();

        res.status(201).json({
            message: "Registration successful",
            user: {
                id: user._id,
                name: user.name,
                email: user.email
            }
        });

    } catch (error) {

        console.error("Registration error:", error);

        res.status(500).json({
            message: "Server error during registration"
        });
    }
});


// ===============================
// LOGIN
// ===============================

app.post("/api/login", async (req, res) => {
    try {

        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                message: "Email and password are required"
            });
        }

        const user = await User.findOne({ email });

        if (!user) {
            return res.status(401).json({
                message: "Invalid email or password"
            });
        }

        if (user.password !== password) {
            return res.status(401).json({
                message: "Invalid email or password"
            });
        }

        res.json({
            message: "Login successful",
            user: {
                id: user._id,
                name: user.name,
                email: user.email
            }
        });

    } catch (error) {

        console.error("Login error:", error);

        res.status(500).json({
            message: "Server error during login"
        });
    }
});


// ===============================
// PROFILE
// ===============================

app.get("/api/profile", async (req, res) => {
    try {

        const email =
            req.query.email ||
            req.headers["x-user-email"];

        if (!email) {
            return res.status(400).json({
                message: "Email is required"
            });
        }

        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({
                message: "User not found"
            });
        }

        res.json({
            user: {
                id: user._id,
                name: user.name,
                email: user.email
            }
        });

    } catch (error) {

        console.error("Profile error:", error);

        res.status(500).json({
            message: "Unable to load profile"
        });
    }
});


// ===============================
// CREATE BLOG
// ===============================

app.post("/api/blogs", async (req, res) => {
    try {

        console.log("Received blog data:", req.body);

        const {
            title,
            category,
            content,
            author,
            status
        } = req.body;

        if (!title) {
            return res.status(400).json({
                message: "Title is required"
            });
        }

        if (!category) {
            return res.status(400).json({
                message: "Category is required"
            });
        }

        if (!content) {
            return res.status(400).json({
                message: "Content is required"
            });
        }

        if (!author) {
            return res.status(400).json({
                message: "Author is required"
            });
        }

        const blog = new Blog({
            title,
            category,
            content,
            author,
            status: status || "Published"
        });

        await blog.save();

        console.log("Blog saved successfully:", blog._id);

        res.status(201).json({
            message: "Blog created successfully",
            blog
        });

    } catch (error) {

        console.error("Blog creation error:", error);

        res.status(500).json({
            message: "Server error while creating blog",
            error: error.message
        });
    }
});


// ===============================
// GET ALL BLOGS
// ===============================

app.get("/api/blogs", async (req, res) => {
    try {

        const blogs = await Blog.find()
            .sort({ createdAt: -1 });

        res.json({
            blogs
        });

    } catch (error) {

        console.error("Error fetching blogs:", error);

        res.status(500).json({
            message: "Unable to load blogs"
        });
    }
});


// ===============================
// GET MY BLOGS
// ===============================

app.get("/api/my-blogs", async (req, res) => {
    try {

        const author = req.query.author;

        let blogs;

        if (author) {

            blogs = await Blog.find({
                author: author
            }).sort({
                createdAt: -1
            });

        } else {

            blogs = await Blog.find()
                .sort({
                    createdAt: -1
                });
        }

        res.json({
            blogs
        });

    } catch (error) {

        console.error("Error fetching my blogs:", error);

        res.status(500).json({
            message: "Unable to load your blogs"
        });
    }
});


// ===============================
// GET SINGLE BLOG
// ===============================

app.get("/api/blogs/:id", async (req, res) => {
    try {

        const blog = await Blog.findById(req.params.id);

        if (!blog) {
            return res.status(404).json({
                message: "Blog not found"
            });
        }

        res.json({
            blog
        });

    } catch (error) {

        console.error("Error fetching blog:", error);

        res.status(500).json({
            message: "Unable to load blog"
        });
    }
});


// ===============================
// UPDATE BLOG
// ===============================

app.put("/api/blogs/:id", async (req, res) => {
    try {

        const blog = await Blog.findByIdAndUpdate(
            req.params.id,
            req.body,
            {
                new: true,
                runValidators: true
            }
        );

        if (!blog) {
            return res.status(404).json({
                message: "Blog not found"
            });
        }

        res.json({
            message: "Blog updated successfully",
            blog
        });

    } catch (error) {

        console.error("Update error:", error);

        res.status(500).json({
            message: "Unable to update blog"
        });
    }
});


// ===============================
// DELETE BLOG
// ===============================

app.delete("/api/blogs/:id", async (req, res) => {
    try {

        const blog = await Blog.findByIdAndDelete(
            req.params.id
        );

        if (!blog) {
            return res.status(404).json({
                message: "Blog not found"
            });
        }

        res.json({
            message: "Blog deleted successfully"
        });

    } catch (error) {

        console.error("Delete error:", error);

        res.status(500).json({
            message: "Unable to delete blog"
        });
    }
});


// ===============================
// START SERVER
// ===============================

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});