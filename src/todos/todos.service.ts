import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Todo } from './todo.entity';
import { CreateTodoDto } from '../dtos/create-todo.dto';
import { UpdateTodoDto } from '../dtos/update-todo.dto';
import { User } from '../users/user.entity';
@Injectable()
export class TodosService {
  constructor(@InjectRepository(Todo) private repo: Repository<Todo>) {}

  create(todo: CreateTodoDto, user: User) {
    const newTodo = this.repo.create({ ...todo, user });
    return this.repo.save(newTodo);
  }
  findAll(user: User) {
    return this.repo.find({ where: { user } });
  }

  update(id: number, updateTodoDto: UpdateTodoDto, user: User) {
    return this.repo.update({ id, user }, updateTodoDto);
  }
  delete(id: number, user: User) {
    return this.repo.delete({ id, user });
  }
}
