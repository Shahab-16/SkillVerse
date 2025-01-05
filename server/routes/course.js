const express = require("express");
const router = express.Router();

const {
  createCourse,
  deleteCourse,
  editCourse,
} = require("../controllers/course");

const {
  createRatingAndReview,
  getRatingAndReview,
  getAllRatingAndReview,
} = require("../controllers/ratingsAndReviews");

const {
  createSection,
  updateSection,
  deleteSection,
} = require("../controllers/section");

const {
  createSubSection,
  updateSubSection,
  deleteSubSection,
} = require("../controllers/subSection");

const {
  createCategory,
  showAllCategories,
  categoryPageDetails,
} = require("../controllers/category");

const {
  auth,
  isAdmin,
  isInstructor,
  isStudent,
} = require("../middleware/auth");

router.post("/create-course", auth, isInstructor, createCourse);
router.delete("/delete-course", auth, isInstructor, deleteCourse);
router.post("/edit-course", auth, isInstructor, editCourse);

router.post(
  "/create-rating-and-review",
  auth,
  isStudent,
  createRatingAndReview
);
router.get("/get-rating-and-review", auth, getRatingAndReview);
router.get("/get-all-rating-and-review", getAllRatingAndReview);

router.post("/create-section", auth, isInstructor, createSection);
router.put("/update-section", auth, isInstructor, updateSection);
router.delete("/delete-section", auth, isInstructor, deleteSection);

router.post("/create-subsection", auth, isInstructor, createSubSection);
router.put("/update-subsection", auth, isInstructor, updateSubSection);
router.delete("/delete-subsection", auth, isInstructor, deleteSubSection);

router.post("/create-category", auth, isAdmin, createCategory);
router.get("/show-all-categories", showAllCategories);
router.get("/category-page-details", categoryPageDetails);

module.exports = router;
