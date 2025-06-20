'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from "@/components/ui/button";
import { ClaimData } from '@/lib/types';
import { useEffect, useState } from 'react';

export function MockClaim({ claimData }: { claimData: ClaimData }) {
  const data = claimData;

  return (
    <Card className="w-full max-w-4xl mx-auto my-8 shadow-lg border-2 border-gray-200 animate-in fade-in duration-500">
      <CardHeader className="bg-red-600 text-white">
        <CardTitle className="text-2xl font-bold">Claim Summary</CardTitle>
        <CardDescription className="text-red-100">Review the details of your claim below.</CardDescription>
      </CardHeader>
      <CardContent className="p-6 grid gap-6">
        <div>
          <h3 className="text-xl font-bold text-gray-800 mb-2">Incident Details</h3>
          <p><strong>Date & Time:</strong> {data.incident_details?.date_time || 'N/A'}</p>
          <p><strong>Location:</strong> {data.incident_details?.location || 'N/A'}</p>
          <p><strong>Description:</strong> {data.incident_details?.description || 'N/A'}</p>
        </div>
        <div>
          <h3 className="text-xl font-bold text-gray-800 mb-2">Your Vehicle</h3>
          <p><strong>Vehicle:</strong> {data.your_vehicle?.make_model || 'N/A'}</p>
          <p><strong>License Plate:</strong> {data.your_vehicle?.license_plate || 'N/A'}</p>
        </div>
        <div>
          <h3 className="text-xl font-bold text-gray-800 mb-2">Other Parties Involved</h3>
          {data.other_parties_involved?.map((party, index) => (
            <div key={index} className="mb-2">
              <p><strong>Name:</strong> {party.name || 'N/A'}</p>
              <p><strong>Phone:</strong> {party.phone || 'N/A'}</p>
              <p><strong>Insurance Provider:</strong> {party.insurance?.provider || 'N/A'}</p>
              <p><strong>Policy Number:</strong> {party.insurance?.policy_number || 'N/A'}</p>
              {party.vehicle && <p><strong>Vehicle:</strong> {party.vehicle?.make_model || 'N/A'}</p>}
            </div>
          ))}
        </div>
        <div>
          <h3 className="text-xl font-bold text-gray-800 mb-2">Injuries</h3>
          {data.injuries?.map((injury, index) => (
             <div key={index} className="mb-2">
                <p><strong>Description:</strong> {injury.description || 'N/A'}</p>
                <p><strong>Severity:</strong> {injury.severity || 'N/A'}</p>
             </div>
           ))}
        </div>
        <div>
          <h3 className="text-xl font-bold text-gray-800 mb-2">Police Report</h3>
          <p><strong>Filed:</strong> {data.police_report?.filed ? 'Yes' : 'No'}</p>
          {data.police_report?.filed && (
             <>
               <p><strong>Report Number:</strong> {data.police_report?.report_number || 'N/A'}</p>
               <p><strong>Officer Name:</strong> {data.police_report?.officer_name || 'N/A'}</p>
             </>
           )}
        </div>
        <div className="flex justify-end space-x-4 mt-6">
            <Button variant="outline">Edit Information</Button>
            <Button className="bg-[#E41B23] text-white hover:bg-[#c4161c]">Submit Claim</Button>
        </div>
      </CardContent>
    </Card>
  );
} 