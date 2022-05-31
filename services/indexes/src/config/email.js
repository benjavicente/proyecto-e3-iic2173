const dotenv = require('dotenv');
dotenv.config();

module.exports = {
  provider: {
    // your provider name directly or from ENV var
    service: 'SendGrid',
    // auth data always from ENV vars
    auth: {
      user: 'apikey',
      pass: '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',
    },
  },
  // defaults to be passed to nodemailer's emails
  defaults: {
    from: 'template <fballadares@uc.cl>',
  },
};
