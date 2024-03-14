// ----------------------- SERVICES IMPORTS ----------------------- //

const {
    isYearOk,
    isModelOk,
    isClaimOk,
    isCarValueOk,
    isRiskRatingOk,
    isReputeOk,
    isMultiReputesOk,
} = require('./errorHandlers.js');

// ---------------------------------------------------------------- //
// ------------------------ GET CAR VALUE ------------------------- //
// ---------------------------------------------------------------- //

// -------------------- GET CAR VALUE HELPERS --------------------- //

const getCharacterNumber = input => {
    // Check for non letters characters
    const regex = /[^a-zA-Z]/;
    if (regex.test(input)) return 0;

    // Shift of the Charcode return => just because a.charCodeAt(0) == 97, and we want 1
    const charCodeInxedShift = 96;
    return input.toLowerCase().charCodeAt(0) - charCodeInxedShift;
};

// ----------------------- GET CAR VALUE () ----------------------- //

const getCarValue = inputObj => {
    /*   
        getCarValue Bussiness formula:
        Sum of characters indexes ( a = 1 ... z = 26) multiplied by 100 plus the car year
        carValue = (indexesSum * 100 ) + year     
    */

    const {car_model, car_year} = inputObj;

    // ERROR HANDLING
    if (isYearOk(car_year).error) return isYearOk(car_year);
    if (isModelOk(car_model).error) return isModelOk(car_model);

    // Get sum of characters index
    const modelCharsSum = car_model
        .split('')
        .map(letter => getCharacterNumber(letter))
        .reduce((acc, currVal) => {
            return acc + currVal;
        }, 0);

    const suggestedValue = modelCharsSum * 100 + car_year;

    return {car_value: suggestedValue};
};

// ---------------------------------------------------------------- //
// ----------------------- GET RISK RATING ------------------------ //
// ---------------------------------------------------------------- //

const getRiskRating = inputObj => {
    /* 
        getRiskRating Bussiness formula:
        Count how many of the rating words are on the claim. Adds 1 for each occurence. (min = 1 ; max = 5)
        Returns {risk_rating: number}
    */

    const {claim_history: claimStr} = inputObj;

    // ERROR HANDLING
    if (isClaimOk(claimStr).error) return isClaimOk(claimStr);

    // MINIMUM RISK RATING FOR EMPTY CLAIMS
    if (claimStr === '') return {risk_rating: 1};

    const ratingWordsArr = [
        'collide',
        'collided',
        'collisions',
        'collision',
        'crashed',
        'crash',
        'crashes',
        'scratch',
        'scratches',
        'bump',
        'bumps',
        'smash',
    ];

    // Clean and Split string to arr
    const claimArr = claimStr.replaceAll('.', '').split(' ');

    let riskRatingCount = 0;

    // Count Ocurrences
    for (const word of claimArr) {
        if (ratingWordsArr.includes(word)) riskRatingCount++;
    }

    // Round Rating
    if (riskRatingCount < 1) riskRatingCount = 1;
    if (riskRatingCount > 5) riskRatingCount = 5;

    return {risk_rating: riskRatingCount};
};

// ---------------------------------------------------------------- //
// --------------------- GET INSURANCE QUOTE ---------------------- //
// ---------------------------------------------------------------- //

const getInsuranceQuote = insuranceInput => {
    /* 
        getInsuranceQuote Bussiness formule:
        Car Value multiplied by driver Rating divided by 100
    */

    const {car_value, risk_rating} = insuranceInput;

    // ERROR HANDLING
    if (isCarValueOk(car_value).error) return isCarValueOk(car_value);
    if (isRiskRatingOk(risk_rating).error) return isRiskRatingOk(risk_rating);

    const quote = Math.floor((car_value * risk_rating) / 100);
    const monthly_quote = +(quote / 12).toFixed(1);

    return {monthly_premium: monthly_quote, yearly_premium: quote};
};

// ---------------------------------------------------------------- //
// ------------------ GET INSURANCE REPUTE  MVP ------------------- //
// ---------------------------------------------------------------- //

const getInsuranceRepute = driverAndCarInput => {
    const {driver_name, car_model, car_year, claim_history} = driverAndCarInput;

    // Get values to deconstruct
    const carValue = getCarValue({car_model: car_model, car_year: car_year});
    const riskRating = getRiskRating({claim_history: claim_history});

    // Ternary deconstruction (Cleaner then if loop)
    const {car_value} = 'car_value' in carValue ? carValue : {car_value: -1};
    const {risk_rating} = 'risk_rating' in riskRating ? riskRating : {risk_rating: -1};

    // Get values to deconstruct
    const quote = getInsuranceQuote({car_value, risk_rating});

    // Ternary deconstruction (Cleaner then if loop)
    const {monthly_premium} = 'monthly_premium' in quote ? quote : {monthly_premium: -1};
    const {yearly_premium} = 'yearly_premium' in quote ? quote : {yearly_premium: -1};

    const insuranceRepute = {
        driverName: driver_name,
        carModel: car_model,
        carYear: car_year,
        riskRating: risk_rating,
        carValue: car_value,
        monthlyPremium: monthly_premium,
        yearlyPremium: yearly_premium,
    };

    // ERROR HANDLING
    if (isReputeOk(insuranceRepute).error) return isReputeOk(insuranceRepute);

    return insuranceRepute;
};

// ---------------------------------------------------------------- //
// --------------- GET MULTIPLE INSURANCES REPUTES ---------------- //
// ---------------------------------------------------------------- //

// I am sorry this is a bit verbose.. It is my fisrt attempt of generics.
const getMultipleInsuranceReputes = entries => {
    //
    // ERROR HANDLING
    if (isMultiReputesOk(entries).error) return isMultiReputesOk(entries);

    // For clarity note ::. Read entries as the inputes from drivers and reputes as the final output from the API
    const reputesArr = entries.entriesArr.map(entry => getInsuranceRepute(entry));
    const APIresponse = {data: [...reputesArr]};

    return APIresponse;
};

module.exports = {
    getCarValue,
    getRiskRating,
    getInsuranceQuote,
    getInsuranceRepute,
    getMultipleInsuranceReputes,
};
