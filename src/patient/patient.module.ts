import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PatientService } from './patient.service';
import { PatientData } from './models/data/PatientData';
import { PatientController } from './patient.controller';
import { IllnessDetailsData } from '../illnessDetail/models/data/IllnessDetailData';
import { EmailService } from 'src/email/email.service';
import { PatientTypeData } from './models/data/PatientTypeData';

@Module({
  imports: [TypeOrmModule.forFeature([PatientTypeData, IllnessDetailsData, PatientData, IllnessDetailsData])],
  controllers: [PatientController],
  providers: [PatientService, EmailService]
})
export class PatientModule {}