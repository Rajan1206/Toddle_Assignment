const mongoose = require('mongoose');

const surveySchema = mongoose.Schema({
	surveyName: String,
    givenByCount: Number,
	Question_list: [String],
	PeopleSaidTrue : [Number]
});

module.exports = mongoose.model("Survey", surveySchema);