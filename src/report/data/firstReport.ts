import { Content, StyleDictionary, TDocumentDefinitions } from "pdfmake/interfaces";

export const firstReport = (title: string) : TDocumentDefinitions => {
    
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
    
    const docDefinition : TDocumentDefinitions = {
        // STYLES
        styles: styles,
        // MARGINS
        pageMargins: [40,60,40,60],
        // HEADER
        header: {
            columns: [
                logo, 
                "", 
                {
                    text: "Generado por: Edvin Calderón - 05/09/2024 12:12"
                }
            ]
        },
        content: [
            {
                text: title,
                style: 'header'
            }
        ]
    }
    return docDefinition;
}