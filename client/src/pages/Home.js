import axios from 'axios';
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { logout, setOnlineUser, setSocketConnection, setUser } from '../redux/userSlice';
import Sidebar from '../components/Sidebar';
import logo from '../assets/logo.png';
import io from 'socket.io-client';

const Home = () => {
  const user = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  console.log('Thông tin người dùng:', user);

  // Hàm lấy thông tin người dùng từ backend
  const fetchUserDetails = async () => {
    try {
      const URL = `${process.env.REACT_APP_BACKEND_URL}/api/user-details`;
      const response = await axios({
        url: URL,
        withCredentials: true,
      });

      // Cập nhật thông tin người dùng vào Redux
      dispatch(setUser(response.data.data));

      // Nếu backend báo logout, chuyển hướng về trang đăng nhập
      if (response.data.data.logout) {
        dispatch(logout());
        navigate('/email');
      }
      console.log('Thông tin người dùng hiện tại:', response);
    } catch (error) {
      console.error('Lỗi khi lấy thông tin người dùng:', error);
    }
  };

  useEffect(() => {
    fetchUserDetails();
  }, []);

  // Thiết lập kết nối Socket.IO để cập nhật danh sách người dùng online
  useEffect(() => {
    const socketConnection = io(process.env.REACT_APP_BACKEND_URL, {
      auth: {
        token: localStorage.getItem('token'),
      },
    });

    socketConnection.on('onlineUser', (data) => {
      console.log('Người dùng online:', data);
      dispatch(setOnlineUser(data));
    });

    dispatch(setSocketConnection(socketConnection));

    return () => {
      socketConnection.disconnect();
    };
  }, []);

  // Kiểm tra nếu đang ở đường dẫn chính ('/')
  const basePath = location.pathname === '/';

  return (
    <div className="grid lg:grid-cols-[300px,1fr] h-screen max-h-screen">
      {/* Sidebar: Hiển thị khi ở trang chính */}
      <section className={`bg-white ${!basePath && 'hidden'} lg:block`}>
        <Sidebar />
      </section>

      {/* Khu vực tin nhắn: chỉ hiển thị khi không phải trang chính */}
      <section className={`${basePath && 'hidden'}`}>
        <Outlet />
      </section>

      {/* Màn hình chờ: hiển thị logo và thông báo chọn người dùng gửi tin nhắn */}
      <div
        className={`flex flex-col items-center justify-center gap-4 ${
          basePath ? 'lg:flex' : 'hidden'
        }`}
      >
        <img src={logo} width={250} alt="Logo" />
        <p className="text-lg mt-2 text-slate-500">
          Vui lòng chọn người dùng để gửi tin nhắn
        </p>
      </div>
    </div>
  );
};

export default Home;
