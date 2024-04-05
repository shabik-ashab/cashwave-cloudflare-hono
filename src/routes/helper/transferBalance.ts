import getPrismaClient from '../../prisma';

const transferBalance = async (c) => {
    const userId = c.req.userId;
    let { amount, to } = await c.req.json();
    const prisma = getPrismaClient(c);
    to = parseInt(to);
    amount = parseInt(amount);
    let flag = true

    const senderAccount = await prisma.account.findFirst({
        where: {
            userId: userId,
        },
    });

    if (!senderAccount || senderAccount.balance < amount) {
        flag = false
        return c.json({
            statusCode: 400,
            body: {
                message: "Insufficient balance",
            },
        });
    }

    const recipientAccount = await prisma.account.findFirst({
        where: {
            userId: to,
        },
    });

    if (!recipientAccount) {
        flag = false
        return c.json({
            statusCode: 400,
            body: {
                message: "Invalid account",
            },
        });
    }
    if (flag){
        try {
            await prisma.$transaction(async (tx) => {
                await tx.account.update({
                    where: {
                        userId: userId,
                    },
                    data: {
                        balance: {
                            decrement: amount,
                        },
                    },
                });
    
                await tx.account.update({
                    where: {
                        userId: to,
                    },
                    data: {
                        balance: {
                            increment: amount,
                        },
                    },
                });
            });
    
            return c.json({
                statusCode: 200,
                body: {
                    message: "Transfer successful",
                },
            });
        } catch (error) {
            console.error("Error occurred during transfer:", error);
            return c.json({
                statusCode: 400,
                body: {
                    message: error.message || "Transfer failed",
                },
            });
        }
    }
}

export default transferBalance;
