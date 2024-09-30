import { Global, Module } from "@nestjs/common/decorators";
import { FilesController } from "./files.controller";
import { TypeOrmModule } from "@nestjs/typeorm";
import { FileCategoryData } from "./models/data/FileCategoryData";
import { FileData } from "./models/data/FileData";
import { FileService } from "./files.service";

@Global()
@Module({
    imports: [TypeOrmModule.forFeature([FileCategoryData, FileData])],
    controllers: [FilesController],
    providers: [FileService]
})
export class FilesModule {}