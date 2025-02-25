import express from "express";
import {
  registerAdmin,
  loginAdmin,
  getUsers,
  updateUsers,
  getAuthors,
  updateAuthors,
  getAudiobooks,
  getCategories,
  deleteUser,
  deleteAuthor,
  addCategory,
  deleteCategory,
  deleteAudiobooks,
  getNumberOfUsers,
  getNumberOfAuthors,
  getNumberOfAudiobooks,
  getAudiobooksOfAuthor,
  getSubcategoriesOfBook,
} from "../controllers/adminController.js";
import verifyToken from "../middleware/authMiddleware.js";

const router = express.Router();
router.post("/register", registerAdmin);
router.post("/login", loginAdmin);
router.get("/userslist", verifyToken, getUsers);
router.put("/updateusers", verifyToken, updateUsers);
router.delete("/deleteuser", verifyToken, deleteUser);
router.get("/authorslist", verifyToken, getAuthors);
router.put("/updateauthors", verifyToken, updateAuthors);
router.delete("/deleteauthor", verifyToken, deleteAuthor);
router.get("/audiobooks", verifyToken, getAudiobooks);
router.get("/categories", verifyToken, getCategories);
router.get("/categories/:category/subcategories", getSubcategoriesOfBook);

router.post("/addcategories", verifyToken, addCategory);
router.delete("/deletecategory", verifyToken, deleteCategory);
router.delete("/deleteaudiobook", verifyToken, deleteAudiobooks);
router.post("/audiobooksofauthor", verifyToken, getAudiobooksOfAuthor);

// Admin-only routes
router.get("/getuserscount", verifyToken, getNumberOfUsers);
router.get("/getauthorscount", verifyToken, getNumberOfAuthors);
router.get("/getaudiobookscount", verifyToken, getNumberOfAudiobooks);

export default router;
