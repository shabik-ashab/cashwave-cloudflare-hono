import { Hono } from 'hono'
import signup from './helper/signup'
import signin from './helper/signin'
import { authMiddleware } from '../middleware'

const app = new Hono()

app.post('/signup', signup)
app.post('/signin', signin)


export default app