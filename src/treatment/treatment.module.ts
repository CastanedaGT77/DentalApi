import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TreatmentData } from './models/data/TreatmentData';
import { TreatmentDetailsData } from './models/data/TreatmentDetailsData';
import { TreatmentController } from './treatment.controller';
import { TreatmentService } from './treatment.service';
import { TreatmentTypeData } from 'src/treatmentType/models/data/TreatmentTypeData';
import { PatientData } from 'src/patient/models/data/PatientData';

@Module({
  imports: [TypeOrmModule.forFeature([TreatmentData, TreatmentDetailsData, TreatmentTypeData, PatientData])],
  controllers: [TreatmentController],
  providers: [TreatmentService]
})
export class TreatmentModule {}