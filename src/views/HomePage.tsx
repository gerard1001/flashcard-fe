import * as React from "react";
import NavBar from "../components/NavBar";

function HomePage() {
  return (
    <>
      <NavBar />
      <div
        style={{
          display: "flex",
          height: "100%",
          width: "100%",
          alignItems: "center",
          justifyContent: "center",
          flexDirection: "column",
        }}
      >
        <span style={{ color: "black", fontSize: "50px", fontWeight: "bold" }}>
          The Flashcard App
        </span>
      </div>
    </>
  );
}

export default HomePage;
