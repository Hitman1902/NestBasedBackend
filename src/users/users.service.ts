import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';
import { User } from './user.entity';
import * as bcrypt from 'bcrypt';
@Injectable()
export class UsersService {
  constructor(private readonly databaseService: DatabaseService) {}
  async create(email: string, password: string): Promise<User> {
    const hashedPassword = await bcrypt.hash(password, 10);
    const result = await this.databaseService.query<User>(
      'INSERT INTO users (email, password) VALUES ($1, $2) RETURNING *',
      [email, hashedPassword],
    );
    return result[0];
  }
  async findByEmail(email: string): Promise<User | undefined> {
    const result = await this.databaseService.query<User>(
      'SELECT * FROM users WHERE email = $1',
      [email],
    );
    return result[0];
  }
}
