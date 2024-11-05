import { IsDateString, IsNumber, IsString, Matches } from "class-validator";

export class CreateAppointmentDto {
    
    @IsNumber()
    public patientId: number;
    
    @IsNumber()
    public branchId: number;
    
    @IsNumber()
    public assignedUser: number;
    
    @Matches("^(0[1-9]|[12][0-9]|3[01])/(0[1-9]|1[0-2])/(\\d{4})$")
    public appointmentDate: Date;
    
    @IsString()
    public reason: string;
    
    @Matches(new RegExp("^(?:[01]?\\d|2[0-3])(?::[0-5]\\d){1,2}$"))
    public startHour: string;
    
    @Matches(new RegExp("^(?:[01]?\\d|2[0-3])(?::[0-5]\\d){1,2}$"))
    public endHour: string;
}