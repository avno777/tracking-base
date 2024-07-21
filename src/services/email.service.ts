import nodemailer, { Transporter, SendMailOptions } from 'nodemailer'
import { config } from '../configs/config'
// interface EmailConfig {
//   smtp: {
//     host: string
//     port: number
//     secure: boolean
//     auth: {
//       user: string
//       pass: string
//     }
//   }
//   from: string
// }

const transport: Transporter = nodemailer.createTransport({
  host: config.mail.host,
  port: config.mail.port,
  secure: true,
  //requireTLS: true,
  auth: {
    user: config.mail.username,
    pass: config.mail.password
  },
  tls: {
    rejectUnauthorized: false // Không từ chối các chứng chỉ không hợp lệ
  },
  logger: true
})
const sendEmail = async (to: string, subject: string, emailTemplate: string): Promise<void> => {
  const options: SendMailOptions = {
    from: config.mail.email,
    to,
    subject,
    html: emailTemplate
  }
  await transport.sendMail(options)
}

export { transport, sendEmail }
