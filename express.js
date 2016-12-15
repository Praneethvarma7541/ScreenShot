var MongoClient = require('mongodb').MongoClient , assert = require('assert');

var url = 'mongodb://localhost:27017/mongo';

var maindb;
MongoClient.connect(url, function(err, db){
    assert.equal(null, err);
    console.log("Connected successfully to server");
    maindb = db;
});

var upsertDb = function(db, idx, body, callback){
    var collection = db.collection('screenshots');
    collection.updateOne({index: idx}, {index: idx, data:body}, {upsert:true, w:1}).then(function(result){
        assert.equal(1, result.result.n);
    });
}

// var findDocuments = function(db, callback){
//     var collection = db.collection('screenshots');
//     collection.find({}).toArray(function(err, docs){
//         assert.equal(err, null);
//         console.log("Found the following records");
//         console.log(docs)
//         callback(docs);
//     });
// }

var findURL = function(db, idx, callback){
    var collection = db.collection('screenshots');
    collection.find({index:idx}).toArray(function(err, docs){
        assert.equal(err, null);
        console.log("Found the following records");
        console.log(docs)
        callback(docs);
    });
}

var request = require('request');
var express = require('express');
var bodyParser = require('body-parser')

var server = express();
server.use(express.static(__dirname));
server.use(bodyParser.urlencoded({
    extended: true
}));
server.use(bodyParser.json());
server.post('/archiveSubmit', function(req, res){
    var url = req.body.url;
    var options = {
        url: url,
        method: 'GET'
    }
    var success = false;

    var text = request(options, function(error, response, body){
        if(!error && response.statusCode == 200){
            res.send('Your url was successfully saved');
            upsertDb(maindb, url, body, function(result){});
           // findDocuments(maindb, function(docs){})
        }
        else{
            res.send('Failed to save your url <br/>' + error)
        }
    })
})

server.post('/search', function(req, res){
    var url = req.body.q;

    var collection = maindb.collection('screenshots');
    collection.findOne({index:url}).then(function(item) {
        res.send(item.data);
    }); 
})
console.log("Started")
server.listen(3000);