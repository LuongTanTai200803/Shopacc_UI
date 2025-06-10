import { useNavigate } from "react-router-dom";
import '../index.css';

function Navbar({ avatar, username, coin, isLoggedIn, handleLogout, setScreen }) {
  const navigate = useNavigate();
  
  const Logout = () => {
    handleLogout()
    navigate("/");
  }

  //console.log("token: ", localStorage.getItem("token"))
  return ( <nav className="navbar navbar-expand-lg custom-navbar">
    <div className="container px-4 px-lg-5">
        <a className="navbar-brand" href="/">ShopACC uy tín chất lượng</a>
    
        {/* Avatar Dropdown */}
        <div className="ms-auto d-flex align-items-center">
          {isLoggedIn && localStorage.getItem("token") ? (
            <div className="dropdown">
              <button
                className="btn d-flex align-items-center dropdown-toggle"
                type="button"
                id="userDropdown"
                data-bs-toggle="dropdown"
                aria-expanded="false"
              >
                <img
                  src={avatar} 
                  className="rounded-circle me-2"
                  width="36"
                  height="36"
                  alt="avatar"
                />
                <div className="text-start">
                  <div className="fw-medium small">{username}</div>
                  <div className="text-danger fw-bold small">{coin} <small>đ</small></div>
                </div>
              </button>
              <ul className="dropdown-menu dropdown-menu-end" aria-labelledby="userDropdown">
                <li>
                  <button className="dropdown-item" onClick={() => navigate("/profile")}>
                    Hồ sơ
                  </button>
                </li>
                <li><hr className="dropdown-divider" /></li>
                <li>
                  <button className="dropdown-item text-danger" onClick={(e) => {
                    e.preventDefault(); 
                    Logout(); // Lưu data và điều hướng
                    }}>
                    Đăng xuất
                  </button>
                </li>
              </ul>
            </div>
          ) : (
            <>
              <button className="btn btn-outline-dark me-2" onClick={() => navigate("/signup")}>
                <i className="bi bi-person-plus me-1"></i> Đăng ký
              </button>
              <button className="btn btn-outline-dark" onClick={() => navigate("/login")}>
                <i className="bi bi-box-arrow-in-right me-1"></i> Đăng nhập
              </button>
            </>
          )}
        </div>
      </div>
  </nav>
  );
}

export default Navbar;
