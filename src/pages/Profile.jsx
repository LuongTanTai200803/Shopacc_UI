import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";


//import useAuth from "../hooks/useAuth"
//import { handlerLogout } from './Home.jsx';


const apiUrl = import.meta.env.VITE_API_URL
export default function Profile({ isLoggedIn, apiUrl}) {
    const navigate = useNavigate();
    const [userData, setUserData] = useState(null);
    const [error, setError] = useState(null);
    const [tokenExpired, setTokenExpired] = useState(false);
    const token = localStorage.getItem('token');
    const [role, setRole] = useState(false);

    const [showForm, setShowForm] = useState(false);
    const [showForm_create, setShowForm_create] = useState('');
    const [showForm_update, setShowForm_update] = useState('');
    
    const [coin, setCoin] = useState('');
    const [confirmMessage, setConfirmMessage] = useState('');
    
    const [id, setId] = useState('');
    const [id_guest, setId_guest] = useState('');

    const [hero, setHero] = useState('');
    const [skin, setSkin] = useState('');
    const [price, setPrice] = useState('');
    const [description, setDescription] = useState('');
    const [rank, setRank] = useState('');
    const [image_url, setImage_url] = useState('');

    // Logic
    const isNormalUser = !role;
    const shouldShowForm = isNormalUser && showForm;
    const shouldShowButton = isNormalUser && !showForm;


    // Kiểm tra token khi vào 
    useEffect(() => {
      fetchData();
        if (!token) {
        navigate('/'); // Nếu không có token, chuyển về trang login
        }else { //Kiểm tra role
          
        fetch(`${apiUrl}/acc/check`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        })
          .then(res => {
            if (res.status === 200) {
              setRole(true) // Role
              //console.log("Status code:", res.status);
              
              // console.error('Response status:', res.status); // thêm dòng này
              // console.error('Response data:', data); // thêm dòng này
            }
          });
        } 
    }, [token]);


    // Hiển thị thông tin user
    const fetchData = async () => {

        try {
            const response = await fetch(`${apiUrl}/auth/profile`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            const data = await response.json();

            if (response.ok) {
                setUserData(data);// Lưu vào state
                
            } else {
                if (data.msg === 'Token has expired') {
                    
                } else {
                    console.error('Response status:', response.status); // thêm dòng này
                    console.error('Response data:', data); // thêm dòng này
                    setError(data.msg || data.message || 'Lỗi dữ liệu');
                }
            }
        } catch (error) {
            console.error('Error:', error);
            setError('Không thể kết nối tới server. Có thể server bị lỗi hoặc bạn đang offline.');
        }

    };
    
    if (!isLoggedIn) {
    console.log("token het han")
    
        return (
            <div>
                
                <p>Phiên đăng nhập đã hết hạn, vui lòng đăng nhập lại.</p>
                <button onClick={() => navigate("/")}>Đăng nhập</button>
                
            </div>
        );
    }
  // Nạp coin
  const handleChargeCoin = async (e) => {
    e.preventDefault();
    setError(""); // Reset lỗi trước khi gọi API
    try {

      const response = await fetch(`${apiUrl}/auth/`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`, // nếu có token
        },
        body: JSON.stringify({ coin, id_guest }),
      });
      const data = await response.json();

      if (response.ok) {
          console.log("Status code:", response.status);
          setUserData(prev => ({
            ...prev,
            coin: data.coin || (Number(prev.coin) + Number(coin))
          }));
          setConfirmMessage(`User ${id_guest} nhận được ${coin} coin`);
          // Tự động ẩn message sau 5 giây
          setTimeout(() => {
            setConfirmMessage("");
          }, 5000);

        } else {
            console.error('Response status:', response.status); // thêm dòng này
            console.error('Response data:', data); // thêm dòng này
            setError(data.msg || data.message || 'Đăng nhập thất bại');
            setConfirmMessage(`Số coin nhập sai ${coin}`);
            // Tự động ẩn message sau 5 giây
            setTimeout(() => {
              setConfirmMessage("");
            }, 5000);
        }
    } catch (error) {
        console.error('Error:', error);
        setError('Không thể kết nối tới server. Có thể server bị lỗi hoặc bạn đang offline.');
    }
      
      setShowForm(false); // Ẩn form sau khi submit
      setCoin('');
  };
  // create nick
  const create_nick = async (e) => {
    e.preventDefault();
    setError(""); // Reset lỗi trước khi gọi API
    try {

      const response = await fetch(`${apiUrl}/acc/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`, // nếu có token
        },
        body: JSON.stringify({ hero, skin, price, description , image_url}),
      });
      const data = await response.json();

      if (response.ok) {
          console.log("Status code:", response.status);
          setUserData(data)
          setConfirmMessage(`Nick ${data.id || 'mới'} created`);
          setTimeout(() => {
            setConfirmMessage("");
          }, 5000);
          setShowForm_create(false); // Ẩn form sau khi submit

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
    // update nick
  const update_nick = async (e) => {
    e.preventDefault();
    setError(""); // Reset lỗi trước khi gọi API
    try {

      const response = await fetch(`${apiUrl}/acc/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`, // nếu có token
        },
        body: JSON.stringify({ hero, skin, price, description , image_url}),
      });
      const data = await response.json();

      if (response.ok) {
          console.log("Status code:", response.status);
          setUserData(data)
          setConfirmMessage(`Nick ${data.id || 'đã'} update`);
          setTimeout(() => {
            setConfirmMessage("");
          }, 5000);
          setShowForm_update(false); // Ẩn form sau khi submit

        } else {
            console.error('Response status:', response.status); // thêm dòng này
            console.error('Response data:', data); // thêm dòng này
            setError(data.msg || data.message || 'Update account thất bại');
        }
    } catch (error) {
        console.error('Error:', error);
        setError('Không thể kết nối tới server. Có thể server bị lỗi hoặc bạn đang offline.');
    }
  
  };
  
  // Return origin
  return (
    <div>
     

    <div>
{userData ? (
  <>
    <h2>Xin chào, {userData.username}</h2>
    <p>ID: {userData.id}</p>
    <p>Số coin hiện có: {userData.coin}</p>

    {/* Nút hiển thị form */}
  <div>
    {!role &&(
    !showForm ? (
      <button
        className="btn btn-outline-dark"
        onClick={() => setShowForm(true)}
      >
        <i className="bi me-1"></i> Nạp coin
      </button>
    ) : (
      // Form nhập số coin
      <form  >
        <div className="mb-3">
        <img className="card-image_url-top" 
          src="https://res.cloudinary.com/dgdn1g9w6/image/upload/fl_preserve_transparency/v1749459327/download_z3sedt.jpg" />
          <br />

          <label htmlFor="coinInput" className="form-label">Nội dung Lời nhắn khi chuyển:</label> <br />
          <span style={{
            display: 'inline-block',
            padding: '8px',
            border: '1px solid #ccc',
            borderRadius: '4px'
          }}>
            {`sp${userData.id}`}
          </span>

        </div>
        
        <button
          type="button"
          className="btn btn-secondary"
          onClick={() => setShowForm(false)}
        >
          Hủy
        </button>
      </form>
      ))}
      {role &&(
      !showForm ? (
         <button
        className="btn btn-outline-dark"
        onClick={() => setShowForm(true)}
      >
        <i className="bi me-1"></i> Nạp coin
      </button>
    ) : (
      // Form nhập số coin
      <form onSubmit={handleChargeCoin} >
        <div className="mb-3">
        <img className="card-image_url-top"  />
          <br />

          <label htmlFor="coinInput" className="form-label">Nạp coin cho tài khoản:</label>
          <input
            type="text"
            value={id_guest}
            onChange={(e) => setId_guest(e.target.value)}
          /> <br />
          <span style={{
            display: 'inline-block',
            padding: '0px',
            border: '0px solid #ccc',
            borderRadius: '10px'
          }}>
          <label htmlFor="coinInput" className="form-label">Số coin</label>
          
          <input
            type="text"
            value={coin}
            onChange={(e) => setCoin(e.target.value)}
          /> 
          </span>

        </div>
        <button type="submit" className="btn btn-success me-2">Xác nhận</button>
        <button
          type="button"
          className="btn btn-secondary"
          onClick={() => setShowForm(false)}
        >
          Hủy
        </button>
      </form>
      
    ))}

    </div>
    {/* Thông báo sau khi submit */}
    {confirmMessage && (
      <div className="alert alert-info mt-3">
        {confirmMessage}
      </div>
    )}
      </>
      ) : (
        
        <p>Đang tải dữ liệu...</p>
      )}
    </div>

    {role && (
      !showForm_create? (

      <button
        className="btn btn-outline-dark" 
        onClick={() => setShowForm_create(true)}
        >
        <i className="bi me-1"></i> Thêm acc
      </button>
    ) : (
      // Form nhập số coin
      <form onSubmit={create_nick} >
        <div className="mb-3">

          <label htmlFor="coinInput" className="form-label">Nhập thông tin tài khoản</label>
          <br />
          <label htmlFor="coinInput" className="form-label">Số lượng tướng</label>
          <input
            type="text"
            value={hero}
            onChange={(e) => setHero(e.target.value)}
          /><br />
          <label htmlFor="coinInput" className="form-label">Số skin</label>
          <input
            type="text"
            value={skin}
            onChange={(e) => setSkin(e.target.value)}
          /><br />
          <label htmlFor="coinInput" className="form-label">Giá trị</label>
          <input
            type="text"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
          /><br />
          <label htmlFor="coinInput" className="form-label">Mô tả </label>
          <input
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          /><br />
          <label htmlFor="coinInput" className="form-label">Rank</label>
          <input
            type="text"
            value={rank}
            onChange={(e) => setRank(e.target.value)}
          /><br />
          <label htmlFor="coinInput" className="form-label">Image</label>
          <input
            type="text"
            value={image_url}
            onChange={(e) => setImage_url(e.target.value)}
          />

        </div>
        <button type="submit" className="btn btn-success me-2">Xác nhận</button>
        <button
          type="button"
          className="btn btn-secondary"
          onClick={() => setShowForm_create(false)}
        >
          Hủy
        </button>
      </form>
      )
    )} 
    
    
    
    
    <br />
        {/* Form update account */}
        
    {role && (
      !showForm_update ?(

        <button
        className="btn btn-outline-dark" 
        onClick={() => setShowForm_update(true)}
        >
        <i className="bi me-1"></i> Sửa thông tin tài khoản
      </button>
    ) : (
       // Form sửa thông tin
      <form onSubmit={update_nick} >
        <div className="mb-3">

          <label htmlFor="coinInput" className="form-label">Nhập thông tin tài khoản</label>
          <br />
          <label htmlFor="coinInput" className="form-label">ID Tài khoản</label>
          <input
            type="text"
            value={id}
            onChange={(e) => setId(e.target.value)}
          /><br />
          <label htmlFor="coinInput" className="form-label">Số lượng tướng</label>
          <input
            type="text"
            value={hero}
            onChange={(e) => setHero(e.target.value)}
          /><br />
          <label htmlFor="coinInput" className="form-label">Số skin</label>
          <input
            type="text"
            value={skin}
            onChange={(e) => setSkin(e.target.value)}
          /><br />
          <label htmlFor="coinInput" className="form-label">Giá trị</label>
          <input
            type="text"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
          /><br />
          <label htmlFor="coinInput" className="form-label">Mô tả </label>
          <input
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          /><br />
          <label htmlFor="coinInput" className="form-label">Rank</label>
          <input
            type="text"
            value={rank}
            onChange={(e) => setRank(e.target.value)}
          /><br />
          <label htmlFor="coinInput" className="form-label">Image</label>
          <input
            type="text"
            value={image_url}
            onChange={(e) => setImage_url(e.target.value)}
          />

        </div>
        <button type="submit" className="btn btn-success me-2">Xác nhận</button>
        <button
          type="button"
          className="btn btn-secondary"
          onClick={() => setShowForm_update(false)}
        >
          Hủy
        </button>
        {error && (
        <div className="alert alert-warning py-2 text-center" role="alert">
          {error}
        </div>
      )}
      </form>
      )
    )}



    </div>
    
  );
}