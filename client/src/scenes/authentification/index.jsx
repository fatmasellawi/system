import React, { useState } from 'react';
import '../../style/login.css';
import {
  Box,
  Button,
  TextField,
  Typography,
  Paper,
  ToggleButton,
  ToggleButtonGroup,
  Alert,
  MenuItem,
} from '@mui/material';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useUserContext } from '../../context/UserContext';

// Import de la vidéo
import backgroundVideo from '../../assets/videos/safety.mp4';
import backgroundImage from '../../assets/images/background.jpg'; // Correctement importer l'image aussi

const LoginRegister = () => {
  const navigate = useNavigate();
  const { setUserRole, setUserToken } = useUserContext();

  const [formData, setFormData] = useState({
    email: '',
    password: '',
    role: 'user',
  });
  const [isLogin, setIsLogin] = useState(true);
  const [message, setMessage] = useState('');
  const [alertType, setAlertType] = useState('info');
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage('');

    try {
      const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:5000'; // URL de l'API

      const response = await axios.post(
        `${apiUrl}/api/auth/${isLogin ? 'login' : 'register'}`,
        formData,
        {
          withCredentials: true,
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
          },
        }
      );

      setAlertType('success');
      setMessage(isLogin ? 'Connection réussie' : 'Inscription réussie, vérifiez votre email');

      if (isLogin) {
        const { token, user } = response.data;
        if (token && user) {
          setUserToken(token);
          setUserRole(user.role); // Vérifie que le rôle est bien dans la réponse
          setTimeout(() => navigate('/dashboard'), 1500); // Redirection après une petite attente
        } else {
          throw new Error('Token ou rôle manquant');
        }
      } else {
        setFormData({ email: '', password: '', role: 'user' });
        setIsLogin(true);
      }
    } catch (error) {
      console.error(error);
      setAlertType('error');
      setMessage(error.response?.data?.message || 'Erreur lors de la requête');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box className="login-container">
      {/* Vidéo d'arrière-plan */}
      <video 
        autoPlay 
        muted 
        loop 
        className="video-background"
        poster={backgroundImage} // Utilisation de l'import correct
      >
        <source src={backgroundVideo} type="video/mp4" />
        Votre navigateur ne supporte pas les vidéos HTML5.
      </video>

      {/* Contenu du formulaire */}
      <Paper elevation={4} className="login-content">
        <Typography variant="h5" align="center" gutterBottom sx={{ color: 'text.primary' }}>
          {isLogin ? 'Se connecter' : 'S’inscrire'}
        </Typography>

        <ToggleButtonGroup
          value={isLogin ? 'Sign in' : 'Sign up'}
          exclusive
          fullWidth
          onChange={(_, value) => {
            if (value) {
              setIsLogin(value === 'login');
              setMessage(''); // Effacer les messages précédents lorsqu'on change de mode
            }
          }}
          sx={{ mb: 2 }}
        >
          <ToggleButton value="login">Connexion</ToggleButton>
          <ToggleButton value="register">Inscription</ToggleButton>
        </ToggleButtonGroup>

        <form onSubmit={handleSubmit}>
          <TextField
            fullWidth
            label="Email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            margin="normal"
            placeholder="email@example.com"
            required
            sx={{ backgroundColor: 'rgba(255, 255, 255, 0.8)' }}
          />
          <TextField
            fullWidth
            label="Mot de passe"
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            margin="normal"
            required
            sx={{ backgroundColor: 'rgba(255, 255, 255, 0.8)' }}
          />
          {!isLogin && (
            <TextField
              select
              fullWidth
              label="Rôle"
              name="role"
              value={formData.role}
              onChange={handleChange}
              margin="normal"
              required
              sx={{ backgroundColor: 'rgba(255, 255, 255, 0.8)' }}
            >
              <MenuItem value="Admin">HSE</MenuItem>
              <MenuItem value="user">Utilisateur</MenuItem>
              <MenuItem value="manager">Responsable</MenuItem>
            </TextField>
          )}
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            sx={{ mt: 2, py: 1.5 }}
            disabled={isLoading}
          >
            {isLoading ? 'Chargement...' : isLogin ? 'Se connecter' : "S’inscrire"}
          </Button>
        </form>

        {message && (
          <Alert severity={alertType} sx={{ mt: 2 }}>
            {message}
          </Alert>
        )}
      </Paper>
    </Box>
  );
};

export default LoginRegister;
