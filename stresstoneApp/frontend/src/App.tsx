import { useEffect, useState } from "react";
import axios from "axios";
import Login from "./components/Login";
import Header from "./components/Header";
import Sider from "./components/Sider";
import { Box, CssBaseline } from "@mui/material";
import TonePlayer from "./components/TonePlayer";

const siderWidth = 240;
const headerHeight = 64;

function App() {
  const [message, setMessage] = useState<string>("");

  useEffect(() => {
    axios.get("http://localhost:3000/")
      .then((res) => setMessage(res.data))
      .catch((err) => console.log(err));
  }, []);

  return (
    <div>
      <h1>Stresstone App</h1>
      <p>{message}</p>
    </div>
  );
}

export default App;
