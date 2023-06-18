import React, { useState, useEffect } from "react";
import "./signup.css";
import { Button, Container, FormControl, Input } from "@mui/material";
import CommonApi from "../../common/api";
import { Link } from "react-router-dom";

function Signup() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [mobile, setMobile] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [aboutMe, setAboutMe] = useState("");
  const [error, setError] = useState("");
  async function Signup() {
    const data = {
      name: name,
      email: email,
      mobileNumber: mobile,
      password: password,
      confirmPassword: confirmPassword,
      aboutMe: aboutMe,
      
    };
   const res= CommonApi("signup", "post", data, false);
   console.log(res);
  }

  return (
    <>
      <Container className="container">
        <h2>Signup</h2>

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
            type="text"
            placeholder="Full Name"
            onChange={(txt) => {
              setName(txt.target.value);
            }}
          />
          <Input
            type="email"
            placeholder="Email"
            onChange={(txt) => {
              setEmail(txt.target.value);
            }}
          />
          <Input
            type="numeric"
            placeholder="Mobile Number"
            onChange={(txt) => {
              setMobile(txt.target.value);
            }}
          />
          <Input
            type="password"
            placeholder="Password"
            onChange={(txt) => {
              setPassword(txt.target.value);
            }}
          />
          <Input
            type="password"
            placeholder="Confirm Password"
            onChange={(txt) => {
              setConfirmPassword(txt.target.value);
            }}
          />
          <Input
            type="text"
            placeholder="About me "
            onChange={(txt) => {
              setAboutMe(txt.target.value);
            }}
          />
          <Button
            variant="contained"
            title="Signup"
            onClick={() => {
              Signup();
            }}
          >
            Signup
          </Button>
        </form>
        <hr/>
        <h3>Already have an account?</h3>
        <Link to={"/login"} >

        <Button variant="contained" >Login</Button>
        </Link>
      </Container>
    </>
  );
}

export default Signup;
