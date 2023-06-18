import axios from "axios";
import { useState } from "react";

const Production_URL = "https://sociable-xisn.onrender.com/api";
// const Production_URL = "http://localhost:3001/api";
export default async function CommonApi(url, method, data, auth) {
  let token = "";
  token = localStorage.getItem("token");
  if (auth) {
    return axios({
      method: method,
      url: `${Production_URL}/${url}`,
      data: data,
      headers: {
        "Content-Type": "application/json",
        Authorization: token,
      },
    });
  } else {
    const response = axios({
      method: method,
      url: `${Production_URL}/${url}`,
      data: data ? data : null,
    });

    return response.data;
  }
}
