const passport = require("passport");
const express = require("express");

const router = express.Router();

router.get("/login/success", isLoggedIn, async (req, res) => {
    if(req.user) {
        res.send(req.user)
    } else {
        res.status(403).send({ msg: 'Autentication failed'});
    }
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
        successRedirect: "http://localhost:3000/profile",
        failureRedirect: "http://localhost:3000",
    })
);

router.get("/logout", (req, res) => {
    req.logout(function (err) {
        if (err) {
        return next(err);
        }
        res.redirect("http://localhost:3000");
    });
});

function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }

    res.status(403).send({ msg: 'error' });
}

module.exports = router;
