const express = require('express');
const registerUser = require('../controller/registerUser');
const checkEmail = require('../controller/checkEmail');
const checkPassword = require('../controller/checkPassword');
const userDetails = require('../controller/userDetails');
const logout = require('../controller/logout');
const updateUserDetails = require('../controller/updateUserDetails');
const searchUser = require('../controller/searchUser');

const router = express.Router(); // Khởi tạo Router từ Express

// ======================= USER API ==========================

// Đăng ký người dùng mới
router.post('/register', registerUser);

// Kiểm tra email người dùng đã tồn tại hay chưa
router.post('/email', checkEmail);

// Kiểm tra mật khẩu khi đăng nhập
router.post('/password', checkPassword);

// Lấy thông tin chi tiết của người dùng đã đăng nhập
router.get('/user-details', userDetails);

// Đăng xuất người dùng
router.get('/logout', logout);

// Cập nhật thông tin người dùng như tên và ảnh đại diện
router.post('/update-user', updateUserDetails);

// Tìm kiếm người dùng theo tên hoặc email
router.post('/search-user', searchUser);

module.exports = router; // Xuất module router
