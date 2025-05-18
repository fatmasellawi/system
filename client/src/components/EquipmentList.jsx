import { useEffect, useState } from 'react';
import API from '../services/api';
import './../style/EquipmentList.css'
export default function EquipmentList() {
  const [equipment, setEquipment] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const res = await API.get('/stock');
      setEquipment(res.data);
    };
    fetchData();
  }, []);

  return (
    <div className="equipment-container">
      <h3>Liste des équipements</h3>
      <table className="equipment-table">
        <thead>
          <tr>
            <th>Nom</th>
            <th>Quantité</th>
            <th>Seuil Minimal</th>
          </tr>
        </thead>
        <tbody>
          {equipment.map((item) => (
            <tr key={item._id}>
              <td>{item.name}</td>
              <td>{item.quantity}</td>
              <td>{item.minThreshold}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
