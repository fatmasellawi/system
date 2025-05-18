import React, { useState, useEffect } from 'react';
import { useUserContext } from '../../context/UserContext';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom'; // <-- ajout

import axios from 'axios';

import '../../style/patrol.css';

const ImageModal = ({ imgSrc, onClose }) => (
  <div className="modal" onClick={onClose}>
    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
      <img src={imgSrc} alt="Zoomed" style={{ width: '100%', height: 'auto' }} />
      <button onClick={onClose} className="close-btn">✖</button>
    </div>
  </div>
);

const Patrol = () => {

  const navigate = useNavigate();

  const { t } = useTranslation();
  const { userRole } = useUserContext();

  const [patrols, setPatrols] = useState([]);
  const [formData, setFormData] = useState({
    No: '',
    Area: '',
    Where: '',
    Item: '',
    Solution: '',
    PersoneAction: '',
    Progress: '',
    Deadline: '',
    Picture: null,
    PictureAfter: null,
  });
  const [editingId, setEditingId] = useState(null);
  const [message, setMessage] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [emailStatus, setEmailStatus] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    return () => {
      if (selectedImage) {
        URL.revokeObjectURL(selectedImage);
      }
    };
  }, [selectedImage]);

  const showMessage = (message, type = 'success') => {
    setMessage({ text: message, type });
  };

  const sendPatrolEmail = async (patrol) => {
    const patrolId = patrol.id;

    if (!patrolId) {
      console.error('Patrol ID is missing');
      return;
    }

    if (emailStatus[patrolId] === 'sending') return;

    setEmailStatus(prev => ({ ...prev, [patrolId]: 'sending' }));

    // Vérification des photos avant envoi
    if (!patrol.Picture || !patrol.PictureAfter) {
      showMessage('❌ Both before and after photos are required to send the email.', 'error');
      setEmailStatus(prev => ({ ...prev, [patrolId]: 'error' }));
      return;
    }

    try {
      const formData = new FormData();
      console.log('Sending patrol data:', patrol);

      // Ajout des données
      for (const key in patrol) {
        if (patrol[key] !== null && patrol[key] !== undefined) {
          if (key === 'Picture' || key === 'PictureAfter') {
            if (patrol[key]) {
              formData.append(key, patrol[key]);
            }
          } else {
            formData.append(key, patrol[key]);
          }
        }
      }

      // Log des données envoyées
      for (let pair of formData.entries()) {
        console.log(pair[0] + ': ' + pair[1]);
      }

      const apiUrl = 'http://localhost:5000/api/patrol/send-email';
      const response = await axios.post(apiUrl, formData);

      console.log('Response:', response);
      setEmailStatus(prev => ({ ...prev, [patrolId]: 'sent' }));
      showMessage('✅ Email sent successfully');
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message || 'Unknown error';
      console.error('Error sending email:', errorMessage);
      showMessage(`❌ ${errorMessage}`, 'error');
      setEmailStatus(prev => ({ ...prev, [patrolId]: 'error' }));
    }
  };

  const validateForm = () => {
    if (!formData.No || !formData.Area || !formData.Where || !formData.Item || 
        !formData.Solution || !formData.PersoneAction || !formData.Progress|| !formData.Deadline) {
      showMessage('❌ All fields are required', 'error');
      return false;
    }

    // Vérification que les photos ont été chargées
    if (!formData.Picture) {
      showMessage('❌ Before photo is required', 'error');
      return false;
    }

    if (!formData.PictureAfter) {
      showMessage('❌ After photo is required', 'error');
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    setIsLoading(true);

    try {
      if (editingId) {
        setPatrols(prev =>
          prev.map(p =>
            p.id === editingId ? { ...formData, id: editingId } : p
          )
        );
        showMessage('✅ Patrol updated');
      } else {
        const newPatrol = {
          ...formData,
          id: Date.now().toString(),
          isValidated: false
        };
        setPatrols(prev => [...prev, newPatrol]);
        showMessage('✅ New patrol added');
      }
      resetForm();
    } catch (error) {
      console.error('Error:', error);
      showMessage('❌ Error during submission', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      No: '',
      Area: '',
      Where: '',
      Item: '',
      Solution: '',
      PersoneAction: '',
      Progress: '',
      Deadline: '',
      Picture: null,
      PictureAfter: null,
    });
    setEditingId(null);
  };

  const handleEdit = (patrol) => {
    setFormData({
      No: patrol.No || '',
      Area: patrol.Area || '',
      Where: patrol.Where || '',
      Item: patrol.Item || '',
      Solution: patrol.Solution || '',
      PersoneAction: patrol.PersoneAction || '',
      Progress: patrol.Progress || '',
      Deadline: patrol.Deadline|| '',

      Picture: patrol.Picture || null,
      PictureAfter: patrol.PictureAfter || null,
    });
    setEditingId(patrol.id);
  };

  const handleDelete = (id) => {
    setPatrols(prev => prev.filter(p => p.id !== id));
    showMessage('🗑️ Patrol deleted.');
  };

  const handleValidatorChange = (patrolId) => {
    setPatrols(prev =>
      prev.map(p =>
        p.id === patrolId ? { ...p, isValidated: !p.isValidated } : p
      )
    );
  };

  const handleImageClick = (imageFile) => {
    if (imageFile) {
      const imageUrl = URL.createObjectURL(imageFile);
      setSelectedImage(imageUrl);
    }
  };

  const handleCloseModal = () => {
    setSelectedImage(null);
  };

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setFormData({ ...formData, [name]: files ? files[0] : value });
  };

  return (

    
    <div style={{ padding: '2rem' }} className='patrol'>
      <h2>{t('Patrol Management')}</h2>

      <button onClick={() => navigate('/PatrolList')} className="navigate-btn">
        {t('Go to Patrol List')}
      </button>

      {message && (
        <p style={{ color: message.type === 'error' ? 'red' : 'green' }}>
          {message.text}
        </p>
      )}

      <form onSubmit={handleSubmit} encType="multipart/form-data">
        <div className="form-grid">
          <input type="number" name="No" placeholder={t('Number')} value={formData.No} onChange={handleChange} required />
          <input type="text" name="Area" placeholder={t('Area')} value={formData.Area} onChange={handleChange} required />
          <input type="text" name="Where" placeholder={t('Where')} value={formData.Where} onChange={handleChange} required />
          <input type="text" name="Item" placeholder={t('Item')} value={formData.Item} onChange={handleChange} required />
          <textarea name="Solution" placeholder={t('Solution')} value={formData.Solution} onChange={handleChange} required />
          <input type="text" name="PersoneAction" placeholder={t('Person in charge')} value={formData.PersoneAction} onChange={handleChange} required />
          <select name="Progress" value={formData.Progress} onChange={handleChange} required>
            <option value="">{t('Select progress')}</option>
            <option value="InProgress">{t('InProgress')}</option>
            <option value="Completed">{t('Completed')}</option>
            <option value="Pending">{t('Pending')}</option>
          </select>

          <input
  type="date"
  name="Deadline"
  placeholder={t('Deadline')}
  value={formData.Deadline}
  onChange={handleChange}
  required
/>

          <div className="file-inputs">
            <label>
              {t('Before photo')}
              <input type="file" name="Picture" accept="image/*" onChange={handleChange} />
            </label>
            <label>
              {t('After photo')}
              <input type="file" name="PictureAfter" accept="image/*" onChange={handleChange} />
            </label>
          </div>
        </div>
        <button type="submit" className="submit-btn" disabled={isLoading}>
          {isLoading ? t('Loading...') : (editingId ? t('Update') : t('Add Patrol'))}
        </button>
      </form>

      <h3>{t('list of daily patrols')}</h3>
      <div className="table-responsive">
        <table>
          <thead>
            <tr>
              <th>{t('Number')}</th>
              <th>{t('Area')}</th>
              <th>{t('Where')}</th>
              <th>{t('Item')}</th>
              <th>{t('Solution')}</th>
              <th>{t('Person in charge')}</th>
              <th>{t('Progress')}</th>
              <th>{t('Deadline')}</th>

              <th>{t('Before')}</th>
              <th>{t('After')}</th>
              <th>{t('Actions')}</th>
              {userRole === 'Admin' && <th>{t('Validator')}</th>}
              <th>{t('Send Email')}</th>
            </tr>
          </thead>
          <tbody>
            {patrols.map(p => (
              <tr key={p.id}>
                <td>{p.No}</td>
                <td>{p.Area}</td>
                <td>{p.Where}</td>
                <td>{p.Item}</td>
                <td className="solution-cell">{p.Solution}</td>
                <td>{p.PersoneAction}</td>
                <td>{p.Progress}</td>
                <td>{p.Deadline}</td>

                <td>
                  {p.Picture && (
                    <img
                      src={URL.createObjectURL(p.Picture)}
                      alt="Avant"
                      onClick={() => handleImageClick(p.Picture)}
                      className="thumbnail"
                    />
                  )}
                </td>
                <td>
                  {p.PictureAfter && (
                    <img
                      src={URL.createObjectURL(p.PictureAfter)}
                      alt="Après"
                      onClick={() => handleImageClick(p.PictureAfter)}
                      className="thumbnail"
                    />
                  )}
                </td>
                <td>
                  <button onClick={() => handleEdit(p)}>{t('Edit')}</button>
                  <button onClick={() => handleDelete(p.id)}>{t('Delete')}</button>
                </td>
                {userRole === 'Admin' && (
                  <td>
                    <input
                      type="checkbox"
                      checked={p.isValidated}
                      onChange={() => handleValidatorChange(p.id)}
                    />
                  </td>
                )}
                <td>
                  <button onClick={() => sendPatrolEmail(p)}>{t('Send Email')}</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {selectedImage && (
        <ImageModal imgSrc={selectedImage} onClose={handleCloseModal} />
      )}
    </div>
  );
};

export default Patrol;
