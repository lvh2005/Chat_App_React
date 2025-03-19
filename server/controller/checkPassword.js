const UserModel = require("../models/UserModel");
const bcryptjs = require('bcryptjs');
const jwt = require('jsonwebtoken');

/**
 * Hàm kiểm tra mật khẩu của người dùng và tạo JWT nếu đăng nhập thành công.
 * @param {Object} request - Đối tượng yêu cầu từ client.
 * @param {Object} response - Đối tượng phản hồi gửi về client.
 */
async function checkPassword(request, response) {
    try {
        const { password, userId } = request.body;

        // Kiểm tra xem thông tin đầu vào có đầy đủ không
        if (!password || !userId) {
            return response.status(400).json({
                message: "Vui lòng cung cấp đầy đủ userId và mật khẩu",
                error: true
            });
        }

        // Tìm người dùng theo userId
        const user = await UserModel.findById(userId);
        if (!user) {
            return response.status(404).json({
                message: "Không tìm thấy người dùng",
                error: true
            });
        }

        // So sánh mật khẩu nhập vào với mật khẩu đã mã hóa trong database
        const verifyPassword = await bcryptjs.compare(password, user.password);
        if (!verifyPassword) {
            return response.status(400).json({
                message: "Mật khẩu không đúng. Vui lòng kiểm tra lại!",
                error: true
            });
        }

        // Tạo dữ liệu để đưa vào token
        const tokenData = {
            id: user._id,
            email: user.email
        };

        // Tạo JWT token với thời gian hết hạn là 1 ngày
        const token = jwt.sign(tokenData, process.env.JWT_SECRET_KEY, { expiresIn: '1d' });

        // Cấu hình cookie để tăng bảo mật
        const cookieOptions = {
            httpOnly: true, // Chặn truy cập từ JavaScript phía client
            secure: process.env.NODE_ENV === 'production', // Chỉ sử dụng HTTPS trong môi trường production
            sameSite: 'strict' // Chặn yêu cầu từ các site khác (chống CSRF)
        };

        // Gửi cookie chứa token về client và phản hồi thành công
        return response.cookie('token', token, cookieOptions).status(200).json({
            message: "Đăng nhập thành công",
            token: token,
            success: true
        });

    } catch (error) {
        console.error("Lỗi trong checkPassword:", error); // Log lỗi để dễ kiểm tra khi debug

        // Phản hồi lỗi máy chủ
        return response.status(500).json({
            message: "Lỗi máy chủ nội bộ",
            error: true
        });
    }
}

module.exports = checkPassword;
