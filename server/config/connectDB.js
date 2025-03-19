const mongoose = require('mongoose');

async function connectDB() {
    try {
        await mongoose.connect(process.env.MONGODB_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });

        const connection = mongoose.connection;

        connection.on('connected', () => {
            console.log("✅ Đã kết nối thành công tới MongoDB");
        });

        connection.on('error', (error) => {
            console.error("❌ Lỗi kết nối MongoDB: ", error);
        });
    } catch (error) {
        console.error("❌ Có lỗi trong quá trình kết nối: ", error);
        process.exit(1);
    }
}

module.exports = connectDB;
