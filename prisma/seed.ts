import { PrismaClient } from '../generated/prisma/client';
import * as argon2 from 'argon2';

const prisma = new PrismaClient();

const bdDistricts = [
  'Bagerhat',
  'Bandarban',
  'Barguna',
  'Barishal',
  'Bhola',
  'Bogura',
  'Brahmanbaria',
  'Chandpur',
  'Chapainawabganj',
  'Chattogram',
  'Chuadanga',
  "Cox's Bazar",
  'Cumilla',
  'Dhaka',
  'Dinajpur',
  'Faridpur',
  'Feni',
  'Gaibandha',
  'Gazipur',
  'Gopalganj',
  'Habiganj',
  'Jamalpur',
  'Jashore',
  'Jhalokathi',
  'Jhenaidah',
  'Joypurhat',
  'Khagrachhari',
  'Khulna',
  'Kishoreganj',
  'Kurigram',
  'Kushtia',
  'Lakshmipur',
  'Lalmonirhat',
  'Magura',
  'Manikganj',
  'Meherpur',
  'Moulvibazar',
  'Munshiganj',
  'Mymensingh',
  'Naogaon',
  'Narayanganj',
  'Narsingdi',
  'Natore',
  'Netrokona',
  'Nilphamari',
  'Noakhali',
  'Pabna',
  'Panchagarh',
  'Patuakhali',
  'Pirojpur',
  'Rajbari',
  'Rajshahi',
  'Rangamati',
  'Rangpur',
  'Satkhira',
  'Shariatpur',
  'Sherpur',
  'Sirajganj',
  'Sunamganj',
  'Sylhet',
  'Tangail',
];

const areaSuffixes = ['Sadar', 'Sadar Dakshin', 'Union', 'Pouroshova'];

const territorySuffixes = ['Central Market', 'Bus Stand', 'Rail Station'];

const distributorNames = [
  'PRAN-RFL Group',
  'Akij Food & Beverage',
  'City Group',
  'Meghna Group of Industries',
  'Ispahani',
  'Olympic Industries',
  'Sajeeb Group',
  'Aarong Dairy',
  'Bashundhara Food',
  'ACI Foods',
  'Nestlé Bangladesh',
  'Unilever Bangladesh',
  'Square Toiletries',
  'Marico Bangladesh',
  'Kohinoor Chemical (Keya)',
  'Square Pharmaceuticals',
  'Beximco Pharmaceuticals',
  'Incepta Pharmaceuticals',
  'Renata Limited',
  'Eskayef Pharmaceuticals (SK+F)',
  'ACME Laboratories',
  'Orion Pharma',
  'Healthcare Pharmaceuticals',
  'Aristopharma',
  'Opsonin Pharma',
  'Beacon Pharmaceuticals',
  'Drug International',
  'NIPRO JMI',
  'GSK Bangladesh',
  'Sanofi Bangladesh',
];

let hashedPassword: string;
async function hashPassword() {
  hashedPassword = await argon2.hash('password@1234', {
    type: argon2.argon2id,
    memoryCost: 2 ** 16,
    timeCost: 3,
    parallelism: 1,
  });
}

async function seedGeography() {
  for (const district of bdDistricts) {
    const region = await prisma.region.create({
      data: { name: district },
    });

    for (const suffix of areaSuffixes) {
      const areaName = `${district} ${suffix}`;
      const area = await prisma.area.create({
        data: { name: areaName, regionId: region.id },
      });

      for (const suffix of territorySuffixes) {
        const territoryName = `${areaName} ${suffix}`;
        await prisma.territory.create({
          data: { name: territoryName, areaId: area.id },
        });
      }
    }
  }
}

async function seedDistributors() {
  for (const distributorName of distributorNames) {
    await prisma.distributor.create({
      data: { name: distributorName },
    });
  }
}

async function seedAdmins() {
  for (let i = 1; i <= 10; i++) {
    await prisma.admin.create({
      data: {
        username: `admin${i}`,
        name: `Admin ${i}`,
        phone: '01500000000'.slice(0, 11 - i.toString().length) + `${i}`,
        passwordHash: hashedPassword,
      },
    });
  }
}

async function seedSalesReps() {
  for (let i = 1; i <= 150000; i++) {
    await prisma.salesRep.create({
      data: {
        username: `salesRep${i}`,
        name: `Sales Representative ${i}`,
        phone: '01700000000'.slice(0, 11 - i.toString().length) + `${i}`,
        passwordHash: hashedPassword,
      },
    });
  }
}

async function main() {
  await hashPassword();
  await seedAdmins();
  await seedSalesReps();
  await seedGeography();
  await seedDistributors();
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
