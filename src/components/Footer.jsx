import React from 'react';

export default function Footer() {
  return (
    // Toàn bộ footer với nền đen đậm và text trắng
    <footer className="bg-dark text-white py-5 position-relative"> {/* position-relative cho fixed button */}
      <div className="container">
        {/* Phần trên của footer: các cột thông tin */}
        <div className="row g-4 mb-4"> {/* g-4 cho khoảng cách giữa các cột */}

          {/* Cột 1: Thông tin chung */}
          <div className="col-12 col-md-6 col-lg-3">
            <h4 className="fs-5 fw-semibold mb-3 pb-2 border-bottom border-secondary">THÔNG TIN CHUNG</h4>
            <ul className="list-unstyled mb-0 small">
              <li className="mb-2"><a href="#" className="text-white text-decoration-none hover-link">Hướng Dẫn Nạp Tiền Tại Shop</a></li>
              <li className="mb-2"><a href="#" className="text-white text-decoration-none hover-link">Hướng Dẫn Tạo Tài Khoản Shop</a></li>
              <li className="mb-2"><a href="#" className="text-white text-decoration-none hover-link">Hướng Dẫn Đổi Thông Tin Nick Riot</a></li>
              <li className="mb-2"><a href="#" className="text-white text-decoration-none hover-link">Chính Sách Bảo Mật</a></li>
              <li className="mb-2"><a href="#" className="text-white text-decoration-none hover-link">Điều Khoản Dịch Vụ</a></li>
            </ul>
          </div>

          {/* Cột 2: Sản phẩm */}
          <div className="col-12 col-md-6 col-lg-3">
            <h4 className="fs-5 fw-semibold mb-3 pb-2 border-bottom border-secondary">SẢN PHẨM</h4>
            <ul className="list-unstyled mb-0 small">
              <li className="mb-2"><a href="#" className="text-white text-decoration-none hover-link">Danh Mục Game Liên Minh</a></li>
              <li className="mb-2"><a href="#" className="text-white text-decoration-none hover-link">Danh Mục Game TFT</a></li>
            </ul>
          </div>

          {/* Cột 3: Thời gian hỗ trợ */}
          <div className="col-12 col-md-6 col-lg-3">
            <h4 className="fs-5 fw-semibold mb-3 pb-2 border-bottom border-secondary">THỜI GIAN HỖ TRỢ</h4>
            <p className="small mb-2">Sáng: 8h00 - 11h30</p>
            <p className="small mb-2">Chiều: 13h00 - 21h00</p>
          </div>

          {/* Cột 4: Logo và giới thiệu ngắn */}
          <div className="col-12 col-md-6 col-lg-3">
            <h4 className="fs-4 fw-bold mb-3">SHOPACC.COM</h4> 
            <p className="small lh-base">
              Shop Game Liên Minh Huyền Thoại, DTCL TFT, Nick teamfighttactics, Nick tft, Nick Đấu Trường Chân Lý Giá Rẻ.
            </p>
          </div>
        </div>
          {/* Cột 5: Hỗ trợ */}
           <div>
            <h5 className="fs-5 fw-semibold mb-3 pb-2 border-bottom border-secondary">Liên Hệ</h5>
          <div className="ws-text-sm ws-text-red-500 ws-font-bold">
            <a href="https://m.me/100013238611790" target="_blank">
              <i className="chat-toggle-button custom-chat-button btn btn-primary rounded-pill shadow-lg d-flex align-items-center justify-content-center"> Message</i>
            
            </a>
          </div>
        </div>
                  
        {/* Đường kẻ ngang ngăn cách phần trên và copyright */}
        <hr className="border-secondary mb-4" />

        {/* Phần dưới cùng: Copyright và thông tin vận hành */}
        <div className="text-center small text-secondary"> {/* text-secondary cho màu xám nhạt hơn */}
          <p className="mb-1">© Copyright 2025</p>
          <p className="mb-1">Operated by <a href="https://shopacc.up.railway.app/" target="_blank" rel="noopener noreferrer" className="text-info text-decoration-none hover-underline">https://shopacc</a>, All Rights Reserved</p>
          <p className="mb-0 text-muted">Copyright &copy; ShopACC 2025</p>
        </div>
      </div>

      {/* Nút Chat/Hỗ trợ - Vị trí cố định (fixed) */}
      {/* Đây là các placeholder, bạn có thể thay thế bằng icon SVG hoặc image */}

    </footer>
  );
}
