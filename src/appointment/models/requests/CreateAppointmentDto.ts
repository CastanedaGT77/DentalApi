import { IsDateString, IsNumber, IsString } from "class-validator";

export class CreateAppointmentDto {
    
    @IsNumber()
    public patientId: number;
    
    @IsNumber()
    public branchId: number;
    
    @IsNumber()
    public assignedUser: number;
    
    @IsDateString()
    public appointmentDate: Date;
    
    @IsString()
    public observations: string;
    
    @IsNumber()
    public startHour: number;
    
    @IsNumber()
    public endHour: number;
}