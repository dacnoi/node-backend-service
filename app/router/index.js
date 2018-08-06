var express = require('express');
var router = express.Router();
var https = require('https');
var request = require('request');

process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

var opntions = {
    host : '10.14.166.4',
    port : 8082,
    path : '/patient-registry/STU3/Patient',
    method : 'GET'
}

// nodejs client call rest api use request
router.get('/infor/:token', (req, res) => {
    console.log(req.params.token);
    var username = "admin";
    var password = "admin";
    var auth = "Basic " + new Buffer(username + ":" + password).toString("base64");
    console.log(auth);
    var opntionPOST = {
        url : 'https://10.14.166.4:9444/oauth2/introspect',
        headers : {
            'Content-Type' : 'application/x-www-form-urlencoded',
            'Authorization': auth
        },
        form : {
            'token' : req.params.token
        }   
    };

    request.post( opntionPOST, function(err, resPost, body){
        if(err){
            console.log(err);
        }else{
            if(res.statusCode == 200){
                var object = JSON.parse(body);
                console.log(object)
                if(object.active === true){
                    
                    // Call Rest api 
                    var opntionGET = {
                        url : 'http://10.14.166.4:8082/patient-registry/STU3/Patient/5b56dc62365203685ff7e289',
                        headers : {
                            'Content-Type' : 'application/json'
                        }   
                    };
                    request.get(opntionGET, function(err, resGET, body){
                        if(err){
                            console.log(err);
                        }else{
                            console.log("true");
                            let result = {
                                "active" : true,
                                "data": JSON.parse(body)
                            };
                            res.send(result);
                        }
                    });
                }else if(object.active === false){
                    // token het han hoat dong
                    console.log("false");
                    let result = {
                        "active" : false,
                        "data": JSON.parse(body)
                    };
                    res.send(result);
                }
            }
        }
    });
    
    
});

// nodejs client call rest api use https
router.get('/data/:token', function(req, res){
    var username = "admin";
    var password = "admin";
    var authenticationHeader = "Basic " + new Buffer(username + ":" + password).toString("base64");
    
    var opntionPOST = {
        host : 'localhost',
        port : 9445,
        path : '/oauth2/introspect',
        method : 'POST',
        headers : {
            'Content-Type' : 'application/x-www-form-urlencoded',
            'Authorization' : authenticationHeader
        },
        form : {
            'token' : req.params.token
        }
    }
    
    var reqPOST = https.request(opntionPOST , function(res){
        var body = "";
        res.on('data', function(data) {
            body += data;
         });
         res.on('end', function() {
          //here we have the full response, html or json object
            console.log(body);
         })
         res.on('error', function(e) {
            onsole.log("Got error: " + e.message);
         });
    });
});

router.get('/patient-registry/STU3/Patient', (req, res ) => {
    opntions.path = opntions.path + '?_count='+ 200; 
    var result;
    http.request(opntions, function(res){
        res.setEncoding('utf8');
        res.on('data', function(data){
            result = data;
            
        });
    }).end();
    console.log(result);
    res.json(result);
});

module.exports = router;