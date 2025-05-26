import React from 'react';
import { Navbar, Container } from 'react-bootstrap';
import bannerImg from '../assets/images/banner_residanat_2025.png';

const Header = () => {
  return (
    <header className="mb-4">
      <Navbar bg="light" expand="lg" className="shadow-sm">
        <Container>
          <Navbar.Brand href="/">
            <img 
              src={bannerImg} 
              alt="Concours d'accès au résidanat Session Octobre 2025" 
              className="img-fluid" 
              style={{ maxHeight: '80px' }}
            />
            <div className="site-title">
              <h1 className="fs-4 mb-0">Concours d'accès au résidanat Session Octobre 2025</h1>
              <p className="fs-6 text-muted mb-0">Faculté de médecine d'Oran université d'Oran 1 "AHMED Benbela"</p>
            </div>
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav" className="justify-content-end">
            <div className="d-flex">
              <a href="/login" className="btn btn-outline-success me-2">Connexion</a>
              <a href="/register" className="btn btn-success">Inscription</a>
            </div>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </header>
  );
};

export default Header;
