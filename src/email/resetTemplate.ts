const resetTemplate = (companyName, fullName, username, password, url) => (`
    <!DOCTYPE html>
    <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Reinicio de contraseña - ${companyName}</title>
            <style>
            body {
                font-family: Arial, sans-serif;
                background-color: #f4f4f4;
                margin: 0;
                padding: 20px;
            }
            .container {
                max-width: 600px;
                margin: 0 auto;
                background-color: #ffffff;
                padding: 20px;
                border-radius: 8px;
                box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
            }
            h1 {
                color: #333333;
            }
            p {
                color: #555555;
                line-height: 1.6;
            }
            .button {
                display: inline-block;
                padding: 10px 20px;
                font-size: 16px;
                color: #ffffff;
                background-color: #007bff;
                text-decoration: none;
                border-radius: 5px;
            }
            .footer {
                font-size: 12px;
                color: #888888;
                text-align: center;
                margin-top: 20px;
            }
            </style>
        </head>
        <body>
            <div class="container">
                <h1>Reinicio de contraseña, ${fullName}!</h1>
                <p>Tu contraseña ha sido reiniciada correctamente.</p>
                <p><strong>Contraseña:</strong> ${password}</p>
                <p>Para iniciar sesión puedes dirigirte al siguiente enlace:</p>
                <a href="${url}" class="button">Iniciar Sesión</a>
                <p>Si tienes alguna duda o inconveniente no dudes en comunicarte con nuestro equipo de soporte al siguiente correo: soporte@gmail.com.</p>
                <p>Saludos</p>
                <div class="footer">&copy; Nuestra Compañia. Todos los derechos reservados.</div>
            </div>
        </body>
    </html>
`);

export {resetTemplate};