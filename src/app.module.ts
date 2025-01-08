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
import { RolesModule } from './roles/role.module';
import { TreatmentData } from './treatment/models/data/TreatmentData';
import { TreatmentDetailsData } from './treatment/models/data/TreatmentDetailsData';
import { TreatmentModule } from './treatment/treatment.module';
import { BranchModule } from './branch/branch.module';
import { BranchData } from './branch/models/data/BranchData';
import { AppointmentModule } from './appointment/appointment.module';
import { AppointmentData } from './appointment/models/data/AppointmentData';
import { PaymentHeaderData } from './payment/models/data/PaymentHeaderData';
import { PaymentDetailData } from './payment/models/data/PaymentDetailData';
import { PaymentTypeData } from './payment/models/data/PaymentTypeData';
import { CompanyData } from './company/models/data/CompanyData';
import { PropertiesData } from './company/models/data/PropertiesData';
import { CompanyModule } from './company/company.module';
import { EmailService } from './email/email.service';
import { PaymentModule } from './payment/payment.module';
import { ReportModule } from './report/report.module';
import { FilesModule } from './files/files.module';
import { FileData } from './files/models/data/FileData';
import { FileCategoryData } from './files/models/data/FileCategoryData';
import { DashboardModule } from './dashboard/dashboard.module';
import { AppointmentDetailsData } from './appointment/models/data/AppointmentDetailsData';
import { UnprotectedModule } from './unprotected/unprotected.module';
import { PatientTypeData } from './patient/models/data/PatientTypeData';
import { NewsModule } from './news/news.module';
import { NewData } from './news/models/data/NewsData';

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
        CompanyData,
        PropertiesData,
        BranchData,
        PermissionData,
        RoleData,
        RolePermissionData,
        UserData, 
        IllnessDetailsData, 
        PatientTypeData,
        PatientData, 
        TreatmentTypeData,
        TreatmentData,
        TreatmentDetailsData,
        AppointmentData,
        AppointmentDetailsData,
        PaymentTypeData,
        PaymentHeaderData,
        PaymentDetailData,
        FileData,
        FileCategoryData,
        NewData
      ],
      dropSchema: false,
      synchronize: false
    }),
    AuthModule, 
    DashboardModule,
    BranchModule,
    RolesModule,
    UserModule,
    CompanyModule,
    PatientModule,
    IllnessDetailModule,
    TreatmentTypeModule,
    TreatmentModule,
    AppointmentModule,
    PaymentModule,
    ReportModule,
    FilesModule,
    NewsModule,
    UnprotectedModule
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
