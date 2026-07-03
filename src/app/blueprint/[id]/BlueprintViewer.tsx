"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { 
  Sparkles, Users, DollarSign, MapPin, 
  Layers, Lightbulb, MonitorPlay, QrCode, 
  Heart, Edit3, Send, Bookmark, Check, X
} from "lucide-react";
import { useRouter } from "next/navigation";

interface Blueprint {
  id: string;
  eventType: string;
  guestCount: number;
  budget: number;
  venueType: string;
  theme: string;
  layout: string;
  colors: string[];
  lighting: string;
  flowers: string;
  stageStyle: string;
  decorStyle: string;
  notes: string[];
  createdAt: string;
  conceptImage?: string;
}

export default function BlueprintViewer({ 
  blueprint, 
  id 
}: { 
  blueprint: Blueprint; 
  id: string; 
}) {
  const router = useRouter();
  const [showArModal, setShowArModal] = useState(false);
  const [proposalStatus, setProposalStatus] = useState<"idle" | "requested">("idle");
  const [saveStatus, setSaveStatus] = useState<"idle" | "saved">("idle");
  const [devMode, setDevMode] = useState(false);

  const [showSaveModal, setShowSaveModal] = useState(false);
  const [saveEmail, setSaveEmail] = useState("");

  const [showProposalModal, setShowProposalModal] = useState(false);
  const [proposalData, setProposalData] = useState({ name: "", phone: "", email: "", eventDate: "", city: "", proposalType: "", notes: "" });

  const [showEditModal, setShowEditModal] = useState(false);
  const [editData, setEditData] = useState({
    theme: blueprint.theme || "",
    lighting: blueprint.lighting || "",
    guestCount: blueprint.guestCount || 0,
    venueType: blueprint.venueType || "",
    budget: blueprint.budget || 0,
    eventType: blueprint.eventType || "",
    layout: blueprint.layout || "",
    flowers: blueprint.flowers || "",
    decorStyle: blueprint.decorStyle || "",
    stageStyle: blueprint.stageStyle || ""
  });

  const handleRequestProposal = () => {
    setShowProposalModal(true);
  };

  const handleSaveDesign = () => {
    setShowSaveModal(true);
  };

  const submitSaveDesign = async () => {
    if (!saveEmail) return;
    try {
      await fetch("/api/save-design", {
        method: "POST",
        body: JSON.stringify({
          userEmail: saveEmail,
          blueprintId: id
        })
      });
      setShowSaveModal(false);
      setSaveStatus("saved");
      setTimeout(() => setSaveStatus("idle"), 4000);
    } catch (e) {
      console.error(e);
    }
  };

  const submitProposal = async () => {
    try {
      await fetch("/api/request-proposal", {
        method: "POST",
        body: JSON.stringify({
          blueprintId: id,
          ...proposalData
        })
      });
      setShowProposalModal(false);
      setProposalStatus("requested");
      setTimeout(() => setProposalStatus("idle"), 4000);
    } catch (e) {
      console.error(e);
    }
  };

  const submitEdit = async () => {
    try {
      await fetch("/api/regenerate-blueprint", {
        method: "POST",
        body: JSON.stringify({
          blueprintId: id,
          changes: {
            ...editData,
            guestCount: parseInt(editData.guestCount.toString(), 10) || 0,
            budget: parseFloat(editData.budget.toString()) || 0
          }
        })
      });
      setShowEditModal(false);
      router.refresh();
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div style={{
      minHeight: "100vh",
      backgroundColor: "#fcfbf9",
      color: "#111111",
      fontFamily: "'Inter', sans-serif",
      padding: "2.5rem 1.5rem",
      position: "relative",
      overflow: "hidden"
    }}>
      {/* Background Ambience */}
      <div style={{
        position: "absolute",
        top: "-15%",
        left: "-10%",
        width: "60%",
        height: "60%",
        borderRadius: "50%",
        background: "radial-gradient(circle, rgba(212, 160, 0, 0.06) 0%, transparent 70%)",
        filter: "blur(80px)",
        pointerEvents: "none",
        zIndex: 0
      }}></div>
      <div style={{
        position: "absolute",
        bottom: "-15%",
        right: "-10%",
        width: "60%",
        height: "60%",
        borderRadius: "50%",
        background: "radial-gradient(circle, rgba(244, 63, 94, 0.05) 0%, transparent 70%)",
        filter: "blur(80px)",
        pointerEvents: "none",
        zIndex: 0
      }}></div>

      {/* Floating Status Alerts */}
      {proposalStatus === "requested" && (
        <div style={{
          position: "fixed",
          bottom: "2rem",
          left: "50%",
          transform: "translateX(-50%)",
          zIndex: 1100,
          background: "rgba(16, 185, 129, 0.95)",
          backdropFilter: "blur(8px)",
          color: "#ffffff",
          padding: "1rem 2rem",
          borderRadius: "100px",
          fontWeight: "600",
          boxShadow: "0 10px 25px rgba(16, 185, 129, 0.3)",
          display: "flex",
          alignItems: "center",
          gap: "0.5rem",
          animation: "slideUp 0.3s ease-out"
        }}>
          <Check style={{ width: "1.2rem", height: "1.2rem" }} />
          Proposal Requested! Our sensory architects will contact you shortly.
        </div>
      )}

      {saveStatus === "saved" && (
        <div style={{
          position: "fixed",
          bottom: "2rem",
          left: "50%",
          transform: "translateX(-50%)",
          zIndex: 1100,
          background: "rgba(59, 130, 246, 0.95)",
          backdropFilter: "blur(8px)",
          color: "#ffffff",
          padding: "1rem 2rem",
          borderRadius: "100px",
          fontWeight: "600",
          boxShadow: "0 10px 25px rgba(59, 130, 246, 0.3)",
          display: "flex",
          alignItems: "center",
          gap: "0.5rem",
          animation: "slideUp 0.3s ease-out"
        }}>
          <Bookmark style={{ width: "1.2rem", height: "1.2rem" }} />
          Design successfully saved to your profile!
        </div>
      )}

      <div style={{ maxWidth: "1000px", margin: "0 auto", position: "relative", zIndex: 10, display: "flex", flexDirection: "column", gap: "2.5rem" }}>
        
        {/* Navigation & Client Header */}
        <header style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-end",
          borderBottom: "1px solid rgba(0, 0, 0, 0.08)",
          paddingBottom: "1.5rem",
          flexWrap: "wrap",
          gap: "1.5rem"
        }}>
          <div>
            <Link href="/ppm" style={{
              display: "inline-flex",
              alignItems: "center",
              fontSize: "0.85rem",
              color: "#6b7280",
              textDecoration: "none",
              marginBottom: "1rem",
              transition: "color 0.2s"
            }}
            onMouseOver={(e) => e.currentTarget.style.color = "#111111"}
            onMouseOut={(e) => e.currentTarget.style.color = "#6b7280"}
            >
              <span style={{ marginRight: "0.5rem" }}>←</span> Edit Preferences
            </Link>
            <div style={{
              display: "flex",
              alignItems: "center",
              gap: "0.5rem",
              color: "#d4a000",
              fontSize: "0.75rem",
              fontWeight: "600",
              letterSpacing: "0.15em",
              textTransform: "uppercase"
            }}>
              <Sparkles style={{ width: "0.85rem", height: "0.85rem" }} />
              <span>Your Curated Concept</span>
            </div>
            <h1 style={{
              fontSize: "2.5rem",
              fontWeight: "800",
              marginTop: "0.3rem",
              background: "linear-gradient(90deg, #111111, #3f3f46)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              letterSpacing: "-0.03em"
            }}>
              {blueprint.theme}
            </h1>
          </div>
          
          {/* Admin / Developer Mode Toggle */}
          <div>
            <button 
              onClick={() => setDevMode(!devMode)}
              style={{
                background: devMode ? "rgba(239, 68, 68, 0.15)" : "transparent",
                color: devMode ? "#ef4444" : "#52525b",
                border: `1px solid ${devMode ? "rgba(239, 68, 68, 0.3)" : "rgba(255, 255, 255, 0.1)"}`,
                padding: "0.5rem 1rem",
                borderRadius: "100px",
                fontSize: "0.75rem",
                fontWeight: "600",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: "0.4rem",
                transition: "all 0.2s"
              }}
            >
              <Layers style={{ width: "0.9rem", height: "0.9rem" }} />
              {devMode ? "Developer Mode: ON" : "Admin Mode"}
            </button>
          </div>
        </header>

        {/* Hero Concept Image & CTA */}
        <section style={{
          position: "relative",
          borderRadius: "28px",
          height: "380px",
          width: "100%",
          border: "1px solid rgba(255, 255, 255, 0.1)",
          boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.7)",
          display: "flex",
          flexDirection: "column",
          justifyContent: "flex-end",
          padding: "2.5rem",
          overflow: "hidden"
        }}>
          <Image
            src={blueprint.conceptImage || "/event-concept.png"}
            width={2560}
            height={1440}
            alt="Event Concept"
            style={{
              position: "absolute",
              inset: 0,
              width: "100%",
              height: "100%",
              objectFit: "cover",
              zIndex: 0
            }}
            quality={100}
            priority
          />
          {/* Overlay Darkening */}
          <div style={{
            position: "absolute",
            inset: 0,
            background: "linear-gradient(to top, rgba(8, 8, 10, 0.95) 0%, rgba(8, 8, 10, 0.4) 50%, transparent 100%)",
            zIndex: 1
          }}></div>

          <div style={{ position: "relative", zIndex: 2, display: "flex", justifyContent: "space-between", alignItems: "flex-end", flexWrap: "wrap", gap: "1.5rem" }}>
            <div>
              <button 
                onClick={() => setShowArModal(true)}
                style={{
                  padding: "1rem 2.2rem",
                  background: "linear-gradient(135deg, #d4a000, #ffa500)",
                  color: "#ffffff",
                  border: "none",
                  borderRadius: "100px",
                  fontWeight: "700",
                  fontSize: "1rem",
                  cursor: "pointer",
                  boxShadow: "0 10px 30px rgba(212, 160, 0, 0.35)",
                  display: "flex",
                  alignItems: "center",
                  gap: "0.6rem",
                  transition: "transform 0.2s, box-shadow 0.2s",
                  marginBottom: "0.8rem"
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.transform = "translateY(-3px)";
                  e.currentTarget.style.boxShadow = "0 12px 35px rgba(212, 160, 0, 0.5)";
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.boxShadow = "0 10px 30px rgba(212, 160, 0, 0.35)";
                }}
              >
                <QrCode style={{ width: "1.2rem", height: "1.2rem" }} />
                Generate AR Preview
              </button>
              
              <div style={{
                color: "rgba(255,255,255,0.9)",
                fontSize: "0.85rem",
                fontWeight: "500",
                display: "flex",
                alignItems: "center",
                gap: "0.4rem",
                marginLeft: "0.8rem",
                textShadow: "0 2px 5px rgba(0,0,0,0.5)"
              }}>
                ✨ AI Generated From Your Requirements
              </div>
            </div>


          </div>
        </section>

        {/* Client Concept Quick Stats */}
        <section style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
          gap: "1.25rem"
        }}>
          <div style={{
            background: "#ffffff",
            border: "1px solid rgba(0, 0, 0, 0.06)",
            borderRadius: "20px",
            padding: "1.5rem",
            boxShadow: "0 8px 25px rgba(0,0,0,0.03)"
          }}>
            <div style={{ color: "#6b7280", fontSize: "0.75rem", fontWeight: "600", textTransform: "uppercase", letterSpacing: "0.05em", display: "flex", alignItems: "center", gap: "0.4rem", marginBottom: "0.5rem" }}>
              <Users style={{ width: "0.9rem", height: "0.9rem", color: "#d4a000" }} />
              <span>Expected Guests</span>
            </div>
            <div style={{ fontSize: "1.3rem", fontWeight: "700", color: "#111111" }}>{blueprint.guestCount} Guests</div>
          </div>

          <div style={{
            background: "#ffffff",
            border: "1px solid rgba(0, 0, 0, 0.06)",
            borderRadius: "20px",
            padding: "1.5rem",
            boxShadow: "0 8px 25px rgba(0,0,0,0.03)"
          }}>
            <div style={{ color: "#6b7280", fontSize: "0.75rem", fontWeight: "600", textTransform: "uppercase", letterSpacing: "0.05em", display: "flex", alignItems: "center", gap: "0.4rem", marginBottom: "0.5rem" }}>
              <MapPin style={{ width: "0.9rem", height: "0.9rem", color: "#f43f5e" }} />
              <span>Event Venue</span>
            </div>
            <div style={{ fontSize: "1.3rem", fontWeight: "700", color: "#111111" }}>{blueprint.venueType}</div>
          </div>

          <div style={{
            background: "#ffffff",
            border: "1px solid rgba(0, 0, 0, 0.06)",
            borderRadius: "20px",
            padding: "1.5rem",
            boxShadow: "0 8px 25px rgba(0,0,0,0.03)"
          }}>
            <div style={{ color: "#6b7280", fontSize: "0.75rem", fontWeight: "600", textTransform: "uppercase", letterSpacing: "0.05em", display: "flex", alignItems: "center", gap: "0.4rem", marginBottom: "0.5rem" }}>
              <Heart style={{ width: "0.9rem", height: "0.9rem", color: "#ec4899" }} />
              <span>Sensory Theme</span>
            </div>
            <div style={{ fontSize: "1.3rem", fontWeight: "700", color: "#111111" }}>{blueprint.eventType}</div>
          </div>

          <div style={{
            background: "#ffffff",
            border: "1px solid rgba(0, 0, 0, 0.06)",
            borderRadius: "20px",
            padding: "1.5rem",
            boxShadow: "0 8px 25px rgba(0,0,0,0.03)"
          }}>
            <div style={{ color: "#6b7280", fontSize: "0.75rem", fontWeight: "600", textTransform: "uppercase", letterSpacing: "0.05em", display: "flex", alignItems: "center", gap: "0.4rem", marginBottom: "0.5rem" }}>
              <DollarSign style={{ width: "0.9rem", height: "0.9rem", color: "#10b981" }} />
              <span>Budget Plan</span>
            </div>
            <div style={{ fontSize: "1.3rem", fontWeight: "700", color: "#111111" }}>${blueprint.budget?.toLocaleString() || "Custom"}</div>
          </div>
        </section>

        {/* Details and Sidebar */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "1fr",
          gap: "2.5rem",
        }} className="md:grid-cols-3">
          
          {/* Main Specifications Card */}
          <div style={{ display: "flex", flexDirection: "column", gap: "2rem", gridColumn: "span 2" }}>
            
            <div style={{
              background: "#ffffff",
              border: "1px solid rgba(0, 0, 0, 0.06)",
              borderRadius: "28px",
              padding: "2.5rem",
              display: "flex",
              flexDirection: "column",
              gap: "2rem",
              boxShadow: "0 8px 25px rgba(0,0,0,0.03)"
            }}>
              <h3 style={{
                fontSize: "1.3rem",
                fontWeight: "700",
                borderBottom: "1px solid rgba(0,0,0,0.06)",
                paddingBottom: "0.85rem",
                display: "flex",
                alignItems: "center",
                gap: "0.5rem",
                color: "#111111"
              }}>
                <Sparkles style={{ width: "1.2rem", height: "1.2rem", color: "#d4a000" }} />
                Event Design Scheme
              </h3>

              <div style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
                gap: "1.75rem"
              }}>
                <div>
                  <span style={{ fontSize: "0.75rem", color: "#6b7280", display: "block", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "0.3rem" }}>Spatial Layout</span>
                  <span style={{ fontWeight: "600", color: "#111111", fontSize: "1.05rem" }}>{blueprint.layout}</span>
                </div>
                
                <div>
                  <span style={{ fontSize: "0.75rem", color: "#6b7280", display: "block", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "0.3rem" }}>Lighting Design</span>
                  <span style={{ fontWeight: "600", color: "#111111", fontSize: "1.05rem" }}>{blueprint.lighting}</span>
                </div>

                <div>
                  <span style={{ fontSize: "0.75rem", color: "#6b7280", display: "block", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "0.3rem" }}>Floral Design</span>
                  <span style={{ fontWeight: "600", color: "#111111", fontSize: "1.05rem" }}>{blueprint.flowers || "Curated Florals"}</span>
                </div>

                <div>
                  <span style={{ fontSize: "0.75rem", color: "#6b7280", display: "block", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "0.3rem" }}>Stage Presentation</span>
                  <span style={{ fontWeight: "600", color: "#111111", fontSize: "1.05rem" }}>{blueprint.stageStyle}</span>
                </div>

                <div style={{ gridColumn: "span 2" }}>
                  <span style={{ fontSize: "0.75rem", color: "#6b7280", display: "block", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "0.3rem" }}>Decor styling & Accents</span>
                  <span style={{ fontWeight: "600", color: "#111111", fontSize: "1.05rem" }}>{blueprint.decorStyle}</span>
                </div>
              </div>

              {/* Color Swatches */}
              <div style={{
                borderTop: "1px solid rgba(0, 0, 0, 0.06)",
                paddingTop: "1.5rem",
                marginTop: "0.5rem"
              }}>
                <span style={{ fontSize: "0.75rem", color: "#6b7280", display: "block", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "0.85rem" }}>Color Palette</span>
                <div style={{ display: "flex", flexWrap: "wrap", gap: "0.85rem" }}>
                  {blueprint.colors?.map((color, idx) => (
                    <div 
                      key={idx} 
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "0.6rem",
                        background: "#ffffff",
                        border: "1px solid rgba(0, 0, 0, 0.1)",
                        padding: "0.5rem 1rem",
                        borderRadius: "100px",
                        boxShadow: "0 2px 8px rgba(0,0,0,0.04)"
                      }}
                    >
                      <div 
                        style={{
                          width: "16px",
                          height: "16px",
                          borderRadius: "50%",
                          backgroundColor: color,
                          border: "1px solid rgba(0, 0, 0, 0.1)"
                        }}
                      ></div>
                      <span style={{ fontSize: "0.8rem", textTransform: "capitalize", fontWeight: "600", color: "#111111" }}>{color}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Spatial Guidelines */}
            {blueprint.notes && blueprint.notes.length > 0 && (
              <div style={{
                background: "#ffffff",
                border: "1px solid rgba(0, 0, 0, 0.06)",
                borderRadius: "28px",
                padding: "2.5rem",
                boxShadow: "0 8px 25px rgba(0,0,0,0.03)"
              }}>
                <h3 style={{
                  fontSize: "1.3rem",
                  fontWeight: "700",
                  borderBottom: "1px solid rgba(0,0,0,0.06)",
                  paddingBottom: "0.85rem",
                  display: "flex",
                  alignItems: "center",
                  gap: "0.5rem",
                  marginBottom: "1.5rem",
                  color: "#111111"
                }}>
                  <Lightbulb style={{ width: "1.2rem", height: "1.2rem", color: "#ffa500" }} />
                  Spatial Experience Guidelines
                </h3>
                <ul style={{ display: "flex", flexDirection: "column", gap: "1rem", listStyle: "none", padding: 0 }}>
                  {blueprint.notes.map((note, idx) => (
                    <li key={idx} style={{
                      display: "flex",
                      alignItems: "flex-start",
                      gap: "0.85rem",
                      color: "#444444",
                      fontSize: "0.95rem",
                      lineHeight: "1.6"
                    }}>
                      <span style={{
                        flexShrink: 0,
                        width: "24px",
                        height: "24px",
                        borderRadius: "50%",
                        backgroundColor: "rgba(212, 160, 0, 0.1)",
                        color: "#d4a000",
                        border: "1px solid rgba(212, 160, 0, 0.2)",
                        fontSize: "0.8rem",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontWeight: "700",
                        marginTop: "2px"
                      }}>
                        {idx + 1}
                      </span>
                      <span>{note}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

          </div>

          {/* Sidebar Area - Clean CTAs */}
          <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
            
            {/* Design Controls */}
            <div style={{
              background: "#ffffff",
              border: "1px solid rgba(0, 0, 0, 0.06)",
              borderRadius: "28px",
              padding: "2rem",
              display: "flex",
              flexDirection: "column",
              gap: "1.25rem",
              boxShadow: "0 8px 25px rgba(0,0,0,0.03)"
            }}>
              <h4 style={{ fontSize: "0.9rem", fontWeight: "700", textTransform: "uppercase", letterSpacing: "0.05em", color: "#6b7280" }}>
                Concept Options
              </h4>

              <button 
                onClick={handleRequestProposal}
                style={{
                  width: "100%",
                  padding: "0.9rem",
                  background: "#111111",
                  color: "#ffffff",
                  border: "none",
                  borderRadius: "14px",
                  fontWeight: "600",
                  fontSize: "0.9rem",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "0.5rem",
                  transition: "transform 0.2s, background-color 0.2s"
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.transform = "translateY(-2px)";
                  e.currentTarget.style.backgroundColor = "#27272a";
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.backgroundColor = "#111111";
                }}
              >
                <Send style={{ width: "1rem", height: "1rem" }} />
                Request Proposal
              </button>

              <button 
                onClick={handleSaveDesign}
                style={{
                  width: "100%",
                  padding: "0.9rem",
                  background: "#f4f4f5",
                  color: "#111111",
                  border: "1px solid rgba(0, 0, 0, 0.08)",
                  borderRadius: "14px",
                  fontWeight: "600",
                  fontSize: "0.9rem",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "0.5rem",
                  transition: "background-color 0.2s, border-color 0.2s"
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.backgroundColor = "#e4e4e7";
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.backgroundColor = "#f4f4f5";
                }}
              >
                <Bookmark style={{ width: "1rem", height: "1rem" }} />
                Save Design
              </button>

              <Link href="/saved-designs" style={{ textDecoration: "none" }}>
                <button style={{
                  width: "100%",
                  padding: "0.5rem",
                  background: "transparent",
                  color: "#d4a000",
                  border: "none",
                  borderRadius: "14px",
                  fontWeight: "600",
                  fontSize: "0.8rem",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "0.5rem",
                  transition: "opacity 0.2s"
                }}
                onMouseOver={(e) => e.currentTarget.style.opacity = "0.8"}
                onMouseOut={(e) => e.currentTarget.style.opacity = "1"}
                >
                  View Saved Designs
                </button>
              </Link>

              <button 
                onClick={() => setShowEditModal(true)}
                style={{
                  width: "100%",
                  padding: "0.9rem",
                  background: "transparent",
                  color: "#6b7280",
                  border: "none",
                  borderRadius: "14px",
                  fontWeight: "600",
                  fontSize: "0.9rem",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "0.5rem",
                  transition: "color 0.2s"
                }}
                onMouseOver={(e) => e.currentTarget.style.color = "#111111"}
                onMouseOut={(e) => e.currentTarget.style.color = "#6b7280"}
              >
                <Edit3 style={{ width: "1rem", height: "1rem" }} />
                Edit Preferences
              </button>
            </div>



          </div>

        </div>

        {/* Developer / Admin Mode Panel */}
        {devMode && (
          <div style={{
            background: "rgba(0, 0, 0, 0.4)",
            border: "1px dashed #ef4444",
            borderRadius: "20px",
            padding: "2.5rem",
            display: "flex",
            flexDirection: "column",
            gap: "2rem",
            animation: "slideUp 0.3s ease-out"
          }}>
            <h3 style={{ color: "#ef4444", fontSize: "1.5rem", fontWeight: "700", display: "flex", alignItems: "center", gap: "0.5rem", margin: 0 }}>
              <Layers style={{ width: "1.5rem", height: "1.5rem" }} />
              Admin / Developer Mode
            </h3>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "2rem" }}>
              {/* Unity Integration Pipeline */}
              <div style={{ background: "rgba(255,255,255,0.02)", padding: "1.5rem", borderRadius: "16px", border: "1px solid rgba(255,255,255,0.05)" }}>
                <h4 style={{ color: "#ffffff", marginBottom: "1rem", fontSize: "1.1rem", display: "flex", alignItems: "center", gap: "0.5rem", margin: "0 0 1rem 0" }}>
                  <MonitorPlay style={{ width: "1rem", height: "1rem", color: "#3b82f6" }} />
                  Unity Integration Pipeline
                </h4>
                <div style={{ fontSize: "0.85rem", color: "#a1a1aa", display: "flex", flexDirection: "column", gap: "0.8rem" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", borderBottom: "1px solid rgba(255,255,255,0.05)", paddingBottom: "0.5rem" }}>
                    <span>Sync Endpoint:</span> <span style={{ color: "#10b981", fontFamily: "monospace" }}>/api/unity/sync</span>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", borderBottom: "1px solid rgba(255,255,255,0.05)", paddingBottom: "0.5rem" }}>
                    <span>3D Assets Status:</span> <span style={{ color: "#eab308" }}>Pending Generation</span>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between" }}>
                    <span>Target Engine:</span> <span>Unity 2023.2 (URP)</span>
                  </div>
                </div>
                <button style={{ 
                  marginTop: "1.5rem", width: "100%", padding: "0.75rem", 
                  backgroundColor: "rgba(59, 130, 246, 0.1)", color: "#3b82f6", 
                  border: "1px solid rgba(59, 130, 246, 0.3)", borderRadius: "8px", 
                  cursor: "pointer", fontWeight: "600", transition: "all 0.2s" 
                }}>
                  Push to Unity Cloud Build
                </button>
              </div>

              {/* Raw JSON Data */}
              <div style={{ background: "rgba(255,255,255,0.02)", padding: "1.5rem", borderRadius: "16px", border: "1px solid rgba(255,255,255,0.05)", display: "flex", flexDirection: "column" }}>
                <h4 style={{ color: "#ffffff", marginBottom: "1rem", fontSize: "1.1rem", display: "flex", alignItems: "center", gap: "0.5rem", margin: "0 0 1rem 0" }}>
                  <Layers style={{ width: "1rem", height: "1rem", color: "#10b981" }} />
                  Raw JSON Blueprint Data
                </h4>
                <div style={{ 
                  flex: 1, overflow: "auto", maxHeight: "200px", 
                  background: "rgba(0,0,0,0.3)", padding: "1rem", 
                  borderRadius: "8px", border: "1px solid rgba(255,255,255,0.02)" 
                }}>
                  <pre style={{ fontSize: "0.75rem", color: "#10b981", margin: 0, fontFamily: "monospace", whiteSpace: "pre-wrap", wordBreak: "break-all" }}>
                    {JSON.stringify(blueprint, null, 2)}
                  </pre>
                </div>
              </div>
            </div>
          </div>
        )}

      </div>



      {/* AR Modal Overlay - Client Focused */}
      {showArModal && (
        <div style={{
          position: "fixed",
          inset: 0,
          zIndex: 1000,
          backgroundColor: "rgba(0, 0, 0, 0.85)",
          backdropFilter: "blur(12px)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "1rem"
        }}>
          <div style={{
            backgroundColor: "#0d0d11",
            border: "1px solid rgba(255, 255, 255, 0.08)",
            borderRadius: "32px",
            padding: "2.2rem",
            maxWidth: "420px",
            width: "100%",
            position: "relative",
            boxShadow: "0 25px 50px rgba(0,0,0,0.6)",
            display: "flex",
            flexDirection: "column",
            gap: "1.5rem"
          }}>
            <button 
              onClick={() => setShowArModal(false)}
              style={{
                position: "absolute",
                top: "1.2rem",
                right: "1.2rem",
                background: "none",
                border: "none",
                color: "#8e9196",
                fontSize: "1.2rem",
                cursor: "pointer",
                padding: "4px"
              }}
            >
              ✕
            </button>

            <div style={{ textAlign: "center", display: "flex", flexDirection: "column", gap: "0.5rem" }}>
              <div style={{
                margin: "0 auto",
                width: "48px",
                height: "48px",
                borderRadius: "50%",
                backgroundColor: "rgba(212, 160, 0, 0.1)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#d4a000",
                border: "1px solid rgba(212, 160, 0, 0.2)",
                marginBottom: "0.5rem"
              }}>
                <QrCode style={{ width: "1.5rem", height: "1.5rem" }} />
              </div>
              <h3 style={{ fontSize: "1.3rem", fontWeight: "800", color: "#ffffff", fontFamily: "'Outfit', sans-serif" }}>Augmented Reality Preview</h3>
              <p style={{ fontSize: "0.75rem", color: "#8e9196", lineHeight: "1.4" }}>
                Scan the project configuration to launch the high-fidelity venue preview on your mobile device or AR headset.
              </p>
            </div>

            {/* Stylized QR Code */}
            <div style={{
              backgroundColor: "#ffffff",
              padding: "1rem",
              borderRadius: "20px",
              margin: "0 auto",
              width: "180px",
              height: "180px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: "0 10px 30px rgba(0,0,0,0.3)",
              position: "relative",
              overflow: "hidden"
            }}>
              <div style={{
                width: "100%",
                height: "100%",
                border: "4px solid #18181b",
                padding: "6px",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                position: "relative"
              }}>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <div style={{ width: "32px", height: "32px", backgroundColor: "#18181b" }}></div>
                  <div style={{ width: "32px", height: "32px", backgroundColor: "#18181b" }}></div>
                </div>
                
                {/* Scanline overlay */}
                <div style={{
                  position: "absolute",
                  left: 0,
                  right: 0,
                  height: "2px",
                  backgroundColor: "#d4a000",
                  opacity: 0.8,
                  animation: "scan 2.5s infinite linear"
                }}></div>

                <div style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
                  <div style={{
                    width: "60px",
                    height: "60px",
                    border: "2px solid #18181b",
                    display: "flex",
                    flexWrap: "wrap",
                    padding: "2px",
                    gap: "2px"
                  }}>
                    <div style={{ width: "12px", height: "12px", backgroundColor: "#18181b" }}></div>
                    <div style={{ width: "12px", height: "12px", backgroundColor: "#a1a1aa" }}></div>
                    <div style={{ width: "12px", height: "12px", backgroundColor: "#a1a1aa" }}></div>
                    <div style={{ width: "12px", height: "12px", backgroundColor: "#18181b" }}></div>
                    <div style={{ width: "12px", height: "12px", backgroundColor: "#a1a1aa" }}></div>
                    <div style={{ width: "12px", height: "12px", backgroundColor: "#18181b" }}></div>
                    <div style={{ width: "12px", height: "12px", backgroundColor: "#18181b" }}></div>
                    <div style={{ width: "12px", height: "12px", backgroundColor: "#a1a1aa" }}></div>
                  </div>
                </div>

                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <div style={{ width: "32px", height: "32px", backgroundColor: "#18181b" }}></div>
                  <div style={{ width: "24px", height: "24px", border: "2px solid #18181b" }}></div>
                </div>
              </div>
            </div>

            {/* Instructions */}
            <div style={{
              display: "flex",
              flexDirection: "column",
              gap: "0.5rem",
              backgroundColor: "rgba(255,255,255,0.02)",
              border: "1px solid rgba(255,255,255,0.05)",
              padding: "1rem",
              borderRadius: "16px",
              fontSize: "0.75rem",
              color: "#d4d4d8",
              lineHeight: "1.4"
            }}>
              <h4 style={{ fontWeight: "750", color: "#ffe071" }}>How to view:</h4>
              <ol style={{ paddingLeft: "1.25rem", display: "flex", flexDirection: "column", gap: "0.4rem", margin: 0 }}>
                <li>Open the Yenege AR application on your device.</li>
                <li>Aim the camera at this QR code to load the configuration.</li>
                <li>Aim at a flat surface (like a floor or table) to anchor and explore your customized event layout.</li>
              </ol>
            </div>

            <button 
              onClick={() => setShowArModal(false)}
              style={{
                width: "100%",
                padding: "0.8rem",
                backgroundColor: "#202027",
                border: "none",
                borderRadius: "14px",
                color: "#ffffff",
                fontWeight: "600",
                cursor: "pointer",
                transition: "background-color 0.2s"
              }}
              onMouseOver={(e) => e.currentTarget.style.backgroundColor = "#2d2d37"}
              onMouseOut={(e) => e.currentTarget.style.backgroundColor = "#202027"}
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* Edit Preferences Modal */}
      {showEditModal && (
        <div style={{
          position: "fixed",
          inset: 0,
          zIndex: 1000,
          backgroundColor: "rgba(0, 0, 0, 0.85)",
          backdropFilter: "blur(12px)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "1rem"
        }}>
          <div style={{
            backgroundColor: "#0d0d11",
            border: "1px solid rgba(255, 255, 255, 0.08)",
            borderRadius: "32px",
            padding: "2.2rem",
            maxWidth: "420px",
            width: "100%",
            position: "relative",
            boxShadow: "0 25px 50px rgba(0,0,0,0.6)",
            display: "flex",
            flexDirection: "column",
            gap: "1.5rem"
          }}>
            <button 
              onClick={() => setShowEditModal(false)}
              style={{
                position: "absolute",
                top: "1.2rem",
                right: "1.2rem",
                background: "none",
                border: "none",
                color: "#8e9196",
                fontSize: "1.2rem",
                cursor: "pointer",
                padding: "4px"
              }}
            >
              ✕
            </button>
            <div style={{ textAlign: "center", display: "flex", flexDirection: "column", gap: "0.5rem" }}>
              <h3 style={{ fontSize: "1.3rem", fontWeight: "800", color: "#ffffff", fontFamily: "'Outfit', sans-serif" }}>Edit Preferences</h3>
              <p style={{ fontSize: "0.75rem", color: "#8e9196", lineHeight: "1.4" }}>
                Update your event preferences below to regenerate your custom blueprint.
              </p>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem", maxHeight: "60vh", overflowY: "auto", paddingRight: "0.5rem" }}>
              <div>
                <label style={{ fontSize: "0.75rem", color: "#8e9196", marginBottom: "0.3rem", display: "block" }}>Event Type</label>
                <input type="text" value={editData.eventType} onChange={(e) => setEditData({...editData, eventType: e.target.value})} style={{ width: "100%", padding: "0.8rem", borderRadius: "10px", backgroundColor: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", color: "#fff" }} />
              </div>
              <div>
                <label style={{ fontSize: "0.75rem", color: "#8e9196", marginBottom: "0.3rem", display: "block" }}>Guests</label>
                <input type="number" value={editData.guestCount} onChange={(e) => setEditData({...editData, guestCount: parseInt(e.target.value, 10) || 0})} style={{ width: "100%", padding: "0.8rem", borderRadius: "10px", backgroundColor: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", color: "#fff" }} />
              </div>
              <div>
                <label style={{ fontSize: "0.75rem", color: "#8e9196", marginBottom: "0.3rem", display: "block" }}>Budget ($)</label>
                <input type="number" value={editData.budget} onChange={(e) => setEditData({...editData, budget: parseFloat(e.target.value) || 0})} style={{ width: "100%", padding: "0.8rem", borderRadius: "10px", backgroundColor: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", color: "#fff" }} />
              </div>
              <div>
                <label style={{ fontSize: "0.75rem", color: "#8e9196", marginBottom: "0.3rem", display: "block" }}>Venue Type</label>
                <input type="text" value={editData.venueType} onChange={(e) => setEditData({...editData, venueType: e.target.value})} style={{ width: "100%", padding: "0.8rem", borderRadius: "10px", backgroundColor: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", color: "#fff" }} />
              </div>
              <div style={{ gridColumn: "span 2" }}>
                <label style={{ fontSize: "0.75rem", color: "#8e9196", marginBottom: "0.3rem", display: "block" }}>Theme</label>
                <input type="text" value={editData.theme} onChange={(e) => setEditData({...editData, theme: e.target.value})} style={{ width: "100%", padding: "0.8rem", borderRadius: "10px", backgroundColor: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", color: "#fff" }} />
              </div>
              <div style={{ gridColumn: "span 2" }}>
                <label style={{ fontSize: "0.75rem", color: "#8e9196", marginBottom: "0.3rem", display: "block" }}>Layout</label>
                <input type="text" value={editData.layout} onChange={(e) => setEditData({...editData, layout: e.target.value})} style={{ width: "100%", padding: "0.8rem", borderRadius: "10px", backgroundColor: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", color: "#fff" }} />
              </div>
              <div>
                <label style={{ fontSize: "0.75rem", color: "#8e9196", marginBottom: "0.3rem", display: "block" }}>Lighting</label>
                <input type="text" value={editData.lighting} onChange={(e) => setEditData({...editData, lighting: e.target.value})} style={{ width: "100%", padding: "0.8rem", borderRadius: "10px", backgroundColor: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", color: "#fff" }} />
              </div>
              <div>
                <label style={{ fontSize: "0.75rem", color: "#8e9196", marginBottom: "0.3rem", display: "block" }}>Flowers</label>
                <input type="text" value={editData.flowers} onChange={(e) => setEditData({...editData, flowers: e.target.value})} style={{ width: "100%", padding: "0.8rem", borderRadius: "10px", backgroundColor: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", color: "#fff" }} />
              </div>
              <div>
                <label style={{ fontSize: "0.75rem", color: "#8e9196", marginBottom: "0.3rem", display: "block" }}>Decor Style</label>
                <input type="text" value={editData.decorStyle} onChange={(e) => setEditData({...editData, decorStyle: e.target.value})} style={{ width: "100%", padding: "0.8rem", borderRadius: "10px", backgroundColor: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", color: "#fff" }} />
              </div>
              <div>
                <label style={{ fontSize: "0.75rem", color: "#8e9196", marginBottom: "0.3rem", display: "block" }}>Stage Style</label>
                <input type="text" value={editData.stageStyle} onChange={(e) => setEditData({...editData, stageStyle: e.target.value})} style={{ width: "100%", padding: "0.8rem", borderRadius: "10px", backgroundColor: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", color: "#fff" }} />
              </div>
            </div>
            <button 
              onClick={submitEdit}
              style={{
                width: "100%",
                padding: "0.8rem",
                background: "linear-gradient(135deg, #10b981, #059669)",
                border: "none",
                borderRadius: "14px",
                color: "#ffffff",
                fontWeight: "600",
                cursor: "pointer",
                transition: "transform 0.2s"
              }}
              onMouseOver={(e) => e.currentTarget.style.transform = "translateY(-2px)"}
              onMouseOut={(e) => e.currentTarget.style.transform = "translateY(0)"}
            >
              Regenerate Blueprint
            </button>
          </div>
        </div>
      )}
      
      {/* Request Proposal Modal */}
      {showProposalModal && (
        <div style={{
          position: "fixed",
          inset: 0,
          zIndex: 1000,
          backgroundColor: "rgba(0, 0, 0, 0.85)",
          backdropFilter: "blur(12px)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "1rem"
        }}>
          <div style={{
            backgroundColor: "#0d0d11",
            border: "1px solid rgba(255, 255, 255, 0.08)",
            borderRadius: "32px",
            padding: "2.2rem",
            maxWidth: "480px",
            width: "100%",
            position: "relative",
            boxShadow: "0 25px 50px rgba(0,0,0,0.6)",
            display: "flex",
            flexDirection: "column",
            gap: "1.5rem",
            maxHeight: "90vh",
            overflowY: "auto"
          }}>
            <button 
              onClick={() => setShowProposalModal(false)}
              style={{
                position: "absolute",
                top: "1.2rem",
                right: "1.2rem",
                background: "none",
                border: "none",
                color: "#8e9196",
                fontSize: "1.2rem",
                cursor: "pointer",
                padding: "4px"
              }}
            >
              ✕
            </button>
            <div style={{ textAlign: "center", display: "flex", flexDirection: "column", gap: "0.5rem" }}>
              <h3 style={{ fontSize: "1.4rem", fontWeight: "800", color: "#ffffff", fontFamily: "'Outfit', sans-serif" }}>Request Proposal</h3>
              <p style={{ fontSize: "0.85rem", color: "#8e9196", lineHeight: "1.5" }}>
                Send us your curated blueprint details and our sensory architects will craft a personalized quotation.
              </p>
            </div>
            
            <div style={{ display: "flex", flexDirection: "column", gap: "1.2rem" }}>
              <div>
                <label style={{ fontSize: "0.75rem", color: "#8e9196", marginBottom: "0.4rem", display: "block" }}>Full Name <span style={{color: "#ef4444"}}>*</span></label>
                <input type="text" placeholder="Your name" value={proposalData.name} onChange={(e) => setProposalData({...proposalData, name: e.target.value})} style={{ width: "100%", padding: "0.8rem", borderRadius: "10px", backgroundColor: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", color: "#fff" }} />
              </div>
              
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                <div>
                  <label style={{ fontSize: "0.75rem", color: "#8e9196", marginBottom: "0.4rem", display: "block" }}>Phone Number <span style={{color: "#ef4444"}}>*</span></label>
                  <input type="tel" placeholder="Phone" value={proposalData.phone} onChange={(e) => setProposalData({...proposalData, phone: e.target.value})} style={{ width: "100%", padding: "0.8rem", borderRadius: "10px", backgroundColor: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", color: "#fff" }} />
                </div>
                <div>
                  <label style={{ fontSize: "0.75rem", color: "#8e9196", marginBottom: "0.4rem", display: "block" }}>Email Address <span style={{color: "#ef4444"}}>*</span></label>
                  <input type="email" placeholder="Email" value={proposalData.email} onChange={(e) => setProposalData({...proposalData, email: e.target.value})} style={{ width: "100%", padding: "0.8rem", borderRadius: "10px", backgroundColor: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", color: "#fff" }} />
                </div>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                <div>
                  <label style={{ fontSize: "0.75rem", color: "#8e9196", marginBottom: "0.4rem", display: "block" }}>Preferred Event Date <span style={{color: "#ef4444"}}>*</span></label>
                  <input type="date" value={proposalData.eventDate} onChange={(e) => setProposalData({...proposalData, eventDate: e.target.value})} style={{ width: "100%", padding: "0.8rem", borderRadius: "10px", backgroundColor: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", color: "#fff", colorScheme: "dark" }} />
                </div>
                <div>
                  <label style={{ fontSize: "0.75rem", color: "#8e9196", marginBottom: "0.4rem", display: "block" }}>City / Venue Location <span style={{color: "#ef4444"}}>*</span></label>
                  <input type="text" placeholder="e.g. Addis Ababa" value={proposalData.city} onChange={(e) => setProposalData({...proposalData, city: e.target.value})} style={{ width: "100%", padding: "0.8rem", borderRadius: "10px", backgroundColor: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", color: "#fff" }} />
                </div>
              </div>

              <div>
                <label style={{ fontSize: "0.75rem", color: "#8e9196", marginBottom: "0.4rem", display: "block" }}>What do you need?</label>
                <select value={proposalData.proposalType} onChange={(e) => setProposalData({...proposalData, proposalType: e.target.value})} style={{ width: "100%", padding: "0.8rem", borderRadius: "10px", backgroundColor: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", color: "#fff" }}>
                  <option value="" disabled>Select an option</option>
                  <option value="Full Event Planning">Full Event Planning</option>
                  <option value="Venue Styling">Venue Styling</option>
                  <option value="AR Visualization">AR Visualization</option>
                  <option value="Decoration Only">Decoration Only</option>
                  <option value="Consultation">Consultation</option>
                  <option value="Custom Package">Custom Package</option>
                </select>
              </div>

              <div>
                <label style={{ fontSize: "0.75rem", color: "#8e9196", marginBottom: "0.4rem", display: "block" }}>Special Notes or Requests</label>
                <textarea rows={3} placeholder='Example: "I want a traditional coffee ceremony area."' value={proposalData.notes} onChange={(e) => setProposalData({...proposalData, notes: e.target.value})} style={{ width: "100%", padding: "0.8rem", borderRadius: "10px", backgroundColor: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", color: "#fff", resize: "vertical" }} />
              </div>
            </div>

            <button 
              onClick={submitProposal}
              disabled={!proposalData.name || !proposalData.email || !proposalData.phone || !proposalData.eventDate || !proposalData.city}
              style={{
                width: "100%",
                padding: "0.9rem",
                background: (!proposalData.name || !proposalData.email || !proposalData.phone || !proposalData.eventDate || !proposalData.city) ? "rgba(255,255,255,0.1)" : "linear-gradient(135deg, #d4a000, #ffa500)",
                border: "none",
                borderRadius: "14px",
                color: (!proposalData.name || !proposalData.email || !proposalData.phone || !proposalData.eventDate || !proposalData.city) ? "#8e9196" : "#ffffff",
                fontWeight: "700",
                cursor: (!proposalData.name || !proposalData.email || !proposalData.phone || !proposalData.eventDate || !proposalData.city) ? "not-allowed" : "pointer",
                transition: "transform 0.2s"
              }}
              onMouseOver={(e) => {
                if(proposalData.name && proposalData.email && proposalData.phone && proposalData.eventDate && proposalData.city) {
                  e.currentTarget.style.transform = "translateY(-2px)";
                }
              }}
              onMouseOut={(e) => e.currentTarget.style.transform = "translateY(0)"}
            >
              Send Proposal Request
            </button>
          </div>
        </div>
      )}


      {/* Save Design Modal */}
      {showSaveModal && (
        <div style={{
          position: "fixed",
          inset: 0,
          zIndex: 1000,
          backgroundColor: "rgba(0, 0, 0, 0.85)",
          backdropFilter: "blur(12px)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "1rem"
        }}>
          <div style={{
            backgroundColor: "#0d0d11",
            border: "1px solid rgba(255, 255, 255, 0.08)",
            borderRadius: "32px",
            padding: "2.2rem",
            maxWidth: "420px",
            width: "100%",
            position: "relative",
            boxShadow: "0 25px 50px rgba(0,0,0,0.6)",
            display: "flex",
            flexDirection: "column",
            gap: "1.5rem"
          }}>
            <button 
              onClick={() => setShowSaveModal(false)}
              style={{
                position: "absolute",
                top: "1.2rem",
                right: "1.2rem",
                background: "none",
                border: "none",
                color: "#8e9196",
                fontSize: "1.2rem",
                cursor: "pointer",
                padding: "4px"
              }}
            >
              ✕
            </button>
            <div style={{ textAlign: "center", display: "flex", flexDirection: "column", gap: "0.5rem" }}>
              <h3 style={{ fontSize: "1.3rem", fontWeight: "800", color: "#ffffff", fontFamily: "'Outfit', sans-serif" }}>Save Design</h3>
              <p style={{ fontSize: "0.75rem", color: "#8e9196", lineHeight: "1.4" }}>
                Enter your email to save this curated blueprint securely to your personal account.
              </p>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
              <input type="email" placeholder="Your email address" value={saveEmail} onChange={(e) => setSaveEmail(e.target.value)} style={{ width: "100%", padding: "0.8rem", borderRadius: "10px", backgroundColor: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", color: "#fff" }} />
            </div>
            <button 
              onClick={submitSaveDesign}
              style={{
                width: "100%",
                padding: "0.8rem",
                background: "linear-gradient(135deg, #d4a000, #ffa500)",
                border: "none",
                borderRadius: "14px",
                color: "#ffffff",
                fontWeight: "600",
                cursor: "pointer",
                transition: "transform 0.2s"
              }}
              onMouseOver={(e) => e.currentTarget.style.transform = "translateY(-2px)"}
              onMouseOut={(e) => e.currentTarget.style.transform = "translateY(0)"}
            >
              Confirm Save
            </button>
          </div>
        </div>
      )}

      {/* Global CSS Style Animations */}
      <style jsx global>{`
        @keyframes scan {
          0%, 100% { top: 5%; }
          50% { top: 95%; }
        }
        @keyframes slideUp {
          from { transform: translate(-50%, 1rem); opacity: 0; }
          to { transform: translate(-50%, 0); opacity: 1; }
        }
      `}</style>
    </div>
  );
}
