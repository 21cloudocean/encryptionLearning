const express = require("express");
const bodyParser = require('body-parser');
const ejs = require("ejs");
const mongoose = require('mongoose');
const encrypt = require("mongoose-encryption");

const app = express();

app.use(express.static("public"));
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: true}));

mongoose.connect('mongodb://localhost:27017/userDB');
const userSchema = new mongoose.Schema({
  email:String,
  password:String
});

const secret = "Thisisourlittlesecret."
userSchema.plugin(encrypt, {secret: secret, encryptedFields: ['password']});
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
const newUser = new User({
  email: req.body.username,
  password: req.body.password
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

app.post("/login", function(req,res){
  const username = req.body.username;
  const password = req.body.password;
  User.findOne({email:username}, function(err, foundUser){
    if(err){
      console.log(err);
    } else {
      if(foundUser){
        if(foundUser.password === password){
          res.render("secrets");
        } else {
          res.send("Please check your password");
        }
      } else {
        res.send("The user is not exist.");
      }
    }
  })
})
app.listen(3000,()=>{
  console.log("listen to port 3000");
});
