import 'dotenv/config';
import twilio from 'twilio';

export const client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);

export const sendVerificationSMS = async (phoneNumber: string): Promise<string> => {
  console.log("TWILIO_VERIFY_API_SID:", process.env.TWILIO_VERIFY_API_SID);
  const verification = await client.verify.v2.services("VA02b3974e248fc97f2c81025ef75590b5")
  .verifications
  .create({ to: phoneNumber, channel: 'sms' })

  return verification.sid
}

export const verificationStatus = async (verificationSid: string, code: string): Promise<string> => {
  const verificationCheck = await client.verify.v2
    .services("VA02b3974e248fc97f2c81025ef75590b5")
    .verificationChecks
    .create({ verificationSid, code });

  return verificationCheck.status
}

