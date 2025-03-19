import React, { useState } from 'react';
import { IoClose } from 'react-icons/io5';
import { Link, useNavigate } from 'react-router-dom';
import uploadFile from '../helpers/uploadFile';
import axios from 'axios';
import toast from 'react-hot-toast';

const RegisterPage = () => {
  // State lưu thông tin đăng ký
  const [data, setData] = useState({
    name: '',
    email: '',
    password: '',
    profile_pic: ''
  });
  // State lưu thông tin file ảnh được chọn để upload
  const [uploadPhoto, setUploadPhoto] = useState(null);
  const navigate = useNavigate();

  // Xử lý thay đổi input cho các trường đăng ký
  const handleOnChange = (e) => {
    const { name, value } = e.target;
    setData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  // Xử lý upload ảnh hồ sơ
  const handleUploadPhoto = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    const uploadResponse = await uploadFile(file);
    // Lưu file đã chọn để hiển thị tên file, nếu cần
    setUploadPhoto(file);
    // Cập nhật URL ảnh hồ sơ từ Cloudinary (lưu ý: có thể sử dụng secure_url nếu API trả về)
    setData((prev) => ({
      ...prev,
      profile_pic: uploadResponse?.url || ''
    }));
  };

  // Xử lý xóa ảnh đã chọn
  const handleClearUploadPhoto = (e) => {
    e.stopPropagation();
    e.preventDefault();
    setUploadPhoto(null);
    setData((prev) => ({
      ...prev,
      profile_pic: ''
    }));
  };

  // Xử lý submit form đăng ký
  const handleSubmit = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    const URL = `${process.env.REACT_APP_BACKEND_URL}/api/register`;

    try {
      const response = await axios.post(URL, data);
      console.log('Phản hồi:', response);

      toast.success(response.data.message);

      if (response.data.success) {
        // Reset dữ liệu đăng ký sau khi thành công
        setData({
          name: '',
          email: '',
          password: '',
          profile_pic: ''
        });
        navigate('/email');
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || 'Có lỗi xảy ra, vui lòng thử lại.');
    }
    console.log('Dữ liệu gửi đi:', data);
  };

  return (
    <div className="mt-10 flex items-center justify-center">
      <div className="bg-white w-full max-w-md rounded-lg overflow-hidden p-6 shadow-lg">
        <h3 className="text-2xl font-bold text-center mb-6">Chào mừng đến với Chat App!</h3>
        <form onSubmit={handleSubmit} className="grid gap-5">
          {/* Tên */}
          <div className="flex flex-col">
            <label htmlFor="name" className="font-semibold mb-1">
              Tên:
            </label>
            <input
              type="text"
              id="name"
              name="name"
              placeholder="Nhập tên của bạn"
              className="bg-slate-100 px-3 py-2 border border-gray-300 rounded focus:outline-primary"
              value={data.name}
              onChange={handleOnChange}
              required
            />
          </div>
          {/* Email */}
          <div className="flex flex-col">
            <label htmlFor="email" className="font-semibold mb-1">
              Email:
            </label>
            <input
              type="email"
              id="email"
              name="email"
              placeholder="Nhập email của bạn"
              className="bg-slate-100 px-3 py-2 border border-gray-300 rounded focus:outline-primary"
              value={data.email}
              onChange={handleOnChange}
              required
            />
          </div>
          {/* Mật khẩu */}
          <div className="flex flex-col">
            <label htmlFor="password" className="font-semibold mb-1">
              Mật khẩu:
            </label>
            <input
              type="password"
              id="password"
              name="password"
              placeholder="Nhập mật khẩu của bạn"
              className="bg-slate-100 px-3 py-2 border border-gray-300 rounded focus:outline-primary"
              value={data.password}
              onChange={handleOnChange}
              required
            />
          </div>
          {/* Upload ảnh hồ sơ */}
          <div className="flex flex-col">
            <label htmlFor="profile_pic" className="font-semibold mb-1">
              Ảnh đại diện:
            </label>
            <div
              className="h-14 bg-slate-200 flex items-center justify-between px-3 py-2 border border-gray-300 rounded cursor-pointer hover:border-primary"
              onClick={() => document.getElementById('profile_pic').click()}
            >
              <p className="text-sm truncate">
                {uploadPhoto?.name ? uploadPhoto.name : 'Tải ảnh đại diện lên'}
              </p>
              {uploadPhoto?.name && (
                <button
                  className="text-lg hover:text-red-600"
                  onClick={handleClearUploadPhoto}
                >
                  <IoClose />
                </button>
              )}
            </div>
            <input
              type="file"
              id="profile_pic"
              name="profile_pic"
              className="hidden"
              onChange={handleUploadPhoto}
              accept="image/*"
            />
          </div>
          {/* Nút đăng ký */}
          <button
            type="submit"
            className="bg-primary text-lg px-4 py-2 hover:bg-secondary rounded font-bold text-white transition-colors"
          >
            Đăng ký
          </button>
        </form>
        <p className="mt-5 text-center">
          Đã có tài khoản?{' '}
          <Link to="/email" className="hover:text-primary font-semibold">
            Đăng nhập ngay
          </Link>
        </p>
      </div>
    </div>
  );
};

export default RegisterPage;
