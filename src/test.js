import React, { useState, useEffect } from "react";
import axios from "axios";
import ResponsiveAppBar from "./header";
import { Fab, Box, Tooltip } from "@mui/material";
import { PlusOne, Download } from "@mui/icons-material";
import { Route } from "react-router";
import { useSpring, animated } from "@react-spring/web";
import { Parallax } from "react-scroll-parallax";
import { ParallaxBanner } from "react-scroll-parallax";
// import { BannerLayer } from "react-scroll-parallax/dist/components/ParallaxBanner/types";
import "./App.css";
function Myapi() {
  const [user, setUser] = useState("");
  const Production_URL = "https://sociable-xisn.onrender.com/api";
  // const Production_URL = "http://localhost:3001/api";
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
        localStorage.setItem("user", JSON.stringify(response.data));
        const getUser = localStorage.getItem("user");
        setUser(JSON.parse(getUser));
        console.log("User LoggedIn successfully", JSON.parse(getUser));
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
        setUser(null);
      })
      .catch((err) => {
        console.log("Error:", err.response.data);
      });
  }
  function getUser() {
    if (user) {
      axios
        .get(`${Production_URL}/users/${user.userID}`)
        .then((response) => {
          console.log("User Found:", response.data);
        })
        .catch((err) => {
          console.log("Error:", err.response.data);
        });
    } else if (!user) {
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

  const background = {
    image:
      "https://s3-us-west-2.amazonaws.com/s.cdpn.io/105988/banner-background.jpg",
    translateY: [0, 50],
    opacity: [1, 0.3],
    scale: [1.05, 1, "easeOutCubic"],
    shouldAlwaysCompleteAnimation: true,
  };

  const headline = {
    translateY: [0, 30],
    scale: [1, 1.05, "easeOutCubic"],
    shouldAlwaysCompleteAnimation: true,
    expanded: false,
    children: (
      <div className="absolute inset-0 flex items-center justify-center">
        <h1 className="text-6xl md:text-8xl text-white font-thin">
          {user && `Welcome ${user?.name}`}
        </h1>
      </div>
    ),
  };

  const foreground = {
    image:
      "https://s3-us-west-2.amazonaws.com/s.cdpn.io/105988/banner-foreground.png",
    translateY: [0, 15],
    scale: [1, 1.1, "easeOutCubic"],
    shouldAlwaysCompleteAnimation: true,
  };

  const gradientOverlay = {
    opacity: [0, 0.9],
    shouldAlwaysCompleteAnimation: true,
    expanded: false,
    children: (
      <div className="absolute inset-0 bg-gradient-to-t from-gray-900 to-blue-900" />
    ),
  };
  const springs = useSpring({
    from: { x: 32 },
    to: { x: 1200 },
  });

  return (
    <div
      style={{
        // backgroundColor: "red",
        height: "100%",
        width: "100%",
        justifyContent: "center",
        alignItems: "center",
        alignSelf: "center",
        alignContent: "center",
      }}
    >
      {/* <ResponsiveAppBar /> */}
      {/* <Route path="/" component={ResponsiveAppBar} /> */}

      <ParallaxBanner
        layers={[background, headline, foreground, gradientOverlay]}
        className="full"
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

      <Parallax speed={-10}>
        <div />
        <button style={{ height: 100, width: 100 }} onClick={() => Signup()}>
          <text>Signup</text>
        </button>
      </Parallax>
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
