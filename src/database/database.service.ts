import { Injectable, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Pool, PoolClient } from 'pg';

@Injectable()
export class DatabaseService implements OnModuleInit {
  private pool: Pool;

  constructor(private configService: ConfigService) {}

  async onModuleInit(): Promise<void> {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call
    this.pool = new Pool({
      host: this.configService.get<string>('DB_HOST'),
      port: Number(this.configService.get<string>('DB_PORT') || 5432),
      user: this.configService.get<string>('DB_USERNAME'),
      password: this.configService.get<string>('DB_PASSWORD'),
      database: this.configService.get<string>('DB_NAME'),
    });

    try {
      // Ensure that client is properly typed as PoolClient
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
      const client = await this.pool.connect().catch((error) => {
        console.error(
          '❌ Error while connecting to the database:',
          // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
          error.message,
        );
        throw new Error('Failed to establish database connection');
      });

      if (client) {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
        await client.query('SELECT 1'); // Test the connection
        // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
        client.release(); // Release the client back to the pool
        console.log('✅ Database connected successfully');
      } else {
        throw new Error('Database connection failed: No client returned');
      }
    } catch (error) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      console.error('❌ Database connection failed:', error.message);
      throw error; // Rethrow error to ensure app doesn't continue without DB connection
    }
  }

  async query<T = any>(sql: string, params?: any[]): Promise<T[]> {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
    const client: PoolClient = await this.pool.connect();

    try {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
      const result = await client.query(sql, params);
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      return result.rows as T[];
    } catch (err) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      console.error('❌ Query failed:', err.message);
      throw err; // Propagate the error for handling at higher levels
    } finally {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
      client.release(); // Release the client to the pool
    }
  }
}
