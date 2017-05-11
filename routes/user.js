var express = require('express');
var bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken');
var router = express.Router();

var User = require('../models/user');

router.post('/', function (req, res, next) {
    var user = new User({
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        email: req.body.email,
    	password: bcrypt.hashSync(req.body.password,10),
    });

    user.save(function(err, result){
    	if(err){
    		return res.status(500).json({
    			title: 'An error occured',
    			error: err
    		});
    	}
    	res.status(201).json({
    		message: 'Signup Successful',
    		obj: result
    	})
    });
});

router.post('/signin', function (req, res, next) {
    User.findOne({email: req.body.email},function(err, result){
        if(err){
            return res.status(500).json({
                title: 'An error occured',
                error: err
            });
        }

        if (!result) {
            return res.status(500).json({
                title: 'User not Found!',
                error: {message: 'User does not exist!'}
            });
        }

        if(!bcrypt.compareSync(req.body.password, result.password)){
            return res.status(500).json({
                title: 'Incorrect password!',
                error: {message: 'User password Incorrect!'}
            });
        }
        var token = jwt.sign({user: result}, 'secret', {expiresIn: 7200});
        res.status(201).json({
            message: 'Signin Successful',
            token: token,
            userId: result._id
        });
    });
});

module.exports = router;
