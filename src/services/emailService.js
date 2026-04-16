const nodemailer = require('nodemailer');

let transporter;

async function createTransporter() {
    if (transporter) return transporter;

    const testAccount = await nodemailer.createTestAccount();

    transporter = nodemailer.createTransport({
        host: testAccount.smtp.host,
        port: testAccount.smtp.port,
        secure: testAccount.smtp.secure,
        auth: {
            user: testAccount.user,
            pass: testAccount.pass
        }
    });

    return transporter;
}

async function sendEmail({ to, subject, html }) {
    const transport = await createTransporter();

    const info = await transport.sendMail({
        from: '"Sistema Dashboard" <no-reply@sistema.com>',
        to,
        subject,
        html
    });

    console.log('Email enviado (preview):');
    console.log(nodemailer.getTestMessageUrl(info));
}

module.exports = { sendEmail };
