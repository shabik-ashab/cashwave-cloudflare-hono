import { Hono } from 'hono';
import { PrismaClient } from '@prisma/client/edge'
import { withAccelerate } from '@prisma/extension-accelerate'
import { env } from 'hono/adapter';
import root from './routes/root';
import { cors } from 'hono/cors';
import signup from './routes/helper/signup';

const app = new Hono();

app.use('*', cors());
app.route('/api/v1', root);


export default app;
