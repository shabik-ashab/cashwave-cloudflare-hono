import { Hono } from 'hono'
import { authMiddleware } from '../middleware'
import getBalance from './helper/getBalance'

const app = new Hono()

app.get('/', (c) => c.text('account'))

app.get("/balance", authMiddleware, getBalance)

export default app