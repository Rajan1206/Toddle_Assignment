const express = require('express');
const dotEnv = require('dotenv');
const mongoose = require('mongoose');
const userRoutes = require('./routes/userRoutes');
    
dotEnv.config();
const app = express();

app.use('/api/user', userRoutes);

app.get('/', (req, res) => {
    res.send("Welcome to node server");
})

const port = process.env.PORT || 3000;

mongoose
	.connect(
		
		'mongodb+srv://rajan:rajan@cluster0.uxxvi.gcp.mongodb.net/test?retryWrites=true&w=majority',
		{ useNewUrlParser: true, useUnifiedTopology: true },
	)
	.then(() => {
		console.log('Connected to Database');
	})
	.catch(() => {
		console.log('Connection failed');
	});
    

app.listen(port, () => {
    console.log(`Server is listening on port ${port}`);
 });