const jwt = require('jsonwebtoken');
const UserModel = require('../models/UserModel');

const getUserDetailsFromToken = async (token) => {
    try {
        if (!token) {
            return {
                message: "Phiên làm việc đã hết hạn",
                logout: true,
            };
        }

        const decode = await jwt.verify(token, process.env.JWT_SECRET_KEY);

        const user = await UserModel.findById(decode.id).select('-password');

        if (!user) {
            return {
                message: "Không tìm thấy người dùng",
                logout: true,
            };
        }

        return user;
    } catch (error) {
        return {
            message: error.message || "Token không hợp lệ",
            logout: true,
        };
    }
};

module.exports = getUserDetailsFromToken;
