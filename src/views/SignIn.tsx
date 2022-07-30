/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { gql, useMutation } from "@apollo/client";
import React from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { Dispatch } from "redux";
import NavBar from "../components/NavBar";
import { getUserAction, userErrorAction } from "../redux/reducers/user.reducer";
import "../styles/signin.css";
import * as FaIcons from "react-icons/fa";

const SIGN_IN = gql`
  mutation Login($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      token
      user {
        id
        name
        email
      }
    }
  }
`;

export default function SignIn() {
  const dispatch: Dispatch = useDispatch();
  const [signIn, { loading, data }] = useMutation(SIGN_IN);
  const navigate = useNavigate();

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const signInData = new FormData(event.currentTarget);

    await signIn({
      variables: {
        email: signInData.get("email"),
        password: signInData.get("password"),
      },
    })
      .then((value) => {
        localStorage.setItem("token", value.data.login.token);
        localStorage.setItem("userId", value.data.login.user.id);
        dispatch(getUserAction(value.data.login));
        navigate("/flashcard");
      })
      .catch((error) => {
        toast.error(error.message);
        dispatch(userErrorAction(error.message));
      });
  };

  return (
    <>
      <NavBar />

      <div className="container">
        {" "}
        <div className="icon">
          <FaIcons.FaUserCircle id="userIcon" />
        </div>
        <form onSubmit={handleSubmit}>
          <input required id="email" name="email" placeholder="Email" />
          <input
            required
            placeholder="Password"
            name="password"
            type="password"
            id="password"
            autoComplete="current-password"
          />
          {loading ? (
            <button type="submit" disabled={loading} style={{ width: "300px" }}>
              Loading...
            </button>
          ) : (
            <button type="submit" disabled={loading} style={{ width: "300px" }}>
              Login
            </button>
          )}
        </form>
      </div>
    </>
  );
}
