require('dotenv').config();
const express = require('express');
const cors = require('cors');
const i18n = require('i18n');
const cookieParser = require('cookie-parser');
const mongoose = require('mongoose');
const useragent = require('express-useragent');
const helmet = require('helmet');

const router = require('./routes/index.r');
const logger = require('./util/logger');
const localsConfig = require('./locales/config');
const rateLimiter = require('./middleware/rateLimiter');
const cr = require('./locales/codedResponses');

const environment = process.env.NODE_ENV;
const stage = require('./config/index')[environment];

// mongo db
mongoose.connect(stage.mongoUri, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useUnifiedTopology: true,
  useFindAndModify: false
});

const connection = mongoose.connection;
connection.once('open', () => {
  console.log("MongoDB connection established");
  // server config
  const app = express();

  app.use(helmet());
  app.use(cors(stage.corsOptions));
  app.use(useragent.express());
  app.use(express.json());
  app.use(express.urlencoded({extended: true}));
  app.use(cookieParser());

  i18n.configure(localsConfig);
  app.use(i18n.init);

  logger.init(stage.mongoUri, app);

  rateLimiter.init(connection);
  app.use(rateLimiter.rateLimiterMiddleware);

  app.use('/api/v1', router);

  app.all('*', (req, res)=>{
    const t = req.__;
    res.status(404).json({
      messages: [cr.not_found(t)]
    })
  })

  app.listen(stage.port, () => console.log(`Server Started at port: ${stage.port}`));
});