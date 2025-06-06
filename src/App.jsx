import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Dashboard from "./pages/Dashboard";
import Home from './pages/Home';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Profile from "./pages/Profile";
import Payment from "./pages/Payment";

function App() {
  return (
    <div className="d-flex flex-column min-vh-100">
      <Router>
        <Navbar />

        {/* Main content - phần chiếm hết không gian còn lại */}
        <div className="flex-grow-1">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/payment" element={<Payment />} />
          </Routes>
        </div>

        <Footer />
      </Router>
    </div>
  );
}

export default App;
