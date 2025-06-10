import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";


export default function useAuth() {

  const [tokenExpired, setTokenExpired] = useState("");
  
  useEffect(() => {
      const checkToken = () => {

      const token = localStorage.getItem('token');

          if (!token) {
              setTokenExpired(true);
              console.log("Khong co token")
              
              return;
          }
            
          try {
              const decoded = jwtDecode(token);
              const currentTime = Math.floor(Date.now() / 1000);
              
              setTokenExpired(decoded.exp < currentTime); // Đặt true nếu hết hạn
          } catch (err) {
              setTokenExpired(true); // Token lỗi cho hết hạn
              console.error('Token error',err)
          }
      };
      
      checkToken(); // Kiểm tra ngay khi load
      const interval = setInterval(checkToken, 60000); // Kiểm tra định kỳ mỗi 30s
      
      return () => clearInterval(interval);
    }, []);

  return [tokenExpired, setTokenExpired];
}


function checkToken(){

  if (useAuth())
    return true
  return false
}