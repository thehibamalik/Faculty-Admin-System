const express = require("express");
const router = express.Router();
const path = require("path");

const MongoClient = require("mongodb").MongoClient;
const url = "mongodb://localhost:27017/facultyDB";

const multer = require("multer");

const Storage = multer.diskStorage({
    destination: function(req, file, callback) {
        callback(null, "./views/resources/img");
    },
    filename: function(req, file, callback) {
        callback(null, "avatar.jpg");
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
        name: req.body.fullname,
        biography: req.body.biography,
        avatar: path.join(__dirname,"/views/resources/img/avatar.jpg"),
    };

    MongoClient.connect(url, {useNewUrlParser: true, useUnifiedTopology: true}, function(err, db) {
        if (err) throw err;
        var dbo = db.db("facultyDB");

        dbo.collection("bioInfo").deleteMany({}, function(err1, result) {
            if (err1) throw err1;

            dbo.collection("bioInfo").insertOne(element, function(err2,result){
                if(err2) throw err2;

                console.log("The new document was inserted.");
                db.close();
            });
        });
    });

    res.status(200).redirect("/admin/index.html");
});

router.get("/", function(req, res){
    MongoClient.connect(url, {useNewUrlParser: true, useUnifiedTopology: true}, function(err, db) {
        if (err) throw err;
        var dbo = db.db("facultyDB");
        dbo.collection("bioInfo").findOne({}, function(err1, result) {
            if (err1) throw err1;
            res.send(result);
            db.close();
        });
    });
});

module.exports = router