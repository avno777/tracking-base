import { Request, Response, NextFunction } from 'express'
import { JwtPayload } from 'jsonwebtoken'
import authService from '../services/auth.service'

interface RequestWithUser extends Request {
  user?: {
    _id: string
    role: string
  }
}

const authMiddleware = async (req: RequestWithUser, res: Response, next: NextFunction): Promise<Response | void> => {
  const authHeader = req.headers.authorization

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Unauthorized!!!' })
  }

  const token = authHeader.split(' ')[1]

  try {
    const decoded = (await authService.verifyAccessToken(token)) as JwtPayload
    req.user = { _id: decoded._id, role: decoded.role }
    next()
  } catch (error) {
    return res.status(401).json({ message: 'Invalid or expired token' })
  }
}

const authorizeRoles = (...allowedRoles: string[]) => {
  return (req: RequestWithUser, res: Response, next: NextFunction): Response | void => {
    if (!req.user || !allowedRoles.includes(req.user.role)) {
      return res.status(403).json({ message: 'Access denied' })
    }
    next()
  }
}

export { authMiddleware, authorizeRoles }
