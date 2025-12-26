import React from "react";

export default function Summary({ total, liked, onRestart }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", padding: 24 }}>
      <h1>Summary</h1>

      <p>
        You liked <strong>{liked.length}</strong> out of <strong>{total}</strong> cats
      </p>

      <button onClick={onRestart} style={{ marginBottom: 20 }}>
        RESTART
      </button>

      {/* Grid of liked cats */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(2, 150px)",
          gap: 12,
        }}
      >
        {liked.map((cat) => (
          <img
            key={cat.id}
            src={cat.src}
            alt="Liked cat"
            style={{
              width: 150,
              height: 150,
              objectFit: "cover",
              borderRadius: 12,
            }}
          />
        ))}
      </div>
    </div>
  );
}