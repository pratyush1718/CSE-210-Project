import { useEffect, useState } from "react";
import axios from "axios";
import Login from "./components/Login";

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
      <Login></Login>
      <p>{message}</p>
    </div>
  );
}

export default App;
