import { Hono } from 'hono'
import signup from './helper/signup'
import signin from './helper/signin'

const app = new Hono()

app.get('/', (c) => c.text('user'))

app.post('/signup', signup)
app.post('/signin', signin)
export default app