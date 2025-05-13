import { Module } from '@nestjs/common';
import { TodosController } from './todos.controller';
import { TodosService } from './todos.service';
import { UsersModule } from '../users/users.module'; // Import UsersModule to access user-related functionalities
import { DatabaseService } from 'src/database/database.service';

@Module({
  imports: [UsersModule],
  controllers: [TodosController],
  providers: [TodosService, DatabaseService],
})
export class TodosModule {}
