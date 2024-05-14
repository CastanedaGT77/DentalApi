import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BranchData } from './models/data/BranchData';
import { BranchController } from './branch.controller';
import { BranchService } from './branch.service';

@Module({
  imports: [TypeOrmModule.forFeature([BranchData])],
  controllers: [BranchController],
  providers: [BranchService]
})
export class BranchModule {}