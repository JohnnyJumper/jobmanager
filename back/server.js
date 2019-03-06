const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const express = require('express');
const graphqlHTTP = require('express-graphql');
const schema = require('./schema/graphql.schema');
const {mongoURI} = require('./config/keys');
const API_PORT = process.env.PORT || 6357;
const app = express();
const cors = require('cors');

const jobsAPI = require("./api/jobs.api");

mongoose.connect(
	mongoURI,
	{ useNewUrlParser: true }
);

const db = mongoose.connection;

db.once("open", () => console.log('connected to the database'));
db.on("error", console.log.bind(console, "MongoDB connection error"));

app.use(cors());


app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

// app.use('/api', jobsAPI);

app.use('/graphql', graphqlHTTP({
	schema,
	graphiql: true
}))

app.listen(API_PORT, () => console.log(`Listening on port ${API_PORT}`));