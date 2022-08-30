const express = require("express");

const smsController = require("../controllers/sms.c");
const booksController = require("../controllers/books.c");
const linksController = require("../controllers/links.c");

const router = express.Router();

// Customer Service
router.post(
  "/request/service/send-verification-code",
  require("../controllers/customer_service/sendVerificationCode.c")
);
router.post(
  "/request/service/verify",
  require("../controllers/customer_service/verifyAuthCode.c")
);
router.post(
  "/request/service/complete-profile",
  require("../controllers/customer_service/completeProfile.c")
);

// Other
router.get("/books", booksController.getBooks);
router.post("/books/add", booksController.addBook);

router.get("/links", linksController.getLinks);
router.post("/links/add", linksController.addLink);

// Util
router.get("/awake", require("../controllers/awake"));
router.get("/captcha", require("../controllers/captcha"));
router.get("/email/test", require("../controllers/emailTest"));

router.post("/sms/update-sms-status", smsController.updateMessageStatus);

module.exports = router;
