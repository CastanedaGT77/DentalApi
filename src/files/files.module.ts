import { Global, Module } from "@nestjs/common/decorators";
import { FilesController } from "./files.controller";

@Global()
@Module({
    controllers: [FilesController],
    providers: []
})
export class FilesModule {}