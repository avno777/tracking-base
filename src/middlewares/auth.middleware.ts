import { Request, Response, NextFunction } from 'express'
import { JwtPayload } from 'jsonwebtoken'
import authService from '../services/auth.service'
import { IAccount } from '../models/database/accounts.models'
import accountService from '../services/account.service'
import { IRequest } from '~/models/interfaces/req.interface'
import { response400, response401, response403, response500 } from '~/utils/apiResponse'
import jsonRes from '~/utils/jsonRes'

const authMiddleware = async (req: IRequest, res: Response, next: NextFunction): Promise<Response | void> => {
  const authHeader = req.headers.authorization

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    //return res.status(401).json({ message: 'Unauthorized!!!' })
    return response401(res, jsonRes.UNAUTHORIZED)
  }

  const token = authHeader.split(' ')[1]
  console.log('token', token)

  try {
    const decoded = (await authService.verifyAccessToken(token)) as JwtPayload
    req.user = { _id: decoded._id }
    console.log(req.user._id)
    next()
  } catch (error) {
    //return res.status(401).json({ message: 'Invalid or expired token' })
    return response401(res, jsonRes.INVALID_OR_EXPIRED_TOKEN)
  }
}

const authorizeRoles = (...allowedRoles: string[]) => {
  return async (req: IRequest, res: Response, next: NextFunction): Promise<Response | void> => {
    try {
      const accountId = req.user?._id
      const user: IAccount | null = await authService.findByKeyword({ accountId }, '_id')
      if (!req.user || !user || !allowedRoles.includes(user.role)) {
        //return res.status(403).json({ message: 'Access denied!!!' })
        return response403(res, jsonRes.ACCESS_DENIED)
      }
      next()
    } catch (error) {
      //return res.status(500).json({ message: 'Internal server error' })
      return response500(res, jsonRes.INTERNAL_SERVER_ERROR)
    }
  }
}

export { authMiddleware, authorizeRoles }
