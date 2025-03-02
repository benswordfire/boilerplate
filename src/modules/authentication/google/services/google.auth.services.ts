import 'dotenv/config';
import { findUserByEmail, findUserByGoogleId, insertGoogleUser } from '../../models/auth.models';
import { logger } from '../../../../config/logger/logger';
import { Result } from '@/config/types/Result';

const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;
const GOOGLE_REDIRECT_URI = process.env.GOOGLE_REDIRECT_URI;

if (!GOOGLE_CLIENT_ID || !GOOGLE_REDIRECT_URI || !GOOGLE_CLIENT_SECRET) {
  throw new Error("Missing Google OAuth environment variables");
}

export const getGoogleAuthURL = () => {
  const baseURL = 'https://accounts.google.com/o/oauth2/auth';
  const params = new URLSearchParams({
    client_id: GOOGLE_CLIENT_ID,
    redirect_uri: GOOGLE_REDIRECT_URI,
    response_type: "code",
    scope: "openid email profile",
  });

  return `${baseURL}?${params.toString()}`;
};

export const handleGoogleAuth = async (
  code: any, 
  session: any
): Promise<Result> => {
  try {
    const tokenRes = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        client_id: GOOGLE_CLIENT_ID,
        client_secret: GOOGLE_CLIENT_SECRET,
        redirect_uri: GOOGLE_REDIRECT_URI,
        grant_type: "authorization_code",
        code,
      }),
    });

    const tokenData = await tokenRes.json();

    if (!tokenRes.ok) throw new Error(tokenData.error || "Failed to get access token");
    
    logger.debug(`Handling Google tokenData: ${tokenData.access_token}`)
    const { access_token } = tokenData;

    logger.debug(`Attempting to retrieve user data from Google`)
    const userRes = await fetch("https://www.googleapis.com/oauth2/v2/userinfo", {
      headers: { Authorization: `Bearer ${access_token}` },
    });

    const userData = await userRes.json();
    if (!userRes.ok) throw new Error(userData.error || "Failed to fetch user info");

    logger.info('Google user data retrieved', { 
      email: userData.email,
      name: userData.given_name,
      id: userData.id
    });
    const { email, given_name: name, id } = userData;

    const existingUser = await findUserByGoogleId(id);

    if (existingUser) {
      session.user = {
        userId: existingUser.id,
        email: email,
      };
      logger.debug(`Session created: ${JSON.stringify(session.user)}`);
      return {
        success: true,
        message: 'Redirect',
        status: 200,
        authorized: true,
      };
    }

    if (await findUserByEmail(email)) {
      return {
        success: false,
        message: 'User already registered with email credentials',
        status: 400
      };
    }

    const result = await insertGoogleUser(email, id);
    if (!result) {
      throw new Error('Failed to create user in database');
    }

    session.user = {
      userId: result.id,
      email: email,
    };
    logger.debug(`Session created: ${JSON.stringify(session.user)}`);
    return {
      success: true,
      message: 'Redirect',
      status: 200,
      authorized: true,
    };
  } catch (error) {
    logger.error('Google authentication failed:', error);
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Authentication failed',
      status: 500,
    };
  }
}