import Mailgen from "mailgen";
import nodemailer from "nodemailer";

const sendEmail = async (options) => {
    const mailgenerator = new Mailgen({
        theme: "default",
        product: {
            name: "Task Manager", 
            link: "https://taskmanager.com"
        }
    })

    const emailTextual = mailgenerator.generatePlaintext(options.mailgenContent)

    const emailHTML = mailgenerator.generate(options.mailgenContent)

    const transporter = nodemailer.createTransport({
        host: process.env.MAILTRAP_SMTP_HOST,
        port: process.env.MAILTRAP_SMTP_PORT,
        auth: {
        user: process.env.MAILTRAP_SMTP_USER,
        pass: process.env.MAILTRAP_SMTP_PASS,
        }
    })

    const mail = {
        from: "Pranjalraj0404@gmail.com",
        to: options.email,
        subject: options.subject,
        text:  emailTextual,
        html: emailHTML,
    }

    try {
        await transporter.sendMail(mail)
    } catch (error) {
        console.error("Email service failed , check info again")
        console.error("Error:", error)
    }
}


const emailVerification = (username, verificationUrl) => {
    return {
        body: {
            name: username,
            intro: "welcome to backend email verification using mailgen ",
            action: {
                instructions: "TO GET STARTED CLICK HERE PLIJ",
                button: {
                color: '#5e5701ff',
                text: 'Confirm your account',
                link: verificationUrl
            },
            },
            outro: "Need help, or have questions? Just reply to this email, we'd love to help.",
        }
    }
}

const ForgetPasswordMailGeneration = (username, passwordrestUrl) => {
    return {
        body: {
            name: username,
            intro: "We got a request to change your password ",
            action: {
                instructions: "TO GET STARTED CLICK HERE PLIJ",
                button: {
                color: '#933100ff',
                text: 'Reset password',
                link: passwordrestUrl,
            },
            },
            outro: "Need help, or have questions? Just reply to this email, we'd love to help.",
        }
    }
}


export {
    emailVerification,
    ForgetPasswordMailGeneration,
    sendEmail,
};