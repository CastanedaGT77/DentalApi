import { Module } from "@nestjs/common";
import { NewData } from "./models/data/NewsData";
import { NewsController } from "./news.controller";
import { NewsService } from "./news.service";
import { TypeOrmModule } from "@nestjs/typeorm";

@Module({
    imports: [TypeOrmModule.forFeature([NewData])],
    controllers: [NewsController],
    providers: [NewsService]
})
export class NewsModule {}