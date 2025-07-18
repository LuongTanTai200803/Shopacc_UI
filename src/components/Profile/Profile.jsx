// src/components/Profile/Profile.jsx
import { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import ProfileSidebar from './ProfileSidebar';
import ProfileContent from './ProfileContent';

const apiUrl = import.meta.env.VITE_API_URL;

export default function Profile({ isLoggedIn }) {
    const navigate = useNavigate();
    const [userData, setUserData] = useState(null);
    const [error, setError] = useState(null);
    const [tokenExpired, setTokenExpired] = useState(false);
    const token = localStorage.getItem('token');
    const [role, setRole] = useState(false); // true if admin, false if normal user
    const [activeTab, setActiveTab] = useState('accountInfo'); // Quản lý tab đang hoạt động
    const [purchasedAccounts, setPurchasedAccounts] = useState([]);
    const [isLoadingPurchased,setIsLoadingPurchased] = useState(false); // Trạng thái loading cho purchased accounts
    const [errorPurchased, setErrorPurchased] = useState(null);
    
    // States và handlers cho các form được di chuyển xuống ProfileContent hoặc các tab con
    // Bạn có thể cân nhắc lifting state lên đây nếu nhiều tab cần dùng chung,
    // nhưng để giữ nguyên logic hiện tại, chúng ta sẽ truyền setters/handlers xuống.

    // Logic kiểm tra token và fetch user data
    useEffect(() => {
        if (!token) {
            navigate('/'); // Nếu không có token, chuyển về trang login
            return; // Dừng hàm để không chạy fetch bên dưới
        }

        const fetchUserProfile = async () => {
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
                    setUserData(data);
                    localStorage.setItem('coin', data.coin);
                } else {
                    if (data.msg === 'Token has expired') {
                        setTokenExpired(true);
                        // Xóa token cũ và chuyển hướng
                        localStorage.removeItem('token');
                        // handleLogout(); // Nếu có hàm logout tổng thể
                    } else {
                        console.error('Response status:', response.status);
                        console.error('Response data:', data);
                        setError(data.msg || data.message || 'Lỗi dữ liệu');
                    }
                }
            } catch (error) {
                console.error('Error:', error);
                setError('Không thể kết nối tới server. Có thể server bị lỗi hoặc bạn đang offline.');
            }
        };

        const checkUserRole = async () => {
            try {
                const res = await fetch(`${apiUrl}/acc/check`, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                if (res.status === 200) {
                    setRole(true); // User là Admin
                } else {
                    setRole(false); // User là Normal User
                }
            } catch (error) {
                console.error('Error checking role:', error);
                setRole(false); // Mặc định là normal user nếu có lỗi kiểm tra role
            }
        };

        fetchUserProfile();
        checkUserRole();

    }, [token, apiUrl, navigate, role]); // Dependencies cho useEffect

    // Hàm fetch cho purchased accounts (dùng useCallback)
    const fetchPurchasedAccounts = useCallback(async () => {
        if (!token) return; // Không fetch nếu không có token

        setIsLoadingPurchased(true);
        setErrorPurchased(null);
        try {
            const response = await fetch(`${apiUrl}/order/purchased-accounts`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            });

            const data = await response.json();

            if (response.ok) {
                setPurchasedAccounts(data);
                console.log("Purchased accounts:", data);
            } else {
                console.error("Response status:", response.status);
                console.error("Response data:", data);
                setErrorPurchased(data.msg || data.message || "Không thể tải danh sách tài khoản đã mua.");
                if (data.msg === 'Token has expired') {
                    setTokenExpired(true);
                    localStorage.removeItem('token');
                    // handleLogout();
                }
            }
        } catch (err) {
            console.error("Error fetching purchased accounts:", err);
            setErrorPurchased('Không thể kết nối tới server. Có thể server bị lỗi hoặc bạn đang offline.');
        } finally {
            setIsLoadingPurchased(false);
        }
    }, [token, apiUrl, setTokenExpired]); // Dependencies cho fetchPurchasedAccounts

    // useEffect riêng cho purchased accounts
    useEffect(() => {
        if (activeTab === 'purchasedAccounts') { // CHỈ CHẠY KHI TAB NÀY ĐƯỢC KÍCH HOẠT
            fetchPurchasedAccounts();
        }
        // Bạn có thể thêm một logic để xóa purchasedAccounts khi rời tab
        // Ví dụ: else { setPurchasedAccounts([]); } nếu muốn load lại mỗi lần vào tab
    }, [activeTab, fetchPurchasedAccounts]); // Chỉ chạy khi activeTab hoặc fetchPurchasedAccounts thay đổi

    // Xử lý khi token hết hạn hoặc người dùng chưa đăng nhập
    if (tokenExpired || !isLoggedIn) {
        console.log("Phiên đăng nhập đã hết hạn hoặc chưa đăng nhập.");
        return (
            <div className="container mt-5 text-center">
                <p className="lead">Phiên đăng nhập đã hết hạn hoặc bạn chưa đăng nhập, vui lòng đăng nhập lại.</p>
                <button onClick={() => navigate("/")} className="btn btn-primary">Đăng nhập</button>
            </div>
        );
    }

    if (!userData) {
        return <p className="text-center mt-5">Đang tải dữ liệu người dùng...</p>;
    }

    // Giao diện chính của Profile
    return (
        <div className="container-fluid mt-4">
            <div className="row g-0"> {/* g-0 để loại bỏ khoảng trống giữa các cột */}
                {/* Sidebar */}
                <div className="col-12 col-md-3">
                    <ProfileSidebar a
                        ctiveTab={activeTab}
                        setActiveTab={setActiveTab} 
                        userData={userData}
                        role={role} />
                </div>

                {/* Nội dung chính */}
                <div className="col-12 col-md-9 ps-md-3"> {/* ps-md-3 thêm padding trái trên màn hình trung bình trở lên */}
                    <ProfileContent
                        activeTab={activeTab}
                        userData={userData}
                        role={role}
                        token={token}
                        apiUrl={apiUrl}
                        purchasedAccounts={purchasedAccounts}
                        setIsLoadingPurchased={setIsLoadingPurchased} // Truyền setter để cập nhật trạng thái loading
                        isLoadingPurchased={isLoadingPurchased} // Truyền trạng thái loading
                        setUserData={setUserData} // Truyền setter để cập nhật coin sau khi nạp
                        setError={setError} // Truyền setter lỗi
                        error={error} // Truyền trạng thái lỗi
                    />
                </div>
            </div>
        </div>
    );
}