import { Hono } from 'hono'
import signup from './helper/signup'

const app = new Hono()

app.get('/', (c) => c.text('user'))

app.post('/signup', signup)

export default app