import { describe, it, expect, vi, beforeEach } from 'vitest';
import userEvent from '@testing-library/user-event';
import { render, screen, waitFor } from '../../../helpers/render';
import { RegisterForm } from '@/modules/auth/components/register-form';

// ── Mocks ────────────────────────────────────────────────────────────────────

const pushMock = vi.fn();
vi.mock('next/navigation', () => ({
  useRouter: () => ({ push: pushMock }),
}));

const registerMock = vi.fn();
vi.mock('@/hooks/use-auth', () => ({
  useAuth: () => ({
    login: vi.fn(),
    register: registerMock,
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

// ── Helpers ──────────────────────────────────────────────────────────────────

async function fillValidForm(user: ReturnType<typeof userEvent.setup>) {
  await user.type(screen.getByLabelText('Full Name'), 'John Doe');
  await user.type(screen.getByLabelText('Email'), 'john@example.com');
  await user.type(screen.getByLabelText('Password'), 'Password1');
  await user.type(screen.getByLabelText('Confirm Password'), 'Password1');
}

// ── Tests ────────────────────────────────────────────────────────────────────

describe('RegisterForm', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render the registration form', () => {
    render(<RegisterForm />);

    expect(screen.getByText('Create an account')).toBeInTheDocument();
    expect(screen.getByLabelText('Full Name')).toBeInTheDocument();
    expect(screen.getByLabelText('Email')).toBeInTheDocument();
    expect(screen.getByLabelText('Password')).toBeInTheDocument();
    expect(screen.getByLabelText('Confirm Password')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Create Account' })).toBeInTheDocument();
    expect(screen.getByText('Sign in')).toBeInTheDocument();
  });

  it('should show validation errors for empty fields', async () => {
    const user = userEvent.setup();
    render(<RegisterForm />);

    await user.click(screen.getByRole('button', { name: 'Create Account' }));

    expect(await screen.findByText('Name is required')).toBeInTheDocument();
    expect(screen.getByText('Email is required')).toBeInTheDocument();
    expect(screen.getByText('Password is required')).toBeInTheDocument();
    expect(screen.getByText('Password confirmation is required')).toBeInTheDocument();
    expect(registerMock).not.toHaveBeenCalled();
  });

  it('should show error for short name', async () => {
    const user = userEvent.setup();
    render(<RegisterForm />);

    await user.type(screen.getByLabelText('Full Name'), 'A');
    await user.type(screen.getByLabelText('Email'), 'test@example.com');
    await user.type(screen.getByLabelText('Password'), 'Password1');
    await user.type(screen.getByLabelText('Confirm Password'), 'Password1');
    await user.click(screen.getByRole('button', { name: 'Create Account' }));

    expect(await screen.findByText('Name must be at least 2 characters')).toBeInTheDocument();
  });

  it('should show error for password without uppercase', async () => {
    const user = userEvent.setup();
    render(<RegisterForm />);

    await user.type(screen.getByLabelText('Full Name'), 'John Doe');
    await user.type(screen.getByLabelText('Email'), 'john@example.com');
    await user.type(screen.getByLabelText('Password'), 'password1');
    await user.type(screen.getByLabelText('Confirm Password'), 'password1');
    await user.click(screen.getByRole('button', { name: 'Create Account' }));

    expect(await screen.findByText('Password must contain at least one uppercase letter')).toBeInTheDocument();
  });

  it('should show error when passwords do not match', async () => {
    const user = userEvent.setup();
    render(<RegisterForm />);

    await user.type(screen.getByLabelText('Full Name'), 'John Doe');
    await user.type(screen.getByLabelText('Email'), 'john@example.com');
    await user.type(screen.getByLabelText('Password'), 'Password1');
    await user.type(screen.getByLabelText('Confirm Password'), 'Different1');
    await user.click(screen.getByRole('button', { name: 'Create Account' }));

    expect(await screen.findByText('Passwords do not match')).toBeInTheDocument();
  });

  it('should call register and redirect on success', async () => {
    registerMock.mockResolvedValueOnce({ user: { id: '1' }, message: 'Created' });
    const user = userEvent.setup();
    render(<RegisterForm />);

    await fillValidForm(user);
    await user.click(screen.getByRole('button', { name: 'Create Account' }));

    await waitFor(() => {
      expect(registerMock).toHaveBeenCalledWith({
        name: 'John Doe',
        email: 'john@example.com',
        password: 'Password1',
        passwordConfirmation: 'Password1',
      });
    });

    await waitFor(() => {
      expect(pushMock).toHaveBeenCalledWith('/');
    });
  });

  it('should show server error on failure', async () => {
    registerMock.mockRejectedValueOnce({
      message: 'Email already taken',
      statusCode: 409,
    });
    const user = userEvent.setup();
    render(<RegisterForm />);

    await fillValidForm(user);
    await user.click(screen.getByRole('button', { name: 'Create Account' }));

    expect(await screen.findByRole('alert')).toBeInTheDocument();
    expect(screen.getByText('Email already taken')).toBeInTheDocument();
    expect(pushMock).not.toHaveBeenCalled();
  });

  it('should show field-level errors from backend', async () => {
    registerMock.mockRejectedValueOnce({
      message: 'Validation failed',
      statusCode: 422,
      errors: { email: ['This email is already registered'] },
    });
    const user = userEvent.setup();
    render(<RegisterForm />);

    await fillValidForm(user);
    await user.click(screen.getByRole('button', { name: 'Create Account' }));

    expect(await screen.findByText('This email is already registered')).toBeInTheDocument();
  });

  it('should show generic message when error has no message', async () => {
    registerMock.mockRejectedValueOnce({});
    const user = userEvent.setup();
    render(<RegisterForm />);

    await fillValidForm(user);
    await user.click(screen.getByRole('button', { name: 'Create Account' }));

    expect(await screen.findByRole('alert')).toBeInTheDocument();
    expect(screen.getByText('Registration failed. Please try again.')).toBeInTheDocument();
  });

  it('should show password hint text', () => {
    render(<RegisterForm />);
    expect(
      screen.getByText('At least 8 characters with uppercase, lowercase, and a number'),
    ).toBeInTheDocument();
  });

  it('should have link to login page', () => {
    render(<RegisterForm />);
    const link = screen.getByText('Sign in');
    expect(link.closest('a')).toHaveAttribute('href', '/login');
  });
});
