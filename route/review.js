const express = require("express");
const router = express.Router({ mergeParams: true });
const wrapAsync = require("../utils/wrapAsync");
const ExpressError = require("../utils/expressError");
const { listingSchema, reviewSchema } = require("../schema");
const Review = require("../models/review");
const Listing = require("../models/listing");
const { validateReview, isLoggedIn, isAuthor } = require("../middleware");
const reviewController = require("../controller/reviews.js");

// Post review route
router.post("/", isLoggedIn, validateReview, wrapAsync(reviewController.createReview));

// Delete review route
router.delete("/:reviewId", isLoggedIn, isAuthor, wrapAsync(reviewController.deleteReview));

module.exports = router;
