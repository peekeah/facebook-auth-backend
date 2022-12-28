const passport = require("passport");
const express = require("express");

const router = express.Router();

router.get("/", async (req, res) => {
    res.render("pages/index.ejs");
});

router.get("/profile", isLoggedIn, async (req, res) => {
    res.render("pages/profile.ejs", {
        user: req.user,
    });
});

router.get("/error", isLoggedIn, async (req, res) => {
    res.render("pages/error.ejs");
});

router.get("/auth/facebook",
    passport.authenticate("facebook", {
        scope: ["public_profile", "email"],
    })
);

router.get("/auth/facebook/callback",
    passport.authenticate("facebook", {
        successRedirect: "/profile",
        failureRedirect: "/error",
    })
);

router.get("/logout", (req, res) => {
    req.logout(function (err) {
        if (err) {
        return next(err);
        }
        res.redirect("/");
    });
});

function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }

    res.redirect("/");
}

module.exports = router;
