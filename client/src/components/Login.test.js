import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom'; // Login component uses <a href> for navigation
import Login from './Login';

describe('Login Component', () => {
  test('renders email and password inputs and a submit button', () => {
    render(
      <MemoryRouter>
        <Login />
      </MemoryRouter>
    );

    // Check for email input
    expect(screen.getByPlaceholderText(/adresse email/i)).toBeInTheDocument();
    // Check for password input
    expect(screen.getByPlaceholderText(/mot de passe/i)).toBeInTheDocument();
    // Check for submit button
    expect(screen.getByRole('button', { name: /se connecter/i })).toBeInTheDocument();
  });
});
