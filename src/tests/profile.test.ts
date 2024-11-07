import request from 'supertest';
import { app } from '../index';
import { authenticateUser } from '../middleware/auth';

// Mock the auth middleware
jest.mock('../middleware/auth', () => ({
  authenticateUser: jest.fn((req, res, next) => next()),
}));

// Before each test, clear all mocks
beforeEach(() => {
  jest.clearAllMocks();
});

describe('Profile Endpoints', () => {
  describe('GET /api/profile', () => {
    it('should return profile when authenticated', async () => {
      // Mock successful auth
      (authenticateUser as jest.Mock).mockImplementation((req, res, next) => {
        req.user = { uid: 'vHAuIHMgW9OaO8JJVki33ULxBup1', phoneNumber: ' +46123456789' }; // Add mock user data
        next();
      });

      const response = await request(app)
        .get('/api/profile')
        .expect(200);

      expect(authenticateUser).toHaveBeenCalled();
      expect(response.body).toHaveProperty('email');
    });

    it('should return 401 when not authenticated', async () => {
      // Mock failed auth
      (authenticateUser as jest.Mock).mockImplementation((req, res, next) => {
        res.status(401).json({ message: 'Unauthorized' });
      });

      await request(app)
        .get('/api/profile')
        .expect(401);
    });
  });

  describe('PUT /api/profile', () => {
    it('should update profile when authenticated', async () => {
      // Mock successful auth
      (authenticateUser as jest.Mock).mockImplementation((req, res, next) => {
        req.user = { uid: 'vHAuIHMgW9OaO8JJVki33ULxBup1', phoneNumber: ' +46123456789' };
        next();
      });

      const updateData = {
        name: 'Marek Test User',
        email: 'marekbecica+testuser@gmail.com'
      };

      const response = await request(app)
        .put('/api/profile')
        .send(updateData)
        .expect(200);

      expect(authenticateUser).toHaveBeenCalled();
      expect(response.body).toHaveProperty('message', "Profile updated");
    });

    it('should return 401 when not authenticated', async () => {
      // Mock failed auth
      (authenticateUser as jest.Mock).mockImplementation((req, res, next) => {
        res.status(401).json({ message: 'Unauthorized' });
      });

      const updateData = {
        name: 'Marek Test User',
        email: 'marekbecica+testuser@gmail.com'
      };

      await request(app)
        .put('/api/profile')
        .send(updateData)
        .expect(401);
    });
  });
});