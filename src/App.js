import React, { useState, useEffect } from "react";
import axios from "axios";
function App() {
  const [id, setId] = useState("");
  const Production_URLL = "https://sociable-xisn.onrender.com/";
  const Production_URL = "http://localhost:3001/api/";
  function Signup() {
    // replace 3001 with your API port number
    const newUser = {
      name: "Arun Singh",
      email: "arunk4it@gmail.com",
      password: "43md33rm2S",
      mobileNumber: 333243233,
    };

    axios
      .post(`${Production_URL}`, newUser)
      .then((response) => {
        console.log("User added successfully:", response.data.id);
      })
      .catch((err) => {
        console.log("Error:", err.response.data);
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
      .post(`${Production_URL}login`, newUser)
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
      .post(`${Production_URL}logout`, newUser)
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
        .get(`${Production_URL}users/${id}`)
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
      .get(`${Production_URL}users`)
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
  return (
    <div
      style={{
        backgroundColor: "red",
        height: 500,
        width: 500,
        justifyContent: "center",
        alignItems: "center",
        alignSelf: "center",
        alignContent: "center",
      }}
    >
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

export default App;
