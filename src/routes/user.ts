import { Hono } from 'hono'
import signup from './helper/signup'
import signin from './helper/signin'
import getUsers from './helper/getUsers'

const app = new Hono()

app.post('/signup', signup)
app.post('/signin', signin)
app.get("/bulk", getUsers)

export default app