import { Global, Module } from "@nestjs/common/decorators";
import { FilesController } from "./files.controller";
import { TypeOrmModule } from "@nestjs/typeorm";
import { FileCategoryData } from "./models/data/FileCategoryData";
import { FileData } from "./models/data/FileData";
import { FileService } from "./files.service";
import { FilesCategoryController } from "./fileCategory.controller";
import { FileCategoryService } from "./filesCategory.service";
import { PatientData } from "src/patient/models/data/PatientData";
import { UserData } from "src/user/models/data/UserData";

@Global()
@Module({
    imports: [TypeOrmModule.forFeature([FileCategoryData, FileData, PatientData, UserData])],
    controllers: [FilesController, FilesCategoryController],
    providers: [FileService, FileCategoryService]
})
export class FilesModule {}