// src/components/Profile/AccountInfoTab.jsx
import React from 'react';

export default function AccountInfoTab({ userData }) {
  return (
    <div className="card shadow-sm p-4">
      <h3 className="mb-4">Thông tin tài khoản</h3>
      <div className="row">
        {/* Cột thông tin cá nhân */}
        <div className="col-12 col-md-6 mb-4">
          <h5 className="mb-3 border-bottom pb-2">Thông tin cá nhân</h5>
          <div className="mb-2">
            <strong>Facebook:</strong> {userData.facebook || 'Chưa cập nhật'}
          </div>
          <div className="mb-2">
            <strong>ID:</strong> {userData.id}
          </div>
          <div className="mb-2">
            <strong>Tên tài khoản:</strong> {userData.username}
          </div>
          <div className="mb-2">
            <strong>Số điện thoại:</strong> {userData.phoneNumber || 'Chưa cập nhật'}
          </div>
          <div className="mb-2">
            <strong>Ví chính:</strong> {userData.mainWallet || '0 đ'}
          </div>
          <div className="mb-2">
            <strong>Ví Coin:</strong> {userData.coin || '0'}
          </div>
          <div className="mb-2">
            <strong>Ngày tham gia:</strong> {userData.joinDate || 'Không rõ'}
          </div>
        </div>

        {/* Cột đổi mật khẩu */}
        <div className="col-12 col-md-6">
          <h5 className="mb-3 border-bottom pb-2">Đổi mật khẩu</h5>
          <form>
            <div className="mb-3">
              <label htmlFor="currentPassword" className="form-label">Mật khẩu hiện tại</label>
              <input type="password" className="form-control" id="currentPassword" />
            </div>
            <div className="mb-3">
              <label htmlFor="newPassword" className="form-label">Mật khẩu mới</label>
              <input type="password" className="form-control" id="newPassword" />
            </div>
            <div className="mb-3">
              <label htmlFor="confirmPassword" className="form-label">Nhập lại mật khẩu mới</label>
              <input type="password" className="form-control" id="confirmPassword" />
            </div>
            <button type="submit" className="btn btn-danger w-100">Cập nhật</button>
          </form>
        </div>
      </div>
    </div>
  );
}