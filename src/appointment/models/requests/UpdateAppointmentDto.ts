import { IsDateString, IsNumber, IsString, Matches } from "class-validator";

export class UpdateAppointmentDto {
    
    @IsNumber()
    appointmentId: number;

    @IsNumber()
    public patientId: number;
    
    @IsNumber()
    public branchId: number;
    
    @IsNumber()
    public assignedUser: number;
    
    @IsString()
    public appointmentDate: Date;
    
    @IsString()
    public observations: string;
    
    @Matches(new RegExp("^(?:[01]?\\d|2[0-3])(?::[0-5]\\d){1,2}$"))
    public startHour: string;
    
    @Matches(new RegExp("^(?:[01]?\\d|2[0-3])(?::[0-5]\\d){1,2}$"))
    public endHour: string;
}