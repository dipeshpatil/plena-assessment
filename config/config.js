const yaml = require('js-yaml');
const fs = require('fs');
const path = require('path');

let config = {};

// Get document, or throw exception on error
try {
  config = yaml.load(
    fs.readFileSync(
      path.join(__dirname, `config.${process.env.APP_ENV}.yml`),
      'utf8',
    ),
  );
} catch (e) {
  console.log(e);
}

const { protocol, host, port, api_prefix } = config.app;

module.exports = {
  dbConfig: config.db,
  appConfig: {
    ...config.app,
    baseAPIEndpoint: `${protocol}://${host}:${port}${api_prefix}`,
  },
};
