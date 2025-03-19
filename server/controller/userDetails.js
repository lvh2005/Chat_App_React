const getUserDetailsFromToken = require("../helpers/getUserDetailsFromToken");

async function userDetails(request, response) {
    try {
        const token = request.cookies.token || "";

        if (!token) {
            return response.status(401).json({
                message: "Token không tồn tại.",
                error: true,
            });
        }

        const user = await getUserDetailsFromToken(token);

        if (!user) {
            return response.status(401).json({
                message: "Token không hợp lệ hoặc đã hết hạn.",
                error: true,
            });
        }

        // Loại bỏ trường password trước khi trả về
        const { password, ...userWithoutPassword } = user._doc || user;

        return response.status(200).json({
            message: "Lấy thông tin người dùng thành công.",
            data: userWithoutPassword,
            success: true,
        });

    } catch (error) {
        console.error("Lỗi khi lấy thông tin người dùng:", error);
        return response.status(500).json({
            message: error.message || "Lỗi máy chủ nội bộ.",
            error: true,
        });
    }
}

module.exports = userDetails;
