import { IsDateString, IsNumber, IsString } from "class-validator";

export class CreateAppointmentDto {
    @IsNumber()
    public id: number;
    
    @IsNumber()
    public patientId: number;
    
    @IsNumber()
    public branchId: number;
    
    @IsNumber()
    public assignedUser: number;
    
    @IsDateString()
    public appointmentDate: Date;
    
    public observations: string;
    
    @IsNumber()
    public startHour: number;
    
    public endHour: number;
}