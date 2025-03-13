const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const passport = require("passport");
const { saveRedirectUrl } = require("../middleware.js");

const userController = require("../controller/user.js");

router.route("/signup")
.get((req, res) => {
    res.render("users/signup.ejs");
})
.post(wrapAsync(userController.signUp));


router.get("/login",userController.loginForm);

router.post("/login", 
    saveRedirectUrl ,
    passport.authenticate('local', { 
        failureRedirect: '/login',
        failureFlash: true 
    }), (req, res) => {
        req.flash("success", "Welcome back!");
        res.redirect(req.session.returnTo || '/listings');
    }
);

router.get("/logout", userController.logout);

module.exports = router;
