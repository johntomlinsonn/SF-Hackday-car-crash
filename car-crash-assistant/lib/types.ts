export interface ClaimData {
  incident_details: {
    date_time: string | null;
    location: string | null;
    description: string | null;
  };
  your_vehicle: {
    make_model: string | null;
    license_plate: string | null;
  };
  other_parties_involved: {
    name: string | null;
    phone: string | null;
    insurance: {
      provider: string | null;
      policy_number: string | null;
    };
    vehicle?: {
      make_model: string | null;
      license_plate: string | null;
    };
  }[];
  injuries: {
    description: string | null;
    severity: string | null;
  }[];
  police_report: {
    filed: boolean;
    report_number: string | null;
    officer_name: string | null;
  };
} 