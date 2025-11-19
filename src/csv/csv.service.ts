import { Injectable } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class CsvService {
  private bdDistricts = [
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
  private areaSuffixes = ['Sadar', 'Sadar Dakshin', 'Union', 'Pouroshova'];
  private territorySuffixes = ['Central Market', 'Bus Stand', 'Rail Station'];
  private distributorNames = [
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

  async generateCsv(
    count: number,
    writable: NodeJS.WritableStream,
  ): Promise<void> {
    writable.write('uid,name,phone,region,area,distributor,territory,routes\n');
    for (let i = 0; i < count; i++) {
      const uid = uuidv4();
      const name = this.randomName();
      const phone = this.randomPhone();
      const region = this.pick(this.bdDistricts);
      const area = `${region} ${this.pick(this.areaSuffixes)}`;
      const distributor = this.pick(this.distributorNames);
      const territory = `${area} ${this.pick(this.territorySuffixes)}`;
      const routes = JSON.stringify({
        waypoints: [
          this.randomLatLng(),
          this.randomLatLng(),
          this.randomLatLng(),
        ],
      });
      const row = [
        uid,
        name,
        phone,
        region,
        area,
        distributor,
        territory,
        routes,
      ]
        .map((v) => this.escapeCsv(v))
        .join(',');
      if (!writable.write(row + '\n')) {
        await new Promise<void>((resolve) => writable.once('drain', resolve));
      }
    }
  }

  private escapeCsv(value: string): string {
    const hasSpecial = /[",\n]/.test(value);
    const escaped = value.replace(/"/g, '""');
    return hasSpecial ? `"${escaped}"` : escaped;
  }

  private pick<T>(arr: T[]): T {
    return arr[Math.floor(Math.random() * arr.length)];
  }

  private randomName(): string {
    const first = [
      'Arif',
      'Hasan',
      'Rahim',
      'Karim',
      'Jahan',
      'Sumaiya',
      'Nusrat',
      'Faisal',
      'Sadia',
      'Tania',
    ];
    const last = [
      'Ahmed',
      'Hossain',
      'Chowdhury',
      'Rahman',
      'Islam',
      'Akter',
      'Sultana',
      'Mia',
      'Uddin',
      'Sarker',
    ];
    return `${this.pick(first)} ${this.pick(last)}`;
  }

  private randomPhone(): string {
    const prefix = ['013', '014', '015', '016', '017', '018', '019'];
    const p = this.pick(prefix);
    let rest = '';
    for (let i = 0; i < 8; i++) rest += this.randomInt(0, 9).toString();
    return `${p}${rest}`;
  }

  private randomInt(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  private randomLatLng(): { lat: number; lng: number } {
    const lat = 20.5 + Math.random() * (26.5 - 20.5);
    const lng = 88 + Math.random() * (92 - 88);
    return { lat: Number(lat.toFixed(6)), lng: Number(lng.toFixed(6)) };
  }
}
