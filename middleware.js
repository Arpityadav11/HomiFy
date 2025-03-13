// const Listing = require("./models/listing");
// const Review = require("./models/review");
// const ExpressError = require("./utils/expressError");
// const {listingSchema,reviewSchema} = require("./schema");
// const review = require("./models/review");

// module.exports.isLoggedIn = (req,res,next)=>{
//     if(!req.isAuthenticated()){
//         req.session.redirectUrl = req.originalUrl;
//         req.flash("error","you must be logged in ");
//         return res.redirect("/login");
//     }
//     next();
// };

// module.exports.saveRedirectUrl = (req,res,next)=>{
//     if(req.session.redirectUrl){
//         res.locals.redirectUrl = req.session.redirectUrl;
//         delete req.session.redirectUrl;
//     }
//     next();
// };


// module.exports.isOwner = async(req,res,next)=>{
//     let {id} = req.params;
//     let listing = await Listing.findById(id);
//     if(!listing.owner._id.equals(res.locals.currUser?._id)){
//         req.flash("error","you are not the owner of this listing");
//         return res.redirect(`/listings/${id}`);
//         }

//         next();
// };

// module.exports.isAuthor = async(req,res,next)=>{
//     let {id,reviewId} = req.params;
//     let review = await Review.findById(reviewId);
//     if(!review.author._id.equals(res.locals.currUser?._id)){
//         req.flash("error","you are not the author of this listing");
//         return res.redirect(`/listings/${id}`);
//         }
//         next();
// };

// module.exports.validateListing = (req,res,next)=>{
//     let {error} = listingSchema.validate(req.body);
//     if(error){
//         let msg = error.details.map(el => el.message).join(",");
//         throw new ExpressError(400,msg);
//     }else{
//         next();
//     }
// };

// module.exports.validateReview = (req,res,next)=>{
//     let {error} = reviewSchema.validate(req.body);
//     if(error){
//         let msg = error.details.map(el => el.message).join(",");
//         throw new ExpressError(400,msg);
//     }else{
//         next();
//     }
// };

const Listing = require("./models/listing");
const Review = require("./models/review");
const ExpressError = require("./utils/expressError");
const { listingSchema, reviewSchema } = require("./schema");

// ✅ Middleware to check if user is logged in
module.exports.isLoggedIn = (req, res, next) => {
    if (!req.isAuthenticated()) {
        req.session.redirectUrl = req.originalUrl;
        req.flash("error", "You must be logged in to do that!");
        return res.redirect("/login");
    }
    next();
};

// ✅ Middleware to save redirect URL after login
module.exports.saveRedirectUrl = (req, res, next) => {
    if (req.session.redirectUrl) {
        res.locals.redirectUrl = req.session.redirectUrl;
        delete req.session.redirectUrl;  // ✅ Clear it after one-time use
    }
    next();
};

// ✅ Middleware to check if user is the owner of the listing
module.exports.isOwner = async (req, res, next) => {
    const { id } = req.params;
    const listing = await Listing.findById(id);

    if (!listing) {
        req.flash("error", "Listing not found!");
        return res.redirect("/listings");
    }

    // ✅ Prevent crash if currUser is undefined
    if (!res.locals.currUser || !listing.owner._id.equals(res.locals.currUser._id)) {
        req.flash("error", "You do not have permission to edit this listing!");
        return res.redirect(`/listings/${id}`);
    }

    next();
};

// ✅ Middleware to check if user is the author of the review
module.exports.isAuthor = async (req, res, next) => {
    const { id, reviewId } = req.params;
    const review = await Review.findById(reviewId);

    if (!review) {
        req.flash("error", "Review not found!");
        return res.redirect(`/listings/${id}`);
    }

    // ✅ Prevent crash if currUser is undefined
    if (!res.locals.currUser || !review.author._id.equals(res.locals.currUser._id)) {
        req.flash("error", "You do not have permission to delete this review!");
        return res.redirect(`/listings/${id}`);
    }

    next();
};

// ✅ Middleware to validate listing input
module.exports.validateListing = (req, res, next) => {
    const { error } = listingSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(",");
        throw new ExpressError(400, msg);
    } else {
        next();
    }
};

// ✅ Middleware to validate review input
module.exports.validateReview = (req, res, next) => {
    const { error } = reviewSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(",");
        throw new ExpressError(400, msg);
    } else {
        next();
    }
};
