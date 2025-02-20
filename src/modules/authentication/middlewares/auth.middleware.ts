import { Request, Response, NextFunction } from 'express';
import { findUserById } from '../models/auth.models';
import { User } from '../types/User';

export const publicRoutes = [
  '/login',
  '/register'
];

export const authorize = async (
  request: Request,
  response: Response,
  next: NextFunction
) => {
  try {
    if (publicRoutes.includes(request.path)) {
      return next();
    }

    if (!request.session || !request.session.user) {
      return response.status(401).redirect('/login');
    }

    const user: User | null = await findUserById(request.session.user.userId);

    if (!user) {
      return response.status(401).redirect('/login');
    }
    request.user = user; 

    response.setHeader(
      'Cache-Control',
      'no-store, no-cache, must-revalidate, private'
    );

    next();  
  } catch (error) {
    console.error('Authorization failed:', error)
  }
}

export const currentUser = async (
  request: Request,
  response: Response,
  next: NextFunction
) => {
  try {
    if (!request.session || !request.session.user) {
      return response.redirect('/login');
    }

    const user = await findUserById(request.session.user.userId);

    if (!user) {
      return response.redirect('/login');
    }

    request.user = user; 

    next();
  } catch (error) {
    console.error('Error loading user:', error);
    response.status(500).send('Internal Server Error');
  }
}
