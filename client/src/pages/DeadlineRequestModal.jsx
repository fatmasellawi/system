import React, { useState } from 'react';

const DeadlineRequestModal = ({ patrol, onClose, onRequest }) => {
  const [newDeadline, setNewDeadline] = useState('');
  const [reason, setReason] = useState(''); // Nouveau champ pour la raison de la demande
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!newDeadline || !reason) {
      setErrorMessage('Veuillez remplir tous les champs.');
      return;
    }

    // Envoie la demande de changement avec la raison au backend
    onRequest(patrol._id, newDeadline, reason);
    onClose(); // Fermer la modal après l'envoi
  };

  return (
    <div className="modal-overlay" style={{
      position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh',
      backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center',
      alignItems: 'center', zIndex: 1000
    }}>
      <div style={{
        background: '#fff', padding: '20px', borderRadius: '8px', minWidth: '300px',
        maxWidth: '90%', boxShadow: '0 0 15px rgba(0,0,0,0.3)'
      }}>
        <h3>Demande de changement de deadline</h3>
        <form onSubmit={handleSubmit}>
          <label htmlFor="deadline">Nouvelle date :</label>
          <input
            type="date"
            value={newDeadline}
            onChange={(e) => setNewDeadline(e.target.value)}
            required
            style={{ display: 'block', margin: '10px 0', padding: '8px', width: '100%' }}
          />

          <label htmlFor="reason">Raison du changement :</label>
          <textarea
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            required
            style={{ display: 'block', margin: '10px 0', padding: '8px', width: '100%' }}
          />

          {errorMessage && (
            <div style={{ color: 'red', marginBottom: '10px' }}>
              {errorMessage}
            </div>
          )}

          <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <button type="button" onClick={onClose} style={{ marginRight: '10px' }}>
              Annuler
            </button>
            <button type="submit" style={{ background: '#2196F3', color: 'white', padding: '8px 12px' }}>
              Envoyer
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default DeadlineRequestModal;
