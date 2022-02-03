const express = require('express');
const router = express.Router();
const fs = require("fs");

const MongoClient = require('mongodb').MongoClient;
const {ObjectId} = require('mongodb');
const url = "mongodb://localhost:27017/facultyDB";

const multer = require("multer");

const Storage = multer.diskStorage({
    destination: function(req, file, callback) {
        callback(null, "./views/resources/img/research");
    },
    filename: function(req, file, callback) {
        callback(null, file.fieldname + "_" + Date.now() + "_" + file.originalname);
    }
});

const filter = function(req, file, cb){
    if (file.mimetype.startsWith("image")) {
        cb(null, true);
    } else {
        cb("Not an image! Please upload only images.", false);
    }
};

const upload = multer({
    storage: Storage,
    fileFilter: filter
});

router.post("/", upload.single("pictureUpload"), function(req, res){

    var element = { 
        title: req.body.name,
        description: req.body.description,
        image: "../resources/img/research/"+req.file.filename
    };

    MongoClient.connect(url, {useNewUrlParser: true, useUnifiedTopology: true}, function(err, db) {
        if (err) throw err;
        var dbo = db.db("facultyDB");
        dbo.collection("researchInfo").insertOne(element, function(err,result){
            if(err) throw err;
            console.log("The new document was inserted.");
            db.close();
        });
    });

    res.status(200).redirect("/admin/research-program-admin.html");
});

router.get("/", function(req, res){
    MongoClient.connect(url, {useNewUrlParser: true, useUnifiedTopology: true}, function(err, db) {
        if (err) throw err;
        var dbo = db.db("facultyDB");
        dbo.collection("researchInfo").find({}).toArray(function(err, result) {
            if (err) throw err;
            res.send(result);
            db.close();
        });
    });
});

router.put("/:id", upload.single("image"), function(req, res){
    
    var element = { $set: {
        title: req.body.title,
        description: req.body.description,
        image: "../resources/img/research/"+req.file.filename
    }};

    MongoClient.connect(url, {useNewUrlParser: true, useUnifiedTopology: true}, function(err, db) {
        if (err) throw err;
        var dbo = db.db("facultyDB");

        //get document data and delete the associated image
        dbo.collection("researchInfo").findOne({_id : ObjectId(req.params.id)}, function(err,result){
            if(err) throw err;

            fs.unlinkSync(result.image.replace("../","./views/"));

            dbo.collection("researchInfo").updateOne({_id : ObjectId(req.params.id)}, element, function(err,result){
                if(err) throw err;
                console.log("A document with id:"+req.params.id+" was updated.");
                db.close();
            });
        });
    });

    res.send("Update successfull");
});

router.delete("/:id", function(req, res){

    MongoClient.connect(url, {useNewUrlParser: true, useUnifiedTopology: true}, function(err, db) {
        if (err) throw err;
        var dbo = db.db("facultyDB");

        //get document data and delete the associated image
        dbo.collection("researchInfo").findOne({_id : ObjectId(req.params.id)}, function(err,result){
            if(err) throw err;

            fs.unlinkSync(result.image.replace("../","./views/"));

            dbo.collection("researchInfo").deleteOne({_id : ObjectId(req.params.id)}, function(err,result){
                if(err) throw err;
                console.log("A document with id:"+req.params.id+" was deleted.");
                db.close();
            });
        });
    });

    res.send("Delete successfull");
});

module.exports = router