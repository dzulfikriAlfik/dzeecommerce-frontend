import { describe, it, expect, vi, beforeEach } from 'vitest';
import userEvent from '@testing-library/user-event';
import { render, screen, waitFor } from '../../../helpers/render';
import { LoginForm } from '@/modules/auth/components/login-form';

// ── Mocks ────────────────────────────────────────────────────────────────────

const pushMock = vi.fn();
vi.mock('next/navigation', () => ({
  useRouter: () => ({ push: pushMock }),
}));

const loginMock = vi.fn();
vi.mock('@/hooks/use-auth', () => ({
  useAuth: () => ({
    login: loginMock,
    register: vi.fn(),
    logout: vi.fn(),
    user: null,
    isAuthenticated: false,
    isLoading: false,
    hasRole: () => false,
  }),
}));

vi.mock('sonner', () => ({
  toast: { success: vi.fn(), error: vi.fn() },
}));

// ── Tests ────────────────────────────────────────────────────────────────────

describe('LoginForm', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render the login form', () => {
    render(<LoginForm />);

    expect(screen.getByText('Welcome back')).toBeInTheDocument();
    expect(screen.getByLabelText('Email')).toBeInTheDocument();
    expect(screen.getByLabelText('Password')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Sign In' })).toBeInTheDocument();
    expect(screen.getByText('Create one')).toBeInTheDocument();
  });

  it('should show validation errors for empty fields on submit', async () => {
    const user = userEvent.setup();
    render(<LoginForm />);

    await user.click(screen.getByRole('button', { name: 'Sign In' }));

    expect(await screen.findByText('Email is required')).toBeInTheDocument();
    expect(screen.getByText('Password is required')).toBeInTheDocument();
    expect(loginMock).not.toHaveBeenCalled();
  });

  it('should show validation error for invalid email', async () => {
    const user = userEvent.setup();
    render(<LoginForm />);

    await user.type(screen.getByLabelText('Email'), 'not-an-email');
    await user.type(screen.getByLabelText('Password'), 'Password1');
    await user.click(screen.getByRole('button', { name: 'Sign In' }));

    expect(await screen.findByText('Please enter a valid email address')).toBeInTheDocument();
    expect(loginMock).not.toHaveBeenCalled();
  });

  it('should show validation error for short password', async () => {
    const user = userEvent.setup();
    render(<LoginForm />);

    await user.type(screen.getByLabelText('Email'), 'test@example.com');
    await user.type(screen.getByLabelText('Password'), 'short');
    await user.click(screen.getByRole('button', { name: 'Sign In' }));

    expect(await screen.findByText('Password must be at least 8 characters')).toBeInTheDocument();
    expect(loginMock).not.toHaveBeenCalled();
  });

  it('should call login and redirect on success', async () => {
    loginMock.mockResolvedValueOnce({ user: { id: '1' }, message: 'OK' });
    const user = userEvent.setup();
    render(<LoginForm />);

    await user.type(screen.getByLabelText('Email'), 'test@example.com');
    await user.type(screen.getByLabelText('Password'), 'Password1');
    await user.click(screen.getByRole('button', { name: 'Sign In' }));

    await waitFor(() => {
      expect(loginMock).toHaveBeenCalledWith({
        email: 'test@example.com',
        password: 'Password1',
      });
    });

    await waitFor(() => {
      expect(pushMock).toHaveBeenCalledWith('/');
    });
  });

  it('should show server error on failure', async () => {
    loginMock.mockRejectedValueOnce({ message: 'Invalid credentials', statusCode: 401 });
    const user = userEvent.setup();
    render(<LoginForm />);

    await user.type(screen.getByLabelText('Email'), 'test@example.com');
    await user.type(screen.getByLabelText('Password'), 'Password1');
    await user.click(screen.getByRole('button', { name: 'Sign In' }));

    expect(await screen.findByRole('alert')).toBeInTheDocument();
    expect(screen.getByText('Invalid credentials')).toBeInTheDocument();
    expect(pushMock).not.toHaveBeenCalled();
  });

  it('should show generic message when error has no message', async () => {
    loginMock.mockRejectedValueOnce({});
    const user = userEvent.setup();
    render(<LoginForm />);

    await user.type(screen.getByLabelText('Email'), 'test@example.com');
    await user.type(screen.getByLabelText('Password'), 'Password1');
    await user.click(screen.getByRole('button', { name: 'Sign In' }));

    expect(await screen.findByRole('alert')).toBeInTheDocument();
    expect(screen.getByText('Login failed. Please try again.')).toBeInTheDocument();
  });

  it('should have link to register page', () => {
    render(<LoginForm />);
    const link = screen.getByText('Create one');
    expect(link.closest('a')).toHaveAttribute('href', '/register');
  });
});
