const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const session = require('express-session');
const MongoClient = require("mongodb").MongoClient;
const url = "mongodb://localhost:27017/facultyDB";

//Include routes
const bioRoutes = require("./routes/bio");
const newsRoutes = require("./routes/news");
const pubRoutes = require("./routes/pub");
const contactRoutes = require("./routes/contact");
const groupRoutes = require("./routes/group");
const teachingRoutes = require("./routes/teachings");
const pressRoutes = require("./routes/press");
const researchRoutes = require("./routes/research");

//Loading middlewares
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());


//Allowing headers
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", '*');
    res.header("Access-Control-Allow-Credentials", true);
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
    res.header("Access-Control-Allow-Headers", 'Origin,X-Requested-With,Content-Type,Accept,content-type,application/json');
    next();
});

//Declaring the views as static, for redirections
app.use("/resources",express.static(__dirname+"/views/resources"));
app.use("/",express.static(__dirname+"/views/client"));

//Loading route
app.use("/bio", bioRoutes);
app.use("/news", newsRoutes);
app.use("/pub", pubRoutes);
app.use("/contact", contactRoutes);
app.use("/group", groupRoutes);
app.use("/teachings", teachingRoutes);
app.use("/press", pressRoutes);
app.use("/research", researchRoutes);

//Root redirects to the index
app.get('/', function(req,res) {
    res.redirect("/index.html");
});

//Declaring a session middleware
app.use(session({secret: "superSecret123!",  resave: true, saveUninitialized: true}));

//Define the logic for the login
app.post("/login", function(req, res){
    MongoClient.connect(url, {useNewUrlParser: true, useUnifiedTopology: true}, function(err, db) {
        if (err) throw err;
        var dbo = db.db("facultyDB");

        dbo.collection("userInfo").findOne({}, function(err1, result) {
            if (err1) throw err1;
            db.close();

            if (result.user === req.body.username && result.password === req.body.password){
                //Create session
                req.session.allowed = 1;
                res.redirect("/admin/index.html");
            }else{
                //Login failed, try again
                res.redirect("/admin-login.html");
            }
        });
    });
});

//Redirect the user to the login screen if there's no session
app.use("/admin",function(req,res,next){
    if(!req.session.allowed){
        res.redirect("/admin-login.html");
    }else{
        next();
    }
},express.static(__dirname+"/views/admin",{redirect:false}));

//Starting the server
app.listen(8080, "localhost", () => {
    console.log(`Listening at http://localhost:8080`);
});