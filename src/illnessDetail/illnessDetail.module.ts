import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { IllnessDetailsData } from '../illnessDetail/models/data/IllnessDetailData';
import { IllnessDetailService } from './illnessDetail.service';
import { IllnessDetailController } from './illnessDetail.controller';

@Module({
  imports: [TypeOrmModule.forFeature([IllnessDetailsData])],
  controllers: [IllnessDetailController],
  providers: [IllnessDetailService]
})
export class IllnessDetailModule {}