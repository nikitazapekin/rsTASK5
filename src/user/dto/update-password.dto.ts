import { ApiProperty } from '@nestjs/swagger';
import { IsString, MinLength } from 'class-validator';

export class UpdatePasswordDto {
  @ApiProperty()
  @IsString()
  @MinLength(1)
  oldPassword: string;

  @ApiProperty()
  @IsString()
  @MinLength(1)
  newPassword: string;
}
