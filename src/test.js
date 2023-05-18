import React, { useState, useEffect } from "react";
import axios from "axios";
import ResponsiveAppBar from "./header";
import { Fab, Box, Tooltip } from "@mui/material";
import { PlusOne, Download } from "@mui/icons-material";
import { Route } from "react-router";
import { useSpring, animated } from "@react-spring/web";

function Myapi() {
  const [id, setId] = useState("");
  const Production_URL = "https://sociable-xisn.onrender.com/api";
  // const Production_URL = "http://localhost:3001/api/";
  function Signup() {
    // replace 3001 with your API port number
    const newUser = {
      name: "Arun Singh",
      email: "arunk4it@gmail.com",
      password: "43md33rm2S",
      mobileNumber: 333243233,
    };

    axios
      .post(`${Production_URL}/signup`, newUser)
      .then((response) => {
        console.log("User added successfully:", response.data.id);
      })
      .catch((err) => {
        console.log("Error:", err.response);
      });
  }
  function Login() {
    const apiUrl = "http://localhost:3001/"; // replace 3001 with your API port number
    const newUser = {
      name: "Arun Singh",
      email: "arunk4it@gmail.com",
      password: "43md33rm2S",
      mobileNumber: 333243233,
      deviceToken: "dfdslfk43r34rkmlefk34rmk34mr",
    };

    axios
      .post(`${Production_URL}/login`, newUser)
      .then((response) => {
        console.log("User LoggedIn successfully:", response.data.userID);
        setId(response.data.userID);
      })
      .catch((err) => {
        console.log("Error:", err.response.data);
      });
  }
  function logOut() {
    const newUser = {
      name: "Arun Singh",
      email: "arunk4it@gmail.com",
      password: "43md33rm2S",
      mobileNumber: 333243233,
      deviceToken: "dfdslfk43r34rkmlefk34rmk34mr",
    };

    axios
      .post(`${Production_URL}/logout`, newUser)
      .then((response) => {
        console.log("UserLogout :", response.data);
        setId("");
      })
      .catch((err) => {
        console.log("Error:", err.response.data);
      });
  }
  function getUser() {
    if (id) {
      axios
        .get(`${Production_URL}/users/${id}`)
        .then((response) => {
          console.log("User Found:", response.data);
        })
        .catch((err) => {
          console.log("Error:", err.response.data);
        });
    } else if (!id) {
      console.log("User ID is required");
    }
  }
  async function getAllUsers() {
    axios
      .get(`${Production_URL}/users`)
      .then((response) => {
        console.log("All Users Found:", response.data);
      })
      .catch((err) => {
        console.log("Error:", err.response.data);
      });
  }
  useEffect(() => {
    // addUser();
  }, []);
  const springs = useSpring({
    from: { x: 32 },
    to: { x: 1200 },
  });

  return (
    <div
      style={{
        backgroundColor: "red",
        height: 500,
        width: "100%",
        justifyContent: "center",
        alignItems: "center",
        alignSelf: "center",
        alignContent: "center",
      }}
    >
      {/* <ResponsiveAppBar /> */}
      {/* <Route path="/" component={ResponsiveAppBar} /> */}
      <animated.div
        style={{
          width: 80,
          height: 80,
          background: "#ff6d6d",
          borderRadius: 8,
        }}
      />
      <Tooltip title={"Resume"}>
        <Fab
          style={{
            backgroundColor: "#101010",
            position: "absolute",
            bottom: 10,
            right: 20,
          }}
          aria-label="add"
        >
          <Download color="white" style={{ color: "#ffffff" }} />
        </Fab>
      </Tooltip>
      <text style={{ textAlign: "center" }}>{id}</text>
      <button style={{ height: 100, width: 100 }} onClick={() => Signup()}>
        <text>Signup</text>
      </button>
      <button style={{ height: 100, width: 100 }} onClick={() => Login()}>
        <text>Login</text>
      </button>
      <button style={{ height: 100, width: 100 }} onClick={() => logOut()}>
        <text>Logout</text>
      </button>
      <button style={{ height: 100, width: 100 }} onClick={() => getUser()}>
        <text>getUser</text>
      </button>
      <button style={{ height: 100, width: 100 }} onClick={() => getAllUsers()}>
        <text>getAllUser</text>
      </button>
    </div>
  );
}

export default Myapi;
