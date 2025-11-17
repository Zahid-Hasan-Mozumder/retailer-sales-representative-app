import { Injectable } from '@nestjs/common';
import * as argon2 from 'argon2';

@Injectable()
export class PasswordService {
  // Hash a password
  async hashPassword(password: string): Promise<string> {
    return await argon2.hash(password, {
      type: argon2.argon2id, // Use argon2id variant (recommended), argon2 has three variants -> argon2id, argon2i, argon2d
      memoryCost: 2 ** 16, // 64 MiB memory cost
      timeCost: 3, // 3 iterations
      parallelism: 1, // Degree of parallelism
    });
  }

  // Verify a password against a hash
  async verifyPassword(
    hashedPassword: string,
    plainPassword: string,
  ): Promise<boolean> {
    return await argon2.verify(hashedPassword, plainPassword);
  }
}
