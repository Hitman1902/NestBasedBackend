import { IsString, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
export class CreateTodoDto {
  @IsString()
  @MinLength(1)
  @ApiProperty({ example: 'Todo' })
  title: string;

  @IsString()
  @MinLength(1)
  @ApiProperty({ example: 'Description for todo list ' })
  description: string;

  @IsString()
  @ApiProperty({ example: 'completed || pending || inprogress || todo' })
  status: string;
}
