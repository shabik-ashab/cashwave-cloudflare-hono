import { Hono } from 'hono'
import { authMiddleware } from '../middleware'
import getBalance from './helper/getBalance'
import transferBalance from './helper/transferBalance'

const app = new Hono()

app.get('/', (c) => c.text('account'))

app.get("/balance", authMiddleware, getBalance)
app.post("transfer", authMiddleware, transferBalance)

export default app