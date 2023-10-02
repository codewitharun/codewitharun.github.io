"use client";
import { useCallback, useState } from "react";

function Home() {
  const a: number = 22432;
  const [name, setName] = useState("I am arun");
  return <div className="bg-red">This in my first page in next {name}</div>;
}

export default Home;
