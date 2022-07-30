import { NavLink, useNavigate } from "react-router-dom";
import "../styles/NavBar.css";
import { ReactElement } from "react";

const LinkDiv =
  (page: string) =>
  ({ isActive }: { isActive: boolean }) => {
    console.log("PAGE", page);
    return (
      <div
        style={{
          fontSize: "18px",
          fontFamily: "Arial, Helvetica, sans-serif",
          marginRight: "40px",
        }}
        color={isActive ? "white" : "black"}
      >
        {page}
      </div>
    );
  };

function NavBar({ children }: { children?: ReactElement }) {
  const navigate = useNavigate();

  return (
    <>
      <div
        style={{
          display: "flex",
          padding: "10px 10px",
          boxShadow: "4px 4px 10px #0000001a, 0px 10px 20px #00000040",
          alignItems: "center",
          justifyContent: "right",
          position: "fixed",
          top: 0,
          left: 0,
          maxWidth: "100%",
          width: "100%",
          height: "80px",
          zIndex: "1000",
          marginRight: "30px",
        }}
        className="div"
      >
        {children ? children : []}
        {localStorage.getItem("token") ? (
          <button
            style={{
              backgroundColor: "#ffbb00",
              display: "block",
              margin: "auto",
              width: "80px",
              height: "40px",
              borderRadius: "20px",
              position: "absolute",
              right: "10px",
            }}
            onClick={() => {
              localStorage.removeItem("token");
              localStorage.removeItem("userId");
              navigate("/sign-in");
            }}
          >
            Logout
          </button>
        ) : (
          <>
            <NavLink className="nav-link" to="/">
              {LinkDiv("Home")}
            </NavLink>
            <NavLink className="nav-link" to="/sign-in">
              {LinkDiv("Login")}
            </NavLink>
            <NavLink className="nav-link" to="/sign-up">
              {LinkDiv("SignUp")}
            </NavLink>
          </>
        )}
      </div>
    </>
  );
}

export default NavBar;
