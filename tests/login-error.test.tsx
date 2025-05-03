import '@testing-library/jest-dom'
import { render, screen, fireEvent } from '@testing-library/react';
import LoginPage from '../app/login/page';

// Mock the login action to simulate a failed login
jest.mock('../app/login/actions', () => ({
  login: jest.fn(() => Promise.resolve({ error: { message: 'Invalid email or password' } })),
  signup: jest.fn(),
}));

describe('LoginPage', () => {
  it('shows an error message when login fails', async () => {
    render(<LoginPage />);

    fireEvent.change(screen.getByLabelText(/email/i), {
      target: { value: 'wrong@example.com' },
    });
    fireEvent.change(screen.getByLabelText(/password/i), {
      target: { value: 'wrongpassword' },
    });
    fireEvent.click(screen.getByRole('button', { name: /sign in/i }));

    // Wait for error message to appear
    const error = await screen.findByText(/invalid email or password/i);
    expect(error).toBeInTheDocument();
  });
}); 