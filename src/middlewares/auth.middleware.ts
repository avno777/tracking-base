import { Request, Response, NextFunction } from 'express'
import { JwtPayload } from 'jsonwebtoken'
import authService from '../services/auth.service'
import { IAccount } from '../models/database/accounts.models'
import accountService from '../services/account.service'
import { IRequest } from '~/models/interfaces/req.interface'

// interface RequestWithUser extends Request {
//   user?: {
//     _id: string
//   }
// }

const authMiddleware = async (req: IRequest, res: Response, next: NextFunction): Promise<Response | void> => {
  const authHeader = req.headers.authorization

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Unauthorized!!!' })
  }

  const token = authHeader.split(' ')[1]
  console.log('token', token)

  try {
    const decoded = (await authService.verifyAccessToken(token)) as JwtPayload
    req.user = { _id: decoded._id }
    console.log(req.user._id)
    next()
  } catch (error) {
    return res.status(401).json({ message: 'Invalid or expired token' })
  }
}

const authorizeRoles = (...allowedRoles: string[]) => {
  return async (req: IRequest, res: Response, next: NextFunction): Promise<Response | void> => {
    try {
      const accountId = req.user?._id
      const user: IAccount | null = await authService.findByKeyword({ accountId }, '_id')
      if (!req.user || !user || !allowedRoles.includes(user.role)) {
        return res.status(403).json({ message: 'Access denied!!!' })
      }
      next()
    } catch (error) {
      return res.status(500).json({ message: 'Internal server error' })
    }
  }
}

export { authMiddleware, authorizeRoles }
