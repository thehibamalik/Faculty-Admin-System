const express = require('express');
const router = express.Router();
var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://localhost:27017/facultyDB";

router.post("/", function(req, res){

    var element = {
        phone: req.body.phone,
        directions: req.body.directions,
        email: req.body.email,
        lat: parseFloat(req.body.lat),
        long: parseFloat(req.body.long),
    };

    MongoClient.connect(url, {useNewUrlParser: true, useUnifiedTopology: true}, function(err, db) {
        if (err) throw err;
        var dbo = db.db("facultyDB");

        dbo.collection("contactInfo").deleteMany({}, function(err1, result) {
            if (err1) throw err1;

            dbo.collection("contactInfo").insertOne(element, function(err2,result){
                if(err2) throw err2;
                console.log("The new document was inserted.");
                db.close();
            });
        });
    });

    res.status(200).redirect("/admin/contact-admin.html");
});

router.get("/", function(req, res){
    MongoClient.connect(url, {useNewUrlParser: true, useUnifiedTopology: true}, function(err, db) {
        if (err) throw err;
        var dbo = db.db("facultyDB");
        dbo.collection("contactInfo").findOne({}, function(err, result) {
            if (err) throw err;
            res.send(result);
            db.close();
        });
    });
});

module.exports = router