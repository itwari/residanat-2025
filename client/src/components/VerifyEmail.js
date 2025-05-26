import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Form, Button, Alert } from 'react-bootstrap';
import { authService } from '../services/api'; // Importer le service API
import iconEmail from '../assets/images/icon_medical_email.png';

const VerifyEmail = () => {
  const [verificationCode, setVerificationCode] = useState('');
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isResending, setIsResending] = useState(false);

  // Récupérer l'email depuis l'URL au chargement du composant
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const emailParam = params.get('email');
    if (emailParam) {
      setEmail(emailParam);
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');
    setSuccess('');

    try {
      // Vrai appel API pour la vérification du code
      const response = await authService.verifyEmail(email, verificationCode);
      
      setSuccess(response.message || 'Vérification réussie! Redirection vers votre tableau de bord...');
      
      // Redirection vers le tableau de bord après un court délai
      setTimeout(() => {
        window.location.href = '/dashboard';
      }, 2000);

    } catch (err) {
      setError(err.message || 'Code de vérification invalide ou expiré. Veuillez réessayer.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResendCode = async () => {
    setIsResending(true);
    setError('');
    setSuccess('');

    try {
      // Vrai appel API pour renvoyer le code
      const response = await authService.resendVerification(email);
      setSuccess(response.message || 'Un nouveau code de vérification a été envoyé à votre adresse email.');
    } catch (err) {
      setError(err.message || 'Erreur lors de l\`envoi du code. Veuillez réessayer.');
    } finally {
      setIsResending(false);
    }
  };

  return (
    <Container className="py-5">
      <Row className="justify-content-center">
        <Col md={6}>
          <Card className="shadow-lg border-0 rounded-lg">
            <Card.Header className="bg-success text-white text-center py-4">
              <h2 className="mb-0">Vérification de l'Email</h2>
              <p className="mb-0">Concours Résidanat 2025</p>
            </Card.Header>
            <Card.Body className="p-4">
              {error && <Alert variant="danger">{error}</Alert>}
              {success && <Alert variant="success">{success}</Alert>}
              
              <div className="text-center mb-4">
                <img src={iconEmail} alt="Email" style={{ height: '80px' }} />
                <h4 className="mt-3">Vérifiez votre boîte de réception</h4>
                <p className="text-muted">
                  Nous avons envoyé un code de vérification à <strong>{email || 'votre adresse email'}</strong>
                </p>
              </div>

              <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-4">
                  <Form.Label>Code de vérification</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Entrez le code à 6 chiffres"
                    value={verificationCode}
                    onChange={(e) => setVerificationCode(e.target.value)}
                    required
                    maxLength={6} // Limiter à 6 chiffres
                  />
                  <Form.Text className="text-muted">
                    Le code est valable pendant 1 heure.
                  </Form.Text>
                </Form.Group>

                <div className="d-grid mb-3">
                  <Button 
                    variant="success" 
                    type="submit" 
                    size="lg" 
                    disabled={isSubmitting || !email}
                  >
                    {isSubmitting ? 'Vérification...' : 'Vérifier le code'}
                  </Button>
                </div>
              </Form>

              <div className="text-center mt-3">
                <p>Vous n'avez pas reçu de code?</p>
                <Button 
                  variant="link" 
                  className="text-success p-0" 
                  onClick={handleResendCode}
                  disabled={isResending || !email}
                >
                  {isResending ? 'Envoi en cours...' : 'Renvoyer le code'}
                </Button>
              </div>
            </Card.Body>
            <Card.Footer className="text-center py-3">
              <div>
                <a href="/register" className="text-success">Retour à l'inscription</a>
              </div>
            </Card.Footer>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default VerifyEmail;
