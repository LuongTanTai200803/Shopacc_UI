import { useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { data, useNavigate } from "react-router-dom";
import Profile from './Profile';
import avatar from '../assets/images/default-avatar.png';
import Navbar  from "../components/Navbar";



export default function Home({apiUrl}) {
  const navigate = useNavigate();
  const [error, setError] = useState('');
  const [screen, setScreen] = useState("home"); // "home", "signup", "login"
  const [isLoggedIn, setIsLoggedIn] = useState(
    localStorage.getItem("isLoggedIn") === "true"
  ); // Khởi tạo từ localStorage
  const [tokenExpired, setTokenExpired] = useState(false);
  const token = localStorage.getItem('token');
  const username = localStorage.getItem('username');
  const coin = localStorage.getItem('coin');

  const [accounts, setAccounts] = useState([]);

  // Kiểm tra token login
  useEffect(() => {
    if (token) { //Kiểm tra có token hay không
      
      // Ví dụ gọi đến route backend

      // fetch("http://127.0.0.1:5000/auth/protected", {
      //   headers: {
      //     Authorization: `Bearer ${token}`
      //   }
      // })
      fetch(`${apiUrl}/auth/protected`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      
        .then(res => {
          if (res.status === 200) {
            setIsLoggedIn(true);  
            // console.error('Response status:', res.status); // thêm dòng này
            // console.error('Response data:', data); // thêm dòng này
          } else {

            setIsLoggedIn(false);
            localStorage.removeItem("token"); // Xóa token không hợp lệ
          }
        });
    } else {
      setIsLoggedIn(false);
    }   

  }, []);
  // fetch danh sách accounts
  useEffect(() => {
    if (true) {
      const fetchAccounts = async () => {
        try {
          
          const response = await fetch(`${apiUrl}/acc/`, {
              method: 'GET',
              headers: {
                 'Content-Type': 'application/json'
              }
          });

          const data = await response.json();
          // console.log("Fetched data:", data);

          if (response.ok) {
            setAccounts(data);  // set state với data tài khoản
            setError(null);     // xóa lỗi nếu có
          } else {
              console.error('msg:', token)
              console.error('Response status:', response.status); // thêm dòng này
              console.error('Response data:', data); // thêm dòng này
              setError(data.msg || data.message || 'Lấy dữ liệu thất bại');
          }
        } catch (error) {
            console.error('Error server not run:', error.message);
            setError('Không thể kết nối tới server. Có thể server bị lỗi hoặc bạn đang offline.');
        }
      };
      fetchAccounts();
    }
  }, []);

  const location = useLocation();
  // Khi vừa vào Home, nếu có state.screen thì dùng nó
  useEffect(() => {
    if (location.state?.screen) {
      setScreen(location.state.screen);
    }
  }, [location.state]);

    
    if (screen === "signup") 
      return <Signup
              onBack={() => setScreen("home")}
              onSwitchToSignup={() => setScreen("signup")}
              onSwitchToLogin={() => setScreen("login")}
             />;
    if (screen === "login") 
      return <Login
              onBack={() => setScreen("home")}
              onSwitchToSignup={() => setScreen("signup")}
              onSwitchToLogin={() => setScreen("login")}
              onLoginSuccess={handleLoginSuccess} // Truyền callback
             />;
    if (screen === "profile") {
      return <Profile setScreen={setScreen} />;
    }
  
  

  return (
  <div className="bg-light">
    {/* Navbar */}
  

    {/* Header */}
    <header className="bg-dark py-5">
      <div className="container px-4 px-lg-5 my-5">
        <div className="text-center text-white">
          <h1 className="display-4 fw-bolder">Shop tài khoản game</h1>
          <p className="lead fw-normal text-white-50 mb-0">Mua bán tài khoản an toàn - nhanh chóng</p>
        </div>
      </div>
    </header>

    {/* Sản phẩm mẫu */}
    <section className="py-5">
      <div className="row gx-4 gx-lg-5 row-cols-2 row-cols-md-3 row-cols-xl-4 justify-content-center">
        {accounts.map((acc, index) => (
          <ProductCard key={index} {...acc} navigate={navigate} />
        ))}
      </div>
    </section>

    
  </div>
);

  console.log("SCREEN =", screen);

}

function ProductCard({ id, name, price, image_url, status, hero, skin, navigate }) {
  const handleClick = () => {
    const product = { id, name, price, image_url, hero, skin };
    console.log("Lưu vào localStorage:", product);
    localStorage.setItem("details_account", JSON.stringify(product));
    navigate("/Payment");
  };
  return (
    <div className="col mb-5">
      <div className="card h-100">
        {status === "sale" && (
          <div className="badge bg-dark text-white position-absolute" style={{ top: "0.5rem", right: "0.5rem" }}>
            Sale
          </div>
        )}
        <img className="card-image_url-top" src={image_url} alt={name} />
        <div
    className="position-absolute top-0 start-0 bg-danger text-white px-2 py-1 rounded small"
    style={{ backgroundColor: 'rgba(17, 51, 220, 0.6)' }}
        >
          {id}
        </div>
        <div className="card-body p-4">
          <div className="text-center">
            <h5 className="fw-bolder">{name}</h5>
            {hero && <p>Hero: {hero}</p>}
            {skin && <p>Skin: {skin}</p>}
            {price && <p>price: {price}</p>}
          </div>
        </div>
        <div className="card-footer p-4 pt-0 border-top-0 bg-transparent">
          <div className="text-center">
            <a onClick={(e) => {
                e.preventDefault(); 
                handleClick(); // Lưu data và điều hướng
              }}
            className="btn btn-outline-dark mt-auto" href="#">Xem chi tiết</a>
          </div>
        </div>
      </div>
    </div>
  );
}


