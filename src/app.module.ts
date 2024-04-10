import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserData } from './user/models/data/UserData';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: "mysql",
      host: "localhost",
      port: 3306,
      username: "root",
      password: "Andromeda97as..",
      database: "clinic",
      entities: [UserData],
      synchronize: false
    }),
    AuthModule, 
    UserModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
