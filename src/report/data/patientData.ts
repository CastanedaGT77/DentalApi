import { Content, StyleDictionary, TDocumentDefinitions } from "pdfmake/interfaces";
import { PatientData } from "src/patient/models/data/PatientData";
import { TreatmentData } from "src/treatment/models/data/TreatmentData";

export const patientData = (patient: PatientData, treatments: Array<TreatmentData>) : TDocumentDefinitions => {
    
    const styles: StyleDictionary = {
        header: {
            fontSize: 22,
            bold: false,
            alignment: "center",
            margin: [0,0,0,50]
        },
        subtitle: {
            fontSize: 16,
            bold: false,
            alignment: "left",
            margin: [0,0,0,50]
        }
    }

    const logo : Content = {
        image: 'src/report/images/logo.png',
        width: 250,
        height: 100
    }

    const currentDate = new Date().toLocaleDateString();

    const treatmentSection = treatments.map(treatment => {
        return {
            columns: [
                {
                    width: "50%",
                    text: [
                        {text: "Nombre"}, treatment.name
                    ]
                },
                {
                    width: "50%",
                    text: [
                        {text: "Descripción"}, treatment.description
                    ]
                }
            ],
            margin: [0,10,0,15]
        }
    });

    
    const docDefinition : TDocumentDefinitions = {
        // STYLES
        styles: styles,
        // MARGINS
        pageMargins: [40,60,40,60],
        // HEADER
        header: {
            columns: [
                "CLINICA", 
                "", 
                {
                    text: "Generado por: Edvin Calderón - 05/09/2024 12:20"
                }
            ]
        },
        content: [
            { text: 'Reporte General de Paciente', style: 'header' },
            {
                columns: [
                    {
                        width: '50%',
                        text: [
                            { text: 'Nombre Completo: ' },
                            `${patient.firstName} ${patient.lastName}\n\n`,
                            { text: 'Teléfono: ' },
                            `${patient.phoneNumber}\n\n`,
                            { text: 'Celular: ' },
                            `${patient.cellPhoneNumber}\n\n`,
                            { text: 'Correo Electrónico: ' },
                            `${patient.email}\n\n`,
                            { text: 'Ciudad: ' },
                            `${patient.city}\n\n`,
                            { text: 'Dirección: ' },
                            `${patient.address}\n\n`,
                            { text: 'Recomendado Por: ' },
                            `${patient.recommendedBy}\n\n`,
                            { text: 'Persona Encargada: ' },
                            `${patient.personInCharge}\n\n`,
                        ]
                    },
                    {
                        width: '50%',
                        text: [
                            { text: 'Fecha de Nacimiento: ' },
                            `${patient.birthDate.toDateString()}\n\n`,
                            { text: 'Estado Civil: ' },
                            `${patient.maritalStatus}\n\n`,
                            { text: 'Ocupación: ' },
                            `${patient.occupation}\n\n`,
                            { text: 'Médico Personal: ' },
                            `${patient.personalDoctor}\n\n`,
                            { text: 'Dentista Anterior: ' },
                            `${patient.previousDentist}\n\n`,
                            { text: 'Activo: ' },
                            `${patient.active ? 'Sí' : 'No'}\n\n`,
                            { text: 'Aprobado: ' },
                            `${patient.approved ? 'Sí' : 'No'}\n\n`,
                        ]
                    }
                ],
                margin: [0, 10, 0, 15]
            },
            { text: 'Informe de tratamientos', style: 'subtitle' }
        ],
    }
    return docDefinition;
}