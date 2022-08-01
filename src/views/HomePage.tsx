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
          color: "#004261",
        }}
      >
        <h3
          style={{
            fontSize: "50px",
            fontWeight: "bold",
            marginBottom: "30px",
          }}
        >
          The Flashcard App
        </h3>

        <p
          style={{
            textAlign: "center",
            width: "50%",
            fontSize: "20px",
          }}
        >
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Omnis
          perferendis eum doloribus sed voluptas provident deserunt quos officia
          eveniet voluptatibus, quam veritatis excepturi perspiciatis pariatur
          veniam, dolores at cum voluptate!
        </p>
        <p
          style={{
            textAlign: "center",
            width: "50%",
            fontSize: "12px",
            marginTop: "20px",
          }}
        >
          by gerard © 2022
        </p>
      </div>
    </>
  );
}

export default HomePage;
