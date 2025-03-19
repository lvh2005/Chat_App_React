import React, { useState } from 'react';
import { IoClose } from "react-icons/io5";
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';
import { PiUserCircle } from "react-icons/pi";

const CheckEmailPage = () => {
  // State lưu thông tin email
  const [data, setData] = useState({
    email: "",
  });
  const navigate = useNavigate();

  // Hàm xử lý thay đổi giá trị input
  const handleOnChange = (e) => {
    const { name, value } = e.target;
    setData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Hàm xử lý khi submit form
  const handleSubmit = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    const URL = `${process.env.REACT_APP_BACKEND_URL}/api/email`;

    try {
      const response = await axios.post(URL, data);
      toast.success(response.data.message);

      if (response.data.success) {
        // Reset lại giá trị email sau khi submit thành công
        setData({
          email: "",
        });
        // Chuyển hướng sang trang nhập mật khẩu, truyền kèm state từ backend
        navigate('/password', {
          state: response?.data?.data,
        });
      }
    } catch (error) {
      toast.error(error?.response?.data?.message);
    }
  };

  return (
    <div className="mt-5">
      <div className="bg-white w-full max-w-md rounded overflow-hidden p-4 mx-auto shadow">
        {/* Icon người dùng */}
        <div className="w-fit mx-auto mb-2">
          <PiUserCircle size={80} />
        </div>
        {/* Tiêu đề */}
        <h3 className="text-center text-2xl font-bold mb-4">Chào mừng đến với Chat App!</h3>

        {/* Form nhập email */}
        <form className="grid gap-4" onSubmit={handleSubmit}>
          <div className="flex flex-col gap-1">
            <label htmlFor="email" className="font-semibold">
              Email:
            </label>
            <input
              type="email"
              id="email"
              name="email"
              placeholder="Nhập email của bạn"
              className="bg-slate-100 px-2 py-1 focus:outline-primary border border-gray-300 rounded"
              value={data.email}
              onChange={handleOnChange}
              required
            />
          </div>

          <button
            type="submit"
            className="bg-primary text-lg px-4 py-2 hover:bg-secondary rounded font-bold text-white transition-colors"
          >
            Tiếp tục
          </button>
        </form>

        {/* Link chuyển hướng sang đăng ký */}
        <p className="my-3 text-center">
          Người dùng mới?{" "}
          <Link to="/register" className="hover:text-primary font-semibold">
            Đăng ký
          </Link>
        </p>
      </div>
    </div>
  );
};

export default CheckEmailPage;
