import React from 'react';
import { render, screen } from '@testing-library/react';
import { UserStats } from '../UserStats';

describe('UserStats', () => {
  it('renders stats with correct values', () => {
    render(<UserStats ownedCount={5} mintedCount={3} />);
    
    expect(screen.getByText('5')).toBeInTheDocument();
    expect(screen.getByText('3')).toBeInTheDocument();
    expect(screen.getByText('Owned NFTs')).toBeInTheDocument();
    expect(screen.getByText('Minted NFTs')).toBeInTheDocument();
    expect(screen.getByText('Total Value')).toBeInTheDocument();
  });

  it('renders with zero values', () => {
    render(<UserStats ownedCount={0} mintedCount={0} />);
    
    expect(screen.getAllByText('0')).toHaveLength(2);
    expect(screen.getByText('Owned NFTs')).toBeInTheDocument();
    expect(screen.getByText('Minted NFTs')).toBeInTheDocument();
  });
});