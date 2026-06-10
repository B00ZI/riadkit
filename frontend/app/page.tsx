"use client";
import { useEffect, useState } from "react";

export default function Home() {
  const [message, setMessage] = useState("Connecting to backend...");

  useEffect(() => {
    // Call your local Laravel API route
    fetch("http://192.168.100.53:8000/api/test")
      .then((res) => res.json())
      .then((data) => {
        setMessage(data.message);
    })  
      .catch((err) => {
        setMessage("Connection failed! Check your Laravel server or CORS settings.");
        console.error(err);
      });
  }, []);

  return (
    <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh", fontFamily: "sans-serif" }}>
      <div style={{ padding: "20px", border: "1px solid #ccc", borderRadius: "8px", textAlign: "center" }}>
        <h1 style={{ fontSize: "20px", marginBottom: "10px" }}>RiadKit System Test</h1>
        <p style={{ color: "#4a5568", fontWeight: "bold" }}>{message}</p>
      </div>
    </div>
  );
}