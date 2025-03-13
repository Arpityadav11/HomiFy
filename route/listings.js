const express = require("express");
const router = express.Router();
const Listing = require("../models/listing");
const wrapAsync = require("../utils/wrapAsync");
const ExpressError = require("../utils/expressError");
const { isLoggedIn, isOwner, validateListing } = require("../middleware");
const { index, newListingForm, showListing, createListing, renderEditForm, updateListing, deleteListing } = require("../controller/listing");
const multer  = require('multer')
const{storage} = require('../cloudConfig');
const upload = multer({ storage })

router.route("/")
    .get(wrapAsync(index))
    .post(
        isLoggedIn, 
        upload.single("listing[image]"), 
        validateListing, 
        wrapAsync(createListing)
    );

// Route to render the new listing form
router.get("/new", isLoggedIn, newListingForm);

// Routes for specific listing actions
router.route("/:id")
    .get(wrapAsync(showListing))
    .put(
        isLoggedIn, 
        isOwner, 
        upload.single("listing[image]"), 
        validateListing, 
        wrapAsync(updateListing)
    )
    .delete(isLoggedIn, isOwner, wrapAsync(deleteListing));

// Route to render edit form
router.get("/:id/edit", isLoggedIn, isOwner, wrapAsync(renderEditForm));

module.exports = router;
