import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { useRouter } from 'next/navigation';
import { QuickActions } from '../QuickActions';

jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}));

describe('QuickActions', () => {
  const mockPush = jest.fn();

  beforeEach(() => {
    (useRouter as jest.Mock).mockReturnValue({
      push: mockPush,
    });
    mockPush.mockClear();
  });

  it('renders all action buttons', () => {
    render(<QuickActions />);
    
    expect(screen.getByText('Mint New NFT')).toBeInTheDocument();
    expect(screen.getByText('Browse Gallery')).toBeInTheDocument();
    expect(screen.getByText('Marketplace')).toBeInTheDocument();
  });

  it('navigates to mint page when mint button is clicked', () => {
    render(<QuickActions />);
    
    fireEvent.click(screen.getByText('Mint New NFT'));
    expect(mockPush).toHaveBeenCalledWith('/mint');
  });

  it('navigates to gallery when gallery button is clicked', () => {
    render(<QuickActions />);
    
    fireEvent.click(screen.getByText('Browse Gallery'));
    expect(mockPush).toHaveBeenCalledWith('/gallery');
  });

  it('navigates to marketplace when marketplace button is clicked', () => {
    render(<QuickActions />);
    
    fireEvent.click(screen.getByText('Marketplace'));
    expect(mockPush).toHaveBeenCalledWith('/gallery?tab=marketplace');
  });
});