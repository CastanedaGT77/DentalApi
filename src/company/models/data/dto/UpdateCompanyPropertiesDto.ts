import { IsBoolean, IsHexColor, IsInt, IsNotEmpty, IsString } from "class-validator";

export class UpdateCompanyPropertiesDto {
    @IsString()
    @IsNotEmpty()
    logo: string;
  
    @IsString()
    @IsNotEmpty()
    header: string;
  
    @IsString()
    @IsNotEmpty()
    footer: string;
  
    @IsHexColor()
    primaryColor: string;
  
    @IsHexColor()
    secondaryColor: string;
  
    @IsHexColor()
    primaryButtonColor: string;
  
    @IsHexColor()
    secondaryButtonColor: string;

    @IsBoolean()
    @IsNotEmpty()
    allowMessageSending: boolean;

    @IsString()
    @IsNotEmpty()
    waLink: string;

    @IsString()
    @IsNotEmpty()
    igLink: string;

    @IsString()
    @IsNotEmpty()
    fbLink: string;
}