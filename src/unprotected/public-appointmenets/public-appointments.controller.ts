import { Controller, Get } from "@nestjs/common";

@Controller('public-appointments')
export class PublicAppointmentsController {

    // Get all appointments by user depending on filters
    @Get()
    public test(){
        return {code: 200, data: "Hola"};
    }
}