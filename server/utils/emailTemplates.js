export const generateEmailHtml = (patrol) => {
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; }
          .header { background-color: #f8f9fa; padding: 20px; text-align: center; }
          .content { margin: 20px; }
          .patrol-info { margin-bottom: 20px; }
          .images { display: flex; gap: 20px; margin-top: 20px; }
          .image-container { flex: 1; }
          img { max-width: 100%; height: auto; }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>Rapport de Patrouille #${patrol.No}</h1>
          <p>Zone: ${patrol.Area}</p>
        </div>
        
        <div class="content">
          <div class="patrol-info">
            <h2>Détails de la patrouille</h2>
            <p><strong>Localisation:</strong> ${patrol.Where}</p>
            <p><strong>Élément concerné:</strong> ${patrol.Item}</p>
            <p><strong>Solution appliquée:</strong> ${patrol.Solution}</p>
            <p><strong>Personne en charge:</strong> ${patrol.PersoneAction}</p>
            <p><strong>Progression:</strong> ${patrol.Progress}</p>
          </div>
          
          ${patrol.Picture || patrol.PictureAfter ? `
          <div class="images">
            ${patrol.Picture ? `
            <div class="image-container">
              <h3>Photo avant</h3>
              <img src="${patrol.Picture}" alt="Avant intervention" />
            </div>
            ` : ''}
            
            ${patrol.PictureAfter ? `
            <div class="image-container">
              <h3>Photo après</h3>
              <img src="${patrol.PictureAfter}" alt="Après intervention" />
            </div>
            ` : ''}
          </div>
          ` : ''}
        </div>
      </body>
      </html>
    `;
  };