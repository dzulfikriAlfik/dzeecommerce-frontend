import { describe, it, expect } from 'vitest';
import { loginSchema, registerSchema } from '@/modules/auth/schemas/auth.schema';

describe('loginSchema', () => {
  it('should pass with valid credentials', () => {
    const result = loginSchema.safeParse({
      email: 'user@example.com',
      password: 'Password1',
    });
    expect(result.success).toBe(true);
  });

  it('should fail when email is empty', () => {
    const result = loginSchema.safeParse({ email: '', password: 'Password1' });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0]?.message).toBe('Email is required');
    }
  });

  it('should fail when email is invalid', () => {
    const result = loginSchema.safeParse({ email: 'not-an-email', password: 'Password1' });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0]?.message).toBe('Please enter a valid email address');
    }
  });

  it('should fail when password is empty', () => {
    const result = loginSchema.safeParse({ email: 'user@example.com', password: '' });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0]?.message).toBe('Password is required');
    }
  });

  it('should fail when password is too short', () => {
    const result = loginSchema.safeParse({ email: 'user@example.com', password: 'short' });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0]?.message).toBe('Password must be at least 8 characters');
    }
  });
});

describe('registerSchema', () => {
  const validData = {
    name: 'John Doe',
    email: 'john@example.com',
    password: 'Password1',
    passwordConfirmation: 'Password1',
  };

  it('should pass with valid data', () => {
    const result = registerSchema.safeParse(validData);
    expect(result.success).toBe(true);
  });

  it('should fail when name is empty', () => {
    const result = registerSchema.safeParse({ ...validData, name: '' });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0]?.message).toBe('Name is required');
    }
  });

  it('should fail when name is too short', () => {
    const result = registerSchema.safeParse({ ...validData, name: 'A' });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0]?.message).toBe('Name must be at least 2 characters');
    }
  });

  it('should fail when email is invalid', () => {
    const result = registerSchema.safeParse({ ...validData, email: 'invalid' });
    expect(result.success).toBe(false);
  });

  it('should fail when password lacks uppercase', () => {
    const result = registerSchema.safeParse({ ...validData, password: 'password1', passwordConfirmation: 'password1' });
    expect(result.success).toBe(false);
    if (!result.success) {
      const messages = result.error.issues.map((i) => i.message);
      expect(messages).toContain('Password must contain at least one uppercase letter');
    }
  });

  it('should fail when password lacks lowercase', () => {
    const result = registerSchema.safeParse({ ...validData, password: 'PASSWORD1', passwordConfirmation: 'PASSWORD1' });
    expect(result.success).toBe(false);
    if (!result.success) {
      const messages = result.error.issues.map((i) => i.message);
      expect(messages).toContain('Password must contain at least one lowercase letter');
    }
  });

  it('should fail when password lacks number', () => {
    const result = registerSchema.safeParse({ ...validData, password: 'Passwordd', passwordConfirmation: 'Passwordd' });
    expect(result.success).toBe(false);
    if (!result.success) {
      const messages = result.error.issues.map((i) => i.message);
      expect(messages).toContain('Password must contain at least one number');
    }
  });

  it('should fail when passwords do not match', () => {
    const result = registerSchema.safeParse({ ...validData, passwordConfirmation: 'Different1' });
    expect(result.success).toBe(false);
    if (!result.success) {
      const messages = result.error.issues.map((i) => i.message);
      expect(messages).toContain('Passwords do not match');
    }
  });

  it('should fail when password confirmation is empty', () => {
    const result = registerSchema.safeParse({ ...validData, passwordConfirmation: '' });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0]?.message).toBe('Password confirmation is required');
    }
  });
});
