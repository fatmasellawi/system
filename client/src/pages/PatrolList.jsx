import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useTranslation } from 'react-i18next';
import jsPDF from 'jspdf';
import 'jspdf-autotable';  // Import jsPDF autotable plugin

import UpdateModal from './UpdateModal';
import DeadlineRequestModal from './DeadlineRequestModal';
import { useUserContext } from '../context/UserContext';









const ValidatorCheckbox = ({ patrolId, isChecked, isDisabled, onChange }) => {
  const handleChange = (e) => {
    onChange(patrolId, e.target.checked);
  };
  return (
    <input
      type="checkbox"
      checked={isChecked}
      disabled={isDisabled}
      onChange={handleChange}
    />
  );
};


// Modal d'affichage d'image zoomée
const ImageModal = ({ imgSrc, onClose }) => (
  <div className="modal" onClick={onClose} style={{
    position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh',
    backgroundColor: 'rgba(0, 0, 0, 0.8)', display: 'flex',
    justifyContent: 'center', alignItems: 'center', zIndex: 9999,
  }}>
    <div onClick={(e) => e.stopPropagation()} style={{ position: 'relative' }}>
      <img src={imgSrc} alt="Zoomed patrol" style={{ maxWidth: '90vw', maxHeight: '90vh' }} />
      <button onClick={onClose} style={{
        position: 'absolute', top: 10, right: 10, background: '#fff',
        border: 'none', fontSize: '1.2rem', cursor: 'pointer', padding: '5px 10px',
      }} aria-label="Close image modal">✖</button>
    </div>
  </div>
);

const PatrolList = () => {
  const { t } = useTranslation();
  const { userRole } = useUserContext();

  const [patrols, setPatrols] = useState([]);
  const [selectedImage, setSelectedImage] = useState(null);
  const [editingPatrol, setEditingPatrol] = useState(null);
  const [requestingPatrol, setRequestingPatrol] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [totalCount, setTotalCount] = useState(0);
  const [statusCounts, setStatusCounts] = useState({ InProgress: 0, Pending: 0, Completed: 0 });

  const [searchArea, setSearchArea] = useState('');
  const [searchDate, setSearchDate] = useState('');
  const [searchLocation, setSearchLocation] = useState('');
  const [updatingValidatorId, setUpdatingValidatorId] = useState(null);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [patrolRes, countRes, statusRes] = await Promise.all([
        axios.get('http://localhost:5000/api/patrol'),
        axios.get('http://localhost:5000/api/patrols/count'),
        axios.get('http://localhost:5000/api/patrols/count-by-status')
      ]);
      setPatrols(patrolRes.data);
      setTotalCount(countRes.data.count || 0);
      setStatusCounts(statusRes.data);
    } catch (error) {
      console.error('❌ Erreur chargement données :', error);
      setError(t('fetchError') || 'Une erreur est survenue.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const isDeadlineOverdue = (deadline) => deadline && new Date(deadline) < new Date();

  const handleExportPDF = () => {
    const doc = new jsPDF();

    // Colonnes conditionnelles selon rôle
    const columns = [
      t('number'), t('area'), t('location'), t('item'), t('solution'),
      t('responsible'), t('progress'), t('before'), t('after'), t('actions'), t('Deadline'),
      ...(userRole === 'Admin' ? [t('validator')] : [])
    ];

    const data = patrols.map((patrol) => [
      patrol.No,
      patrol.Area,
      patrol.Where,
      patrol.Item,
      patrol.Solution,
      patrol.PersoneAction,
      patrol.Progress,
      patrol.Picture ? '✔' : '❌',
      patrol.PictureAfter ? '✔' : '❌',
      'Actions',
      patrol.Deadline ? new Date(patrol.Deadline).toLocaleDateString() : t('noDeadline'),
      ...(userRole === 'Admin' ? [patrol.Validator || ''] : [])
    ]);

    doc.autoTable({
      head: [columns],
      body: data,
    });

    doc.save('patrols.pdf');
  };

  const handleUpdate = (id) => {
    const patrolToEdit = patrols.find((p) => p._id === id);
    setEditingPatrol(patrolToEdit);
  };

  const handleSaveUpdate = async (formData) => {
    if (!editingPatrol) return;
    try {
      const response = await axios.put(`http://localhost:5000/api/patrol/${editingPatrol._id}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      const updated = response.data;
      setPatrols((prev) => prev.map((p) => (p._id === updated._id ? updated : p)));
      setEditingPatrol(null);
    } catch (error) {
      console.error('❌ Erreur mise à jour :', error);
      setError(t('updateError') || 'Erreur lors de la mise à jour');
    }
  };

 const handleValidatorChange = async (patrolId, checked) => {
  setUpdatingValidatorId(patrolId);

  try {
    const token = typeof localStorage !== 'undefined' ? localStorage.getItem('token') : null;

    const response = await axios.patch(
      `http://localhost:5000/api/patrol/${patrolId}`,
      { isValidated: checked },
      {
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
      }
    );

    const updatedPatrol = response.data;

    // Mise à jour dans le state React du champ isValidated pour la patrouille modifiée
    setPatrols((prevPatrols) =>
      prevPatrols.map((p) =>
        p._id === patrolId ? { ...p, isValidated: updatedPatrol.isValidated } : p
      )
    );

    return updatedPatrol;
  } catch (error) {
    const message = error.response?.data?.error || error.message || 'Erreur lors de la mise à jour du Validator';
    console.error('❌ Erreur mise à jour Validator :', message);
    alert(`Erreur : ${message}`);
  } finally {
    setUpdatingValidatorId(null);
  }
};






  const handleDeadlineRequest = async (patrolId, newDeadline, reason) => {
    try {
      const response = await fetch('http://localhost:5000/api/patrols/request-deadline', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ patrolId, newDeadline, reason }),
      });
      const data = await response.json();
      if (response.ok) {
        alert(t('requestSentSuccess') || 'Demande envoyée avec succès.');
        setRequestingPatrol(null);
      } else {
        alert(t('requestError') + ': ' + data.message);
      }
    } catch (err) {
      console.error('❌ Erreur demande délai :', err);
      alert(t('requestErrorFallback') || 'Erreur lors de l’envoi.');
    }
  };

  const handleDelete = async (id) => {
    const original = [...patrols];
    setPatrols((prev) => prev.filter((p) => p._id !== id));
    try {
      await axios.delete(`http://localhost:5000/api/patrol/${id}`);
    } catch (error) {
      console.error('❌ Erreur suppression :', error);
      setError(t('deleteError') || 'Erreur lors de la suppression.');
      setPatrols(original);
    }
  };

  const filteredPatrols = patrols.filter(p => {
    const matchArea = searchArea ? p.Area?.toLowerCase().includes(searchArea.toLowerCase()) : true;
    const matchLocation = searchLocation ? p.Where?.toLowerCase().includes(searchLocation.toLowerCase()) : true;
    const matchDate = searchDate ? new Date(p.Deadline).toISOString().split('T')[0] === searchDate : true;
    return matchArea && matchLocation && matchDate;
  });

  return (
    <div style={{ color: '#2196F3', width: '100%' }}>
      <h2>📋 {loading ? t('loading') : t('patrolsListTitle')}</h2>

      <p style={{ fontWeight: 'bold' }}>{t('totalPatrols')}: {totalCount}</p>

      <button
        onClick={handleExportPDF}
        style={{
          padding: '6px 12px', borderRadius: '4px', backgroundColor: '#4CAF50', color: 'white', marginBottom: '1rem'
        }}
      >
        {t('exportToPDF')}
      </button>

      <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem' }}>
        <div style={{ background: '#ffc107', padding: '8px', borderRadius: '5px' }}>
          🟡 {t('Pending')}: {statusCounts.Pending}
        </div>
        <div style={{ background: '#17a2b8', padding: '8px', borderRadius: '5px' }}>
          🔵 {t('InProgress')}: {statusCounts.InProgress}
        </div>
        <div style={{ background: '#28a745', padding: '8px', borderRadius: '5px' }}>
          🟢 {t('Completed')}: {statusCounts.Completed}
        </div>
      </div>

      <div style={{ marginBottom: '1rem' }}>
        <input
          placeholder={t('filterArea')}
          value={searchArea}
          onChange={e => setSearchArea(e.target.value)}
          style={{ marginRight: 8 }}
        />
        <input
          placeholder={t('filterLocation')}
          value={searchLocation}
          onChange={e => setSearchLocation(e.target.value)}
          style={{ marginRight: 8 }}
        />
        <input
          type="date"
          value={searchDate}
          onChange={e => setSearchDate(e.target.value)}
        />
      </div>

      {error && <p style={{ color: 'red' }}>{error}</p>}

      <table
        style={{
          borderCollapse: 'collapse',
          width: '100%',
          fontSize: '0.9rem',
          border: '1px solid #2196F3',
        }}
      >
        <thead>
          <tr>
            <th style={{ border: '1px solid #2196F3', padding: '6px' }}>{t('number')}</th>
            <th style={{ border: '1px solid #2196F3', padding: '6px' }}>{t('area')}</th>
            <th style={{ border: '1px solid #2196F3', padding: '6px' }}>{t('location')}</th>
            <th style={{ border: '1px solid #2196F3', padding: '6px' }}>{t('item')}</th>
            <th style={{ border: '1px solid #2196F3', padding: '6px' }}>{t('solution')}</th>
            <th style={{ border: '1px solid #2196F3', padding: '6px' }}>{t('responsible')}</th>
            <th style={{ border: '1px solid #2196F3', padding: '6px' }}>{t('progress')}</th>
            <th style={{ border: '1px solid #2196F3', padding: '6px' }}>{t('before')}</th>
            <th style={{ border: '1px solid #2196F3', padding: '6px' }}>{t('after')}</th>
            <th style={{ border: '1px solid #2196F3', padding: '6px' }}>{t('actions')}</th>
            <th style={{ border: '1px solid #2196F3', padding: '6px' }}>{t('Deadline')}</th>
          {userRole === 'Admin' && (
              <th style={{ border: '1px solid #2196F3', padding: '6px' }}>{t('validator')}</th>
            )}
          </tr>
        </thead>

        <tbody>
          {filteredPatrols.map((patrol) => (
            <tr key={patrol._id}>
              <td style={{ border: '1px solid #2196F3', padding: '6px' }}>{patrol.No}</td>
              <td style={{ border: '1px solid #2196F3', padding: '6px' }}>{patrol.Area}</td>
              <td style={{ border: '1px solid #2196F3', padding: '6px' }}>{patrol.Where}</td>
              <td style={{ border: '1px solid #2196F3', padding: '6px' }}>{patrol.Item}</td>
              <td style={{ border: '1px solid #2196F3', padding: '6px' }}>{patrol.Solution}</td>
              <td style={{ border: '1px solid #2196F3', padding: '6px' }}>{patrol.PersoneAction}</td>
              <td style={{ border: '1px solid #2196F3', padding: '6px' }}>{patrol.Progress}</td>

              <td style={{ border: '1px solid #2196F3', padding: '6px', cursor: patrol.Picture ? 'pointer' : 'default' }}
                onClick={() => patrol.Picture && setSelectedImage(patrol.Picture)}
                aria-label={patrol.Picture ? t('viewImage') : ''}
              >
                {patrol.Picture ? (
                  <img src={patrol.Picture} alt="Before" style={{ maxWidth: '100px', maxHeight: '60px' }} />
                ) : t('noPicture')}
              </td>

              <td style={{ border: '1px solid #2196F3', padding: '6px', cursor: patrol.PictureAfter ? 'pointer' : 'default' }}
                onClick={() => patrol.PictureAfter && setSelectedImage(patrol.PictureAfter)}
                aria-label={patrol.PictureAfter ? t('viewImage') : ''}
              >
                {patrol.PictureAfter ? (
                  <img src={patrol.PictureAfter} alt="After" style={{ maxWidth: '100px', maxHeight: '60px' }} />
                ) : t('noPicture')}
              </td>

              <td style={{ border: '1px solid #2196F3', padding: '6px' }}>
                <button onClick={() => handleUpdate(patrol._id)} aria-label={t('edit')}>
                  ✏️
                </button>
                <button onClick={() => handleDelete(patrol._id)} aria-label={t('delete')}>
                  🗑️
                </button>
                <button onClick={() => setRequestingPatrol(patrol)} aria-label={t('requestDeadline')}>
                  ⏳
                </button>
              </td>

              <td
                style={{
                  border: '1px solid #2196F3',
                  padding: '6px',
                  fontWeight: isDeadlineOverdue(patrol.Deadline) ? 'bold' : 'normal',
                  color: isDeadlineOverdue(patrol.Deadline) ? 'red' : 'inherit',
                }}
              >
                {patrol.Deadline ? new Date(patrol.Deadline).toLocaleDateString() : t('noDeadline')}
              </td>
 {userRole === 'Admin' && (
                  <td>
                    <ValidatorCheckbox
                      patrolId={patrol._id}
                      isChecked={patrol.Validator}
                      isDisabled={updatingValidatorId === patrol._id}
                      onChange={handleValidatorChange}
                    />
                  </td>
                )}



            </tr>
          ))}
        </tbody>
      </table>

      {selectedImage && (
        <ImageModal imgSrc={selectedImage} onClose={() => setSelectedImage(null)} />
      )}

      {editingPatrol && (
        <UpdateModal
          patrol={editingPatrol}
          onClose={() => setEditingPatrol(null)}
          onSave={handleSaveUpdate}
        />
      )}

      {requestingPatrol && (
        <DeadlineRequestModal
          patrol={requestingPatrol}
          onClose={() => setRequestingPatrol(null)}
          onSubmit={handleDeadlineRequest}
        />
      )}
    </div>
  );
};

export default PatrolList;
