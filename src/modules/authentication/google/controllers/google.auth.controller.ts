import { Request, Response } from 'express';
import { getGoogleAuthURL, handleGoogleAuth } from '../services/google.auth.services';
import { logger } from '../../../../config/logger/logger';

export const googleAuthRedirect = (
  request: Request, 
  response: Response
) => {
  const authURL = getGoogleAuthURL();
  response.redirect(authURL);
};

export const googleAuthCallback = async (
  request: Request,
  response: Response
) => {
  try {
    const { code } = request.query;
    logger.debug(`Attempting to send Google code: ${code}`)
    const result = await handleGoogleAuth(code, request.session);

    if (result.success) {
      response.redirect('/settings')
    }
  } catch (error) {
    response.status(400).json({ error: error });
  }
}