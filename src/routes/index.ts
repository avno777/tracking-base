import express, { Router } from 'express'
import authRoute from './auth.route'

const router: Router = express.Router()

interface Route {
  path: string
  route: Router
}

const defaultRoutes: Route[] = [{ path: '/auth', route: authRoute }]

defaultRoutes.forEach((route: Route) => {
  router.use(route.path, route.route)
})

export default router
