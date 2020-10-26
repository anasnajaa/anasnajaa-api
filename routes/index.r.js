const express = require('express');
const router = express.Router();

require('./aws.r').init(router);
require('./sms.r').init(router);
require('./other.r').init(router);
require('./serviceRequest.r').init(router);

module.exports = router;