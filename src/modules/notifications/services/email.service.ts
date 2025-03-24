import 'dotenv/config';
import { transporter } from '../../../config/notifications/email';
import { twoFactorAuthEmailTemplate } from '../templates/twoFactorAuthEmailTemplate';
import { emailVerificationEmailTemplate } from '../templates/emailVerificationEmailTemplate';

const sendEmailNotification = async (
  to: string,
  subject: string,
  html: string
): Promise<void> => {
  try {
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to,
      subject,
      html
    });
    console.log(`Success! Email was sent to: ${to}`)
  } catch (error) {
    console.error(`Error! Failed to send email to: ${to}`, error)
  }
}

export const sendTwoFactorAuthTokenEmail = async (
  email: string,
  token: string
): Promise<void> => {
  try {
    await sendEmailNotification(email, '🤫 Psst! Your Secret Code Arrived!', twoFactorAuthEmailTemplate(token))
  } catch (error) {
    console.error(`Error! Failed to send 2FA token to: ${email}`)
  }
}

export const sendEmailVerificationEmail = async (
  email: string,
  token: string
): Promise<void> => {
  try {
    const link = `${process.env.FRONTEND_URL}/email-verification?token=${token}`

    await sendEmailNotification(email, '🤫 Hell Yeah! Last Step To Access Your Account!', emailVerificationEmailTemplate(link))
  } catch (error) {
    console.error(`Error! Failed to send 2FA token to: ${email}`)
  }
}

export const sendPasswordResetTokenEmail = async (
  email: string,
  token: string
): Promise<void> => {
  try {
    const link = `${process.env.FRONTEND_URL}/password-reset?token=${token}`

    await sendEmailNotification(email, '🤫 Psst! You Can Reset Your Password!', twoFactorAuthEmailTemplate(link))
  } catch (error) {
    console.error(`Error! Failed to send password reset token to: ${email}`)
  }
}