import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import App from './App';

// Mock any services or contexts if App.js depends on them for initial render
// jest.mock('./services/api'); // Example if api calls are made in App's useEffect

describe('App Component', () => {
  test('renders Login component for /login route', () => {
    render(
      <MemoryRouter initialEntries={['/login']}>
        <App />
      </MemoryRouter>
    );
    // Assuming your Login component has a distinct element, e.g., a heading "Connexion"
    // This will depend on the actual content of Login.js
    // For now, let's assume Login component will contain a heading "Connexion"
    // We will verify this when we inspect Login.js
    expect(screen.getByRole('heading', { name: /connexion/i })).toBeInTheDocument();
  });
});
