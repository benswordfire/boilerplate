export const twoFactorAuthEmailTemplate = (
  token: string
): string =>
  `
  <p>Hi there!</p>
  <p>Your Two Factor Verification Code: <strong>${token}</strong></p>
`;
