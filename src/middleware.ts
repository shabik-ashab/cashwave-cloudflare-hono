import { env } from 'hono/adapter';
import { verify } from 'hono/jwt'

const authMiddleware = async (c, next) => {
    const authHeader = c.req.header('Authorization')
    if(!authHeader || !authHeader.startsWith('Bearer ')){
        return c.json({message: 'Unauthorized'}, 403)
    }

    const token = authHeader.split(' ')[1];
    try{
        const { JWT_SECRET } = env<{ JWT_SECRET: string }>(c);
        const decoded = await verify(token, JWT_SECRET)
        c.req.userId = decoded.sub 
        await next()
    }catch (err) {
        return c.json({message: 'Unauthorized'}, 403)
    }
}

export { authMiddleware }