import { Content, StyleDictionary, TDocumentDefinitions } from "pdfmake/interfaces";

export const paymentReceiptDoc = (data: any): TDocumentDefinitions => {

    console.log("data for receipt:", data);

    const receipt = {
        name: data.name || "",
        phoneNumber: data.phoneNUmber || "",
        address: data.address || "",
        amountPaid: 100
    }

    const patient = {
        firstName: data?.patient?.firstName || "",
        lastName: data?.patient?.lastName || "",
        phoneNumber: data?.patient?.phoneNumber || "",
        email: data?.patient?.email || ""
    };

    const styles: StyleDictionary = {
        header: {
            fontSize: 22,
            alignment: "center",
            margin: [0, 0, 0, 50]
        },
        subTitle: {
            fontSize: 16,
            alignment: "center",
            margin: [0, 0, 0, 50]
        },
        tableHeader: {
            fontSize: 12,
            color: 'black'
        },
        fieldLabel: {
            margin: [0, 5, 0, 5]
        }
    };

    const logo: Content = {
        image: 'src/report/images/logo.png',  // Replace this with a base64 image if necessary
        width: 150,
        height: 50
    };

    const currentDate = new Date().toLocaleDateString();
    const currentTime = new Date().toLocaleTimeString();

    const details = data?.paymentDetails;

    const docDefinition: TDocumentDefinitions = {
        pageMargins: [40, 60, 40, 60],

        header: {
            columns: [
                logo,
                {
                    text: `Generado: ${currentDate} ${currentTime}`,
                    alignment: 'right',
                    margin: [0, 20, 0, 0]
                }
            ]
        },

        content: [
            { text: 'Recibo de pago', style: 'header' },

            { text: 'Información de recibo', style: 'subTitle' },
            {
                table: {
                    widths: ['auto', '*', 'auto', '*'],  // Adjust width proportions
                    body: [
                        [
                            { text: 'Nombre:', style: 'fieldLabel' },
                            { text: receipt.name, style: 'fieldLabel' },
                            { text: 'Teléfono:', style: 'fieldLabel' },
                            { text: receipt.phoneNumber, style: 'fieldLabel' }
                        ],
                        [
                            { text: 'Dirección:', style: 'fieldLabel' },
                            { text: receipt.address, style: 'fieldLabel'},
                            { text: 'Monto pagado:', style: 'fieldLabel' },
                            { text: receipt.amountPaid, style: 'fieldLabel' }
                        ]
                    ]
                },
                layout: 'noBorders',  // Remove borders for a cleaner look
                margin: [0, 10, 0, 30]  // Add some margin below the section
            },
            { text: 'Información de paciente', style: 'subTitle' },
            {
                table: {
                    widths: ['auto', '*', 'auto', '*'],  // Adjust width proportions
                    body: [
                        [
                            { text: 'Nombre:', style: 'fieldLabel' },
                            { text: patient.firstName, style: 'fieldLabel' },
                            { text: 'Apellido:', style: 'fieldLabel' },
                            { text: patient.lastName, style: 'fieldLabel' }
                        ],
                        [
                            { text: 'Número:', style: 'fieldLabel' },
                            { text: patient.phoneNumber, style: 'fieldLabel' },
                            { text: 'Correo electrónico:', style: 'fieldLabel' },
                            { text: patient.email, style: 'fieldLabel' }
                        ]
                    ]
                },
                layout: 'noBorders',  // Remove borders for a cleaner look
                margin: [0, 10, 0, 30]  // Add some margin below the section
            },
            { text: 'Elementos pagados', style: 'subTitle' },
            {
                table: {
                    headerRows: 1,
                    widths: ['*', '*', '*', '*'],
                    body: [
                        [
                            { text: 'Elemento', style: 'tableHeader' },
                            { text: 'Cantidad pagada', style: 'tableHeader' },
                            { text: 'Pieza', style: 'tableHeader' }
                        ],
                        ...details.map(detail => [
                            detail?.treatmentDetail?.treatmentType?.name,
                            detail?.amount,
                            detail?.treatmentDetail?.piece
                        ])
                    ]
                },
                layout: 'lightHorizontalLines',
            }
        ],

        footer: function (currentPage, pageCount) {
            return {
                text: `Página ${currentPage} de ${pageCount}`,
                alignment: 'center',
                margin: [0, 20, 0, 0]
            };
        },

        styles: styles
    };

    return docDefinition;
};
