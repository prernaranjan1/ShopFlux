import "./App.css";
import { useState, useEffect } from "react";
import Auth from "./Auth";
import Home from "./pages/Home";
import { Toaster } from "react-hot-toast";

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const userId = localStorage.getItem("userId");
    const token = localStorage.getItem("token");

    if (userId && token) {
      setUser(userId);
    }
    setLoading(false);
  }, []);

  if (loading) {
    return <div className="p-6 text-center">Loading...</div>;
  }

  return (
    <>
      {!user ? <Auth onLogin={setUser} /> : <Home user={user} />}
    </>
  );
}

export default App;