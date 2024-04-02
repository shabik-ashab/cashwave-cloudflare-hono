import { env } from 'hono/adapter';
import { sign } from 'hono/jwt';
import getPrismaClient from '../../prisma';

const signin = async (c) => {
  const prisma = getPrismaClient(c);
  const { username, password } = await c.req.json();
  const user = await prisma.user.findFirst({
    where: {
        username: username
    },
});
  if (!user) {
    return c.json({ error: 'User not found' }, 404);
  }
  if (user.password !== password) {
    return c.json({ error: 'Invalid password' }, 401);
  }
  const { JWT_SECRET } = env<{ JWT_SECRET: string }>(c);
  const token = await sign({ sub: user.id }, JWT_SECRET);
  return c.json({ token });
}

export default signin