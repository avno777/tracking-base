import express, { Router } from 'express'
import authRoute from './auth.route'
import customerRoute from './customer.route'
import orderRoute from './order.route'

const router: Router = express.Router()

interface Route {
  path: string
  route: Router
}

const defaultRoutes: Route[] = [
  { path: '/auth', route: authRoute },
  { path: '/customer', route: customerRoute },
  { path: '/order', route: orderRoute }
]

defaultRoutes.forEach((route: Route) => {
  router.use(route.path, route.route)
})

export default router
