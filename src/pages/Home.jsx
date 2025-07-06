import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

// Import các component khác
import Profile from './Profile';
import Signup from './Signup';
import Login from './Login';
import Navbar from "../components/Navbar";
import avatar from '../assets/images/default-avatar.png';

export default function Home({ apiUrl }) {
  const navigate = useNavigate();
  const location = useLocation();

  // Gom state người dùng vào một object cho dễ quản lý
  const [user, setUser] = useState({
    isLoggedIn: !!localStorage.getItem("token"), // !! chuyển string/null thành boolean
    token: localStorage.getItem("token"),
    username: localStorage.getItem("username"),
    coin: localStorage.getItem("coin"),
    avatar: avatar 
  });

  const [accounts, setAccounts] = useState([]);
  const [error, setError] = useState('');
  const [screen, setScreen] = useState("home");

  // Hàm xử lý khi đăng nhập thành công
  const handleLoginSuccess = (loginData) => {
    // 1. Lưu vào localStorage để ghi nhớ
    localStorage.setItem("token", loginData.access_token);
    localStorage.setItem("username", loginData.username);
    localStorage.setItem("coin", loginData.coin);

    // 2. Cập nhật state để giao diện thay đổi
    setUser({
      isLoggedIn: true,
      token: loginData.access_token,
      username: loginData.username,
      coin: loginData.coin,
      avatar: avatar 
    });

    // 3. Chuyển về trang chủ
    setScreen("home"); 
  };

  // Hàm xử lý đăng xuất
  const handleLogout = () => {
    localStorage.clear();
    setUser({
      isLoggedIn: false,
      token: null,
      username: null,
      coin: null,
      avatar: avatar
    });
    navigate("/");
  };

  // Fetch danh sách accounts
  useEffect(() => {
    const fetchAccounts = async () => {
      try {
        console.log("Đang gọi đến API tại:", apiUrl); 
        const response = await fetch(`${apiUrl}/acc/`); 
        if (!response.ok) throw new Error('Network response was not ok');
        const data = await response.json();
        setAccounts(data);
        setError(null);
      } catch (error) {
        console.error('Error fetching accounts:', error.message);
        setError('Không thể kết nối tới server.');
      }
    };
    fetchAccounts();
  }, [apiUrl]);

  // Xử lý chuyển màn hình
  useEffect(() => {
    if (location.state?.screen) {
      setScreen(location.state.screen);
    }
  }, [location.state]);

  // Điều hướng hiển thị
  if (screen === "signup") return <Signup onSwitchToLogin={() => setScreen("login")} />;
  if (screen === "login") return <Login onLoginSuccess={handleLoginSuccess} onSwitchToSignup={() => setScreen("signup")} />;
  if (screen === "profile") return <Profile setScreen={setScreen} />;

  // Giao diện trang chủ
  return (
    <div className="bg-light">
      

      <header className="bg-dark py-5">
        <div className="container px-4 px-lg-5 my-5">
          <div className="text-center text-white">
            <h1 className="display-4 fw-bolder">Shop tài khoản game</h1>
            <p className="lead fw-normal text-white-50 mb-0">Mua bán tài khoản an toàn - nhanh chóng</p>
          </div>
        </div>
      </header>

      <section className="py-5">
        <div className="container px-4 px-lg-5">
          {error && <p className="text-center text-danger">{error}</p>}
          <div className="row gx-4 gx-lg-5 row-cols-2 row-cols-md-3 row-cols-xl-4 justify-content-center">
            {accounts.map((acc) => (
              <ProductCard key={acc.id} {...acc} navigate={navigate} />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

// Component ProductCard
function ProductCard({ id, name, price, image_url, status, hero, skin, navigate }) {
  const handleClick = () => {
    const product = { id, name, price, image_url, hero, skin };
    navigate("/Payment", { state: { productDetails: product } });
  };

  return (
    <div className="col mb-5">
      <div className="card h-100">
        <img className="card-img-top" src={image_url} alt={name || 'Game Account'} />
        <div className="position-absolute top-0 start-0 bg-danger text-white px-2 py-1 rounded small">
          {id}
        </div>
        <div className="card-body p-4">
          <div className="text-center">
            <h5 className="fw-bolder">{name || `Tài khoản #${id}`}</h5>
            {hero && <p>Hero: {hero}</p>}
            {skin && <p>Skin: {skin}</p>}
            {price != null && <p>Giá: {price.toLocaleString()} VNĐ</p>}
          </div>
        </div>
        <div className="card-footer p-4 pt-0 border-top-0 bg-transparent">
          <div className="text-center">
            <a onClick={handleClick} className="btn btn-outline-dark mt-auto" href="#">
              Xem chi tiết
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
