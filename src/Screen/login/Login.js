import React, { useState, useEffect } from "react";
import "./login.css";
import { Button, Container, FormControl, Input } from "@mui/material";
import CommonApi from "../../common/api";
import { Link } from "react-router-dom";

function Login() {
  const [email, setEmail] = useState("");

  const [password, setPassword] = useState("");

  async function onLogin() {
    const data = {
      email: email,
      password: password,
    };
    CommonApi("login", "post", data, false)
      .then((response) => {
        console.log(response);
      })
      .catch((error) => {
        console.log(error);
      });
  }

  return (
    <>
      <Container className="container">
        <h2>Login</h2>

        <form
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            // justifyContent: "center",
            // alignItems: "space-between",
            justifyContent: "space-between",
          }}
        >
          <Input
            type="email"
            placeholder="Email"
            onChange={(txt) => {
              setEmail(txt.target.value);
            }}
          />

          <Input
            type="password"
            placeholder="Password"
            onChange={(txt) => {
              setPassword(txt.target.value);
            }}
          />

          <Button
            variant="contained"
            title="Login"
            onClick={() => {
              onLogin();
            }}
          >
            Login
          </Button>
        </form>
        <h5>Create new account</h5>
        <Link to={"/signup"}>
          <Button variant="contained">Signup</Button>
        </Link>
      </Container>
    </>
  );
}

export default Login;
