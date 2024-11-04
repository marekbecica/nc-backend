import { Response, NextFunction } from 'express';
import { auth } from '../config/firebase';
import { AuthRequest } from '../types/types';

export const authenticateUser = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const authHeader = req.headers.get('authorization');
    // Check if the authorization header starts with 'Bearer '
    if (!authHeader?.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    // Extract the token from the header
    const token = authHeader.split('Bearer ')[1];
    const decodedToken = await auth.verifyIdToken(token);

    // Check if the phone number is verified
    if (!decodedToken.phone_number) {
      return res.status(401).json({ message: 'Phone number not verified' });
    }

    // Attach user data
    req.user = {
      uid: decodedToken.uid,
      phoneNumber: decodedToken.phone_number,
    };

    next();
  } catch (error) {
    console.error('Auth Middleware Error:', error);
    res.status(401).json({ message: 'Invalid authentication token' });
  }
};