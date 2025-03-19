const UserModel = require("../models/UserModel");
const bcryptjs = require("bcryptjs");

async function registerUser(request, response) {
    try {
        const { name, email, password, profile_pic } = request.body;

        // Kiểm tra dữ liệu đầu vào
        if (!name || !email || !password) {
            return response.status(400).json({
                message: "Tên, email và mật khẩu là bắt buộc.",
                error: true,
            });
        }

        // Kiểm tra định dạng email
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return response.status(400).json({
                message: "Định dạng email không hợp lệ.",
                error: true,
            });
        }

        // Kiểm tra độ dài mật khẩu
        if (password.length < 6) {
            return response.status(400).json({
                message: "Mật khẩu phải có ít nhất 6 ký tự.",
                error: true,
            });
        }

        // Kiểm tra email đã tồn tại
        const checkEmail = await UserModel.findOne({ email: email.toLowerCase() });
        if (checkEmail) {
            return response.status(400).json({
                message: "Email đã được sử dụng.",
                error: true,
            });
        }

        // Mã hóa mật khẩu
        const saltRounds = 10;
        const hashPassword = await bcryptjs.hash(password, saltRounds);

        // Tạo payload người dùng
        const payload = {
            name,
            email: email.toLowerCase(),
            profile_pic,
            password: hashPassword,
        };

        // Lưu người dùng mới
        const newUser = new UserModel(payload);
        const savedUser = await newUser.save();

        // Ẩn mật khẩu trong phản hồi
        const { password: _, ...userWithoutPassword } = savedUser.toObject();

        return response.status(201).json({
            message: "Tạo tài khoản thành công.",
            data: userWithoutPassword,
            success: true,
        });

    } catch (error) {
        console.error("Lỗi khi tạo tài khoản:", error);
        return response.status(500).json({
            message: error.message || "Lỗi máy chủ nội bộ.",
            error: true,
        });
    }
}

module.exports = registerUser;
