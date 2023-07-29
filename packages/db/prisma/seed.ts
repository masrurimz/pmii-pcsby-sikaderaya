import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
    const hashedPassword = await bcrypt.hash('admin', 10);
    const superadmin = await prisma.user.upsert({
        where: { email: 'admin@admin.com' },
        update: {},
        create: {
            name: 'Admin',
            email: 'admin@admin.com',
            password: hashedPassword,
            role: 'SUPERADMIN',
        },
    });
    console.log({ superadmin });
}

main()
    .then(async () => {
        await prisma.$disconnect();
    })
    .catch(async (e) => {
        console.error(e);
        await prisma.$disconnect();
        process.exit(1);
    });