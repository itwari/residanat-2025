import React from 'react';
import { Container, Row, Col, Card, Form, Button, Alert } from 'react-bootstrap';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { authService } from '../services/api'; // Importer le service API
import iconEmail from '../assets/images/icon_medical_email.png';
import iconPassword from '../assets/images/icon_medical_password.png';

const Login = () => {
  // Schéma de validation avec Yup
  const validationSchema = Yup.object({
    email: Yup.string().email('Email invalide').required('L\'email est obligatoire'),
    password: Yup.string().required('Le mot de passe est obligatoire')
  });

  // Gestion de la soumission du formulaire
  const handleSubmit = async (values, { setSubmitting, setStatus }) => {
    setStatus(null); // Réinitialiser le statut
    try {
      // Vrai appel API pour la connexion
      const response = await authService.login(values.email, values.password);
      
      setStatus({ success: response.message || 'Connexion réussie! Redirection vers votre tableau de bord...' });
      
      // Redirection vers le tableau de bord après un court délai
      setTimeout(() => {
        window.location.href = '/dashboard';
      }, 1500);

    } catch (error) {
      // Afficher l'erreur retournée par l'API ou un message générique
      setStatus({ error: error.message || 'Email ou mot de passe incorrect. Veuillez réessayer.' });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Container className="py-5">
      <Row className="justify-content-center">
        <Col md={6}>
          <Card className="shadow-lg border-0 rounded-lg">
            <Card.Header className="bg-success text-white text-center py-4">
              <h2 className="mb-0">Connexion</h2>
              <p className="mb-0">Concours Résidanat 2025</p>
            </Card.Header>
            <Card.Body className="p-4">
              <Formik
                initialValues={{
                  email: '',
                  password: ''
                }}
                validationSchema={validationSchema}
                onSubmit={handleSubmit}
              >
                {({
                  values,
                  errors,
                  touched,
                  handleChange,
                  handleBlur,
                  handleSubmit,
                  isSubmitting,
                  status
                }) => (
                  <Form onSubmit={handleSubmit}>
                    {status && status.success && (
                      <Alert variant="success">{status.success}</Alert>
                    )}
                    {status && status.error && (
                      <Alert variant="danger">{status.error}</Alert>
                    )}

                    <Form.Group className="mb-3">
                      <div className="input-group">
                        <span className="input-group-text">
                          <img src={iconEmail} alt="Email" style={{ height: '24px' }} />
                        </span>
                        <Form.Control
                          type="email"
                          name="email"
                          placeholder="Adresse email"
                          value={values.email}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          isInvalid={touched.email && errors.email}
                        />
                        <Form.Control.Feedback type="invalid">
                          {errors.email}
                        </Form.Control.Feedback>
                      </div>
                    </Form.Group>

                    <Form.Group className="mb-4">
                      <div className="input-group">
                        <span className="input-group-text">
                          <img src={iconPassword} alt="Mot de passe" style={{ height: '24px' }} />
                        </span>
                        <Form.Control
                          type="password"
                          name="password"
                          placeholder="Mot de passe"
                          value={values.password}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          isInvalid={touched.password && errors.password}
                        />
                        <Form.Control.Feedback type="invalid">
                          {errors.password}
                        </Form.Control.Feedback>
                      </div>
                    </Form.Group>

                    <div className="d-flex justify-content-between align-items-center mb-4">
                      <Form.Check
                        type="checkbox"
                        label="Se souvenir de moi"
                        name="rememberMe"
                      />
                      <a href="/forgot-password" className="text-success">Mot de passe oublié?</a>
                    </div>

                    <div className="d-grid">
                      <Button 
                        variant="success" 
                        type="submit" 
                        size="lg" 
                        disabled={isSubmitting}
                      >
                        {isSubmitting ? 'Connexion en cours...' : 'Se connecter'}
                      </Button>
                    </div>
                  </Form>
                )}
              </Formik>
            </Card.Body>
            <Card.Footer className="text-center py-3">
              <div>Vous n'avez pas de compte? <a href="/register" className="text-success">Inscrivez-vous</a></div>
            </Card.Footer>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Login;
