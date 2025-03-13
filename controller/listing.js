const Listing = require("../models/listing");
const ExpressError = require("../utils/expressError");

// Index Route: Display all listings
module.exports.index = async (req, res) => {
    const allListings = await Listing.find({});
    res.render("listings/index.ejs", { allListings });
};

// Form to Create a New Listing
module.exports.newListingForm = (req, res) => {
    res.render("listings/new.ejs");
};

// Show a Specific Listing
module.exports.showListing = async (req, res) => {
    const { id } = req.params;
    const listing = await Listing.findById(id)
        .populate({
            path: "reviews",
            populate: {
                path: "author",
            },
        })
        .populate("owner");

    if (!listing) {
        req.flash("error", "Listing you requested for does not exist!");
        return res.redirect("/listings");
    }
    res.render("listings/show.ejs", { listing });
};

// Create a New Listing with File Uploads
// module.exports.createListing = async (req, res, next) => {
//     try {
//         if (!req.file) {
//             req.flash("error", "Image is required!");
//             return res.redirect("/listings/new");
//         }

//         const { path: url, filename } = req.file;
//         const newListing = new Listing(req.body.listing);
//         newListing.owner = req.user._id;
//         newListing.image = { url, filename };
//         await newListing.save();

//         req.flash("success", "New listing created!");
//         res.redirect(`/listings/${newListing._id}`);
//     } catch (error) {
//         console.error(error);
//         next(error);
//     }
// };
module.exports.createListing = async (req, res, next) => {
    try {
        if (!req.file) {
            throw new ExpressError(400, "Image is required!");
        }
        const { path: url, filename } = req.file;
        const newListing = new Listing(req.body.listing);
        newListing.owner = req.user._id;
        newListing.image = { url, filename };
        await newListing.save();

        req.flash("success", "New listing created!");
        res.redirect("/listings");
    } catch (error) {
        console.error(error);
        req.flash("error", "Something went wrong. Try again.");
        res.redirect("/listings/new");
    }
};


// Form to Edit a Listing
module.exports.renderEditForm = async (req, res) => {
    const { id } = req.params;
    const listing = await Listing.findById(id);
    if (!listing) {
        req.flash("error", "Listing you requested for does not exist!");
        return res.redirect("/listings");
    }

    let originalImageUrl = listing.image.url;
    originalImageUrl = originalImageUrl.replace("/upload","/upload/h_300,w_250");
    res.render("listings/edit.ejs", { listing,originalImageUrl });
};

// Update an Existing Listing
module.exports.updateListing = async (req, res, next) => {
    try {
        const { id } = req.params;

        // Check if valid data is sent for the listing
        if (!req.body.listing) {
            throw new ExpressError(400, "Valid listing data is required!");
        }

        await Listing.findByIdAndUpdate(id, { ...req.body.listing });
        req.flash("success", "Listing Updated!");
        res.redirect(`/listings/${id}`);
    } catch (error) {
        console.error(error);
        next(error);
    }
};

// Delete a Listing
module.exports.deleteListing = async (req, res, next) => {
    try {
        const { id } = req.params;
        const deletedListing = await Listing.findByIdAndDelete(id);

        if (!deletedListing) {
            req.flash("error", "Listing does not exist!");
            return res.redirect("/listings");
        }

        console.log(deletedListing);
        req.flash("success", "Listing deleted!");
        res.redirect("/listings");
    } catch (error) {
        console.error(error);
        next(error);
    }
};