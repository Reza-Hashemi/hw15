const express = require("express");
const router = express.Router();
const User = require("../models/user");
const url = require('url');
const mongoose = require('mongoose');


router.get("/signup", (req, res) => {
  res.render("signuppage", { msg: null });
});

router.get("/login", (req, res) => {
  res.render("loginpage", { msg: null });
});

router.get("/user", (req, res) => {
  let queryID = JSON.parse(req.query.a)
  let data = mongoose.Types.ObjectId(queryID);
  User.findOne({_id : data},(err, result) =>{
    if(err) {
     return res.render('loginpae',{msg : "somthing wrong"})
    }
    else {
     return res.render('userpage',{User : result} )
    }
  })
  
  
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
  

  if (
    req.body.usernameinput.length === 0 ||
    req.body.passwordinput.length === 0
  ) {
    return res.render("loginpage", { msg: "enter username or password" });
  }
  
  User.findOne(
    { username: req.body.usernameinput.trim(), password: req.body.passwordinput },
    (err, result) => {
      if (err) {
       console.log(err);
      }
      if (result) {
        res.redirect(url.format({pathname: '/user',query:{
          a:JSON.stringify(result._id) 
        }}))
      }
    }
  );
});

module.exports = router;
