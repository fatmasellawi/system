import React, { useState } from 'react';
import axios from 'axios';

const SendPatrolEmailButton = ({ patrol }) => {
  const [status, setStatus] = useState('idle');
  const [message, setMessage] = useState(null);

  const handleSendEmail = async () => {
    if (!patrol?.id) return;

    if (status === 'sending') return;

    setStatus('sending');

    try {
      const formData = new FormData();
      for (const key in patrol) {
        if (patrol[key]) {
          if (key === 'Picture' || key === 'PictureAfter') {
            formData.append(key, patrol[key]);
          } else {
            formData.append(key, patrol[key]);
          }
        }
      }

      await axios.post('http://localhost:5000/api/patrol/send-email', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      setStatus('sent');
      setMessage('✅ Email sent successfully');
    } catch (error) {
      console.error('Email error:', error);
      setStatus('error');
      setMessage('❌ Failed to send email');
    }
  };

  return (
    <div>
      <button onClick={handleSendEmail} disabled={status === 'sending'}>
        {status === 'sending' ? 'Sending...' : 'Send Email'}
      </button>
      {message && <p style={{ fontSize: '0.8rem' }}>{message}</p>}
    </div>
  );
};

export default SendPatrolEmailButton;
