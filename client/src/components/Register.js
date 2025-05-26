import React from 'react';
import { Container, Row, Col, Card, Form, Button, Alert } from 'react-bootstrap';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { authService } from '../services/api'; // Importer le service API
import iconMedecine from '../assets/images/icon_filiere_medecine.png';
import iconPharmacie from '../assets/images/icon_filiere_pharmacie.png';
import iconDentaire from '../assets/images/icon_filiere_dentaire.png';
import iconUser from '../assets/images/icon_medical_user.png';
import iconEmail from '../assets/images/icon_medical_email.png';
import iconPassword from '../assets/images/icon_medical_password.png';

const Register = () => {
  // Schéma de validation avec Yup
  const validationSchema = Yup.object({
    nom: Yup.string().required('Le nom est obligatoire'),
    prenom: Yup.string().required('Le prénom est obligatoire'),
    email: Yup.string().email('Email invalide').required('L\'email est obligatoire'),
    password: Yup.string()
      .min(8, 'Le mot de passe doit contenir au moins 8 caractères')
      .required('Le mot de passe est obligatoire'),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref('password'), null], 'Les mots de passe doivent correspondre')
      .required('La confirmation du mot de passe est obligatoire'),
    filiere: Yup.string()
      .oneOf(['medecine', 'pharmacie', 'dentaire'], 'Veuillez sélectionner une filière valide')
      .required('La filière est obligatoire'),
    dateNaissance: Yup.date().required('La date de naissance est obligatoire'),
    telephone: Yup.string().required('Le numéro de téléphone est obligatoire'),
    captcha: Yup.string()
      .oneOf(['7'], 'Réponse incorrecte')
      .required('Veuillez répondre à la question de sécurité'),
    acceptTerms: Yup.boolean()
      .oneOf([true], 'Vous devez accepter les conditions d\'utilisation')
  });

  // Gestion de la soumission du formulaire
  const handleSubmit = async (values, { setSubmitting, setStatus }) => {
    setStatus(null); // Réinitialiser le statut
    try {
      // Vrai appel API pour l'inscription
      const userData = {
        nom: values.nom,
        prenom: values.prenom,
        email: values.email,
        password: values.password,
        filiere: values.filiere,
        dateNaissance: values.dateNaissance,
        telephone: values.telephone,
      };
      
      const response = await authService.register(userData);
      
      setStatus({ success: response.message || 'Inscription réussie! Redirection vers la vérification d\`email...' });
      
      // Redirection vers la page de vérification d'email après un court délai
      setTimeout(() => {
        window.location.href = `/verify-email?email=${encodeURIComponent(values.email)}`;
      }, 2000);

    } catch (error) {
      // Afficher l'erreur retournée par l'API ou un message générique
      setStatus({ error: error.message || 'Erreur lors de l\'inscription. Veuillez vérifier vos informations et réessayer.' });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Container className="py-5">
      <Row className="justify-content-center">
        <Col md={8}>
          <Card className="shadow-lg border-0 rounded-lg">
            <Card.Header className="bg-success text-white text-center py-4">
              <h2 className="mb-0">Inscription au concours Résidanat 2025</h2>
              <p className="mb-0">Créez votre compte pour participer au concours national</p>
            </Card.Header>
            <Card.Body className="p-4">
              <Formik
                initialValues={{
                  nom: '',
                  prenom: '',
                  email: '',
                  password: '',
                  confirmPassword: '',
                  filiere: '',
                  dateNaissance: '',
                  telephone: '',
                  captcha: '',
                  acceptTerms: false
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

                    <h4 className="mb-4 text-center">Sélectionnez votre filière</h4>
                    <Row className="mb-4">
                      <Col md={4}>
                        <div className={`filiere-option text-center p-3 ${values.filiere === 'medecine' ? 'border border-success rounded bg-light' : ''}`}>
                          <label>
                            <input
                              type="radio"
                              name="filiere"
                              value="medecine"
                              checked={values.filiere === 'medecine'}
                              onChange={handleChange}
                              className="d-none"
                            />
                            <img src={iconMedecine} alt="Médecine" className="img-fluid mb-2" style={{ height: '80px' }} />
                            <p className="mb-0 fw-bold">Médecine</p>
                          </label>
                        </div>
                      </Col>
                      <Col md={4}>
                        <div className={`filiere-option text-center p-3 ${values.filiere === 'pharmacie' ? 'border border-success rounded bg-light' : ''}`}>
                          <label>
                            <input
                              type="radio"
                              name="filiere"
                              value="pharmacie"
                              checked={values.filiere === 'pharmacie'}
                              onChange={handleChange}
                              className="d-none"
                            />
                            <img src={iconPharmacie} alt="Pharmacie" className="img-fluid mb-2" style={{ height: '80px' }} />
                            <p className="mb-0 fw-bold">Pharmacie</p>
                          </label>
                        </div>
                      </Col>
                      <Col md={4}>
                        <div className={`filiere-option text-center p-3 ${values.filiere === 'dentaire' ? 'border border-success rounded bg-light' : ''}`}>
                          <label>
                            <input
                              type="radio"
                              name="filiere"
                              value="dentaire"
                              checked={values.filiere === 'dentaire'}
                              onChange={handleChange}
                              className="d-none"
                            />
                            <img src={iconDentaire} alt="Médecine Dentaire" className="img-fluid mb-2" style={{ height: '80px' }} />
                            <p className="mb-0 fw-bold">Médecine Dentaire</p>
                          </label>
                        </div>
                      </Col>
                    </Row>
                    {errors.filiere && touched.filiere && (
                      <div className="text-danger mb-3 text-center">{errors.filiere}</div>
                    )}

                    <h4 className="mb-4 text-center">Informations personnelles</h4>
                    <Row className="mb-3">
                      <Col md={6}>
                        <Form.Group className="mb-3">
                          <div className="input-group">
                            <span className="input-group-text">
                              <img src={iconUser} alt="Nom" style={{ height: '24px' }} />
                            </span>
                            <Form.Control
                              type="text"
                              name="nom"
                              placeholder="Nom"
                              value={values.nom}
                              onChange={handleChange}
                              onBlur={handleBlur}
                              isInvalid={touched.nom && errors.nom}
                            />
                            <Form.Control.Feedback type="invalid">
                              {errors.nom}
                            </Form.Control.Feedback>
                          </div>
                        </Form.Group>
                      </Col>
                      <Col md={6}>
                        <Form.Group className="mb-3">
                          <div className="input-group">
                            <span className="input-group-text">
                              <img src={iconUser} alt="Prénom" style={{ height: '24px' }} />
                            </span>
                            <Form.Control
                              type="text"
                              name="prenom"
                              placeholder="Prénom"
                              value={values.prenom}
                              onChange={handleChange}
                              onBlur={handleBlur}
                              isInvalid={touched.prenom && errors.prenom}
                            />
                            <Form.Control.Feedback type="invalid">
                              {errors.prenom}
                            </Form.Control.Feedback>
                          </div>
                        </Form.Group>
                      </Col>
                    </Row>

                    <Row className="mb-3">
                      <Col md={6}>
                        <Form.Group className="mb-3">
                          <Form.Label>Date de naissance</Form.Label>
                          <Form.Control
                            type="date"
                            name="dateNaissance"
                            value={values.dateNaissance}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            isInvalid={touched.dateNaissance && errors.dateNaissance}
                          />
                          <Form.Control.Feedback type="invalid">
                            {errors.dateNaissance}
                          </Form.Control.Feedback>
                        </Form.Group>
                      </Col>
                      <Col md={6}>
                        <Form.Group className="mb-3">
                          <Form.Label>Numéro de téléphone</Form.Label>
                          <Form.Control
                            type="tel"
                            name="telephone"
                            placeholder="Numéro de téléphone"
                            value={values.telephone}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            isInvalid={touched.telephone && errors.telephone}
                          />
                          <Form.Control.Feedback type="invalid">
                            {errors.telephone}
                          </Form.Control.Feedback>
                        </Form.Group>
                      </Col>
                    </Row>

                    <h4 className="mb-4 text-center">Informations de compte</h4>
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
                      <Form.Text className="text-muted">
                        Un code de vérification sera envoyé à cette adresse email.
                      </Form.Text>
                    </Form.Group>

                    <Row className="mb-3">
                      <Col md={6}>
                        <Form.Group className="mb-3">
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
                      </Col>
                      <Col md={6}>
                        <Form.Group className="mb-3">
                          <div className="input-group">
                            <span className="input-group-text">
                              <img src={iconPassword} alt="Confirmer mot de passe" style={{ height: '24px' }} />
                            </span>
                            <Form.Control
                              type="password"
                              name="confirmPassword"
                              placeholder="Confirmer le mot de passe"
                              value={values.confirmPassword}
                              onChange={handleChange}
                              onBlur={handleBlur}
                              isInvalid={touched.confirmPassword && errors.confirmPassword}
                            />
                            <Form.Control.Feedback type="invalid">
                              {errors.confirmPassword}
                            </Form.Control.Feedback>
                          </div>
                        </Form.Group>
                      </Col>
                    </Row>

                    <div className="bg-light p-3 rounded mb-4">
                      <Form.Group className="mb-3">
                        <Form.Label>Question de sécurité: Combien font 3 + 4 ?</Form.Label>
                        <Form.Control
                          type="text"
                          name="captcha"
                          placeholder="Votre réponse"
                          value={values.captcha}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          isInvalid={touched.captcha && errors.captcha}
                        />
                        <Form.Control.Feedback type="invalid">
                          {errors.captcha}
                        </Form.Control.Feedback>
                      </Form.Group>
                    </div>

                    <Form.Group className="mb-4">
                      <Form.Check
                        type="checkbox"
                        name="acceptTerms"
                        label="J'accepte les conditions d'utilisation et la politique de confidentialité"
                        checked={values.acceptTerms}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        isInvalid={touched.acceptTerms && errors.acceptTerms}
                        feedback={errors.acceptTerms}
                        feedbackType="invalid"
                      />
                    </Form.Group>

                    <div className="d-grid">
                      <Button 
                        variant="success" 
                        type="submit" 
                        size="lg" 
                        disabled={isSubmitting}
                      >
                        {isSubmitting ? 'Inscription en cours...' : 'S\`inscrire'}
                      </Button>
                    </div>
                  </Form>
                )}
              </Formik>
            </Card.Body>
            <Card.Footer className="text-center py-3">
              <div>Vous avez déjà un compte? <a href="/login" className="text-success">Connectez-vous</a></div>
            </Card.Footer>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Register;

