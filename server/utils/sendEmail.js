import nodemailer from 'nodemailer';

export const sendEmail = async ({ to, subject, html, attachments }) => {
  // Vérification de la configuration des variables d'environnement
  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
    throw new Error('Email configuration missing. Please set EMAIL_USER and EMAIL_PASS.');
  }

  const transporter = nodemailer.createTransport({
    service: 'gmail', // Utilisation de Gmail, mais vous pouvez également utiliser d'autres services
    auth: {
      user: process.env.EMAIL_USER, // Adresse e-mail de l'expéditeur
      pass: process.env.EMAIL_PASS  // Mot de passe ou mot de passe d'application Gmail
    }
  });

  try {
    const mailOptions = {
      from: `"HSE Patrol" <${process.env.EMAIL_USER}>`, // Adresse de l'expéditeur
      to, // Destinataire
      subject, // Sujet de l'e-mail
      html, // Contenu HTML de l'e-mail
      attachments // Pièces jointes (optionnel)
    };

    // Envoi de l'e-mail
    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent: ' + info.response);
    return info;
  } catch (error) {
    console.error('Error sending email:', error);
    throw new Error('Failed to send email. Please try again later.');
  }
};
