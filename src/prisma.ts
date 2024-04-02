import { PrismaClient } from '@prisma/client/edge'
import { withAccelerate } from '@prisma/extension-accelerate'
import { env } from 'hono/adapter'

const getPrismaClient = (c) => {
    const { DATABASE_URL } = env<{ DATABASE_URL: string }>(c)
    const prisma = new PrismaClient({
        datasourceUrl: DATABASE_URL,
    }).$extends(withAccelerate())

    return prisma;
};

export default getPrismaClient;
