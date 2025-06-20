'use client';

import { useEffect, useState } from 'react';
import { MockClaim } from '@/components/mock-claim';
import { ClaimData } from '@/lib/types';
import Header from '@/components/header';
import Footer from '@/components/footer';

export default function ClaimSummaryPage() {
  const [claimData, setClaimData] = useState<ClaimData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    try {
      const data = sessionStorage.getItem('claimData');
      if (data) {
        setClaimData(JSON.parse(data));
      }
    } catch (error) {
      console.error("Failed to parse claim data from sessionStorage", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  if (isLoading) {
    return (
        <div className="flex flex-col min-h-screen bg-white">
            <Header />
            <main className="flex-1 flex flex-col items-center justify-center">
                <div className="text-xl text-gray-600 animate-pulse">Loading claim data...</div>
            </main>
            <Footer />
      </div>
    );
  }

  if (!claimData) {
    return (
      <div className="flex flex-col min-h-screen bg-white">
        <Header />
        <main className="flex-1 flex flex-col items-center justify-center text-center">
            <h1 className="text-2xl font-bold text-red-600 mb-2">No Claim Data Found</h1>
            <p className="text-gray-600">We couldn't find any claim information. Please start the process again.</p>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-white">
      <Header />
      <main className="flex-1 flex flex-col items-center justify-center p-4">
        <MockClaim claimData={claimData} />
      </main>
      <Footer />
    </div>
  );
} 