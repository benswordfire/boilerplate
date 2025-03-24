export const passwordResetEmailTemplate = (
  link: string
): string =>
  `
  <p>Hi there!</p>
  <p>Click here to reset your password: <a href='${link}'>VERIFY</a></p>
`;