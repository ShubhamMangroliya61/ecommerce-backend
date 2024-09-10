const dotenv = require("dotenv");

dotenv.config();

const _config = {
  nodeEnv: process.env.NODE_ENV || "development",
  port: process.env.PORT || 8080,
  mongoUri: process.env.MONGO_URI,
  jwtSecret: process.env.JWT_SECRET,
  jwtExpiry: process.env.JWT_EXPIRY || "1h",
  emailpass: process.env.MAIL_PASSWORD,
};

const config = {
  get: (name) => {
    const value = _config[name];
    if (value === undefined) {
      console.error(`Environment variable ${name} is missing.`);
      process.exit(1);
    }
    return value;
  },
};

module.exports = config;
