/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-unused-vars */
import * as React from "react";
import { useDispatch } from "react-redux";
import { Dispatch } from "redux";

import { toast } from "react-toastify";
import { gql, useMutation } from "@apollo/client";

import NavBar from "../components/NavBar";
import {
  getUserAction,
  loadingGetUserAction,
  userErrorAction,
} from "../redux/reducers/user.reducer";
import { useNavigate } from "react-router-dom";

const SIGN_UP = gql`
  mutation SignUp($email: String!, $password: String!, $name: String!) {
    signup(name: $name, email: $email, password: $password) {
      token
      token
      user {
        id
        name
        email
      }
    }
  }
`;

export default function SignUp() {
  const dispatch: Dispatch = useDispatch();
  const [signUp, { data, loading }] = useMutation(SIGN_UP);
  const navigate = useNavigate();

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const signUpData = new FormData(event.currentTarget);

    dispatch(loadingGetUserAction({}));
    await signUp({
      variables: {
        email: signUpData.get("email"),
        password: signUpData.get("password"),
        name: `${signUpData.get("firstName")} ${signUpData.get("lastName")}`,
      },
    })
      .then((value) => {
        localStorage.setItem("token", value.data.signup.token);
        localStorage.setItem("userId", value.data.signup.user.id);
        dispatch(getUserAction(value.data.signup));
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

      <form noValidate onSubmit={handleSubmit} style={{ marginTop: "300px" }}>
        <input
          name="firstName"
          required
          id="firstName"
          autoFocus
          placeholder="Firstname"
        />

        <input
          required
          id="lastName"
          name="lastName"
          autoComplete="family-name"
          placeholder="Laststname"
        />
        <input
          required
          id="email"
          name="email"
          autoComplete="email"
          placeholder="Email"
        />

        <input
          required
          name="password"
          type="password"
          id="password"
          autoComplete="new-password"
          placeholder="Password"
        />
        <button type="submit" disabled={loading} style={{  width: "300px"}}>
          Submit
        </button>
      </form>
    </>
  );
}
