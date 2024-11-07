import { Response, Request } from 'express';
import { db } from '../config/firebase';
import { AuthRequest, UserProfile } from '../types/types';

export const userController = {
  // Get user profile
  async getProfile(req: Request, res: Response) {
    try {
      const { phoneNumber } = (req as AuthRequest).user!;
      const userDoc = await db.collection('users').doc(phoneNumber).get();

      if (!userDoc.exists) {
        res.status(404).json({ message: 'Profile not found, please create a new one' });
        return;
      }

      res.json(userDoc.data());
      return;
    } catch (error) {
      console.error('Get Profile Error:', error);
      res.status(500).json({ message: 'Internal server error' });
      return;
    }
  },

  // Update user profile
  async updateProfile(req: Request, res: Response) {
    try {
      const { phoneNumber } = (req as AuthRequest).user!;
      const { name, email } = req.body;

      // Validate input
      if (!name || !email) {
        res.status(400).json({ message: 'Name and email are required' });
        return;
      }

      // Validate email format
      const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
      if (!emailRegex.test(email)) {
        res.status(400).json({ message: 'Invalid email format' });
        return;
      }

      const userRef = db.collection('users').doc(phoneNumber);
      const userDoc = await userRef.get();

      const updatedProfile: Partial<UserProfile> = {
        name,
        email,
        updatedAt: new Date(),
      };

      if (!userDoc.exists) {
        // Create new profile
        await userRef.set({
          ...updatedProfile,
          phoneNumber,
          createdAt: new Date(),
        });
      } else {
        // Update existing profile
        await userRef.update(updatedProfile);
      }

      res.json({ message: 'Profile updated' });
      return;
    } catch (error) {
      console.error('Error while updating profile:', error);
      res.status(500).json({ message: 'Internal server error' });
      return;
    }
  },
};