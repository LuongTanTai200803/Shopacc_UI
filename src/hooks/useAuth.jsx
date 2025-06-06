import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";


export default function useAuth(token) {
  const navigate = useNavigate();
  
  const [tokenExpired, setTokenExpired] = useState(true);
  const [confirmMessage, setConfirmMessage] = useState("");
  const [user_id, setUser_id] = useState();

  useEffect(() => {
    
    if (!token) {
      
      //console.error("setConfirmMessage:",token)
      setConfirmMessage(`Yêu cầu đăng nhập!`);
      // Tự động ẩn message sau 5 giây
      setTimeout(() => {
          setConfirmMessage("");
      }, 5000);
      

    }else { //Kiểm tra tokenExpired
     
      fetch("http://127.0.0.1:5000/auth/protected", {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
        .then(res => {
          if (res.status === 200) {
            setTokenExpired(false);  
            setUser_id(res.user_id)
            // console.error('Response status:', res.status); // thêm dòng này
            // console.error('Response data:', data); // thêm dòng này
          } else {
            setTokenExpired(true);
            console.error(tokenExpired)
          }
          
          
        });
    }   
  }, []);

  return { tokenExpired , confirmMessage, user_id};
}