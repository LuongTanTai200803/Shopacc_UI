import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { signInWithPopup } from "firebase/auth";
import { auth, provider } from "../firebaseConfig";

export default function Login({ onLoginSuccess, apiUrl, user, setUser, isLoggedIn, setIsLoggedIn}) {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState(""); // Thêm state để lưu lỗi

    const navigate = useNavigate();

    const handleLoginSuccess=() => {
        setIsLoggedIn(true);
        setUser({
            username: localStorage.getItem("username"),
            coin: localStorage.getItem("coin"),
        });
        navigate("/"); // về trang chủ
        };
    // Fetch api login
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
          localStorage.setItem('username', data.username);
          localStorage.setItem('coin', data.coin);
          console.log("Status code:", response.status);
            //setTimeout(() => { if (onBack) onBack(); // gọi callback để chuyển sang form login }, 2000);
          handleLoginSuccess();
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

    const handleGoogleLogin = async () => {
    setError("");
    try {
      const result = await signInWithPopup(auth, provider);
      const idToken = await result.user.getIdToken();

      // Gửi idToken về Flask backend
      const res = await fetch(`${apiUrl}/auth/google`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ idToken })
      });

      const data = await res.json();

      if (res.ok) {
        localStorage.setItem('token', data.access_token); // giả sử backend trả JWT
        localStorage.setItem('username', data.username || result.user.email);
        handleLoginSuccess();
      } else {
        setError(data.msg || data.message || "Đăng nhập Google thất bại");
      }

    } catch (err) {
      console.error(err);
      setError("Lỗi đăng nhập Google");
    }
  };


  return (
    <div className="card p-4 shadow bg-white" style={{ maxWidth: "400px", margin: "0 auto" }}>
      <h2 className="text-center mb-4">Đăng nhập</h2>

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
              placeholder="Mật khẩu"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
        <button type="submit" className="btn btn-primary w-100" >
          Đăng Nhập
        </button>

        </form> &nbsp;
      <button className="btn btn-success" onClick={() => navigate("/signup")}>
          Bạn chưa có tài khoản? Đăng ký ngay tại đây.
      </button>
              <br />
      <button class="google-btn" onclick="handleGoogleLogin()">
        <img src="https://developers.google.com/identity/images/g-logo.png" class="google-icon" alt="Google logo" />
        <span>Đăng nhập bằng Google</span>
      </button>
        <br />
      <button className="btn btn-sm btn-outline-secondary mt-2" onClick={() => navigate("/")}>
          ← Quay lại Trang chính
      </button>
      </div>
  );
}