import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { useStore } from '../store/useStore';
import { UsernameDisplay } from '../components/auth/UsernameDisplay';
import { LoginForm } from '../components/auth/LoginForm';
import { UserProfile } from '../components/auth/UserProfile';

// Mock the store
jest.mock('../store/useStore', () => ({
  useStore: jest.fn()
}));

describe('Authentication Components', () => {
  let mockStore: any;

  beforeEach(() => {
    mockStore = {
      identityId: null,
      username: null,
      isLoadingUsername: false,
      network: 'testnet',
      isAuthenticated: false,
      error: null,
      isLoading: false,
      login: jest.fn(),
      loginWithUsername: jest.fn(),
      logout: jest.fn(),
      setError: jest.fn()
    };
    (useStore as jest.Mock).mockReturnValue(mockStore);
  });

  describe('UsernameDisplay', () => {
    it('should display username when available', () => {
      mockStore.identityId = '5rvkYqKPPKPLnUvgRfuerT4o9CJ8qKRM8GBm2YGvVBXx';
      mockStore.username = 'alice';

      render(<UsernameDisplay />);

      expect(screen.getByText('@alice')).toBeInTheDocument();
    });

    it('should display truncated identity ID when username is not available', () => {
      mockStore.identityId = '5rvkYqKPPKPLnUvgRfuerT4o9CJ8qKRM8GBm2YGvVBXx';
      mockStore.username = null;

      render(<UsernameDisplay />);

      expect(screen.getByText('5rvkYqKP...GBm2YGvVBXx')).toBeInTheDocument();
    });

    it('should show full identity ID when showFullId is true', () => {
      mockStore.identityId = '5rvkYqKPPKPLnUvgRfuerT4o9CJ8qKRM8GBm2YGvVBXx';
      mockStore.username = 'alice';

      render(<UsernameDisplay showFullId={true} />);

      expect(screen.getByText('@alice')).toBeInTheDocument();
      expect(screen.getByText('(5rvkYqKP...GBm2YGvVBXx)')).toBeInTheDocument();
    });

    it('should show loading state', () => {
      mockStore.identityId = '5rvkYqKPPKPLnUvgRfuerT4o9CJ8qKRM8GBm2YGvVBXx';
      mockStore.isLoadingUsername = true;

      render(<UsernameDisplay />);

      expect(screen.getByText('Loading...')).toBeInTheDocument();
    });

    it('should not render when no identity ID', () => {
      mockStore.identityId = null;

      const { container } = render(<UsernameDisplay />);

      expect(container.firstChild).toBe(null);
    });
  });

  describe('LoginForm', () => {
    it('should render login form with input types', () => {
      render(<LoginForm />);

      expect(screen.getByLabelText('Identity ID or Username')).toBeInTheDocument();
      expect(screen.getByText('Auto-detect')).toBeInTheDocument();
      expect(screen.getByText('Identity ID')).toBeInTheDocument();
      expect(screen.getByText('Username')).toBeInTheDocument();
      expect(screen.getByText('Enter Gallery')).toBeInTheDocument();
    });

    it('should handle identity ID input', async () => {
      const mockLogin = jest.fn();
      mockStore.login = mockLogin;

      render(<LoginForm />);

      const input = screen.getByLabelText('Identity ID or Username');
      const button = screen.getByText('Enter Gallery');

      fireEvent.change(input, { target: { value: '5rvkYqKPPKPLnUvgRfuerT4o9CJ8qKRM8GBm2YGvVBXx' } });
      fireEvent.click(button);

      await waitFor(() => {
        expect(mockLogin).toHaveBeenCalledWith('5rvkYqKPPKPLnUvgRfuerT4o9CJ8qKRM8GBm2YGvVBXx');
      });
    });

    it('should handle username input', async () => {
      const mockLoginWithUsername = jest.fn();
      mockStore.loginWithUsername = mockLoginWithUsername;

      render(<LoginForm />);

      const input = screen.getByLabelText('Identity ID or Username');
      const button = screen.getByText('Enter Gallery');

      fireEvent.change(input, { target: { value: 'alice' } });
      fireEvent.click(button);

      await waitFor(() => {
        expect(mockLoginWithUsername).toHaveBeenCalledWith('alice');
      });
    });

    it('should switch input types', () => {
      render(<LoginForm />);

      const identityButton = screen.getByText('Identity ID');
      const usernameButton = screen.getByText('Username');

      fireEvent.click(identityButton);
      expect(screen.getByPlaceholderText(/e.g., 5rvkYqKPPKPLnUvgRfuerT4o9CJ8qKRM8GBm2YGvVBXx/)).toBeInTheDocument();

      fireEvent.click(usernameButton);
      expect(screen.getByPlaceholderText('e.g., alice')).toBeInTheDocument();
    });

    it('should handle Enter key press', async () => {
      const mockLogin = jest.fn();
      mockStore.login = mockLogin;

      render(<LoginForm />);

      const input = screen.getByLabelText('Identity ID or Username');

      fireEvent.change(input, { target: { value: '5rvkYqKPPKPLnUvgRfuerT4o9CJ8qKRM8GBm2YGvVBXx' } });
      fireEvent.keyPress(input, { key: 'Enter', code: 'Enter' });

      await waitFor(() => {
        expect(mockLogin).toHaveBeenCalledWith('5rvkYqKPPKPLnUvgRfuerT4o9CJ8qKRM8GBm2YGvVBXx');
      });
    });

    it('should show error message', () => {
      mockStore.error = 'Invalid identity ID';

      render(<LoginForm />);

      expect(screen.getByText('Invalid identity ID')).toBeInTheDocument();
    });

    it('should disable button when loading', () => {
      mockStore.isLoading = true;

      render(<LoginForm />);

      const button = screen.getByText('Authenticating...');
      expect(button).toBeDisabled();
    });

    it('should disable button when input is empty', () => {
      render(<LoginForm />);

      const button = screen.getByText('Enter Gallery');
      expect(button).toBeDisabled();
    });

    it('should show error for empty input', async () => {
      const mockSetError = jest.fn();
      mockStore.setError = mockSetError;

      render(<LoginForm />);

      const button = screen.getByText('Enter Gallery');
      fireEvent.click(button);

      await waitFor(() => {
        expect(mockSetError).toHaveBeenCalledWith('Please enter an identity ID or username');
      });
    });
  });

  describe('UserProfile', () => {
    it('should render user profile with identity info', () => {
      mockStore.identityId = '5rvkYqKPPKPLnUvgRfuerT4o9CJ8qKRM8GBm2YGvVBXx';
      mockStore.username = 'alice';
      mockStore.network = 'testnet';

      render(<UserProfile />);

      expect(screen.getByText('User Profile')).toBeInTheDocument();
      expect(screen.getByText('Username')).toBeInTheDocument();
      expect(screen.getByText('Identity ID')).toBeInTheDocument();
      expect(screen.getByText('Network')).toBeInTheDocument();
      expect(screen.getByText('TESTNET')).toBeInTheDocument();
      expect(screen.getByText('Logout')).toBeInTheDocument();
    });

    it('should show no username when not available', () => {
      mockStore.identityId = '5rvkYqKPPKPLnUvgRfuerT4o9CJ8qKRM8GBm2YGvVBXx';
      mockStore.username = null;

      render(<UserProfile />);

      expect(screen.getByText('No username registered')).toBeInTheDocument();
    });

    it('should show username loading state', () => {
      mockStore.identityId = '5rvkYqKPPKPLnUvgRfuerT4o9CJ8qKRM8GBm2YGvVBXx';
      mockStore.isLoadingUsername = true;

      render(<UserProfile />);

      expect(screen.getByText('Loading...')).toBeInTheDocument();
    });

    it('should handle logout', () => {
      mockStore.identityId = '5rvkYqKPPKPLnUvgRfuerT4o9CJ8qKRM8GBm2YGvVBXx';
      const mockLogout = jest.fn();
      mockStore.logout = mockLogout;

      render(<UserProfile />);

      const logoutButton = screen.getByText('Logout');
      fireEvent.click(logoutButton);

      expect(mockLogout).toHaveBeenCalled();
    });

    it('should show mainnet network badge', () => {
      mockStore.identityId = '5rvkYqKPPKPLnUvgRfuerT4o9CJ8qKRM8GBm2YGvVBXx';
      mockStore.network = 'mainnet';

      render(<UserProfile />);

      expect(screen.getByText('MAINNET')).toBeInTheDocument();
    });

    it('should show register username button when no username', () => {
      mockStore.identityId = '5rvkYqKPPKPLnUvgRfuerT4o9CJ8qKRM8GBm2YGvVBXx';
      mockStore.username = null;

      render(<UserProfile />);

      expect(screen.getByText('Register Username')).toBeInTheDocument();
    });

    it('should show manage username button when username exists', () => {
      mockStore.identityId = '5rvkYqKPPKPLnUvgRfuerT4o9CJ8qKRM8GBm2YGvVBXx';
      mockStore.username = 'alice';

      render(<UserProfile />);

      expect(screen.getByText('Manage Username')).toBeInTheDocument();
    });

    it('should not render when no identity ID', () => {
      mockStore.identityId = null;

      const { container } = render(<UserProfile />);

      expect(container.firstChild).toBe(null);
    });
  });
});