import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import useAuth from "../hooks/useAuth"

const apiUrl = import.meta.env.VITE_API_URL
export default function Payment() {
    const token = localStorage.getItem('token');
    const { tokenExpired , confirmMessage, user_id } = useAuth(token);
    const navigate = useNavigate();
    const [error, setError] = useState(null);
    const [userData, setUserData] = useState(null);
   

    const [screen, setScreen] = useState("payment"); // "payment" "purchase"
    const details_account = JSON.parse(localStorage.getItem("details_account"));
    //console.error("tokenexpired:", tokenExpired)


  // if (details_account) {
  //   console.log("id:",details_account.id);
  //   console.log("name:",details_account.name);
    
  // }
  const handleLogout = () => {
    //setIsLoggedIn(false);
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("token");
    setScreen("home");
  }
  if (screen === "purchase") 
  return <Purchase
          token={token}
          onBack={() => setScreen("payment")}
          // onSwitchToPurchase={() => setScreen("purchase")}
          
         />;

  const checkClick = () => {
      if (tokenExpired)
        setError(`${confirmMessage}`)
        
  setScreen("purchase")
  };
 
  return(
    <div className="bg-light">
        
     

      {/* nội dung chính */}
      <h2></h2>
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
            {!tokenExpired && token ? (   // Kiểm tra đăng nhập
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
                <button className="btn btn-outline-dark me-2" 
                onClick={() => {
                  navigate("/", {state : { screen: "signup"}});
                  }}
                >
                  <i className="bi bi-person-plus me-1"></i> Đăng ký
                </button>
                <button className="btn btn-outline-dark" 
                onClick={() => {
                  navigate("/", {state : { screen: "login"}});
                  }}
                >
                  <i className="bi bi-box-arrow-in-right me-1"></i> Đăng nhập
                </button>
              </>
          )}  
          </div>
        </div>
      </div>
    </nav>
    <div className="col mb-5">
      <div className="card h-100">
        
        <img className="card-image_url-top" src={details_account.image_url}  />
        <div
    className="position-absolute top-0 start-0 bg-danger text-white px-2 py-1 rounded small"
    style={{ backgroundColor: 'rgba(17, 51, 220, 0.6)' }}
        >
          {details_account.id}
        </div>
        <div className="card-body p-4">
          <div className="text-center">
            <h5 className="fw-bolder">{name}</h5>
            {details_account.hero && <p>Hero: {details_account.hero}</p>}
            {details_account.skin && <p>Skin: {details_account.skin}</p>}
            {details_account.price && <p>Price: {details_account.price}</p>}
          </div>
        </div>
        <div className="card-footer p-4 pt-0 border-top-0 bg-transparent">
          <div className="text-center">
            <a onClick={(e) => {
                e.preventDefault(); 
                checkClick(); // Lưu data và điều hướng
              }}
            className="btn btn-outline-dark mt-auto" >Mua</a>
          </div>
          {error && (
          <div className="alert alert-warning py-2 text-center" role="alert">
            {error}
          </div>
        )}
        </div>
      </div>
    </div>
    </div>
  );
}

/* Thanh toán */
function Purchase ({ onBack ,tokenExpired, token, user_id}) {
  const details_account = JSON.parse(localStorage.getItem("details_account"));
  const [error, setError] = useState(""); // Thêm state để lưu lỗi
  const {id: acc_id, price} = details_account;

  //console.log("details_account",details_account)
  //console.log("id", acc_id, "price", price)
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(""); // Reset lỗi trước khi gọi API
    
    try {
        const response = await fetch(`${apiUrl}/order/payment`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                 Authorization: `Bearer ${token}`
            },
            body: JSON.stringify({ acc_id, price})
        });

        const data = await response.json();

        if (response.ok) {
            setError('Mua thành công!.');
            setTimeout(() => {
               // gọi callback để chuyển sang form login
            }, 2000);
        } else {
            console.error('Response status:', response.status); // thêm dòng này
            console.error('Response data:', data); // thêm dòng này
            setError(data.msg || data.message || 'Mua thất bại');
        }
    } catch (error) {
        console.error('Error server not run:', error);
        setError('Không thể kết nối tới server. Có thể server bị lỗi hoặc bạn đang offline.');
    }

  };

  return (
    <div className="card p-4 shadow bg-white" style={{ maxWidth: "400px", margin: "0 auto" }}>
      <h2 className="text-center mb-4">Xác nhận mua tài khoản</h2>

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
            placeholder="Mã giảm giá"
          />
        </div>
      
        <button type="submit" className="btn btn btn-success w-100" >
          MUA
        </button>
    
        </form> &nbsp;

        <br />
      <button className="btn btn-sm btn-outline-secondary mt-2" onClick={onBack}>
          ← Quay lại 
      </button>
      </div>
  );
}