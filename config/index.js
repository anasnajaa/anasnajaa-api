const {merge} = require('lodash');
const sharedSettings = {
    saltingRounds: 10,
    mongoUri: process.env.ATLAS_URI_RW,
    postgressUri: process.env.DATABASE_URL,
    mailer: {
        user: process.env.EMAIL_USER,
        password: process.env.EMAIL_PASS,
        host: process.env.EMAIL_HOST,
        port: process.env.EMAIL_PORT
    },
    sms: {
        accountSid: process.env.TWILIO_ACC_SID,
        authToken: process.env.TWILIO_AUTH,
        fromNumber: process.env.TWILIO_FROM
    },
    jwtOption: { expiresIn: '1d', issuer: process.env.ISSUER },
    jwtSecret: process.env.JWT_SECRET,
    googleRecaptch: process.env.GOOGLE_RECAPTCHA_SECRET_KEY,
    sendGridApiKey: process.env.SENDGRID_API_KEY,
    publicUrl: process.env.PUBLIC_URL
};

const developmentSettings = {
    port: process.env.PORT || 5000,
    corsOptions: {
        origin: "*", 
        credentials: true
    },
    jwtCookieOptions: {
        expires: new Date(Date.now() + 604800000),
        secure: false,
        httpOnly: true,
    },
    jwtSecure: false,
    jwtCookieExpiry: new Date(Date.now() + 604800000),
    rootUrl: process.env.ROOT_URL+":"+process.env.PORT
};

const productionSettings = {
    port: process.env.PORT || 80,
    // only allow clients from these domains to access the API
    // enforced only in browser environment
    corsOptions: {
        origin: [process.env.CORS_URL],
        credentials: true
    },
    // Secure flag is required with https
    // Samesite must be set to None as well
    // Date set here is temporary until JWT refresh endpoint is created
    jwtCookieOptions: {
        expires: new Date(2147483647000),
        secure: true, 
        httpOnly: true,
        sameSite: 'None'
    },
    jwtSecure: true,
    jwtCookieExpiry: new Date(2147483647000),
    // Those settings are used mainly for third party API that need access to this API server
    rootUrl: process.env.ROOT_URL,
    publicUrl: process.env.PUBLIC_URL
};

module.exports = {
    development: merge(sharedSettings, developmentSettings),
    production: merge(sharedSettings, productionSettings)
};