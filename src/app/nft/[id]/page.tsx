import { NFTDetailsClientPage } from './client-page';
import ClientOnly from '@/components/ClientOnly';

// For static export, generate static params
export async function generateStaticParams() {
  // Return empty array for now - pages will be generated on demand
  // In production, you'd fetch all NFT IDs from the database/API here
  return [];
}

interface NFTDetailsPageProps {
  params: Promise<{ id: string }>;
}

export default async function NFTDetailsPage({ params }: NFTDetailsPageProps) {
  // Await the params promise
  const resolvedParams = await params;
  
  return (
    <ClientOnly fallback={
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-white text-xl">Loading NFT Details...</div>
      </div>
    }>
      <NFTDetailsClientPage params={resolvedParams} />
    </ClientOnly>
  );
}