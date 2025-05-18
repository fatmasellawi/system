import Visitor from '../models/visitorModel.js';
import winston from 'winston';
import nodemailer from 'nodemailer';



const logger = winston.createLogger({
  transports: [
    new winston.transports.Console({ level: 'info' }),
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
  ],
});
const validationVisitData = ({ visitorName, department, purpose, visitDate, visitorEmail }) => {
  if (!visitorName || !department || !purpose || !visitDate || !visitorEmail) {
    return { valid: false, message: 'obligatoire.' };
  }
  return { valid: true };
};


export const createVisit = async (req, res) => {
  const { visitorName, department, purpose, visitDate, visitorEmail } = req.body;


  const firePermit = req.body.firePermit === 'true' || req.body.firePermit === 'on';
  const workPermit = req.body.workPermit === 'true' || req.body.workPermit === 'on';
  const validation = validationVisitData({
    visitorName, department, purpose, visitDate, visitorEmail,
    
  });
  if (!validation.valid) {
    return res.status(400).json({ success: false, message: validation.message });

  }

  try {
    const newVisit = new Visitor({
      visitorName, department, purpose, visitDate, visitorEmail,
      firePermit,
      workPermit
    });
    await newVisit.save();
    logger.info(`Visit enregistre avec succes`);

    const recipient = visitorEmail;
    const EMAIL_USER = process.env.EMAIL_USER;
    const EMAIL_PASS = process.env.EMAIL_PASS;

    if (!recipient) {
      logger.warn(`❌ Aucun destinataire email défini.`);
      return res.status(400).json({
        success: false,
        message: `Àucun email defini pour cet visit:$visitorEmail`

      });
    }

    if (!EMAIL_USER || !EMAIL_PASS) {
      logger.error(' ❌ EMAIL_USER ou EMAIL_PASS non définis.');
      return res.status(500).json({
        success: false,
        message: 'Erreur de configuration email . ',
      });
    }


    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: { user: EMAIL_USER, pass: EMAIL_PASS },

    });

    const mailOptions = {
      from: `"System Visit <${EMAIL_USER}>`,
      to: recipient,
      subject: `New visit `,
      html: `
  <h2>Hello ${visitorName},</h2>
<ul>
<li>Your visit request has been registered. Here are the details :</li>

<li>👤 Manager : ${visitorName}</li>
<li>🏢 Département : ${department}</li>
<li>🎯 Objet : ${purpose}</li>
<li>📅 Date : ${new Date(visitDate).toLocaleDateString()}</li>
 <li>🔥 Fire Permi : ${firePermit ? 'Oui' : 'Non'}</li>
 <li>🛠️ Work Permi : ${workPermit ? 'Oui' : 'Non'}</li>
        </ul>
        <p>Thank You,<br>Manager</p>
`,
    };
    await transporter.sendMail(mailOptions);
    logger.info(`Email envoyee a ${recipient}`);
    res.status(201).json({ success: true, message: 'visit ajouter . ', data: newVisit });


  } catch (err) {
    logger.error(`❌ Erreur création patrouille : ${err.message}`);
    res.status(500).json({ success: false, message: 'Erreur serveur.', error: err.message });
  }
};