import { Response } from 'express'
import { JsonResponse } from './jsonRes'

const response200 = (res: Response, jsonRes: JsonResponse, data?: any, pagination?: any) => {
  return res.status(200).json({ statusCode: jsonRes.statusCode, message: jsonRes.message, data, pagination })
}

const response201 = (res: Response, jsonRes: JsonResponse, data?: any) => {
  return res.status(201).json({ statusCode: jsonRes.statusCode, message: jsonRes.message, data })
}

const response204 = (res: Response, jsonRes: JsonResponse) => {
  return res.status(204).json(jsonRes)
}

const response400 = (res: Response, jsonRes: JsonResponse) => {
  return res.status(400).json(jsonRes)
}

const response401 = (res: Response, jsonRes: JsonResponse) => {
  return res.status(401).json(jsonRes)
}

const response403 = (res: Response, jsonRes: JsonResponse) => {
  return res.status(403).json(jsonRes)
}

const response404 = (res: Response, jsonRes: JsonResponse) => {
  return res.status(404).json(jsonRes)
}

const response409 = (res: Response, jsonRes: JsonResponse) => {
  return res.status(409).json(jsonRes)
}

const response422 = (res: Response, jsonRes: JsonResponse, details?: any) => {
  return res.status(422).json({ ...jsonRes, details })
}

const response500 = (res: Response, jsonRes: JsonResponse) => {
  return res.status(500).json(jsonRes)
}

const response503 = (res: Response, jsonRes: JsonResponse) => {
  return res.status(503).json(jsonRes)
}

export {
  response200,
  response201,
  response204,
  response400,
  response401,
  response403,
  response404,
  response409,
  response422,
  response500,
  response503
}
