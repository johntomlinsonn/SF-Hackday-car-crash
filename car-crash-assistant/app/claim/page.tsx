"use client";
import { useSearchParams } from "next/navigation";
import React, { useState, useEffect } from "react";

// Enhanced extraction for names from natural language
function extractName(summary: string | null) {
  if (!summary) return { firstName: "", lastName: "" };
  // Try to match "My name is John Doe" or "I'm John Doe"
  const nameRegex = /(?:my name is|i am|i'm)\s+([A-Z][a-z]+)\s+([A-Z][a-z]+)/i;
  const match = summary.match(nameRegex);
  if (match) {
    return { firstName: match[1], lastName: match[2] };
  }
  // Fallback to previous method
  return {
    firstName: extractField(summary, "First Name"),
    lastName: extractField(summary, "Last Name"),
  };
}

function extractField(summary: string | null, field: string): string {
  if (!summary) return "";
  const regex = new RegExp(`${field}:\\s*([\\w\\s-]+)`, "i");
  const match = summary.match(regex);
  return match ? match[1].trim() : "";
}

export default function ClaimPage() {
  const searchParams = useSearchParams();
  const summary = searchParams.get("summary");

  const [fields, setFields] = useState({
    firstName: "",
    lastName: "",
    email: "",
    agentName: "",
    carMake: "",
    carModel: "",
    carYear: "",
    licensePlate: "",
    otherVehicleMake: "",
    otherVehicleModel: "",
    otherVehicleYear: "",
    otherLicensePlate: "",
  });

  useEffect(() => {
    if (summary) {
      const name = extractName(summary);
      setFields({
        firstName: name.firstName,
        lastName: name.lastName,
        email: extractField(summary, "Email"),
        agentName: extractField(summary, "Agent Name") || extractField(summary, "Agent"),
        carMake: extractField(summary, "Car Make"),
        carModel: extractField(summary, "Car Model"),
        carYear: extractField(summary, "Car Year"),
        licensePlate: extractField(summary, "License Plate"),
        otherVehicleMake: extractField(summary, "Other Vehicle Make"),
        otherVehicleModel: extractField(summary, "Other Vehicle Model"),
        otherVehicleYear: extractField(summary, "Other Vehicle Year"),
        otherLicensePlate: extractField(summary, "Other License Plate"),
      });
    }
  }, [summary]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFields({ ...fields, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert("Claim submitted!\n\n" + JSON.stringify(fields, null, 2));
  };

  const red = "#E41B23";

  return (
    <div
      style={{
        maxWidth: 600,
        margin: "2rem auto",
        fontFamily: "Segoe UI, Arial, sans-serif",
        background: "#fff",
        borderRadius: 16,
        boxShadow: "0 4px 24px rgba(0,0,0,0.08)",
        overflow: "hidden",
      }}
    >
      {/* Header */}
      <div
        style={{
          background: red,
          color: "#fff",
          padding: "2rem 1rem 3.5rem 1rem",
          textAlign: "center",
          position: "relative",
        }}
      >
        <h1 style={{ fontWeight: 900, fontSize: 32, letterSpacing: 1 }}>State Farm Claim</h1>
      </div>

      {/* Agent Bubble */}
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", marginTop: 24 }}>
        <div
          style={{
            width: 96,
            height: 96,
            borderRadius: "50%",
            background: "#fff",
            border: `4px solid ${red}`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
            overflow: "hidden",
          }}
        >
          <img
            src="/mandy-reed-image.png"
            alt="Agent Mandy Reed"
            style={{ width: 80, height: 80, borderRadius: "50%", objectFit: "cover" }}
          />
        </div>
        <div
          style={{
            marginTop: 12,
            background: "#f8d7da",
            color: red,
            padding: "10px 20px",
            borderRadius: 16,
            fontWeight: 500,
            fontSize: 16,
            boxShadow: "0 1px 4px rgba(0,0,0,0.04)",
            textAlign: "center",
            maxWidth: 320,
          }}
        >
          We saw your agent is:
          <div style={{ fontWeight: 700, fontSize: 20, marginTop: 4 }}>
            {fields.agentName || "Mandy Reed"}
          </div>
        </div>
      </div>

      {/* Form */}
      <form
        onSubmit={handleSubmit}
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 18,
          padding: "2rem 2rem 1rem 2rem",
        }}
      >
        <label style={{ fontWeight: 600, color: "#333" }}>
          First Name:
          <input
            name="firstName"
            value={fields.firstName}
            onChange={handleChange}
            style={{
              width: "100%",
              padding: "10px",
              borderRadius: 8,
              border: "1px solid #ddd",
              marginTop: 4,
              marginBottom: 0,
              fontSize: 16,
            }}
          />
        </label>
        <label style={{ fontWeight: 600, color: "#333" }}>
          Last Name:
          <input
            name="lastName"
            value={fields.lastName}
            onChange={handleChange}
            style={{
              width: "100%",
              padding: "10px",
              borderRadius: 8,
              border: "1px solid #ddd",
              marginTop: 4,
              marginBottom: 0,
              fontSize: 16,
            }}
          />
        </label>
        <label style={{ fontWeight: 600, color: "#333" }}>
          Email Address:
          <input
            name="email"
            type="email"
            value={fields.email}
            onChange={handleChange}
            style={{
              width: "100%",
              padding: "10px",
              borderRadius: 8,
              border: "1px solid #ddd",
              marginTop: 4,
              marginBottom: 0,
              fontSize: 16,
            }}
          />
        </label>
        <div
          style={{
            borderTop: `2px solid ${red}`,
            margin: "1.5rem 0 0.5rem 0",
            paddingTop: "1rem",
            fontWeight: 700,
            color: red,
            fontSize: 18,
            letterSpacing: 1,
          }}
        >
          Your Vehicle
        </div>
        <label style={{ fontWeight: 600, color: "#333" }}>
          Make:
          <input
            name="carMake"
            value={fields.carMake}
            onChange={handleChange}
            style={{
              width: "100%",
              padding: "10px",
              borderRadius: 8,
              border: "1px solid #ddd",
              marginTop: 4,
              marginBottom: 0,
              fontSize: 16,
            }}
          />
        </label>
        <label style={{ fontWeight: 600, color: "#333" }}>
          Model:
          <input
            name="carModel"
            value={fields.carModel}
            onChange={handleChange}
            style={{
              width: "100%",
              padding: "10px",
              borderRadius: 8,
              border: "1px solid #ddd",
              marginTop: 4,
              marginBottom: 0,
              fontSize: 16,
            }}
          />
        </label>
        <label style={{ fontWeight: 600, color: "#333" }}>
          Year:
          <input
            name="carYear"
            value={fields.carYear}
            onChange={handleChange}
            style={{
              width: "100%",
              padding: "10px",
              borderRadius: 8,
              border: "1px solid #ddd",
              marginTop: 4,
              marginBottom: 0,
              fontSize: 16,
            }}
          />
        </label>
        <label style={{ fontWeight: 600, color: "#333" }}>
          License Plate:
          <input
            name="licensePlate"
            value={fields.licensePlate}
            onChange={handleChange}
            style={{
              width: "100%",
              padding: "10px",
              borderRadius: 8,
              border: "1px solid #ddd",
              marginTop: 4,
              marginBottom: 0,
              fontSize: 16,
            }}
          />
        </label>
        <div
          style={{
            borderTop: `2px solid ${red}`,
            margin: "1.5rem 0 0.5rem 0",
            paddingTop: "1rem",
            fontWeight: 700,
            color: red,
            fontSize: 18,
            letterSpacing: 1,
          }}
        >
          Other Vehicle
        </div>
        <label style={{ fontWeight: 600, color: "#333" }}>
          Make:
          <input
            name="otherVehicleMake"
            value={fields.otherVehicleMake}
            onChange={handleChange}
            style={{
              width: "100%",
              padding: "10px",
              borderRadius: 8,
              border: "1px solid #ddd",
              marginTop: 4,
              marginBottom: 0,
              fontSize: 16,
            }}
          />
        </label>
        <label style={{ fontWeight: 600, color: "#333" }}>
          Model:
          <input
            name="otherVehicleModel"
            value={fields.otherVehicleModel}
            onChange={handleChange}
            style={{
              width: "100%",
              padding: "10px",
              borderRadius: 8,
              border: "1px solid #ddd",
              marginTop: 4,
              marginBottom: 0,
              fontSize: 16,
            }}
          />
        </label>
        <label style={{ fontWeight: 600, color: "#333" }}>
          Year:
          <input
            name="otherVehicleYear"
            value={fields.otherVehicleYear}
            onChange={handleChange}
            style={{
              width: "100%",
              padding: "10px",
              borderRadius: 8,
              border: "1px solid #ddd",
              marginTop: 4,
              marginBottom: 0,
              fontSize: 16,
            }}
          />
        </label>
        <label style={{ fontWeight: 600, color: "#333" }}>
          License Plate:
          <input
            name="otherLicensePlate"
            value={fields.otherLicensePlate}
            onChange={handleChange}
            style={{
              width: "100%",
              padding: "10px",
              borderRadius: 8,
              border: "1px solid #ddd",
              marginTop: 4,
              marginBottom: 0,
              fontSize: 16,
            }}
          />
        </label>
        <button
          type="submit"
          style={{
            marginTop: 24,
            padding: "14px 0",
            fontWeight: "bold",
            background: red,
            color: "#fff",
            border: "none",
            borderRadius: 8,
            fontSize: 18,
            letterSpacing: 1,
            boxShadow: "0 2px 8px rgba(228,27,35,0.10)",
            cursor: "pointer",
            transition: "background 0.2s",
          }}
        >
          Submit Claim
        </button>
      </form>
      <h2 style={{ marginTop: 32, color: red, fontWeight: 700, fontSize: 20 }}>Call Summary</h2>
      <pre
        style={{
          background: "#f8d7da",
          padding: 16,
          whiteSpace: "pre-wrap",
          borderRadius: 8,
          color: "#333",
          margin: "0 2rem 2rem 2rem",
        }}
      >
        {summary || "No summary provided."}
      </pre>
    </div>
  );
}