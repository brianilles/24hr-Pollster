const client = require('twilio')(accountSid, authToken);

// sends a message to to the potential user with code
client.verify
  .services('--')
  .verifications.create({ to: '+18052916717', channel: 'sms' })
  .then(verification => console.log(verification.status));

// check to see of the code sent matches
client.verify
  .services('--')
  .verificationChecks.create({ to: '+18052916717', code: '141785' })
  .then(verification_check => console.log(verification_check));
