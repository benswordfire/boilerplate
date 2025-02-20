import { Request, Response } from 'express';

export const renderLoginPage = async (request: Request, response: Response) => {
  response.render('login', { title: 'Login' });
};