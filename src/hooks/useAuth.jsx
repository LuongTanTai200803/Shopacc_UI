import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";


export default function useAuth() {

  const [tokenExpired, setTokenExpired] = useState(false);
  
  useEffect(() => {
      const checkToken = () => {

      const token = localStorage.getItem('token');
      //console.log("token:", token)  
          if (!token) {
              setTokenExpired(true);
              
              return;
          }
          try {
              const decoded = jwtDecode(token);
              const currentTime = Math.floor(Date.now() / 1000);
              const remaining = decoded.exp - currentTime

              if (remaining <=0){
                setTokenExpired(false)
                console.log("Token expired. Logging out...");
                localStorage.removeItem("token");
              }
          } catch (err) {
              setTokenExpired(true); // Token lỗi cho hết hạn
              localStorage.removeItem("token");
              console.error('Token error',err)
          }
      };
      
      checkToken(); // Kiểm tra ngay khi load
      const interval = setInterval(checkToken, 60000); // Kiểm tra định kỳ mỗi 30s
      
      return () => clearInterval(interval);
    }, []);

  return [tokenExpired, setTokenExpired];
}
