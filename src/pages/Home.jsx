import { useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { data, useNavigate } from "react-router-dom";
import Profile from './Profile';

const apiUrl = import.meta.env.VITE_API_URL
console.log("API URL:", apiUrl)

export default function Home() {
  const navigate = useNavigate();
  const [error, setError] = useState('');
  const [screen, setScreen] = useState("home"); // "home", "signup", "login"
  const [isLoggedIn, setIsLoggedIn] = useState(
    localStorage.getItem("isLoggedIn") === "true"
  ); // Khởi tạo từ localStorage
  const [tokenExpired, setTokenExpired] = useState(false);
  const token = localStorage.getItem('token');


  const [accounts, setAccounts] = useState([]);
  const handleLoginSuccess = () => {
    setIsLoggedIn(true); // Cập nhật trạng thái đăng nhập
    setScreen("home"); // Quay lại màn hình chính
    localStorage.setItem("isLoggedIn", "true"); // Lưu trạng thái vào localStorage
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("token");
    setScreen("home");

  };
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
    <nav className="navbar navbar-expand-lg navbar-light bg-light">
      <div className="container px-4 px-lg-5">
        <a className="navbar-brand" href="/">ShopACC uy tín chất lượng</a>
        <button className="navbar-toggler" type="button" data-bs-toggle="collapse"
                data-bs-target="#navbarSupportedContent"
                aria-controls="navbarSupportedContent" aria-expanded="false"
                aria-label="Toggle navigation">
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarSupportedContent">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0 ms-lg-4">
            <li className="nav-item"><a className="nav-link active" href="/">Trang chủ</a></li>
            <li className="nav-item"><a className="nav-link" href="#">Giới thiệu</a></li>
          </ul>
          <div className="d-flex">
            {isLoggedIn && localStorage.getItem("token") ? (   // Kiểm tra đăng nhập
                <>
                  <button
                    className="btn btn-outline-dark me-2"
                    onClick={() => navigate("/profile")} // Điều hướng đến trang hồ sơ
                  >
                    <i className="bi bi-person me-1"></i> Hồ sơ
                  </button>
                  <button
                    className="btn btn-outline-dark"
                    onClick={handleLogout} // Đăng xuất
                  >
                    <i className="bi bi-box-arrow-right me-1"></i> Đăng xuất
                  </button>
                </>
              ) : (
              <>
                <button className="btn btn-outline-dark me-2" onClick={() => setScreen("signup")}>
                  <i className="bi bi-person-plus me-1"></i> Đăng ký
                </button>
                <button className="btn btn-outline-dark" onClick={() => setScreen("login")}>
                  <i className="bi bi-box-arrow-in-right me-1"></i> Đăng nhập
                </button>
              </>
          )}  
          </div>
        </div>
      </div>
    </nav>

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


function Signup({ onBack, onSwitchToSignup, onSwitchToLogin}) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState(""); // Thêm state để lưu lỗi

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(""); // Reset lỗi trước khi gọi API

    try {
        const response = await fetch(`${apiUrl}/auth/signup`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ username, password })
        });

        const data = await response.json();

        if (response.ok) {
            setError('Đăng ký thành công! Vui lòng đăng nhập.');
            setTimeout(() => {
              if (onSwitchToLogin) onSwitchToLogin(); // gọi callback để chuyển sang form login
            }, 2000);
        } else {
            console.error('Response status:', response.status); // thêm dòng này
            console.error('Response data:', data); // thêm dòng này
            setError(data.msg || data.message || 'Đăng ký thất bại');
        }
    } catch (error) {
        console.error('Error:', error);
        setError('Không thể kết nối tới server. Có thể server bị lỗi hoặc bạn đang offline.');
    }

  };

  return (
    <div className="card p-4 shadow bg-white" style={{ maxWidth: "400px", margin: "0 auto" }}>
      <h2 className="text-center mb-4">Tạo tài khoản mới</h2>

      {error && (
        <div className="alert alert-warning py-2 text-center" role="alert">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <input
            type="text"
            className="form-control"
            placeholder="Tên đăng nhập"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>

        <div className="mb-3">
          <input
            type="password"
            className="form-control"
            placeholder="Nhập mật khẩu"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <div className="mb-3">
          <input
            type="password"
            className="form-control"
            placeholder="Nhập lại mật khẩu"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
        </div>

        <button type="submit" className="btn btn btn-success w-100" >
          Đăng Ký
        </button>

        </form> &nbsp;
      <button className="btn btn-primary" onClick={onSwitchToLogin}>
          Đăng nhập
      </button>
        <br />
      <button className="btn btn-sm btn-outline-secondary mt-2" onClick={onBack}>
          ← Quay lại Trang chính
      </button>
      </div>
  );
}

function Login({ onBack, onSwitchToSignup ,onSwitchToLogin, onLoginSuccess}) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(""); // Thêm state để lưu lỗi

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(""); // Reset lỗi trước khi gọi API

    try {
        const response = await fetch(`${apiUrl}/auth/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ username, password })
        });

        const data = await response.json();

        if (response.ok) {
            // Kiểm tra token trước khi lưu
          localStorage.setItem('token', data.access_token); // lưu token
          console.log("Status code:", response.status);
            //setTimeout(() => { if (onBack) onBack(); // gọi callback để chuyển sang form login }, 2000);
          if (onLoginSuccess) onLoginSuccess();
        } else {
            console.error('Response status:', response.status); // thêm dòng này
            console.error('Response data:', data); // thêm dòng này
            setError(data.msg || data.message || 'Đăng nhập thất bại');
        }
    } catch (error) {
        console.error('Error:', error);
        setError('Không thể kết nối tới server. Có thể server bị lỗi hoặc bạn đang offline.');
    }


  };

  return (
    <div className="card p-4 shadow bg-white" style={{ maxWidth: "400px", margin: "0 auto" }}>
      <h2 className="text-center mb-4">Tạo tài khoản mới</h2>

        {error && (
          <div className="alert alert-warning py-2 text-center" role="alert">
            {error}
          </div>
        )}
      
        <form onSubmit={handleSubmit}>
          <div className="mb-3">

            <input
              type="text"
              className="form-control"
              placeholder="Nhập username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>

          <div className="mb-3">

            <input
              type="password"
              className="form-control"
              placeholder="Nhập mật khẩu"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
        <button type="submit" className="btn btn-primary w-100" >
          Đăng Nhập
        </button>

        </form> &nbsp;
      <button className="btn btn-success" onClick={onSwitchToSignup}>
          Đăng Ký
      </button>
        <br />
      <button className="btn btn-sm btn-outline-secondary mt-2" onClick={onBack}>
          ← Quay lại Trang chính
      </button>
      </div>
  );
}