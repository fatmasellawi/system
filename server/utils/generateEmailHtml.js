const generatePatrolEmailHTML = (patrol) => `
  <h2>Nouvelle Patrouille - ${patrol.No}</h2>
  <p><strong>Zone:</strong> ${patrol.Area}</p>
  <p><strong>Où:</strong> ${patrol.Where}</p>
  <p><strong>Élément:</strong> ${patrol.Item}</p>
  <p><strong>Solution proposée:</strong> ${patrol.Solution}</p>
  <p><strong>Responsable de l’action:</strong> ${patrol.PersoneAction}</p>
  <p><strong>État:</strong> ${patrol.Progress}</p>
`;
