import * as React from "react";
import { useNavigate } from "react-router-dom";

import { Typography, TextField, Box, Button } from "@mui/material";
import { Link, Navigate } from "react-router-dom";
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';
import axios from "axios";
export default function Contact() {
  const [userId, setUser] = React.useState("");
  const [open, setOpen] = React.useState(false);
  const handleClose = () => {
    setOpen(false);
  };
  const handleOpen = () => {
    setOpen(true);
  };
  const Production_URL = "https://sociable-xisn.onrender.com/api";

  const navigate = useNavigate();
  React.useEffect(() => {
    user();
  }, [userId]);
  async function user() {
    setUser(localStorage.getItem("userID"));
    if (userId === null) {
      navigate("/login");
    }
  }
  return (
    <>
      <div className="container">
        <Typography>{userId}</Typography>
        <Button
       variant="outlined"
          onClick={() => {
            handleOpen()
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
                localStorage.setItem("userID", "");
                setUser(null)
                handleClose()
              })
              .catch((err) => {
                console.log("Error:", err.response.data);
                handleClose()
              });
          }}
        >Logout</Button>
         <div>
      <Button onClick={handleOpen}>Show backdrop</Button>
      <Backdrop
        sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={open}
        onClick={handleClose}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
    </div>
      </div>
    </>
  );
}
