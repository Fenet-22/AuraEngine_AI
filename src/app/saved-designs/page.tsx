import { PrismaClient } from '@prisma/client';
import Link from 'next/link';
import { Bookmark, Calendar, Users, MapPin, Mail } from 'lucide-react';
import { redirect } from 'next/navigation';

const prisma = new PrismaClient();

export default async function SavedDesignsPage({ searchParams }: { searchParams: { email?: string } }) {
  const userEmail = searchParams.email;

  if (!userEmail) {
    return (
      <div style={{ minHeight: "100vh", backgroundColor: "#08080a", color: "#fafafa", padding: "4rem 2rem", fontFamily: "'Inter', sans-serif", display: "flex", justifyContent: "center", alignItems: "center" }}>
        <div style={{ maxWidth: "400px", width: "100%", background: "rgba(255, 255, 255, 0.03)", border: "1px solid rgba(255, 255, 255, 0.08)", borderRadius: "20px", padding: "2.5rem", display: "flex", flexDirection: "column", gap: "1.5rem" }}>
          <div style={{ textAlign: "center" }}>
            <Bookmark style={{ width: "2.5rem", height: "2.5rem", color: "#d4a000", marginBottom: "1rem" }} />
            <h2 style={{ fontSize: "1.5rem", fontWeight: "800", color: "#ffffff", margin: 0 }}>View Saved Designs</h2>
            <p style={{ color: "#8e9196", fontSize: "0.9rem", marginTop: "0.5rem" }}>Enter your email address to view your curated event concepts.</p>
          </div>
          
          <form action={async (formData) => {
            "use server";
            const email = formData.get("email");
            if (email) {
              redirect(`/saved-designs?email=${encodeURIComponent(email as string)}`);
            }
          }} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
            <div style={{ position: "relative" }}>
              <Mail style={{ position: "absolute", left: "1rem", top: "50%", transform: "translateY(-50%)", color: "#8e9196", width: "1.2rem", height: "1.2rem" }} />
              <input 
                type="email" 
                name="email"
                placeholder="Your email address" 
                required
                style={{ 
                  width: "100%", padding: "1rem 1rem 1rem 3rem", 
                  borderRadius: "12px", backgroundColor: "rgba(255,255,255,0.05)", 
                  border: "1px solid rgba(255,255,255,0.1)", color: "#fff",
                  fontSize: "1rem"
                }} 
              />
            </div>
            <button 
              type="submit"
              style={{
                width: "100%", padding: "1rem", background: "linear-gradient(135deg, #d4a000, #ffa500)",
                border: "none", borderRadius: "12px", color: "#ffffff", fontWeight: "700",
                fontSize: "1rem", cursor: "pointer", transition: "transform 0.2s"
              }}
            >
              Continue
            </button>
          </form>
        </div>
      </div>
    );
  }

  const savedDesigns = await (prisma as any).savedDesign.findMany({
    where: { userEmail },
    orderBy: { createdAt: 'desc' },
  });

  const blueprints = await Promise.all(
    savedDesigns.map(async (design: any) => {
      const bp = await prisma.eventBlueprint.findUnique({
        where: { id: design.blueprintId },
      });
      return { ...design, blueprint: bp };
    })
  );

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#08080a", color: "#fafafa", padding: "4rem 2rem", fontFamily: "'Inter', sans-serif" }}>
      <div style={{ maxWidth: "1000px", margin: "0 auto" }}>
        <header style={{ marginBottom: "3rem", borderBottom: "1px solid rgba(255,255,255,0.1)", paddingBottom: "1.5rem" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", flexWrap: "wrap", gap: "1rem" }}>
            <div>
              <h1 style={{ fontSize: "2.5rem", fontWeight: "800", color: "#ffffff", display: "flex", alignItems: "center", gap: "1rem" }}>
                <Bookmark style={{ width: "2rem", height: "2rem", color: "#d4a000" }} />
                My Saved Designs
              </h1>
              <p style={{ color: "#8e9196", marginTop: "0.5rem" }}>Viewing designs for: <strong style={{ color: "#d4a000" }}>{userEmail}</strong></p>
            </div>
            <Link href="/saved-designs" style={{ color: "#8e9196", textDecoration: "none", fontSize: "0.9rem", border: "1px solid rgba(255,255,255,0.1)", padding: "0.5rem 1rem", borderRadius: "100px" }}>Change Email</Link>
          </div>
        </header>

        {blueprints.length === 0 ? (
          <div style={{ textAlign: "center", padding: "4rem 2rem", background: "rgba(255,255,255,0.02)", borderRadius: "20px", border: "1px dashed rgba(255,255,255,0.1)" }}>
            <p style={{ color: "#8e9196", fontSize: "1.1rem" }}>You haven't saved any event designs yet.</p>
            <Link href="/" style={{ color: "#d4a000", textDecoration: "none", marginTop: "1rem", display: "inline-block", fontWeight: "600" }}>Start creating an event</Link>
          </div>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: "2rem" }}>
            {blueprints.map(({ id, createdAt, blueprint }: any) => (
              <div key={id} style={{
                background: "rgba(255, 255, 255, 0.03)",
                border: "1px solid rgba(255, 255, 255, 0.08)",
                borderRadius: "20px",
                padding: "1.5rem",
                display: "flex",
                flexDirection: "column",
                gap: "1rem",
              }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                  <h3 style={{ fontSize: "1.2rem", fontWeight: "700", margin: 0, color: "#fff" }}>
                    {blueprint?.theme || "Untitled Event"}
                  </h3>
                  <span style={{ fontSize: "0.75rem", color: "#8e9196", background: "rgba(255,255,255,0.1)", padding: "0.2rem 0.5rem", borderRadius: "10px" }}>
                    {new Date(createdAt).toLocaleDateString()}
                  </span>
                </div>
                
                <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem", marginTop: "0.5rem" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", fontSize: "0.85rem", color: "#a1a1aa" }}>
                    <Calendar style={{ width: "1rem", height: "1rem", color: "#3b82f6" }} /> {blueprint?.eventType || "Event"}
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", fontSize: "0.85rem", color: "#a1a1aa" }}>
                    <Users style={{ width: "1rem", height: "1rem", color: "#10b981" }} /> {blueprint?.guestCount || 0} Guests
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", fontSize: "0.85rem", color: "#a1a1aa" }}>
                    <MapPin style={{ width: "1rem", height: "1rem", color: "#ef4444" }} /> {blueprint?.venueType || "Venue"}
                  </div>
                </div>

                <div style={{ marginTop: "auto", paddingTop: "1.5rem" }}>
                  <Link href={`/blueprint/${blueprint?.id}`} style={{
                    display: "block",
                    width: "100%",
                    textAlign: "center",
                    padding: "0.8rem",
                    background: "rgba(212, 160, 0, 0.1)",
                    color: "#d4a000",
                    border: "1px solid rgba(212, 160, 0, 0.3)",
                    borderRadius: "12px",
                    textDecoration: "none",
                    fontWeight: "600",
                    transition: "background 0.2s"
                  }}>
                    View Blueprint
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
