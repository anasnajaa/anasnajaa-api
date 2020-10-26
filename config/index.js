module.exports = {
    development: {
        port: process.env.PORT || 5000,
        saltingRounds: 10,
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
        jwtOption: { expiresIn: '1d', issuer: process.env.ISSUER },
        jwtSecret: process.env.JWT_SECRET,
        mongoUri: process.env.ATLAS_URI_RW,
        sessionSecret: process.env.SESSION_SECRET,
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
        googleRecaptch: process.env.GOOGLE_RECAPTCHA_SECRET_KEY,
        sendGridApiKey: process.env.SENDGRID_API_KEY
    },
    production: {
        port: process.env.PORT || 80,
        saltingRounds: 10,
        corsOptions: {
            origin: ['https://anasnajaa.github.io'],
            credentials: true
        },
        jwtCookieOptions: {
            expires: new Date(2147483647000),
            secure: true,
            httpOnly: true,
            sameSite: 'None'
        },
        jwtSecure: true,
        jwtCookieExpiry: new Date(2147483647000),
        jwtOption: { expiresIn: '1d', issuer: process.env.ISSUER },
        jwtSecret: process.env.JWT_SECRET,
        mongoUri: process.env.ATLAS_URI_RW,
        sessionSecret: process.env.SESSION_SECRET,
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
        googleRecaptch: process.env.GOOGLE_RECAPTCHA_SECRET_KEY,
        sendGridApiKey: process.env.SENDGRID_API_KEY
    }
}