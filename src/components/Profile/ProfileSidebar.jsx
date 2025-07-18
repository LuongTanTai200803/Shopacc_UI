// src/components/Profile/ProfileSidebar.jsx
import React from 'react';
import ProfileNavLink from './ProfileNavLink';

export default function ProfileSidebar({ activeTab, setActiveTab, userData , role}) {
  return (
    <div className="d-flex flex-column p-3 bg-light rounded shadow-sm me-md-3 mb-3 mb-md-0" style={{ minHeight: 'calc(100vh - 100px)' }}> {/* Thêm minHeight để sidebar có chiều cao tương đối */}
      {/* Thông tin người dùng ở đầu sidebar */}
      <div className="d-flex align-items-center mb-4">
        <img src="https://via.placeholder.com/40" alt="Avatar" className="rounded-circle me-2" />
        <div>
          <h5 className="mb-0 text-dark">{userData?.username || 'Đang tải...'}</h5>
          <p className="text-muted small mb-0">ID: {userData?.id || '...'}</p>
        </div>
      </div>

      {/* Các mục điều hướng */}
      <ul className="nav nav-pills flex-column">
        <ProfileNavLink
          label="Thông tin tài khoản"
          iconClass="bi-person-circle"
          tabName="accountInfo"
          activeTab={activeTab}
          onClick={() => setActiveTab('accountInfo')}
        />
        <ProfileNavLink
          label="Thông báo"
          iconClass="bi-bell-fill"
          tabName="notifications"
          activeTab={activeTab}
          onClick={() => setActiveTab('notifications')}
        />
        {/* Chỉ hiển thị mục Nạp tiền cho người dùng thường */}
        {!userData?.is_admin && ( // Giả định có trường is_admin trong userData hoặc dựa vào 'role' prop
          <ProfileNavLink
            label="Nạp tiền (Tự động)"
            iconClass="bi-currency-dollar"
            tabName="chargeCoin" // Đổi tên tab để dễ hiểu
            activeTab={activeTab}
            onClick={() => setActiveTab('chargeCoin')}
          />
        )}
        <ProfileNavLink
          label="Lịch sử nạp tiền"
          iconClass="bi-journal-text"
          tabName="depositHistory"
          activeTab={activeTab}
          onClick={() => setActiveTab('depositHistory')}
        />
        <ProfileNavLink
          label="Minigame đã chơi"
          iconClass="bi-controller"
          tabName="minigames"
          activeTab={activeTab}
          onClick={() => setActiveTab('minigames')}
        />
        <ProfileNavLink
          label="Tài khoản đã mua"
          iconClass="bi-box-seam"
          tabName="purchasedAccounts"
          activeTab={activeTab}
          onClick={() => setActiveTab('purchasedAccounts')}
        />
        <ProfileNavLink
          label="Tài khoản đã cọc"
          iconClass="bi-wallet2"
          tabName="depositedAccounts"
          activeTab={activeTab}
          onClick={() => setActiveTab('depositedAccounts')}
        />
        <ProfileNavLink
          label="Giỏ hàng đã thêm"
          iconClass="bi-cart-fill"
          tabName="cart"
          activeTab={activeTab}
          onClick={() => setActiveTab('cart')}
        />
        {/* Đường phân cách */}
        <li className="my-2"><hr className="my-0 border-secondary" /></li>
        <ProfileNavLink
          label="Rút vật phẩm"
          iconClass="bi-arrow-left-right"
          tabName="withdrawItems"
          activeTab={activeTab}
          onClick={() => setActiveTab('withdrawItems')}
        />
        <ProfileNavLink
          label="Dịch vụ cày thuê"
          iconClass="bi-controller"
          tabName="boostingService"
          activeTab={activeTab}
          onClick={() => setActiveTab('boostingService')}
        />
        <ProfileNavLink
          label="Dịch vụ vật phẩm"
          iconClass="bi-gem"
          tabName="itemService"
          activeTab={activeTab}
          onClick={() => setActiveTab('itemService')}
        />

        {/* Các mục chỉ dành cho Admin */}
        {role && ( // Hoặc dùng 'role' prop
          <>
            <li className="my-2"><hr className="my-0 border-secondary" /></li>
            <ProfileNavLink
              label="Thêm tài khoản"
              iconClass="bi-plus-circle"
              tabName="createAcc"
              activeTab={activeTab}
              onClick={() => setActiveTab('createAcc')}
            />
            <ProfileNavLink
              label="Sửa tài khoản"
              iconClass="bi-pencil-square"
              tabName="updateAcc"
              activeTab={activeTab}
              onClick={() => setActiveTab('updateAcc')}
            />
             <ProfileNavLink
              label="Admin Nạp Coin"
              iconClass="bi-coin"
              tabName="adminChargeCoin"
              activeTab={activeTab}
              onClick={() => setActiveTab('adminChargeCoin')}
            />
          </>
        )}
      </ul>
    </div>
  );
}