import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, ListGroup, Badge, Spinner, Alert } from 'react-bootstrap';
import { authService } from '../services/api'; // Importer le service API
import iconMedecine from '../assets/images/icon_filiere_medecine.png';
import iconPharmacie from '../assets/images/icon_filiere_pharmacie.png';
import iconDentaire from '../assets/images/icon_filiere_dentaire.png';

const Dashboard = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Charger les données utilisateur au montage du composant
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userData = await authService.getProfile();
        setUser(userData.user);
      } catch (err) {
        setError(err.message || 'Erreur lors de la récupération des informations utilisateur.');
        // Optionnel: Déconnecter l'utilisateur si le token est invalide ou expiré
        if (err.status === 401 || err.status === 403) {
          authService.logout();
          window.location.href = '/login';
        }
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  // Obtenir l'icône correspondant à la filière
  const getFiliereIcon = (filiere) => {
    switch (filiere) {
      case 'medecine':
        return iconMedecine;
      case 'pharmacie':
        return iconPharmacie;
      case 'dentaire':
        return iconDentaire;
      default:
        return iconMedecine;
    }
  };

  // Obtenir le nom de la filière
  const getFiliereName = (filiere) => {
    switch (filiere) {
      case 'medecine':
        return 'Médecine';
      case 'pharmacie':
        return 'Pharmacie';
      case 'dentaire':
        return 'Médecine Dentaire';
      default:
        return 'Inconnue';
    }
  };

  // Formater la date
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    try {
      return new Date(dateString).toLocaleDateString('fr-FR');
    } catch (e) {
      return 'Date invalide';
    }
  };

  if (loading) {
    return (
      <Container className="py-5 text-center">
        <Spinner animation="border" variant="success" />
        <p>Chargement des informations...</p>
      </Container>
    );
  }

  if (error) {
    return (
      <Container className="py-5">
        <Alert variant="danger">{error}</Alert>
      </Container>
    );
  }

  if (!user) {
    return (
      <Container className="py-5">
        <Alert variant="warning">Impossible de charger les informations utilisateur.</Alert>
      </Container>
    );
  }

  return (
    <Container className="py-5">
      <Row>
        <Col lg={4} className="mb-4">
          <Card className="shadow-sm border-0">
            <Card.Header className="bg-success text-white">
              <h4 className="mb-0">Profil Candidat</h4>
            </Card.Header>
            <Card.Body className="text-center">
              <div className="mb-3">
                <img 
                  src={getFiliereIcon(user.filiere)}
                  alt={getFiliereName(user.filiere)}
                  style={{ height: '100px' }}
                />
              </div>
              <h3>{user.prenom} {user.nom}</h3>
              <p className="text-muted">{user.email}</p>
              <Badge bg="success" className="px-3 py-2">
                Filière: {getFiliereName(user.filiere)}
              </Badge>
            </Card.Body>
            <ListGroup variant="flush">
              <ListGroup.Item className="d-flex justify-content-between align-items-center">
                Date d'inscription
                <span>{formatDate(user.createdAt)}</span>
              </ListGroup.Item>
              <ListGroup.Item className="d-flex justify-content-between align-items-center">
                Statut Email
                <Badge bg={user.emailVerified ? 'success' : 'warning'}>
                  {user.emailVerified ? 'Vérifié' : 'Non vérifié'}
                </Badge>
              </ListGroup.Item>
            </ListGroup>
          </Card>
        </Col>
        
        <Col lg={8}>
          <Card className="shadow-sm border-0 mb-4">
            <Card.Header className="bg-success text-white">
              <h4 className="mb-0">Tableau de bord - Résidanat 2025</h4>
            </Card.Header>
            <Card.Body>
              <h5>Bienvenue dans votre espace candidat, {user.prenom} !</h5>
              <p>
                Votre inscription au concours national de Résidanat 2025 a été enregistrée.
                Vous pouvez suivre l'état de votre candidature et accéder aux informations importantes
                concernant le concours depuis cette interface.
              </p>
              
              <h5 className="mt-4">Prochaines étapes</h5>
              <ListGroup className="mb-4">
                <ListGroup.Item variant={user.emailVerified ? "success" : "warning"}>
                  <i className={`bi ${user.emailVerified ? 'bi-check-circle-fill' : 'bi-exclamation-triangle-fill'} me-2`}></i>
                  {user.emailVerified ? 'Email vérifié' : 'Vérification de l\`email requise'}
                </ListGroup.Item>
                <ListGroup.Item>
                  <i className="bi bi-clock me-2"></i>
                  Vérification des documents (en attente)
                </ListGroup.Item>
                <ListGroup.Item>
                  <i className="bi bi-clock me-2"></i>
                  Paiement des frais d'inscription (en attente)
                </ListGroup.Item>
                <ListGroup.Item>
                  <i className="bi bi-clock me-2"></i>
                  Téléchargement de la convocation (non disponible)
                </ListGroup.Item>
              </ListGroup>
              
              <h5 className="mt-4">Calendrier du concours</h5>
              <ListGroup>
                <ListGroup.Item className="d-flex justify-content-between align-items-center">
                  Clôture des inscriptions
                  <Badge bg="warning">30/06/2025</Badge>
                </ListGroup.Item>
                <ListGroup.Item className="d-flex justify-content-between align-items-center">
                  Publication des listes des candidats
                  <Badge bg="info">15/07/2025</Badge>
                </ListGroup.Item>
                <ListGroup.Item className="d-flex justify-content-between align-items-center">
                  Épreuves écrites
                  <Badge bg="info">10/09/2025</Badge>
                </ListGroup.Item>
                <ListGroup.Item className="d-flex justify-content-between align-items-center">
                  Publication des résultats
                  <Badge bg="info">15/10/2025</Badge>
                </ListGroup.Item>
              </ListGroup>
            </Card.Body>
          </Card>
          
          <Card className="shadow-sm border-0">
            <Card.Header className="bg-success text-white">
              <h4 className="mb-0">Documents</h4>
            </Card.Header>
            <ListGroup variant="flush">
              <ListGroup.Item className="d-flex justify-content-between align-items-center">
                Guide du candidat
                <a href="#" className="btn btn-sm btn-outline-success">Télécharger</a>
              </ListGroup.Item>
              <ListGroup.Item className="d-flex justify-content-between align-items-center">
                Programme du concours
                <a href="#" className="btn btn-sm btn-outline-success">Télécharger</a>
              </ListGroup.Item>
              <ListGroup.Item className="d-flex justify-content-between align-items-center">
                Convocation
                <span className="text-muted">Non disponible</span>
              </ListGroup.Item>
            </ListGroup>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Dashboard;
