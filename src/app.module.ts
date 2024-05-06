import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserData } from './user/models/data/UserData';
import { PatientData } from './patient/models/data/PatientData';
import { PatientModule } from './patient/patient.module';
import { IllnessDetailsData } from './illnessDetail/models/data/IllnessDetailData';
import { IllnessDetailModule } from './illnessDetail/illnessDetail.module';
import { TreatmentTypeModule } from './treatmentType/treatmentType.module';
import { TreatmentTypeData } from './treatmentType/models/data/TreatmentTypeData';
import { RoleData } from './roles/models/data/RoleData';
import { PermissionData } from './roles/models/data/PermissionData';
import { RolePermissionData } from './roles/models/data/RolePermissionData';
import { RolesModule } from './roles/roles.module';
import { TreatmentData } from './treatment/models/data/TreatmentData';
import { TreatmentDetailsData } from './treatment/models/data/TreatmentDetailsData';
import { TreatmentModule } from './treatment/treatment.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: "mysql",
      host: "localhost",
      port: 3306,
      username: "root",
      password: "Andromeda97as..",
      database: "clinic",
      entities: [
        PermissionData,
        RoleData,
        RolePermissionData,
        UserData, 
        IllnessDetailsData, 
        PatientData, 
        TreatmentTypeData,
        TreatmentData,
        TreatmentDetailsData
      ],
      dropSchema: false,
      synchronize: false
    }),
    RolesModule,
    AuthModule, 
    UserModule,
    PatientModule,
    IllnessDetailModule,
    TreatmentTypeModule,
    TreatmentModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
