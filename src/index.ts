import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import { userController } from './controllers/userController'
import { authenticateUser } from './middleware/auth'
import rateLimit from 'express-rate-limit'

dotenv.config()

const app = express()
const port = process.env.PORT || 3000

// Rate limit config
const limiter = rateLimit({
  windowMs: process.env.NODE_ENV === 'test' ? 1000 : 15 * 60 * 1000, // 1 second in test, 15 minutes in production
  limit: process.env.NODE_ENV === 'test' ? 5 : 100, // 5 requests in test, 100 in production
  handler: (req, res) => {
    res.status(429).json({
      message: 'Too many requests from this IP, please try again later.',
    })
  },
  standardHeaders: true,
  legacyHeaders: false,
})

// Apply rate limiter to all routes
app.use(limiter)

// Middleware
app.use(express.json())
app.use(
  cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true,
  }),
)

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok' })
})

// Protected routes
app.get('/api/profile', authenticateUser, userController.getProfile)
app.put('/api/profile', authenticateUser, userController.updateProfile)

export { app }

// Only start the server if this file is run directly
if (require.main === module) {
  app.listen(port, () => {
    console.log(`Server is running on port ${port}`)
  })
}
