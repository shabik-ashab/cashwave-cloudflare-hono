import { Hono } from 'hono'
import account from './account'
import user from './user'

const app = new Hono()

app.route("/account", account)
app.route("/user", user)

export default app