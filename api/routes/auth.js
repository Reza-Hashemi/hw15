const express = require("express");
const router = express.Router();
const User = require("../models/user");

router.get("/signup", (req, res) => {
  res.render("signuppage", { msg: null });
});

router.get("/login", (req, res) => {
  res.render("loginpage", { msg: null });
});

router.get("/user/:username", (req, res) => {
  console.log(req.params.username)
  res.render("userpage");
});

router.post("/signup", (req, res) => {
  if (
    !req.body.firstName ||
    !req.body.lastName ||
    !req.body.username ||
    !req.body.password
  ) {
    // return res.status(406).json({msg: 'Not Acceptable'});
    return res.render("signuppage", { msg: "fill the inputs" });
  }

  if (req.body.password.length > 50 || req.body.password.length < 8) {
    // return res.status(406).json({msg: 'Not Acceptable'});
    return res.render("signuppage", { msg: "Enter complex password" });
  }

  User.findOne({ username: req.body.username.trim() }, (err, existUser) => {
    if (err) {
      // return res.status(500).json({msg: "Somthing went wrong"})
      return res.render("signuppage", { msg: "username is not acceptable" });
    }

    if (existUser) {
      // return res.status(406).json({msg: "username already token"})
      return res.render("signuppage", { msg: "username already token" });
    }

    const NEW_USER = new User({
      username: req.body.username,
      lastName: req.body.lastName,
      firstName: req.body.firstName,
      password: req.body.password,
    });

    NEW_USER.save((err, user) => {
      if (err) {
        // return res.status(500).json({msg: "Somthing went wrong"})
        return res.render("signuppage", { msg: "Somthing went wrong" });
      }

      res.redirect("login");
    });
  });
});

router.post("/login", (req, res) => {
  console.log(req.body)
  console.log(req.body.usernameinput)
  console.log(req.body.passwordinput)

  if (req.body.usernameinput.length === 0 || req.body.passwordinput.length === 0) {
    return res.render("loginpage", { msg: "enter username or password" });
  }
  
  User.findOne(
    { username: req.body.usernameinput , password: req.body.passwordinput },
    (err, result) => {
      if (err) {
        return res.render("loginpage", {
          msg: "username or password is incoorect"
        });
      }
      if (result) {
        let url = "/auth/user/"+`${result.username}`
        res.redirect(url);
      }
    }
  );
});

module.exports = router;
