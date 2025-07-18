// src/components/Profile/ProfileContent.jsx
import React, { useState } from 'react';
import AccountInfoTab from './AccountInfoTab';
// Import các component tab khác nếu bạn tách chúng ra file riêng
// import NotificationsTab from './NotificationsTab';
// import DepositHistoryTab from './DepositHistoryTab';
// ... và các tab admin

export default function ProfileContent({ activeTab, userData, role, token, apiUrl, setUserData, setError, error, purchasedAccounts}) {
  // State riêng cho các form trong ProfileContent
  const [coin, setCoin] = useState('');
  const [id_guest, setId_guest] = useState('');
  const [confirmMessage, setConfirmMessage] = useState('');

  // States cho Create/Update Acc (Admin)
  const [hero, setHero] = useState('');
  const [skin, setSkin] = useState('');
  const [price, setPrice] = useState('');
  const [description, setDescription] = useState('');
  const [rank, setRank] = useState('');
  const [image_url, setImage_url] = useState('');
  const [account_name, setAcccount_name] = useState('');
  const [account_pass, setAcccount_pass] = useState('');
  const [accIdForUpdate, setAccIdForUpdate] = useState(''); // ID của acc cần update
  const [errorPurchased, setErrorPurchased] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  // Hàm xử lý nạp coin (cho admin hoặc user thường)
  const handleChargeCoin = async (e, isAdminCharge = false) => {
    e.preventDefault();
    setError(""); // Reset lỗi
    setConfirmMessage(""); // Reset thông báo

    const targetId = isAdminCharge ? id_guest : userData.id;

    if (!coin || isNaN(coin) || Number(coin) <= 0) {
        setError("Số coin không hợp lệ.");
        return;
    }

    try {
      const response = await fetch(`${apiUrl}/auth/`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ coin: Number(coin), id_guest: targetId }),
      });
      const data = await response.json();

      if (response.ok) {
          console.log("Charge coin status:", response.status);
          setUserData(prev => ({
            ...prev,
            coin: data.coin || (Number(prev.coin) + Number(coin)) // Cập nhật coin nếu API trả về, hoặc tính toán
          }));
          setConfirmMessage(`User ${targetId} nhận được ${coin} coin thành công!`);
          setTimeout(() => setConfirmMessage(""), 5000);
          setCoin(''); // Clear input
          setId_guest(''); // Clear input for admin
        } else {
            console.error('Response status:', response.status);
            console.error('Response data:', data);
            setError(data.msg || data.message || 'Nạp coin thất bại');
            setTimeout(() => setError(""), 5000);
        }
    } catch (error) {
        console.error('Error:', error);
        setError('Không thể kết nối tới server. Có thể server bị lỗi hoặc bạn đang offline.');
        setTimeout(() => setError(""), 5000);
    }
  };

  // Hàm tạo tài khoản (Admin)
  const create_nick = async (e) => {
    e.preventDefault();
    setError("");
    setConfirmMessage("");
    try {
      const response = await fetch(`${apiUrl}/acc/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ hero, skin, price: Number(price), description, image_url, rank , account_name, account_pass }),
      });
      const data = await response.json();

      if (response.ok) {
          console.log("Create nick status:", response.status);
          setConfirmMessage(`Nick mới (ID: ${data.id || 'không rõ'}) đã được tạo.`);
          setTimeout(() => setConfirmMessage(""), 5000);
          // Reset form fields
          setHero(''); setSkin(''); setPrice(''); setDescription(''); setRank(''); setImage_url('');
        } else {
            console.error('Response status:', response.status);
            console.error('Response data:', data);
            setError(data.msg || data.message || 'Tạo tài khoản thất bại');
            setTimeout(() => setError(""), 5000);
        }
    } catch (error) {
        console.error('Error:', error);
        setError('Không thể kết nối tới server. Có thể server bị lỗi hoặc bạn đang offline.');
        setTimeout(() => setError(""), 5000);
    }
  };

  // Hàm cập nhật tài khoản (Admin)
  const update_nick = async (e) => {
    e.preventDefault();
    setError("");
    setConfirmMessage("");
    if (!accIdForUpdate) {
        setError("Vui lòng nhập ID tài khoản cần sửa.");
        return;
    }
    try {
      const response = await fetch(`${apiUrl}/acc/${accIdForUpdate}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ hero, skin, price: Number(price), description, image_url, rank, account_name, account_pass }),
      });
      const data = await response.json();

      if (response.ok) {
          console.log("Update nick status:", response.status);
          setConfirmMessage(`Nick ID ${accIdForUpdate} đã được cập nhật.`);
          setTimeout(() => setConfirmMessage(""), 5000);
          // Reset form fields
          setAccIdForUpdate(''); setHero(''); setSkin(''); setPrice(''); setDescription(''); setRank(''); setImage_url('');
        } else {
            console.error('Response status:', response.status);
            console.error('Response data:', data);
            setError(data.msg || data.message || 'Cập nhật tài khoản thất bại');
            setTimeout(() => setError(""), 5000);
        }
    } catch (error) {
        console.error('Error:', error);
        setError('Không thể kết nối tới server. Có thể server bị lỗi hoặc bạn đang offline.');
        setTimeout(() => setError(""), 5000);
    }
  };


  // Render nội dung dựa trên activeTab
  return (
    <div className="card shadow-sm p-4 h-100"> {/* h-100 để card kéo dài theo chiều cao */}
      {error && (
        <div className="alert alert-danger py-2 text-center" role="alert">
          {error}
        </div>
      )}
      {confirmMessage && (
        <div className="alert alert-info mt-3 py-2 text-center">
          {confirmMessage}
        </div>
      )}

      {/* Render nội dung các tab */}
      {activeTab === 'accountInfo' && <AccountInfoTab userData={userData} />}
      {activeTab === 'notifications' && (
        <>
          <h3 className="mb-4">Thông báo</h3>
          <p>Chưa có thông báo nào.</p>
        </>
      )}
      {/* Tab Nạp coin cho người dùng thường */}
      {activeTab === 'chargeCoin' && !role && (
        <>
          <h3 className="mb-4">Nạp tiền (Tự động)</h3>
          <p className="text-muted mb-3">Vui lòng chuyển khoản với nội dung tin nhắn được cung cấp để hệ thống tự động cộng tiền.</p>
          <div className="card p-3 bg-light mb-3">
            <h5 className="mb-2">Nội dung chuyển khoản của bạn:</h5>
            <div className="border border-primary p-2 rounded text-center fw-bold fs-5 text-break">
              {`sp${userData?.id || ''}`} {/* Sử dụng ID của người dùng */}
            </div>
            <p className="small text-muted mt-2">Sao chép nội dung trên vào phần "lời nhắn" khi chuyển khoản.</p>
          </div>
          {/* Form để admin nạp cho user thường (nếu muốn) */}
          {/* Bạn có thể thêm form nạp coin thủ công ở đây nếu muốn user tự nhập số tiền và có xác nhận */}
          <form onSubmit={(e) => handleChargeCoin(e, false)}> {/* is_admin_charge = false */}
            <div className="mb-3">
              <label htmlFor="userCoinInput" className="form-label">Số coin muốn nạp (thủ công)</label>
              <input
                type="number"
                className="form-control"
                id="userCoinInput"
                value={coin}
                onChange={(e) => setCoin(e.target.value)}
                placeholder="Nhập số coin"
              />
            </div>
            <button type="submit" className="btn btn-primary">Xác nhận nạp coin</button>
          </form>
        </>
      )}

      {/* Tab Nạp coin cho Admin */}
      {activeTab === 'adminChargeCoin' && role && (
        <>
          <h3 className="mb-4">Admin Nạp Coin</h3>
          <form onSubmit={(e) => handleChargeCoin(e, true)}> {/* is_admin_charge = true */}
            <div className="mb-3">
              <label htmlFor="idGuestInput" className="form-label">ID tài khoản cần nạp</label>
              <input
                type="text"
                className="form-control"
                id="idGuestInput"
                value={id_guest}
                onChange={(e) => setId_guest(e.target.value)}
                placeholder="Nhập ID tài khoản"
              />
            </div>
            <div className="mb-3">
              <label htmlFor="adminCoinInput" className="form-label">Số coin</label>
              <input
                type="number"
                className="form-control"
                id="adminCoinInput"
                value={coin}
                onChange={(e) => setCoin(e.target.value)}
                placeholder="Nhập số coin"
              />
            </div>
            <button type="submit" className="btn btn-success me-2">Xác nhận nạp</button>
          </form>
        </>
      )}

      {/* Tab Thêm acc (Admin) */}
      {activeTab === 'createAcc' && role && (
        <>
          <h3 className="mb-4">Thêm tài khoản mới</h3>
          <form onSubmit={create_nick}>
            <div className="mb-3">
              <label htmlFor="heroInput" className="form-label">Số lượng tướng</label>
              <input type="number" className="form-control" id="heroInput" value={hero} onChange={(e) => setHero(e.target.value)} />
            </div>
            <div className="mb-3">
              <label htmlFor="skinInput" className="form-label">Số skin</label>
              <input type="number" className="form-control" id="skinInput" value={skin} onChange={(e) => setSkin(e.target.value)} />
            </div>
            <div className="mb-3">
              <label htmlFor="priceInput" className="form-label">Giá trị (Coin)</label>
              <input type="number" className="form-control" id="priceInput" value={price} onChange={(e) => setPrice(e.target.value)} />
            </div>
            <div className="mb-3">
              <label htmlFor="descriptionInput" className="form-label">Mô tả</label>
              <textarea className="form-control" id="descriptionInput" value={description} onChange={(e) => setDescription(e.target.value)} rows="3"></textarea>
            </div>
            <div className="mb-3">
              <label htmlFor="rankInput" className="form-label">Rank</label>
              <input type="text" className="form-control" id="rankInput" value={rank} onChange={(e) => setRank(e.target.value)} />
            </div>
            <div className="mb-3">
              <label htmlFor="imageUrlInput" className="form-label">URL Hình ảnh</label>
              <input type="text" className="form-control" id="imageUrlInput" value={image_url} onChange={(e) => setImage_url(e.target.value)} />
            </div>
            <div className="mb-3">
              <label htmlFor="imageUrlInput" className="form-label">Tài Khoản</label>
              <input type="text" className="form-control" id="account_name" value={account_name} onChange={(e) => setAcccount_name(e.target.value)} />
            </div>
            <div className="mb-3">
              <label htmlFor="imageUrlInput" className="form-label">Mật Khẩu</label>
              <input type="text" className="form-control" id="account_pass" value={account_pass} onChange={(e) => setAcccount_pass(e.target.value)} />
            </div>
            <button type="submit" className="btn btn-success me-2">Xác nhận</button>
          </form>
        </>
      )}

      {/* Tab Sửa thông tin tài khoản (Admin) */}
      {activeTab === 'updateAcc' && role && (
        <>
          <h3 className="mb-4">Sửa thông tin tài khoản</h3>
          <form onSubmit={update_nick}>
            <div className="mb-3">
              <label htmlFor="accIdForUpdateInput" className="form-label">ID Tài khoản cần sửa</label>
              <input type="text" className="form-control" id="accIdForUpdateInput" value={accIdForUpdate} onChange={(e) => setAccIdForUpdate(e.target.value)} />
            </div>
            <div className="mb-3">
              <label htmlFor="heroUpdateInput" className="form-label">Số lượng tướng</label>
              <input type="number" className="form-control" id="heroUpdateInput" value={hero} onChange={(e) => setHero(e.target.value)} />
            </div>
            <div className="mb-3">
              <label htmlFor="skinUpdateInput" className="form-label">Số skin</label>
              <input type="number" className="form-control" id="skinUpdateInput" value={skin} onChange={(e) => setSkin(e.target.value)} />
            </div>
            <div className="mb-3">
              <label htmlFor="priceUpdateInput" className="form-label">Giá trị (Coin)</label>
              <input type="number" className="form-control" id="priceUpdateInput" value={price} onChange={(e) => setPrice(e.target.value)} />
            </div>
            <div className="mb-3">
              <label htmlFor="descriptionUpdateInput" className="form-label">Mô tả</label>
              <textarea className="form-control" id="descriptionUpdateInput" value={description} onChange={(e) => setDescription(e.target.value)} rows="3"></textarea>
            </div>
            <div className="mb-3">
              <label htmlFor="rankUpdateInput" className="form-label">Rank</label>
              <input type="text" className="form-control" id="rankUpdateInput" value={rank} onChange={(e) => setRank(e.target.value)} />
            </div>
            <div className="mb-3">
              <label htmlFor="imageUrlUpdateInput" className="form-label">URL Hình ảnh</label>
              <input type="text" className="form-control" id="imageUrlUpdateInput" value={image_url} onChange={(e) => setImage_url(e.target.value)} />
            </div>
            <div className="mb-3">
              <label htmlFor="imageUrlInput" className="form-label">Tài Khoản</label>
              <input type="text" className="form-control" id="account_name" value={account_name} onChange={(e) => setAcccount_name(e.target.value)} />
            </div>
            <div className="mb-3">
              <label htmlFor="imageUrlInput" className="form-label">Mật Khẩu</label>
              <input type="text" className="form-control" id="account_pass" value={account_pass} onChange={(e) => setAcccount_pass(e.target.value)} />
            </div>
            <button type="submit" className="btn btn-success me-2">Cập nhật</button>
          </form>
        </>
      )}
      {activeTab === 'purchasedAccounts' && (
        <>
          <h3 className="mb-4">Tài khoản đã mua</h3>
          <p className="text-danger fw-bold">
            Khách hàng mua acc vui lòng quay video đăng nhập acc để bên shop hỗ trợ khi có vấn đề xảy ra.
          </p>

          {isLoading && (
            <div className="text-center my-5">
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
              <p className="mt-2">Đang tải tài khoản đã mua...</p>
            </div>
          )}

          {error && (
            <div className="alert alert-danger" role="alert">
              Lỗi: {error}
            </div>
          )}

          {!isLoading && !error && purchasedAccounts.length === 0 && (
            <div className="alert alert-info text-center" role="alert">
              Bạn chưa có tài khoản nào được mua.
            </div>
          )}

          {!isLoading && !error && purchasedAccounts.length > 0 && (
            purchasedAccounts.map((order) => (
              <div key={order.order_id} className="card shadow-sm p-4 mb-4">
                <div className="row g-3">
                  {/* Hàng 1: ID Tài khoản và Trạng thái */}
                  <div className="col-md-6">
                    <label className="form-label fw-semibold">ID Đơn Hàng:</label>
                    <input type="text" className="form-control" value={order.order_id} readOnly />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label fw-semibold">Trạng Thái Đơn Hàng:</label>
                    <input
                      type="text"
                      className={`form-control fw-bold ${order.order_status === 'COMPLETED' ? 'text-success' : 'text-warning'}`}
                      value={order.order_status === 'COMPLETED' ? 'Đã hoàn tất' : order.order_status}
                      readOnly
                    />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label fw-semibold">Tài Khoản</label>
                    <input type="text" className="form-control" value={order.acc_name || "null"} readOnly />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label fw-semibold">Mật Khẩu</label>
                    <input type="text" className="form-control" value={order.acc_pass || "null"} readOnly />
                  </div>
            
                  {!order.account_details && (
                    <div className="col-12">
                      <div className="alert">Không tìm thấy chi tiết tài khoản cho đơn hàng này.</div>
                    </div>
                  )}
                </div>

                <div className="mt-4 text-end">
                  {/* Các nút hành động có thể thêm vào đây */}
                  <button className="btn btn-info me-2">Xem chi tiết</button>
                  <button className="btn btn-danger">Báo cáo sự cố</button>
                </div>
              </div>
            ))
          )}
        </>
      )}

      {/* Các tab khác cần được thêm vào đây */}
      {activeTab !== 'accountInfo' && activeTab !== 'notifications' &&
       activeTab !== 'chargeCoin' && activeTab !== 'adminChargeCoin' &&
       activeTab !== 'createAcc' && activeTab !== 'updateAcc' &&
        <div className="card shadow-sm p-4"><h3 className="mb-0"></h3><p></p></div>}
    </div>
  );
}