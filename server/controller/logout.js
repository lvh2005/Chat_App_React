/**
 * Hàm đăng xuất người dùng bằng cách xóa token từ cookie.
 * @param {Object} request - Đối tượng yêu cầu từ client.
 * @param {Object} response - Đối tượng phản hồi gửi về client.
 */
async function logout(request, response) {
    try {
        const cookieOptions = {
            httpOnly: true, // Đảm bảo cookie không thể bị truy cập bởi JavaScript từ phía client
            secure: process.env.NODE_ENV === 'production', // Chỉ dùng HTTPS trong môi trường production
            sameSite: 'strict', // Chặn yêu cầu từ các site khác (chống CSRF)
            expires: new Date(0) // Đặt thời gian hết hạn về quá khứ để xóa cookie
        };

        // Xóa cookie bằng cách ghi đè với giá trị rỗng và thời gian hết hạn đã qua
        return response.cookie('token', '', cookieOptions).status(200).json({
            message: "Đăng xuất thành công",
            success: true
        });
    } catch (error) {
        console.error("Lỗi trong logout:", error); // Log lỗi để dễ kiểm tra khi debug

        return response.status(500).json({
            message: "Lỗi máy chủ nội bộ",
            error: true
        });
    }
}

module.exports = logout;
