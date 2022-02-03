const express = require('express');
const router = express.Router();
var MongoClient = require('mongodb').MongoClient;
const {ObjectId} = require('mongodb');
var url = "mongodb://localhost:27017/facultyDB";

router.post("/", function(req, res){

    var element = {
        name: req.body.name,
        begin: req.body["begin-year"],
        end: req.body["end-year"]
    };

    MongoClient.connect(url, {useNewUrlParser: true, useUnifiedTopology: true}, function(err, db) {
        if (err) throw err;
        var dbo = db.db("facultyDB");
        dbo.collection("groupInfo").insertOne(element, function(err,result){
            if(err) throw err;
            console.log("The new document was inserted.");
            db.close();
        });
    });

    res.status(200).redirect("/admin/group-admin.html");
});

router.get("/", function(req, res){
    MongoClient.connect(url, {useNewUrlParser: true, useUnifiedTopology: true}, function(err, db) {
        if (err) throw err;
        var dbo = db.db("facultyDB");
        dbo.collection("groupInfo").find({}).toArray(function(err, result) {
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
        dbo.collection("groupInfo").updateOne({_id : ObjectId(req.params.id)}, element, function(err,result){
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
        dbo.collection("groupInfo").deleteOne({_id : ObjectId(req.params.id)}, function(err,result){
            if(err) throw err;
            console.log("A document with id:"+req.params.id+" was deleted.");
            db.close();
        });
    });

    res.send("Delete successfull");
});

module.exports = router