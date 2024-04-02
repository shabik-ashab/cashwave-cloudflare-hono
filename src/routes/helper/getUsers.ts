import getPrismaClient from '../../prisma';

const getUsers = async (c) => {
    try{
        const filter = c.req.query("filter") || ""
        const prisma = getPrismaClient(c);

        const users = await prisma.user.findMany({
            where: {
                OR: [
                    { firstName: { contains: filter } },
                    { lastName: { contains: filter } }
                ]
            }
        });

        return c.json({
            user: users.map(user => ({
                username: user.username,
                firstName: user.firstName,
                lastName: user.lastName,
                _id: user.id
            }))
        });
    }catch (error) {
        console.error("Error occurred while fetching users:", error);
        return c.json({
            statusCode: 500,
            body: {
                message: "Internal server error"
            }
        });
    }

}

export default getUsers