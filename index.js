// ----------------------- REFERENCE LINKS ------------------------ //

/* 
    https://cloud.google.com/functions/docs/console-quickstart
    https://www.youtube.com/watch?v=5ScNKhR_gWY
    https://www.youtube.com/watch?v=I0vJDmw6P4c
    https://github.com/google-github-actions/deploy-cloud-functions/tree/main
    https://github.com/google-github-actions/auth

*/

// --------------------- CONTROLLERS IMPORTS ---------------------- //

const {
    getCarValue,
    getRiskRating,
    getInsuranceQuote,
    getInsuranceRepute,
    getMultipleInsuranceReputes,
} = require('./src/controllers/controllers.js');

// -------------------- SERVER AND MIDDLEWARE --------------------- //

const app = require('express')();
const cors = require('cors');
app.use(cors());

// ------------------------- ROUTES SETUP ------------------------- //

app.get('/', (_, res) => res.send(`Serber is up and runnming`));
app.post('/get-car-value', (req, res) => res.send(getCarValue(req.body)));
app.post('/get-risk-rating', (req, res) => res.send(getRiskRating(req.body)));
app.post('/get-insurance-quote', (req, res) => res.send(getInsuranceQuote(req.body)));
app.post('/get-insurance-repute', (req, res) => res.send(getInsuranceRepute(req.body)));

app.post('/get-multiple-insurance-reputes', (req, res) => res.send(getMultipleInsuranceReputes(req.body)));

exports.turnersAPI = app;
