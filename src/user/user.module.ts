import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserData } from './models/data/UserData';

@Module({
  imports: [TypeOrmModule.forFeature([UserData])],
  controllers: [UserController],
  providers: [UserService]
})
export class UserModule {}
