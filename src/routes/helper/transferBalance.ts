import getPrismaClient from '../../prisma';

const transferBalance = async (c) => {
    const userId = c.req.userId;
    let {amount, to} = await c.req.json();
    const prisma = getPrismaClient(c);
    to = parseInt(to);

    console.log(userId, amount, to);
    try {
        await prisma.$transaction(async (tx) => {
            // Find the sender's account and check balance
            const senderAccount = await tx.account.findFirst({
                where: {
                    userId: userId,
                },
            });

            // Find the recipient's account
            const recipientAccount = await tx.account.findFirst({
                where: {
                    userId: to,
                },
            });

            // Check if sender's account exists and has sufficient balance
            if (!senderAccount || senderAccount.balance < amount) {
                throw new Error("Insufficient balance");
            }

            // Check if recipient's account exists
            if (!recipientAccount) {
                throw new Error("Invalid account");
            }

            // Perform the transfer
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
            message: "Transfer successful",
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

export default transferBalance;