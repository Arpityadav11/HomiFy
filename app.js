if(process.env.NODE_ENV !== "production"){
    require('dotenv').config();
}

const express = require("express");
const mongoose = require("mongoose");
const methodOverride = require('method-override');
const app = express();
const path = require("path");
const ejsMate = require("ejs-mate");
const ExpressError = require("./utils/expressError");
const session = require("express-session");
const MongoStore = require('connect-mongo');
const flash = require("express-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/User");

const listingRouter = require("./route/listings.js");
const reviewRouter = require("./route/review.js");
const userRouter = require("./route/user.js");
const { error } = require('console');

const DB_URL = process.env.ATLASDB_URL;

async function main() {
    await mongoose.connect(DB_URL);
    console.log("Connected to DB");
}
main().catch(err => console.log(err));

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.engine('ejs', ejsMate);

app.use(express.static(path.join(__dirname, "public")));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(methodOverride('_method'));

const store= MongoStore.create({
    mongoUrl:DB_URL,
    crypto: {
        secret: process.env.SECRET
      },
    touchAfter: 24*60*60,
});

store.on("error",()=>{
    console.log("error in our MONGO SESSION STORE",err);
});

const sessionOptions = {
    store,
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: {
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
        maxAge: 1000 * 60 * 60 * 24 * 7,
        httpOnly: true
    }
}

app.use(session(sessionOptions));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    res.locals.currUser = req.user;
    next();
})

// Use Routers
app.use("/listings", listingRouter);
app.use("/listings/:id/reviews", reviewRouter);
app.use("/", userRouter);

// 404 Route
app.use("*", (req, res, next) => {
    next(new ExpressError(404, "Page not found"));
})

// Error Handling Middleware
app.use((err, req, res, next) => {
    let { statusCode = 500, message = "Something went wrong!" } = err;
    res.status(statusCode).render("errors.ejs", { err });
});

const PORT = process.env.PORT || 8080;

const server = app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`);
});
server.timeout = 120000;
