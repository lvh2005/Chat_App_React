const UserModel = require('../models/UserModel')

async function searchUser(request, response) {
    try {
        const { search } = request.body;
        let users;

        if (search && search.trim()) {
            // Nếu có từ khóa tìm kiếm, thực hiện tìm kiếm với regex
            const query = new RegExp(search.trim(), "i");
            users = await UserModel.find({
                $or: [
                    { name: query },
                    { email: query }
                ]
            })
            .select("-password")
            .limit(20); // Giới hạn kết quả
        } else {
            // Nếu không có từ khóa, trả về toàn bộ người dùng (giới hạn để tránh quá tải)
            users = await UserModel.find().select("-password").limit(20);
        }

        // Nếu không tìm thấy người dùng nào
        if (users.length === 0) {
            return response.status(404).json({
                message: "Không tìm thấy người dùng nào.",
                data: [],
                success: false
            });
        }

        // Trả về kết quả
        return response.status(200).json({
            message: "Danh sách người dùng.",
            data: users,
            success: true
        });

    } catch (error) {
        console.error("Lỗi khi tìm kiếm người dùng:", error);
        return response.status(500).json({
            message: error.message || "Lỗi máy chủ nội bộ.",
            error: true
        });
    }
}

module.exports = searchUser;
