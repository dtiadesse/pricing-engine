module.exports = {
    local: 'http://localhost:4200', // INFO: Only to be used when mockMode is enabled
    dev: 'https://pe.appdev-optigo.fhlmc.com',
    sit: 'https://mfpre.appsit-optigo.fhlmc.com',
    testCredentials: {
      analystUser: {
        uid: 'mfpre_analyst_user',
        pw: 'Pricing!10232020'
      },
      devUser: {
        uid: 'mfpricing_dev_user',
        pw: 'Peservices11122020'
      }
    }
  };
  