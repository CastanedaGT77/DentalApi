import { Content, StyleDictionary, TDocumentDefinitions } from "pdfmake/interfaces";

export const tableReport = (title: string) : TDocumentDefinitions => {
    
    const styles: StyleDictionary = {
        header: {
            fontSize: 22,
            bold: false,
            alignment: "center",
            margin: [0,0,0,50]
        }
    }

    const logo : Content = {
        image: 'src/report/images/logo.png',
        width: 250,
        height: 100
    }

    const currentDate = new Date().toLocaleDateString();

    const patients = [
        { name: "Carlos", lastName: "Rodriguez", phoneNumber: "55582930", branch: "Sucursal A" },
        { name: "Maria", lastName: "Gonzalez", phoneNumber: "55582931", branch: "Sucursal B" },
        { name: "Juan", lastName: "Perez", phoneNumber: "55582932", branch: "Sucursal A" },
        { name: "Ana", lastName: "Ramirez", phoneNumber: "55582933", branch: "Sucursal C" },
        { name: "Luis", lastName: "Martinez", phoneNumber: "55582934", branch: "Sucursal A" },
        { name: "Pedro", lastName: "Fernandez", phoneNumber: "55582935", branch: "Sucursal B" },
        { name: "Laura", lastName: "Hernandez", phoneNumber: "55582936", branch: "Sucursal C" },
        { name: "Sofia", lastName: "Lopez", phoneNumber: "55582937", branch: "Sucursal A" },
        { name: "Daniel", lastName: "Garcia", phoneNumber: "55582938", branch: "Sucursal B" },
        { name: "Jorge", lastName: "Sanchez", phoneNumber: "55582939", branch: "Sucursal A" },
        { name: "Isabel", lastName: "Morales", phoneNumber: "55582940", branch: "Sucursal C" },
        { name: "Carla", lastName: "Gutierrez", phoneNumber: "55582941", branch: "Sucursal B" },
        { name: "Adrian", lastName: "Castillo", phoneNumber: "55582942", branch: "Sucursal A" },
        { name: "Monica", lastName: "Ortiz", phoneNumber: "55582943", branch: "Sucursal C" },
        { name: "Andres", lastName: "Silva", phoneNumber: "55582944", branch: "Sucursal A" },
        { name: "Patricia", lastName: "Cruz", phoneNumber: "55582945", branch: "Sucursal B" },
        { name: "Raul", lastName: "Ibarra", phoneNumber: "55582946", branch: "Sucursal C" },
        { name: "Jessica", lastName: "Mejia", phoneNumber: "55582947", branch: "Sucursal A" },
        { name: "Oscar", lastName: "Rojas", phoneNumber: "55582948", branch: "Sucursal B" },
        { name: "Victoria", lastName: "Navarro", phoneNumber: "55582949", branch: "Sucursal C" }
    ];
    
    
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
                    text: "Generado por: Edvin Calderón - 05/09/2024 12:12"
                }
            ]
        },
        content: [
            { text: 'Reporte de inventario', style: 'header' },
            {
                table: {
                headerRows: 1,
                body: [
                    ['Nombre','Apellido', 'Número', 'Sucursal'],
                    ...patients.map(patient => [patient.name, patient.lastName, patient.phoneNumber, patient.branch]),
                ],
                },
                layout: 'lightHorizontalLines',
            },
        ],
    }
    return docDefinition;
}