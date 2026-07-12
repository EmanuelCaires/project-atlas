export default function Home() {
  return (
    <main
      style={{
        minHeight: "100vh",
        background: "#050712",
        color: "white",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        textAlign: "center",
        padding: "2rem",
      }}
    >
      <h1
        style={{
          fontSize: "4rem",
          marginBottom: "1rem",
        }}
      >
        Project Atlas
      </h1>

      <p
        style={{
          maxWidth: "700px",
          fontSize: "1.2rem",
          color: "#a0a0b0",
        }}
      >
        Hire developers through proof, not promises.
      </p>

      <button
        style={{
          marginTop: "2rem",
          padding: "1rem 2rem",
          borderRadius: "10px",
          border: "none",
          background: "#6b5cff",
          color: "white",
          cursor: "pointer",
          fontWeight: "bold",
        }}
      >
        Join Waitlist
      </button>
    </main>
  );
}