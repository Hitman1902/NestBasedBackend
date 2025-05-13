import {
  Controller,
  Post,
  Get,
  Put,
  Delete,
  Param,
  Body,
  UseGuards,
  Req,
  ParseIntPipe,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { TodosService } from './todos.service';
import { CreateTodoDto } from './dtos/create-todo.dto';
import { UpdateTodoDto } from './dtos/update-todo.dto';
import { JwtPayload } from '../auth/jwt-payload.interface'; // Import JwtPayload
import {
  ApiBody,
  ApiResponse,
  ApiBearerAuth,
  ApiTags,
  ApiOperation,
} from '@nestjs/swagger';
@ApiTags('Todo')
@Controller('todos')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class TodosController {
  constructor(private readonly todosService: TodosService) {}

  @Post()
  @ApiOperation({ summary: 'create a new Todo item ' })
  @ApiBody({ type: CreateTodoDto })
  @ApiResponse({ status: 200, description: ' created successfully' })
  @ApiResponse({ status: 400, description: 'Failed in creating it' })
  create(
    @Body() createTodoDto: CreateTodoDto,
    @Req() req: { user: JwtPayload },
  ) {
    // Extract the userId from req.user and pass it to the service
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const userId = req.user.id;
    return this.todosService.create(createTodoDto, userId);
  }

  @Get()
  @ApiOperation({ summary: 'Fetched all the tasks of Logged in user' })
  @ApiResponse({ status: 200, description: 'Fetched Successfully' })
  @ApiResponse({ status: 400, description: 'Unauthorized ' })
  findAll(@Req() req: { user: JwtPayload }) {
    // Extract the userId from req.user and pass it to the service
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const userId = req.user.id;
    return this.todosService.findAll(userId);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update a Todo by ID' })
  @ApiBody({ type: UpdateTodoDto })
  @ApiResponse({ status: 200, description: 'Todo updated successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Todo not found' })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateTodoDto: UpdateTodoDto,
    @Req() req: { user: JwtPayload },
  ) {
    // Extract the userId from req.user and pass it to the service
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const userId = req.user.id;
    return this.todosService.update(id, updateTodoDto, userId);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a Todo by ID' })
  @ApiResponse({ status: 200, description: 'Todo deleted successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Todo not found' })
  delete(
    @Param('id', ParseIntPipe) id: number,
    @Req() req: { user: JwtPayload },
  ) {
    // Extract the userId from req.user and pass it to the service
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const userId = req.user.id;
    return this.todosService.delete(id, userId);
  }
}
