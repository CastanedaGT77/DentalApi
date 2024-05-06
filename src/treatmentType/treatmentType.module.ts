import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TreatmentTypeService } from './treatmentType.service';
import { TreatmentTypeController } from './treatmentType.controller';
import { TreatmentTypeData } from './models/data/TreatmentTypeData';

@Module({
  imports: [TypeOrmModule.forFeature([TreatmentTypeData])],
  controllers: [TreatmentTypeController],
  providers: [TreatmentTypeService]
})
export class TreatmentTypeModule {}