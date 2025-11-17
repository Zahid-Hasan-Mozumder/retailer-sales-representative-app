import { PrismaClient } from '../generated/prisma/client';
import * as argon2 from 'argon2';

const prisma = new PrismaClient();

async function main() {
  // Hash the password
    const hashedPassword = await argon2.hash('password@1234', {
    type: argon2.argon2id,
    memoryCost: 2 ** 16,
    timeCost: 3,
    parallelism: 1,
  });
  
  // Create 10 admin into the database
  for (let i = 1; i <= 10; i++) {
    await prisma.admin.create({
      data: {
        username: `admin${i}`,
        name: `Admin ${i}`,
        phone: '01500000000'.slice(0, 11 - (i).toString().length) + `${i}`,
        passwordHash: hashedPassword
      },
    });
  }

  // Create 150000 sales representatives into the database
  for (let i = 1; i <= 150000; i++) {
    await prisma.salesRep.create({
      data: {
        username: `salesRep${i}`,
        name: `Sales Representative ${i}`,
        phone: '01700000000'.slice(0, 11 - (i).toString().length) + `${i}`,
        passwordHash: hashedPassword
      },
    });
  }
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })