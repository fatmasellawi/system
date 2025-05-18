import { useEffect, useState } from 'react';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { ClipLoader } from 'react-spinners';

export default function NotificationList() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const response = await axios.get("/api/patrols/upcoming-deadlines");

        console.log("Notifications reçues : ", response.data);
        setNotifications(response.data);
        toast.success('📬 Notifications récupérées avec succès !');
      } catch (err) {
        console.error("Erreur lors du chargement des notifications :", err);
        const errorMessage = err.response?.data?.message || err.message || 'Erreur inconnue';
        setError(errorMessage);
        toast.error(`❌ Erreur : ${errorMessage}`);
      } finally {
        setLoading(false);
      }
    };

    fetchNotifications();
  }, []);

  return (
    <div style={{ padding: '1rem' }}>
      <ToastContainer />

      <h3>📢 Notifications de patrouilles à venir</h3>

      {loading ? (
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <ClipLoader color="#007bff" loading={true} size={25} />
          Chargement des notifications...
        </div>
      ) : error ? (
        <div style={{ color: 'red' }}>❌ {error}</div>
      ) : notifications.length > 0 ? (
        <ul style={{ listStyle: 'none', paddingLeft: 0 }}>
          {notifications.map((item) => (
            <li key={item._id} style={{ marginBottom: '1rem' }}>
              <div style={{ color: '#ff9800' }}>
                ⚠️ {item.message}
              </div>
              <div>
                📅 <em>{new Date(item.deadline).toLocaleDateString('fr-FR')}</em>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <div style={{ color: 'green' }}>✅ Aucune patrouille à échéance proche</div>
      )}
    </div>
  );
}
