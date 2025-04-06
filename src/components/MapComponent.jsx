import { useEffect, useRef } from "preact/hooks";

export default function MapComponent() {
  const grid_width = 50;
  const grid_height = 50;
  const tile_size = 30;

  const tiles = [];
  for (let y = 0; y < grid_height; y++) {
    for (let x = 0; x < grid_width; x++) {
      tiles.push(
        <div
          key={`${x},${y}`}
          title={`Coordinates: ${x},${y}`}
          style={{
            width: tile_size,
            height: tile_size,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            border: "1px solid #333",
            fontSize: "10px",
            backgroundColor: "#1e1e1e",
            color: "#ccc",
            boxSizing: "border-box",
            cursor: "pointer",
          }}
        >
        </div>
      );
    }
  }

  return (
    <div
      style={{
        padding: "5vh 5vw",
        boxSizing: "border-box",
        height: "75vh",
        width: "99vw",
        backgroundColor: "#000",
        color: "#fff",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          height: "100%",
          width: "100%",
          overflow: "auto",
          border: "2px solid #888",
          backgroundColor: "#111",
        }}
      >
        <div
          style={{
            display: "grid",
            gridTemplateColumns: `repeat(${grid_width}, ${tile_size}px)`,
            gridTemplateRows: `repeat(${grid_height}, ${tile_size}px)`,
            justifyContent: "start",
            alignContent: "start",
          }}
        >
          {tiles}
        </div>
      </div>
    </div>
  );
}
