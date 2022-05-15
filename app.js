require('dotenv').config();
const express = require("express");
const bodyParser = require('body-parser');
const ejs = require("ejs");
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const saltRounds = 10;

const app = express();

app.use(express.static("public"));
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: true}));

mongoose.connect('mongodb://localhost:27017/userDB');
const userSchema = new mongoose.Schema({
  email:String,
  password:String
});



const User = new mongoose.model("User", userSchema);

app.get("/",(req,res)=>{
  res.render("home");
});
app.get("/login",(req,res)=>{
  res.render("login");
});
app.get("/register",(req,res)=>{
  res.render("register");
});

app.post("/register",function(req,res){

bcrypt.hash(req.body.password, saltRounds, function(err, hash) {
  const newUser = new User({
    email: req.body.username,
    password: hash
});
User.findOne({email:req.body.username},function(err,foundUser){
  if(err){
    console.log(err)
  } else {
    if(!foundUser) {
      newUser.save(function(err){
        if(err){
          console.log(err);
        } else {
          res.render("secrets");
        }
      });
    } else {
      res.send("This E-mail is already registered.")
    }
  }
})

})
});
app.post("/login", function(req,res){
  const username = req.body.username;
  const password = req.body.password;
  User.findOne({email:username}, function(err, foundUser){
    if(err){
      console.log(err);
    } else {
      if(foundUser){
        bcrypt.compare(password, foundUser.password, function(err, result) {

          if(result === true){
            res.render("secrets");
          } else {
            res.send("Please check your password");
          }
        });

      } else {
        res.send("The user is not exist.");
      }
    }
  })
})
app.listen(3000,()=>{
  console.log("listen to port 3000");
});
