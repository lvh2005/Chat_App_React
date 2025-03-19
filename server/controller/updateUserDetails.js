const getUserDetailsFromToken = require("../helpers/getUserDetailsFromToken");
const UserModel = require("../models/UserModel");

async function updateUserDetails(request, response) {
    try {
        const token = request.cookies.token || "";

        // Lấy thông tin user từ token
        const user = await getUserDetailsFromToken(token);
        if (!user) {
            return response.status(401).json({
                message: "Token không hợp lệ hoặc đã hết hạn.",
                error: true,
            });
        }

        const { name, profile_pic } = request.body;

        // Tạo payload chỉ chứa các trường cần cập nhật
        const updatePayload = {};
        if (name) updatePayload.name = name;
        if (profile_pic) updatePayload.profile_pic = profile_pic;

        // Kiểm tra xem có dữ liệu để cập nhật không
        if (Object.keys(updatePayload).length === 0) {
            return response.status(400).json({
                message: "Không có thông tin nào để cập nhật.",
                error: true,
            });
        }

        // Cập nhật thông tin người dùng
        await UserModel.updateOne(
            { _id: user._id },
            { $set: updatePayload }
        );

        // Lấy lại thông tin người dùng sau khi cập nhật
        const updatedUser = await UserModel.findById(user._id).select("-password");

        return response.json({
            message: "Cập nhật thông tin thành công.",
            data: updatedUser,
            success: true,
        });

    } catch (error) {
        console.error("Lỗi khi cập nhật người dùng:", error);
        return response.status(500).json({
            message: error.message || "Lỗi máy chủ nội bộ.",
            error: true,
        });
    }
}

module.exports = updateUserDetails;
