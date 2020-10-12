const express = require('express');
const User = require('../models/user');
const Survey = require('../models/survey');
const bodyParser = require('body-parser')
const router = express.Router();
const jwt = require('jsonwebtoken')
const surveyRoutes = require('../routes/surveyRoutes');

const jsonParser = bodyParser.json();

router.use("/survey", surveyRoutes);

router.get("/", (req, res, next) => {
    
    User.find().then(doc => {
            res.status(200).json({
                message: "Users fetched successfully",
                user: doc
            });
        })
        .catch(err => console.log(err));
});

router.get('/:id', (req, res, next) => {
	User.findById(req.params.id)
		.exec()
		.then((doc) => {
			res.status(200).json({
				message: 'User fetched successfully',
				product: doc,
			});
		})
		.catch((err) => console.log(err));
});

router.post('/', jsonParser, (req, res) => {
    
    console.log(req.body);
    const user = new User({
        userName: req.body.name,
        userEmail: req.body.email,
        userPassword: req.body.password
    });

    user.save().then(async (result) => {
        await jwt.sign({ id : result._id }, 'secret_key', (err, token) => {
            res.status(200).json({
                token
            });
        });
    });
});


module.exports = router;