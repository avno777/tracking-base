import express, { Router } from 'express'
import accountRoute from './account.route'
import authRoute from './auth.route'
import customerRoute from './customer.route'
import orderRoute from './order.route'
import driverRoute from './driver.route'
import inventoryRoute from './inventory.route'
import invoiceRoute from './invoice.route'
import productRoute from './product.route'
import supplierRoute from './supplier.route'

const router: Router = express.Router()

interface Route {
  path: string
  route: Router
}

const defaultRoutes: Route[] = [
  { path: '/account', route: accountRoute },
  { path: '/auth', route: authRoute },
  { path: '/customer', route: customerRoute },
  { path: '/order', route: orderRoute },
  { path: '/driver', route: driverRoute },
  { path: '/inventory', route: inventoryRoute },
  { path: '/invoice', route: invoiceRoute },
  { path: '/product', route: productRoute },
  { path: '/supplier', route: supplierRoute }
]

defaultRoutes.forEach((route: Route) => {
  router.use(route.path, route.route)
})

export default router
