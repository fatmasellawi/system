import React, { useState } from 'react';
import axios from 'axios';
import '../../style/visitor.css';

const Visitor = () => {
  const [formData, setFormData] = useState({
    visitorName: '',
    visitorEmail: '',
    department: '',
    purpose: '',
    workPermit: false,
    firePermit: false,
    visitDate: '',
    document: null,
  });

  const [error, setError] = useState(null);
  const [success, setSuccess] = useState('');

  const handleChange = (e) => {
    const { name, value, type, checked, files } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : type === 'file' ? files[0] : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess('');

    const formDataToSend = new FormData();
    formDataToSend.append("visitorName", formData.visitorName);
    formDataToSend.append("department", formData.department);
    formDataToSend.append("purpose", formData.purpose);
    formDataToSend.append("visitDate", formData.visitDate);
    formDataToSend.append("visitorEmail", formData.visitorEmail);
    formDataToSend.append("workPermit", formData.workPermit);
    formDataToSend.append("firePermit", formData.firePermit);
    if (formData.document) {
      formDataToSend.append("document", formData.document);
    }

    try {
      const response = await axios.post('http://localhost:5000/visit', formDataToSend, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      console.log("✅ Visite créée :", response.data);
      setSuccess(response.data.message || "Visite enregistrée avec succès.");
      setFormData({
        visitorName: '',
        visitorEmail: '',
        department: '',
        purpose: '',
        workPermit: false,
        firePermit: false,
        visitDate: '',
        document: null,
      });
    } catch (error) {
      console.error("❌ Erreur Axios :", error);
      setError(error.response?.data?.message || "Erreur lors de la soumission du formulaire.");
    }
  };

  return (
    <form onSubmit={handleSubmit} encType="multipart/form-data" className="visitor-form">
      {error && <div className="error-message">{error}</div>}
      {success && <div className="success-message">{success}</div>}

      <input
        type="text"
        name="visitorName"
        placeholder="Manager"
        value={formData.visitorName}
        onChange={handleChange}
        required
      />
      <input
        type="email"
        name="visitorEmail"
        placeholder="Email HSE"
        value={formData.visitorEmail}
        onChange={handleChange}
        required
      />
      <input
        type="text"
        name="department"
        placeholder="Département"
        value={formData.department}
        onChange={handleChange}
        required
      />
      <input
        type="text"
        name="purpose"
        placeholder="Motif de la visite"
        value={formData.purpose}
        onChange={handleChange}
        required
      />
      <label>
        <input
          type="checkbox"
          name="workPermit"
          checked={formData.workPermit}
          onChange={handleChange}
        />
        Autorisation de travail
      </label>
      <label>
        <input
          type="checkbox"
          name="firePermit"
          checked={formData.firePermit}
          onChange={handleChange}
        />
        Permis de feu
      </label>
      <input
        type="date"
        name="visitDate"
        value={formData.visitDate}
        onChange={handleChange}
        required
      />
      <input
        type="file"
        name="document"
        accept=".pdf"
        onChange={handleChange}
      />
      <button type="submit">
        Soumettre
      </button>
    </form>
  );
};

export default Visitor;
