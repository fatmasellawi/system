import React, { createContext, useState, useEffect, useContext } from 'react';

// Création du contexte
const UserContext = createContext();

// Hook personnalisé pour accéder au contexte
export const useUserContext = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUserContext must be used within a UserProvider');
  }
  return context;
};

// Provider du contexte
export const UserProvider = ({ children }) => {
  // États pour gérer l'authentification
  const [userToken, setUserToken] = useState(() => {
    // Initialisation à partir du localStorage si disponible
    return localStorage.getItem('authToken') || null;
  });
  const [userRole, setUserRole] = useState(() => {
    // Initialisation du rôle depuis localStorage si possible
    return localStorage.getItem('userRole') || null;
  });
  const [isLoading, setIsLoading] = useState(true);

  // Effet pour vérifier l'authentification au montage
  useEffect(() => {
    const verifyAuth = async () => {
      try {
        if (userToken) {
          // Ici, tu pourrais faire une requête pour vérifier le token
          // et récupérer les informations utilisateur, ou utiliser un token décodé.
          // Exemple fictif de validation du token JWT :

          // const response = await axios.get('/api/auth/verify', {
          //   headers: { Authorization: `Bearer ${userToken}` }
          // });

          // Exemple fictif de rôle (si tu décodes un token JWT ou le récupères d'une API)
          const decodedRole = 'Admin'; // Par exemple, tu peux décoder le token JWT et obtenir le rôle.
          setUserRole(decodedRole); // Mets à jour le rôle.
        }
      } catch (error) {
        console.error('Erreur de vérification:', error);
        logout();
      } finally {
        setIsLoading(false);
      }
    };

    verifyAuth();
  }, [userToken]);

  // Fonction de login
  const login = (token, role) => {
    localStorage.setItem('authToken', token);
    localStorage.setItem('userRole', role);  // Stocke également le rôle dans localStorage.
    setUserToken(token);
    setUserRole(role);
  };

  // Fonction de logout
  const logout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('userRole');  // Supprime aussi le rôle du localStorage.
    setUserToken(null);
    setUserRole(null);
  };

  // Valeur fournie par le contexte
  const value = {
    userToken,
    userRole,
    isLoading,
    setUserToken,
    setUserRole,
    login,
    logout,
    isAuthenticated: !!userToken,
  };

  return (
    <UserContext.Provider value={value}>
      {!isLoading && children}
    </UserContext.Provider>
  );
};
