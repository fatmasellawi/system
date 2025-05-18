import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import User from '../models/userModel.js';
import nodemailer from 'nodemailer';

// Transporteur Nodemailer
const transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});

// Génération du code d'activation
const generateActivationCode = (length = 25) =>
    Array.from({ length }, () =>
        '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'[Math.floor(Math.random() * 62)]
    ).join('');

// REGISTER
const register = async (req, res) => {
    try {
        let { email, password, role } = req.body;
        email = email.trim();
        password = password.trim();

        // Validation des champs
        if (!email || !password || !role) {
            return res.status(400).json({ message: "Tous les champs sont requis." });
        }

        const emailRegex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({ message: "Format d'email invalide." });
        }

        if (password.length < 8) {
            return res.status(400).json({ message: "Mot de passe trop court (min 8 caractères)." });
        }

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(409).json({ message: "Utilisateur déjà existant." });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const activationCode = generateActivationCode();

        const newUser = new User({
            email,
            password: hashedPassword,
            role,
            ActivationCode: activationCode,
            isActive:true, // L'utilisateur commence avec un compte non activé
        });

        await newUser.save();

        // Contenu de l'email avec backticks pour l'HTML
        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: email,
            subject: "Activating your account",
            html: `
                <h2>Welcome !</h2>
                <p>Thank you for your registration.</p>
                <p>Cliquez sur le lien ci-dessous pour activer votre compte :</p>
                <a href="${process.env.FRONTEND_URL}/activate/${activationCode}">Activate my account</a>
                <p>If you did not request this, ignore this email.</p>
            `,
        };

        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.error("Erreur envoi email:", error);
                return res.status(500).json({ message: "Registration successful, but email not sent." });
            } else {
                return res.status(201).json({ message:` Registered user. Activation email sent to ${email}. `});
            }
        });
    } catch (err) {
        console.error("Erreur inscription:", err);
        res.status(500).json({ message: "Erreur serveur." });
    }
};

// LOGIN
const login = async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(403).json({ message: "Email ou mot de passe incorrect." });
        }

        if (!user.isActive) {
            return res.status(403).json({ message: "Your account is not yet activated." });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
            return res.status(403).json({ message: "Incorrect email or password." });
        }

        // Générer le token JWT...
        const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, {
            expiresIn: '1d',
        });

        res.status(200).json({
            message: "Connection successful",
            token,
            user: {
                id: user._id,
                role: user.role,
                email: user.email,
            },
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Erreur serveur." });
    }
};

// ACTIVATE ACCOUNT
const activateAccount = async (req, res) => {
    try {
        const { code } = req.params; // Récupère le code d'activation de l'URL

        // Recherche l'utilisateur avec le code d'activation
        const user = await User.findOne({ ActivationCode: code });
        if (!user) {
            return res.status(400).json({ message: "Invalid activation code." });
        }

        // Si le compte est déjà activé
        if (user.isActive) {
            return res.status(400).json({ message: "The account is already activated." });
        }

        // Mise à jour de l'utilisateur
        user.isActive = true;
        user.ActivationCode = null;  // Retirer le code d'activation
        await user.save();

        res.status(200).json({ message: "Account successfully activated." });
    } catch (err) {
        console.error("Activation error:", err);
        res.status(500).json({ message: "Server error." });
    }
};

export { register, login, activateAccount };
