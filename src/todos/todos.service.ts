import { Injectable } from '@nestjs/common';
import { DatabaseService } from 'src/database/database.service';
import { Todo } from './todo.entity';
import { CreateTodoDto } from './dtos/create-todo.dto';
import { UpdateTodoDto } from './dtos/update-todo.dto';
@Injectable()
export class TodosService {
  constructor(private readonly databaseService: DatabaseService) {}

  async create(todo: CreateTodoDto, userId: number): Promise<Todo> {
    const { title, description, status } = todo;
    const sql = `INSERT INTO todos (title, description, status, user_id)
                 VALUES ($1, $2, $3, $4) RETURNING *`;
    const params = [title, description, status, userId];
    const result = await this.databaseService.query<Todo>(sql, params);
    return result[0];
  }
  async findAll(userId: number): Promise<Todo[]> {
    const sql = 'SELECT * FROM todos WHERE user_id = $1';
    const result = await this.databaseService.query<Todo>(sql, [userId]);
    return result;
  }

  async update(
    id: number,
    updateTodoDto: UpdateTodoDto,
    userId: number,
  ): Promise<Todo> {
    const { title, description, status } = updateTodoDto;
    const sql = `UPDATE todos
                 SET title = $1, description = $2, status = $3
                 WHERE id = $4 AND user_id = $5
                 RETURNING *`;
    const params = [title, description, status, id, userId];
    const result = await this.databaseService.query<Todo>(sql, params);
    return result[0];
  }
  async delete(id: number, userId: number): Promise<void> {
    const sql = 'DELETE FROM todos WHERE id = $1 AND user_id = $2';
    await this.databaseService.query(sql, [id, userId]);
  }
}
