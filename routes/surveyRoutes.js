const express = require('express');
const User = require('../models/user');
const Survey = require('../models/survey');
const bodyParser = require('body-parser')
const router = express.Router();
const jwt = require('jsonwebtoken')

const jsonParser = bodyParser.json();

router.use('/', verifyToken, (req, res, next) => {
    jwt.verify(req.token, 'secret_key', (err, authdata) => {
        if (err) {
            res.sendStatus(403)
        }
        next();
    })
});


router.post('/create', jsonParser, (req, res) => {
    //console.log(req.body);
    const sentenses = req.body.sentenses;
    //console.log(sentenses);

    const Question_list = [];
    const responses = [];

    sentenses.forEach(item => {
        Question_list.push(item);
        responses.push(0)
    });

    const survey = new Survey({
        surveyName: req.body.name,
        givenByCount: 0,
        Question_list: Question_list,
        PeopleSaidTrue: responses
    });

    //console.log(survey);
    survey.save().then(async (result) => {
        await User.findOneAndUpdate({
            _id: req.body.creator
        }, {
            $push: {
                surveys: result._id
            }
        }, {
            new: true,
            useFindAndModify: false
        });

        res.status(200).json({
            message: 'Survey Created Successfully.',
            created_Survey: result,
        });
    });
});

router.post('/fill/:id', jsonParser, (req, res) => {

    Survey.findById(req.params.id)
        .exec()
        .then(async (doc) => {
            //console.log(doc);

            var count = doc.givenByCount;
            count = count + 1;
            const responses = doc.PeopleSaidTrue;
            const newOne = req.body.answers;

            const updatedList = responses.map((num, idx) => {
                return num + newOne[idx];
            })
            console.log(updatedList);
            await Survey.findOneAndUpdate({
                _id: req.params.id}, 
                {
                  $set: {
                         PeopleSaidTrue: updatedList,
                         givenByCount: count
                      } 
                },
                {
                  new: true,
                  useFindAndModify: false
                }, 
            );

            res.status(200).json({
                message: "Response Added Successfully."
            });
        })
        .catch((err) => console.log(err));
});

router.get('/stats/:id', (req, res) => {

    Survey.findById(req.params.id)
        .exec()
        .then(doc => {
            //console.log(doc);

            res.status(200).json({
                survey: doc
            })
        })
        .catch(err => console.log(err));
});


function verifyToken(req, res, next) {
    
    const bearerHeader = req.headers['authorization'];
    
    if (typeof bearerHeader !== 'undefined') {
        
        const bearer = bearerHeader.split(' ');
        
        const bearerToken = bearer[1];
        
        req.token = bearerToken;
        
        next();
    } else {
        // Forbidden
        res.sendStatus(403);
        
    }
}

module.exports = router;