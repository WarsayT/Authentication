//jshint esversion:6
const express = require('express');
const ejs = require('ejs');
const bodyParser = require('body-parser');
const encrypt = require('mongoose-encryption');

const app =express();

app.use(express.static("public"));
app.set('view engine', 'ejs')
app.use(bodyParser.urlencoded({extended: true}));


//connect to mongoDB
const mongoose = require('mongoose');

main().catch(err => console.log(err));

async function main() {
  await mongoose.connect('mongodb://localhost:27017/userDB');
}

//Users schema and model
const userSchema = new mongoose.Schema({
  email: String,
  password: String
});

// a secret sctring to encrypt our data
const secret = "Thisisourlittlesecret";
userSchema.plugin(encrypt, { secret: secret, encryptedFields: ["password"] });

// mongoose model for our users
const User = new mongoose.model("User", userSchema);


//render the web app
app.get("/", function(req, res) {
  res.render("home");
});

app.get("/login", function(req, res) {
  res.render("login");
});

app.get("/register", function(req, res) {
  res.render("register");
});












//get data from login and register
app.post("/register", function(req, res){

  const newUser = new User({
    email: req.body.username,
    password: req.body.password
  });

  newUser.save(function(err){
    if(!err){
      res.render("secrets");
    } else {
      console.log(err);
    }
  });

});

app.post("/login", function(req, res){
  const username = req.body.username;
  const password = req.body.password;

  User.findOne({email: username}, function(err, foundUser){
    if (!err) {
      if (foundUser) {
        if (foundUser.password === password) {
          res.render("secrets");
        } else {
          console.log("incorrect password");
        }
      } else {
        console.log("User not found");
      }
    } else {
      console.log(err);
    }
  });
});



app.listen(3000, function(req, res){
  console.log("The server is listening on port 3000");
});
