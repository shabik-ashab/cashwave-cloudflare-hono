import { env } from 'hono/adapter';
import { sign } from 'hono/jwt';
import getPrismaClient from '../../prisma';

// Define the signup function
const signup = async (c) => {
    try {
        const prisma = getPrismaClient(c)

        const body = await c.req.json()
        const username = body.username;
        const password = body.password;
        const firstName = body.firstName;
        const lastName = body.lastName;
        console.log(username, password, firstName, lastName)

        const user = await prisma.user.create({
            data: {
                username: username,
                password: password,
                firstName: firstName,
                lastName: lastName,
            }
        });

        const userId = user.id;

        await prisma.account.create({
            data: {
                userId,
                balance: 1 + Math.random() * 10000
            }
        });

        const { JWT_SECRET } = env<{ JWT_SECRET: string }>(c);

        // Generate JWT token using Hono's jwt.sign() method
        const token = await sign({
            sub: userId // Set the subject to userId
        }, JWT_SECRET);

        return c.json({
            body: {
                message: "User created successfully",
                token: token
            }
        });
    } catch (error) {
        console.error("Error occurred during signup:", error);
        return c.json({
            statusCode: 500,
            body: {
                message: "Internal server error"
            }
        });
    }
};

export default signup;
