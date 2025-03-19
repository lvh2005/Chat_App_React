import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';

const Forgotpassword = () => {
  // State lưu email người dùng nhập
  const [email, setEmail] = useState("");

  // Hàm xử lý khi submit form
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Kiểm tra nếu email không được nhập
    if (!email) {
      toast.error("Vui lòng nhập email của bạn");
      return;
    }

    try {
      // Gọi API gửi yêu cầu đặt lại mật khẩu
      const response = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/api/forgot-password`, { email });
      
      // Hiển thị thông báo thành công
      toast.success(response.data.message || "Email đặt lại mật khẩu đã được gửi!");
    } catch (error) {
      // Hiển thị thông báo lỗi
      toast.error(error?.response?.data?.message || "Có lỗi xảy ra, vui lòng thử lại.");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-6 rounded shadow-md w-full max-w-sm">
        <h2 className="text-xl font-bold text-center mb-4">Quên mật khẩu</h2>
        <form onSubmit={handleSubmit} className="grid gap-4">
          <div className="flex flex-col">
            <label htmlFor="email" className="mb-1 font-semibold">Email</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Nhập email của bạn"
              className="px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-primary"
              required
            />
          </div>
          <button
            type="submit"
            className="bg-primary text-white font-bold py-2 rounded hover:bg-secondary transition-colors"
          >
            Gửi yêu cầu đặt lại mật khẩu
          </button>
        </form>
        <p className="text-center mt-4">
          Nhớ mật khẩu?{' '}
          <Link to="/login" className="text-primary hover:underline">
            Đăng nhập ngay
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Forgotpassword;
