import getPrismaClient from '../../prisma';

const getBalance = async (c) => {
    try {
        // Assuming req.userId is extracted from the request, you can use c.req.userId instead
        const userId = c.req.userId;

        const prisma = getPrismaClient(c);

        const account = await prisma.account.findFirst({
            where: {
                userId: userId
            }
        });

        if (!account) {
            return c.json({
                statusCode: 404,
                body: {
                    message: "Account not found"
                }
            });
        }

        return c.json({
            balance: account.balance
        });
    } catch (error) {
        console.error("Error occurred while fetching account:", error);
        return c.json({message: "Internal server error"
        },500);
    }
}

export default getBalance