var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://localhost:27017/facultyDB";

MongoClient.connect(url, function(err, db) {
    if (err) throw err;
    console.log("Database created.");

    var dbase = db.db("facultyDB");

    const collections = [
        "bioInfo",
        "userInfo",
        "groupInfo",
        "pressInfo",
        "pubInfo",
        "researchInfo",
        "teachingInfo",
        "newsInfo",
        "contactInfo"
    ];

    for(const name of collections){
        dbase.createCollection(name, function(err, res) {
            if (err) throw err;
            console.log("Collection "+name+" created.");
        });
    }

    //Insert dummy data
    dbase.collection("bioInfo").insertOne({
        name: "Julie Thorpe",
        biography: "I am an associate professor in the Faculty of Business and Information Technology (FBIT) at Ontario Tech University. I am a member of the Graduate Faculty for both FBIT and the Department of Computer Science. My research is in the area of human factors and computer security, with a focus on user authentication.",
        avatar: "avatar.jpg"
    }, function(err,res){
        if (err) throw err;
        console.log("Dummy data inserted in bioInfo");
    });

    dbase.collection("userInfo").insertOne({
        user: "admin",
        password: "admin"
    }, function(err,res){
        if (err) throw err;
        console.log("Dummy data inserted in userInfo");
    });

    dbase.collection("contactInfo").insertOne({
        phone: "(905) 7441-8668 ext: 6585",
        directions: "University of Ontario Institute of Technology (UOIT) Business and Information Technology 2000 Simcoe Street North Oshawa, Ontario, L1H 7K4",
        email: "test@test.uni.com",
        lat: 43.945671,
        long: -78.896293
    }, function(err,res){
        if (err) throw err;
        console.log("Dummy data inserted in contactInfo");
    });

    dbase.collection("groupInfo").insertMany([
        { name: "Samira Zibaei (PhD)", begin: 2019, end: 2020},
        { name: "Alireza Namanloo (MSc, co-supervised)", begin: 2019, end: 2020},
        { name: "Connor Cushing (MSc, co-supervised)", begin: 2019, end: 2020},
        { name: "Tony Wang (MSc, co-supervised)", begin: 2019, end: 2020},
        { name: "Zeinab Joudaki (PhD, co-supervised)", begin: 2018, end: 2019},
        { name: "Alaadin Addas (MSc)", begin: 2018, end: 2019},
        { name: "Brent MacRae (MSc, co-supervised)", begin: 2018, end: 2019},
        { name: "Christopher Bonk (MSc)", begin: 2018, end: 2019}
    ], function(err,res){
        if (err) throw err;
        console.log("Dummy data inserted in groupInfo");
    });
    
    db.close();
});