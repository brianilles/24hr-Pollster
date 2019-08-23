const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const sendingNumber = process.env.TWILIO_NUMBER;
const serviceSid = process.env.TWILIO_SERVICE_SID;

const client = require('twilio')(accountSid, authToken);

module.exports = {
  sendCode,
  verificationCheck
};

// sends code to end user
async function sendCode(phonenumber) {
  const verification = await client.verify
    .services(serviceSid)
    .verifications.create({ to: phonenumber, channel: 'sms' });
  return verification.status;
}

// verifies codes match
async function verificationCheck(verifyData) {
  const verificationCheck = await client.verify
    .services(serviceSid)
    .verificationChecks.create({
      to: verifyData.phonenumber,
      code: verifyData.code
    });
  return verificationCheck.status;
}
