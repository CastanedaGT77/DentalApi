import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserData } from 'src/user/models/data/UserData';

@Module({
  imports: [TypeOrmModule.forFeature([UserData])],
  controllers: [AuthController],
  providers: [AuthService]
})
export class AuthModule {}
