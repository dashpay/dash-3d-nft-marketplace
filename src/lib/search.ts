import { NFT3D, NFTListing, NFTAuction, SearchFilters, SortOptions } from '@/types/nft';

export interface NFTWithListing extends NFT3D {
  listing?: NFTListing | NFTAuction;
}

export function searchAndFilterNFTs(
  nfts: NFTWithListing[],
  filters: SearchFilters,
  sortBy: SortOptions = SortOptions.RECENT
): NFTWithListing[] {
  let filteredNFTs = [...nfts];

  // Text search
  if (filters.query) {
    const query = filters.query.toLowerCase();
    filteredNFTs = filteredNFTs.filter(nft => 
      nft.name.toLowerCase().includes(query) ||
      nft.description?.toLowerCase().includes(query) ||
      nft.collection?.toLowerCase().includes(query) ||
      nft.creator?.toLowerCase().includes(query)
    );
  }

  // Collection filter
  if (filters.collections?.length) {
    filteredNFTs = filteredNFTs.filter(nft => 
      nft.collection && filters.collections!.includes(nft.collection)
    );
  }

  // Creator filter
  if (filters.creators?.length) {
    filteredNFTs = filteredNFTs.filter(nft => 
      nft.creator && filters.creators!.includes(nft.creator)
    );
  }

  // Price range filter
  if (filters.priceRange?.min !== undefined || filters.priceRange?.max !== undefined) {
    filteredNFTs = filteredNFTs.filter(nft => {
      const price = extractPrice(nft.listing?.price || nft.price);
      if (price === null) return false;
      
      const { min, max } = filters.priceRange!;
      if (min !== undefined && price < min) return false;
      if (max !== undefined && price > max) return false;
      
      return true;
    });
  }

  // Rarity filter
  if (filters.rarity?.length) {
    filteredNFTs = filteredNFTs.filter(nft => 
      nft.rarity && filters.rarity!.includes(nft.rarity)
    );
  }

  // Listing type filter
  if (filters.listingType?.length) {
    filteredNFTs = filteredNFTs.filter(nft => 
      nft.listing && filters.listingType!.includes(nft.listing.listingType)
    );
  }

  // Status filter
  if (filters.status?.length) {
    filteredNFTs = filteredNFTs.filter(nft => 
      nft.listing && filters.status!.includes(nft.listing.status)
    );
  }

  // Geometry type filter
  if (filters.geometryType?.length) {
    filteredNFTs = filteredNFTs.filter(nft => 
      filters.geometryType!.includes(nft.geometryType)
    );
  }

  // Sort results
  return sortNFTs(filteredNFTs, sortBy);
}

export function sortNFTs(nfts: NFTWithListing[], sortBy: SortOptions): NFTWithListing[] {
  const sortedNFTs = [...nfts];
  
  switch (sortBy) {
    case SortOptions.RECENT:
      return sortedNFTs.sort((a, b) => {
        const aTime = a.listing?.createdAt || a.createdAt;
        const bTime = b.listing?.createdAt || b.createdAt;
        return bTime - aTime;
      });
      
    case SortOptions.PRICE_LOW:
      return sortedNFTs.sort((a, b) => {
        const priceA = extractPrice(a.listing?.price || a.price) || 0;
        const priceB = extractPrice(b.listing?.price || b.price) || 0;
        return priceA - priceB;
      });
      
    case SortOptions.PRICE_HIGH:
      return sortedNFTs.sort((a, b) => {
        const priceA = extractPrice(a.listing?.price || a.price) || 0;
        const priceB = extractPrice(b.listing?.price || b.price) || 0;
        return priceB - priceA;
      });
      
    case SortOptions.NAME_AZ:
      return sortedNFTs.sort((a, b) => a.name.localeCompare(b.name));
      
    case SortOptions.NAME_ZA:
      return sortedNFTs.sort((a, b) => b.name.localeCompare(a.name));
      
    case SortOptions.ENDING_SOON:
      return sortedNFTs.sort((a, b) => {
        const aAuction = a.listing as NFTAuction;
        const bAuction = b.listing as NFTAuction;
        
        if (!aAuction?.endTime && !bAuction?.endTime) return 0;
        if (!aAuction?.endTime) return 1;
        if (!bAuction?.endTime) return -1;
        
        return aAuction.endTime - bAuction.endTime;
      });
      
    case SortOptions.MOST_BIDS:
      return sortedNFTs.sort((a, b) => {
        const aAuction = a.listing as NFTAuction;
        const bAuction = b.listing as NFTAuction;
        
        const aBids = aAuction?.totalBids || 0;
        const bBids = bAuction?.totalBids || 0;
        
        return bBids - aBids;
      });
      
    case SortOptions.RARITY:
      const rarityOrder = ['Common', 'Rare', 'Epic', 'Legendary', 'Mythic'];
      return sortedNFTs.sort((a, b) => {
        const aRarity = a.rarity ? rarityOrder.indexOf(a.rarity) : -1;
        const bRarity = b.rarity ? rarityOrder.indexOf(b.rarity) : -1;
        return bRarity - aRarity;
      });
      
    default:
      return sortedNFTs;
  }
}

export function extractPrice(priceString?: string): number | null {
  if (!priceString) return null;
  
  const match = priceString.match(/(\d+\.?\d*)/);
  return match ? parseFloat(match[1]) : null;
}

export function formatPrice(price: number | string, currency: string = 'DASH'): string {
  const numPrice = typeof price === 'string' ? parseFloat(price) : price;
  return `${numPrice.toFixed(1)} ${currency}`;
}

export function getUniqueValues<T>(items: T[], key: keyof T): string[] {
  const values = items
    .map(item => item[key])
    .filter(value => typeof value === 'string' && value.length > 0) as string[];
  
  return Array.from(new Set(values)).sort();
}

export function isAuction(listing?: NFTListing | NFTAuction): listing is NFTAuction {
  return listing?.listingType === 'auction';
}

export function isAuctionActive(auction: NFTAuction): boolean {
  const now = Date.now();
  return auction.status === 'active' && now >= auction.startTime && now < auction.endTime;
}

export function getTimeUntilAuctionEnd(auction: NFTAuction): number {
  return Math.max(0, auction.endTime - Date.now());
}

export function formatTimeRemaining(ms: number): string {
  if (ms <= 0) return 'Ended';
  
  const days = Math.floor(ms / (1000 * 60 * 60 * 24));
  const hours = Math.floor((ms % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((ms % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((ms % (1000 * 60)) / 1000);
  
  if (days > 0) return `${days}d ${hours}h`;
  if (hours > 0) return `${hours}h ${minutes}m`;
  if (minutes > 0) return `${minutes}m ${seconds}s`;
  return `${seconds}s`;
}