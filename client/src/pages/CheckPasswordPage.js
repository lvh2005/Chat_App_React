import React, { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useDispatch } from 'react-redux';
import { setToken } from '../redux/userSlice';
import Avatar from '../components/Avatar';

const CheckPasswordPage = () => {
  // State lưu trữ mật khẩu và userId (userId được lấy từ state truyền qua route)
  const [data, setData] = useState({
    password: "",
  });
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();

  // Nếu không có thông tin người dùng từ state (ví dụ tên), chuyển hướng về trang nhập email
  useEffect(() => {
    if (!location?.state?.name) {
      navigate('/email');
    }
  }, [location, navigate]);

  // Xử lý thay đổi giá trị input
  const handleOnChange = (e) => {
    const { name, value } = e.target;
    setData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Xử lý submit form đăng nhập
  const handleSubmit = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    const URL = `${process.env.REACT_APP_BACKEND_URL}/api/password`;

    try {
      const response = await axios({
        method: 'post',
        url: URL,
        data: {
          userId: location?.state?._id, // Lấy userId từ state của route
          password: data.password,
        },
        withCredentials: true,
      });

      toast.success(response.data.message);

      if (response.data.success) {
        // Lưu token vào Redux và localStorage
        dispatch(setToken(response?.data?.token));
        localStorage.setItem('token', response?.data?.token);

        // Reset lại giá trị password
        setData({ password: "" });
        // Chuyển hướng về trang chủ
        navigate('/');
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || "Có lỗi xảy ra, vui lòng thử lại.");
    }
  };

  return (
    <div className="mt-5">
      <div className="bg-white w-full max-w-md rounded overflow-hidden p-6 mx-auto shadow-lg">
        {/* Phần hiển thị thông tin người dùng */}
        <div className="flex flex-col items-center justify-center mb-4">
          <Avatar
            width={70}
            height={70}
            name={location?.state?.name}
            imageUrl={location?.state?.profile_pic}
          />
          <h2 className="font-semibold text-lg mt-2">{location?.state?.name}</h2>
        </div>

        {/* Form nhập mật khẩu */}
        <form className="grid gap-4" onSubmit={handleSubmit}>
          <div className="flex flex-col gap-1">
            <label htmlFor="password" className="font-semibold">
              Mật khẩu:
            </label>
            <input
              type="password"
              id="password"
              name="password"
              placeholder="Nhập mật khẩu của bạn"
              className="bg-slate-100 px-3 py-2 focus:outline-primary border border-gray-300 rounded"
              value={data.password}
              onChange={handleOnChange}
              required
            />
          </div>

          <button
            type="submit"
            className="bg-primary text-lg px-4 py-2 hover:bg-secondary rounded font-bold text-white transition-colors"
          >
            Đăng nhập
          </button>
        </form>

        {/* Link chuyển hướng khi quên mật khẩu */}
        <p className="my-4 text-center">
          <Link to="/forgot-password" className="hover:text-primary font-semibold">
            Quên mật khẩu?
          </Link>
        </p>
      </div>
    </div>
  );
};

export default CheckPasswordPage;
