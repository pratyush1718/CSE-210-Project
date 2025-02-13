import { useEffect, useState } from "react";
import axios from "axios";
import SearchBar from "./components/SearchBar"; // added import for SearchBar
import Header from "./components/Header";
import Sider from "./components/Sider";
import { Box, CssBaseline } from "@mui/material";
import TonePlayer from "./components/TonePlayer";
import Login from "./components/Login"

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
      <SearchBar /> {/* added SearchBar component */}
    </div>
  );
}

export default App;