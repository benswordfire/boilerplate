export const emailVerificationEmailTemplate = (
  link: string
): string =>
  `
  <p>Hi there!</p>
  <p>Click here to verify your email address: <a href='${link}'>VERIFY</a></p>
`;