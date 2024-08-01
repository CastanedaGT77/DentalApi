import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import nodemailer = require('nodemailer');
import { welcomeTemplate } from './welcomeTemplate';

@Injectable()
export class EmailService implements OnModuleInit{

    private _transporter;
    private _logger: Logger;

    constructor(){
        this._logger = new Logger(EmailService.name);
        this._transporter = nodemailer.createTransport({
            host: "smtp.gmail.com",
            port: 465,
            secure: true,
            auth: {
                user: "castanedagt77@gmail.com",
                pass: "jcbp lhbi uxca yduy"
            }
        })
    }

    async onModuleInit() {
        try {
            await this._transporter.verify();
        }
        catch(error){
            this._logger.error("Could not create email provider:", error);
            throw new Error("Could not create email provider");
        }
    }

    async sendWelcome(companyName: string, fullName: string, email: string, username: string, password: string, url: string){
        try {
            await this._transporter.sendMail({
                from: "castanedagt77@gmail.com",
                to: email,
                subject: "Bienvenida - Clínica Dental",
                text: "",
                html: welcomeTemplate(companyName, fullName, username, password, url)
            })
        }
        catch(error){
            console.log("ERROR SENDING EMAIL:", error);   
        }
    }
};