import React, { useState, useEffect } from 'react';

const UpdateModal = ({ patrol, onClose, onSave }) => {
  const [formData, setFormData] = useState(patrol ? { ...patrol } : {});
  const [previewPictures, setPreviewPictures] = useState({
    Picture: patrol?.Picture || '',
    PictureAfter: patrol?.PictureAfter || '',
  });
  const [selectedFiles, setSelectedFiles] = useState({
    Picture: null,
    PictureAfter: null,
  });
  const [loading, setLoading] = useState(false);

  // Cleanup image previews and reset formData when patrol changes
  useEffect(() => {
    if (!patrol) return;

    const updatedPreviews = {};
    if (patrol.Picture) {
      updatedPreviews.Picture =
        patrol.Picture instanceof Blob ? URL.createObjectURL(patrol.Picture) : patrol.Picture;
    }
    if (patrol.PictureAfter) {
      updatedPreviews.PictureAfter =
        patrol.PictureAfter instanceof Blob ? URL.createObjectURL(patrol.PictureAfter) : patrol.PictureAfter;
    }

    setPreviewPictures((prev) => ({ ...prev, ...updatedPreviews }));
    setFormData({ ...patrol });

    return () => {
      // Cleanup object URLs on unmount or patrol change
      if (updatedPreviews.Picture) URL.revokeObjectURL(updatedPreviews.Picture);
      if (updatedPreviews.PictureAfter) URL.revokeObjectURL(updatedPreviews.PictureAfter);
    };
  }, [patrol]);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (files && files.length > 0) {
      const file = files[0];
      setSelectedFiles((prev) => ({ ...prev, [name]: file }));

      // Preview the image
      setPreviewPictures((prev) => ({
        ...prev,
        [name]: URL.createObjectURL(file),
      }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async () => {
    setLoading(true);
    const data = new FormData();
    Object.entries(formData).forEach(([key, value]) => {
      data.append(key, value);
    });

    // Append selected files (images)
    if (selectedFiles.Picture) {
      data.append('Picture', selectedFiles.Picture);
    }
    if (selectedFiles.PictureAfter) {
      data.append('PictureAfter', selectedFiles.PictureAfter);
    }

    // Log form data for debugging
    for (let pair of data.entries()) {
      console.log(pair[0] + ': ' + pair[1]);
    }

    try {
      const updatedPatrol = await onSave(data);
      // Update preview pictures with new data after save
      setPreviewPictures((prev) => ({
        ...prev,
        Picture: updatedPatrol?.Picture || prev.Picture,
        PictureAfter: updatedPatrol?.PictureAfter || prev.PictureAfter,
      }));
      onClose(); // Close modal after save
    } catch (error) {
      console.error('Error during patrol update:', error);
      alert('Erreur lors de la mise à jour.');
    } finally {
      setLoading(false);
    }
  };

  if (!patrol) return null;

  return (
    <div
      className="modal"
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        backgroundColor: 'rgba(0,0,0,0.7)',
        zIndex: 9999,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <div
        style={{
          background: '#fff',
          padding: 20,
          borderRadius: 10,
          width: '500px',
          maxHeight: '90vh',
          overflowY: 'auto',
          boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.2)',
        }}
      >
        <h3 style={{ marginBottom: '15px' }}>🛠️ Mise à jour de la patrouille</h3>

        {/* Dynamically rendering input fields */}
        {[{ label: 'No', name: 'No' }, { label: 'Zone', name: 'Area' }, { label: 'Lieu', name: 'Where' }, { label: 'Item', name: 'Item' }, { label: 'Solution', name: 'Solution' }, { label: 'Responsable', name: 'PersoneAction' }, { label: 'Avancement', name: 'Progress' }].map(
          ({ label, name }) => (
            <label key={name} style={{ display: 'block', marginBottom: '10px' }}>
              {label} :
              <input
                type="text"
                name={name}
                value={formData[name] || ''}
                onChange={handleChange}
                style={{
                  width: '100%',
                  padding: '8px',
                  marginTop: '5px',
                  border: '1px solid #ccc',
                  borderRadius: '4px',
                }}
              />
            </label>
          )
        )}

        {/* Photo avant */}
        <label style={{ display: 'block', marginBottom: '10px' }}>
          📷 Photo avant :
          <input
            type="file"
            name="Picture"
            onChange={handleChange}
            accept="image/*"
            style={{
              width: '100%',
              padding: '8px',
              marginTop: '5px',
              border: '1px solid #ccc',
              borderRadius: '4px',
            }}
          />
          {previewPictures?.Picture ? (
            <div style={{ marginTop: '10px' }}>
              <img
                src={previewPictures.Picture}
                alt="Avant"
                style={{ width: '100%', height: 'auto', borderRadius: '5px' }}
              />
            </div>
          ) : (
            <div style={{ marginTop: '10px', fontStyle: 'italic', color: '#999' }}>
              Aucune image avant
            </div>
          )}
        </label>

        {/* Photo après */}
        <label style={{ display: 'block', marginBottom: '10px' }}>
          📷 Photo après :
          <input
            type="file"
            name="PictureAfter"
            onChange={handleChange}
            accept="image/*"
            style={{
              width: '100%',
              padding: '8px',
              marginTop: '5px',
              border: '1px solid #ccc',
              borderRadius: '4px',
            }}
          />
          {previewPictures?.PictureAfter ? (
            <div style={{ marginTop: '10px' }}>
              <img
                src={previewPictures.PictureAfter}
                alt="Après"
                style={{ width: '100%', height: 'auto', borderRadius: '5px' }}
              />
            </div>
          ) : (
            <div style={{ marginTop: '10px', fontStyle: 'italic', color: '#999' }}>
              Aucune image après
            </div>
          )}
        </label>

        {/* Action buttons */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'flex-end',
            marginTop: '20px',
          }}
        >
          <button
            onClick={handleSubmit}
            style={{
              marginRight: 10,
              padding: '10px 20px',
              backgroundColor: '#2196F3',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              position: 'relative',
              pointerEvents: loading ? 'none' : 'auto',
            }}
          >
            {loading ? (
              <div
                className="spinner"
                style={{
                  border: '4px solid #f3f3f3',
                  borderTop: '4px solid #2196F3',
                  borderRadius: '50%',
                  width: '24px',
                  height: '24px',
                  animation: 'spin 2s linear infinite',
                  position: 'absolute',
                  left: '50%',
                  top: '50%',
                  marginLeft: '-12px',
                  marginTop: '-12px',
                }}
              ></div>
            ) : (
              '💾 Enregistrer'
            )}
          </button>
          <button
            onClick={onClose}
            style={{
              padding: '10px 20px',
              backgroundColor: '#f44336',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
            }}
          >
            ❌ Annuler
          </button>
        </div>
      </div>
    </div>
  );
};

export default UpdateModal;
