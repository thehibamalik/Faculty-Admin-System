const express = require('express');
const router = express.Router();
var MongoClient = require('mongodb').MongoClient;
const {ObjectId} = require('mongodb');
var url = "mongodb://localhost:27017/facultyDB";

router.post("/", function(req, res){

    var element = {
        title: req.body.name,
        URL: req.body["pub-url"],
        type: req.body["pub-type"]
    };

    console.log(req.body);
    console.log(element);

    MongoClient.connect(url, {useNewUrlParser: true, useUnifiedTopology: true}, function(err, db) {
        if (err) throw err;
        var dbo = db.db("facultyDB");
        dbo.collection("pubInfo").insertOne(element, function(err,result){
            if(err) throw err;
            console.log("The new document was inserted.");
            db.close();
        });
    });

    res.status(200).redirect("/admin/pub-admin.html");
});

router.get("/", function(req, res){
    MongoClient.connect(url, {useNewUrlParser: true, useUnifiedTopology: true}, function(err, db) {
        if (err) throw err;
        var dbo = db.db("facultyDB");
        dbo.collection("pubInfo").find({}).toArray(function(err, result) {
            if (err) throw err;
            res.send(result);
            db.close();
        });
    });
});

router.put("/:id", function(req, res){

    var element = { $set: req.body};

    MongoClient.connect(url, {useNewUrlParser: true, useUnifiedTopology: true}, function(err, db) {
        if (err) throw err;
        var dbo = db.db("facultyDB");
        dbo.collection("pubInfo").updateOne({_id : ObjectId(req.params.id)}, element, function(err,result){
            if(err) throw err;
            console.log("A document with id:"+req.params.id+" was updated.");
            db.close();
        });
    });

    res.send("Update successfull");
});

router.delete("/:id", function(req, res){

    MongoClient.connect(url, {useNewUrlParser: true, useUnifiedTopology: true}, function(err, db) {
        if (err) throw err;
        var dbo = db.db("facultyDB");
        dbo.collection("pubInfo").deleteOne({_id : ObjectId(req.params.id)}, function(err,result){
            if(err) throw err;
            console.log("A document with id:"+req.params.id+" was deleted.");
            db.close();
        });
    });

    res.send("Delete successfull");
});

module.exports = router