const UserModel = require("../models/UserModel");

/**
 * Hàm kiểm tra xem email người dùng đã tồn tại trong hệ thống hay chưa.
 * @param {Object} request - Đối tượng yêu cầu từ client.
 * @param {Object} response - Đối tượng phản hồi gửi về client.
 */
async function checkEmail(request, response) {
    try {
        const { email } = request.body;

        // Kiểm tra xem email có được gửi lên hay không
        if (!email) {
            return response.status(400).json({
                message: "Vui lòng nhập email",
                error: true
            });
        }

        // Tìm người dùng theo email, loại trừ trường mật khẩu khỏi kết quả
        const checkEmail = await UserModel.findOne({ email }).select("-password");

        // Nếu không tìm thấy người dùng với email này
        if (!checkEmail) {
            return response.status(404).json({
                message: "Không tìm thấy người dùng với email này",
                error: true
            });
        }

        // Nếu tìm thấy, trả về thông tin người dùng (trừ mật khẩu)
        return response.status(200).json({
            message: "Xác thực email thành công",
            success: true,
            data: checkEmail
        });

    } catch (error) {
        // Ghi log lỗi ra console để dễ kiểm tra khi phát triển
        console.error("Lỗi trong checkEmail:", error);

        // Phản hồi lỗi chung cho phía client
        return response.status(500).json({
            message: "Lỗi máy chủ nội bộ",
            error: true
        });
    }
}

module.exports = checkEmail;
