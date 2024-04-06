import getPrismaClient from "../../prisma";

const transferBalance = async (c) => {
  const userId = c.req.userId;
  let { amount, to } = await c.req.json();
  const prisma = getPrismaClient(c);
  to = parseInt(to);
  amount = parseInt(amount);

  const senderAccount = await prisma.account.findFirst({
    where: {
      userId: userId,
    },
  });

  if (!senderAccount || senderAccount.balance < amount) {
    return c.json(
      {
        message: "Insufficient balance",
      },
      400
    );
  }

  const recipientAccount = await prisma.account.findFirst({
    where: {
      userId: to,
    },
  });

  if (!recipientAccount) {
    return c.json(
      {
        message: "Invalid account",
      },
      400
    );
  }
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

    return c.json({ message: "Transfer successful" }, 200);
  } catch (error) {
    console.error("Error occurred during transfer:", error);
    return c.json({ message: error.message || "Transfer failed" }, 400);
  }
};

export default transferBalance;
