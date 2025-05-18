import { useState, useEffect } from 'react';
import API from '../services/api';

export default function RequestForm() {
  const [equipmentList, setEquipmentList] = useState([]);
  const [selectedEquipment, setSelectedEquipment] = useState('');
  const [quantity, setQuantity] = useState(0);

  useEffect(() => {
    const fetchEquipment = async () => {
      const res = await API.get('/stock');
      setEquipmentList(res.data);
    };
    fetchEquipment();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await API.post('/request', {
        items: [{ equipment: selectedEquipment, quantity }]
      });
      alert('Demande envoyée');
    } catch (err) {
      alert('Erreur lors de l\'envoi');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <select value={selectedEquipment} onChange={(e) => setSelectedEquipment(e.target.value)}>
        <option value="">Choisir un équipement</option>
        {equipmentList.map((eq) => (
          <option key={eq._id} value={eq._id}>{eq.name}</option>
        ))}
      </select>
      <input type="number" value={quantity} onChange={(e) => setQuantity(e.target.value)} placeholder="Quantité demandée" />
      <button type="submit">Envoyer</button>
    </form>
  );
}
