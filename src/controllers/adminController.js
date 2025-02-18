// admin controller
import Admin from "../models/adminModel.js";
import User from "../models/userModel.js";
import Author from "../models/authorModel.js";
import Audiobook from "../models/audiobookModel.js";
import Category from "../models/categoryModel.js";
import dotenv from "dotenv";
// import express and other necessary modules
import express from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
dotenv.config();

// register admin
const registerAdmin = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const admin = new Admin({
      name,
      email,
      password: hashedPassword,
    });
    (await admin) && admin.save();
    res.status(201).json({ message: "Admin registered successfully" });
  } catch (error) {
    status(500).json({ error: "Internal server error" });
  }
};

// login admin
const loginAdmin = async (req, res) => {
  try {
    const { email, password } = req.body;
    const admin = await Admin.findOne({ email });
    if (!admin) {
      return res.status(401).json({ error: "Invalid email or password" });
    }
    const passwordMatch = await bcrypt.compare(password, admin.password);
    if (!passwordMatch) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    const adminUser = {
      _id: admin._id,
      name: admin.name,
      email: admin.email,
    };
    const token = jwt.sign({ adminId: admin._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });
    res.status(200).json({ adminUser, token });
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
};

// // function to return the users
// const getUsers = async (req, res) => {
//   try {
//     const users = await User.find({});
//     res.status(200).json(users);
//   } catch (error) {
//     res.status(500).json({ error: "Internal server error" });
//   }
// };
// Function to return the users with pagination
const getUsers = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1; // Get page from query, default to 1
    const limit = parseInt(req.query.limit) || 5; // Get limit from query, default to 5
    const skip = (page - 1) * limit;

    const users = await User.find({}).skip(skip).limit(limit); // Apply skip and limit for pagination
    const total = await User.countDocuments({}); // Get total number of users

    res.status(200).json({
      users: users,
      total: total,
    });
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
};

const updateUsers = async (req, res) => {
  try {
    const { userId, ...updatedFields } = req.body;
    if (!userId) {
      return res.status(400).json({ error: "User ID is required" });
    }
    console.log({ userId, updatedFields });

    const user = await User.findByIdAndUpdate(userId, updatedFields, {
      new: true,
      runValidators: true, // Validate fields before updating
    });
    res.status(200).json({
      message: "User updated successfully",
    });
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
};

const deleteUser = async (req, res) => {
  try {
    const { userId } = req.body;
    if (!userId) {
      return res.status(400).json({ error: "User ID is required" });
    }
    const user = await User.findByIdAndDelete(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
};

// const getAuthors = async (req, res) => {
//   try {
//     const authors = await Author.find({});
//     res.status(200).json(authors);
//   } catch (error) {
//     res.status(500).json({ error: "Internal server error" });
//   }
// };
// Function to return the authors with pagination
const getAuthors = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 5;
    const skip = (page - 1) * limit;

    const authors = await Author.find({}).skip(skip).limit(limit);
    const total = await Author.countDocuments({});

    res.status(200).json({
      authors: authors,
      total: total,
    });
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
};
const updateAuthors = async (req, res) => {
  try {
    const { authorId, ...updatedFields } = req.body;
    if (!authorId) {
      return res.status(400).json({ error: "Author ID is required" });
    }
    console.log({ authorId, updatedFields });
    const author = await Author.findByIdAndUpdate(authorId, updatedFields, {
      new: true,
      runValidators: true, // Validate fields before updating
    });
    return res.status(200).json({
      message: "Author updated successfully",
    });
  } catch (error) {
    return res.status(500).json({ error: "Internal server error" });
  }
};

const deleteAuthor = async (req, res) => {
  try {
    const { authorId } = req.body;
    if (!authorId) {
      return res.status(400).json({ error: "Author ID is required" });
    }
    const author = await Author.findByIdAndDelete(authorId);
    if (!author) {
      return res.status(404).json({ error: "Author not found" });
    }
    res.status(200).json({ message: "Author deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
};

const getAudiobooks = async (req, res) => {
  try {
    const audiobooks = await Audiobook.find({});
    res.status(200).json(audiobooks);
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
};
const deleteAudiobooks = async (req, res) => {
  try {
    const { audiobookId } = req.body;
    if (!audiobookId) {
      return res.status(400).json({ error: "Audiobook ID is required" });
    }
    const audiobook = await Audiobook.findByIdAndDelete(audiobookId);
    if (!audiobook) {
      return res.status(404).json({ error: "Audiobook not found" });
    }
    res.status(200).json({ message: "Audiobook deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
};

// const getCategories = async (req, res) => {
//   try {
//     const categories = await Category.find({});
//     console.log({ categories });
//     res.status(200).json(categories);
//   } catch (error) {
//     res.status(500).json({ error: "Internal server error" });
//   }
// };
const getCategories = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1; // Get page from query, default to 1
    const limit = parseInt(req.query.limit) || 10; // Get limit from query, default to 10
    const skip = (page - 1) * limit;

    const categories = await Category.find({}).skip(skip).limit(limit);
    const total = await Category.countDocuments({});

    res.status(200).json({
      categories: categories,
      total: total,
    });
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
};

const addCategory = async (req, res) => {
  try {
    const { name, keywords } = req.body;
    if (!name) {
      return res.status(400).json({ error: "Category name is required" });
    }
    const existingCategory = await Category.findOne({ name });
    if (existingCategory) {
      return res.status(409).json({ error: "Category already exists" });
    }
    console.log(`Adding category ${name}`);
    console.log(keywords);
    const category = new Category({ name, keywords });
    await category.save();
    return res.status(201).json({ message: "Category added successfully" });
  } catch (error) {
    return res.status(500).json({ error: "Internal server error" });
  }
};
const deleteCategory = async (req, res) => {
  try {
    const { categoryId } = req.body; // Get categoryId from req.body
    if (!categoryId) {
      return res.status(400).json({ error: "Category ID is required" });
    }
    const cname = await Category.deleteOne({ _id: categoryId }); // Use _id: categoryId
    if (!cname) {
      return res.status(404).json({ error: "Category not found" });
    }
    res.status(200).json({ message: "Category deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
};
const getNumberOfUsers = async (req, res) => {
  try {
    const numUsers = await User.countDocuments();
    res.status(200).json({ numUsers });
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
};
const getNumberOfAuthors = async (req, res) => {
  try {
    const numAuthors = await Author.countDocuments();
    res.status(200).json({ numAuthors });
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
};

const getNumberOfAudiobooks = async (req, res) => {
  try {
    const numAudiobooks = await Audiobook.countDocuments();
    res.status(200).json({ numAudiobooks });
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
};
const getAudiobooksOfAuthor = async (req, res) => {
  try {
    const { authorId } = req.body;
    if (!authorId) {
      return res.status(400).json({ error: "Author ID is required" });
    }
    // console.log(authorId);
    const audiobooks = await Audiobook.find({ authorId: authorId });
    res.status(200).json(audiobooks);
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
};

export {
  registerAdmin,
  loginAdmin,
  getUsers,
  getAuthors,
  updateAuthors,
  getAudiobooks,
  getCategories,
  updateUsers,
  deleteUser,
  deleteAuthor,
  deleteAudiobooks,
  addCategory,
  deleteCategory,
  getNumberOfUsers,
  getNumberOfAuthors,
  getNumberOfAudiobooks,
  getAudiobooksOfAuthor,
};
