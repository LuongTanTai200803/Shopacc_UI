import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import checkToken from "./hooks/useAuth";

import Dashboard from "./pages/Dashboard";
import Home from './pages/Home';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Profile from "./pages/Profile";
import Payment from "./pages/Payment";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import { useEffect, useState } from "react";

import avatar from './assets/images/default-avatar.png';
import useAuth from "./hooks/useAuth";

const apiUrl = import.meta.env.VITE_API_URL

function App() {

  const [screen, setScreen] = useState("home")
  const [user, setUser] = useState("")
  const token = localStorage.getItem('token');

  const [isLoggedIn, setIsLoggedIn] = useState(
      localStorage.getItem("isLoggedIn") === "true"
    ); // Khởi tạo từ localStorage
  const [tokenExpired, setTokenExpired] = useAuth();
  // console.log("tokenExpired:", tokenExpired)
  // console.log(token)
  //console.log("check: ", checkToken())
  //console.log("tokenExpired: ", tokenExpired)
  //console.log("isLoggedIn 3: ", isLoggedIn)
  useEffect(() => {
    if (token) 
      setIsLoggedIn(true);

    if (tokenExpired)
      localStorage.removeItem("token");
  }, []);
  

  const handleLogout = () => {
    setIsLoggedIn(false);
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    localStorage.removeItem("coin");
    setScreen("home");
  };

  return (
    <div className="d-flex flex-column min-vh-100">
      <Router>
       <Navbar 
          avatar={avatar}
          user={user}
          isLoggedIn={isLoggedIn}
          handleLogout={handleLogout}
          setScreen={setScreen}
          />

        
        <div className="flex-grow-1">
          {/* Conponent Home */}
          <Routes>
            <Route path="/" element={<Home 
            screen={screen}
            setScreen={setScreen}
            apiUrl={apiUrl}
            setIsLoggedIn={setIsLoggedIn}
            />} />
          {/* Conponent Login */}  
            <Route path="/login" element={<Login
                apiUrl={apiUrl}
                isLoggedIn={isLoggedIn}
                setIsLoggedIn={setIsLoggedIn}
                user={user}
                setUser={setUser}
            />} />
            <Route path="/signup" element={<Signup
              apiUrl={apiUrl}
             />} />

            <Route path="/dashboard" element={<Dashboard />} />

            <Route path="/profile" element={<Profile 
            isLoggedIn={isLoggedIn}
            apiUrl={apiUrl}
            />} />

            <Route path="/payment" element={<Payment
            isLoggedIn={isLoggedIn}
            apiUrl={apiUrl}
            
             />} />
          </Routes>
        </div>

        <Footer />
      </Router>
    </div>
  );
}

export default App;
