import {  useEffect, useState } from "react";
import { useNavigate ,useParams} from "react-router-dom";
import useAuth from "../hooks/useAuth"



export default function Payment({ apiUrl, isLoggedIn, token }) {
  const { id } = useParams();
  const navigate = useNavigate();

  const [acc, setAcc]     = useState(null);
  const [err, setErr]     = useState("");
  const [mode, setMode]   = useState("view");   // "view" | "purchase"
  const [image_url, setImageUrl] = useState("");
  const [hero, setHero]   = useState("");
  const [skin, setSkin]   = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [huy_chuong, setHuyChuong] = useState("");
  const [pha_le, setPhaLe] = useState("");
  const [linh_thu, setLinhThu] = useState("");
  const [san_dau, setSanDau] = useState("");
  const [chuong_luc, setChuongLuc] = useState("");
  const [rank, setRank]   = useState(""); 
  /*  Fetch 1 ACC theo ID  */
  useEffect(() => {
    (async () => {
      try {
        const res = await fetch(`${apiUrl}/acc/${id}`, {
          headers: {
            "Content-Type": "application/json",
            ...(token && { Authorization: `Bearer ${token}` }) // chỉ thêm nếu có token
          }
        });
      
        if (!res.ok) throw new Error("Yêu cầu đăng nhập");
        setAcc(await res.json());
      } catch (e) {
        setErr(e.message);
      }
    })();
  }, [id]);
  console.log("acc", acc)
  

  /*  ====== UI ======  */
  if (err)        return <p className="text-danger m-4">{err}</p>;
  if (!acc)       return <p className="m-4">Đang tải…</p>;

  /*  Chế độ mua  */
  if (mode === "purchase")
    return (
      <Purchase
        acc={acc}
        isLoggedIn={isLoggedIn}
        apiUrl={apiUrl}
        onBack={() => setMode("view")}
      />
    );

  return (
    <section className="container my-4">
      <div className="mb-2 text-muted">
        Trang chủ &gt; Tài khoản &gt; Nick: {id} (Liên Minh)
      </div>

      <div className="row">
        {/* Hình ảnh */}
        <div className="col-md-6 text-center">
          <img src={acc.image_url} alt={`ACC #${id}`} className="img-fluid rounded border" />
          <button className="btn btn-danger mt-2">🔍 Phóng to</button>
        </div>

        {/* Thông tin */}
        <div className="col-md-6">
          <h5 className="text-muted">Trò chơi: <span className="text-danger">Liên Minh</span></h5>
          <h4 className="fw-bold">Mã số: {id}</h4>
          <p>{description || "Không có mô tả."}</p>

          <div className="bg-light p-3 rounded mb-3">
            <div className="d-flex justify-content-between">
              <div>
                <div className="fw-bold text-danger">ATM / Momo</div>
                <h4 className="text-danger">{acc.price?.toLocaleString()} ₫</h4>
              </div>
              <div className="text-end">
                <div className="fw-bold">Thẻ cào</div>
                <h5>{(price * 1.1)?.toLocaleString()} ₫</h5>
              </div>
            </div>
          </div>

          {/* Thông tin chi tiết */}
          <table className="table table-sm">
            <tbody>
              <tr><td>Tướng</td><td>{acc.hero}</td><td><button className="btn btn-sm btn-danger">Chi tiết</button></td></tr>
              <tr><td>Trang phục</td><td>{acc.skin}</td><td><button className="btn btn-sm btn-danger">Chi tiết</button></td></tr>
              <tr><td>Linh thú</td><td>{acc.linh_thu || "--"}</td><td><button className="btn btn-sm btn-danger">Chi tiết</button></td></tr>
              <tr><td>Sân đấu</td><td>{acc.san_dau || "--"}</td><td><button className="btn btn-sm btn-danger">Chi tiết</button></td></tr>
              <tr><td>Chương lực</td><td>{chuong_luc || "--"}</td><td><button className="btn btn-sm btn-danger">Chi tiết</button></td></tr>
              <tr><td>Rank</td><td colSpan="2">{acc.rank || "Unrank"}</td></tr>
              <tr><td>Level</td><td colSpan="2">{acc.Level || "0"}</td></tr>
              <tr><td>RP</td><td colSpan="2">{acc.RP || "0"}</td></tr>
            </tbody>
          </table>

          <div className="text-danger fw-bold mb-3">
            🔥 Khuyến mãi tặng 10% khi nạp qua ATM/MOMO
          </div>

          <div className="d-flex gap-2">
            <button
              className="btn btn-warning w-50"
              onClick={() => {
                if (!isLoggedIn) {
                  setErr("Bạn cần đăng nhập trước khi mua!");
                  setTimeout(() => setErr(""), 4000);
                } else {
                  setMode("purchase");       // ⬅️ chuyển sang chế độ mua
                }
              }}
            >
              🛒 Mua Ngay
            </button>
            <button className="btn btn-primary w-50">💰 Cọc tài khoản</button>
          </div>
        </div>
      </div>
    </section>
  );
}

/* Thanh toán */
function Purchase ({ isLoggedIn, onBack ,tokenExpired, token, user_id, navigate, apiUrl, id, price, acc}) {
  
  const [error, setError] = useState(""); // Thêm state để lưu lỗi
  id = acc.id
  price = acc.price
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
            body: JSON.stringify({ id, price})
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
        setError('catch Không thể kết nối tới server. Có thể server bị lỗi hoặc bạn đang offline.');
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