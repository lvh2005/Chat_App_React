const express = require('express')
const { Server } = require('socket.io')
const http = require('http')
const getUserDetailsFromToken = require('../helpers/getUserDetailsFromToken')
const UserModel = require('../models/UserModel')
const { ConversationModel, MessageModel } = require('../models/ConversationModel')
const getConversation = require('../helpers/getConversation')

const app = express()

/*** Tạo server HTTP và thiết lập Socket.IO */
const server = http.createServer(app)
const io = new Server(server, {
    cors: {
        origin: process.env.FRONTEND_URL,
        credentials: true
    }
})

/*** Danh sách người dùng đang online */
const onlineUser = new Set()

// Xử lý khi người dùng kết nối
io.on('connection', async (socket) => {
    console.log("Người dùng kết nối:", socket.id)

    const token = socket.handshake.auth.token 
    const user = await getUserDetailsFromToken(token)

    // Nếu user hợp lệ, thêm vào phòng và danh sách online
    if (user && user._id) {
        socket.join(user._id.toString())
        onlineUser.add(user._id.toString())

        // Gửi danh sách người dùng online đến client
        io.emit('onlineUser', Array.from(onlineUser))
    }

    /**
     * Sự kiện khi mở trang tin nhắn với một người dùng khác
     */
    socket.on('message-page', async (userId) => {
        const userDetails = await UserModel.findById(userId).select("-password")
        const payload = {
            _id: userDetails?._id,
            name: userDetails?.name,
            email: userDetails?.email,
            profile_pic: userDetails?.profile_pic,
            online: onlineUser.has(userId)
        }

        // Gửi thông tin người dùng
        socket.emit('message-user', payload)

        // Lấy tin nhắn từ cuộc trò chuyện trước đó
        const getConversationMessage = await ConversationModel.findOne({
            "$or": [
                { sender: user?._id, receiver: userId },
                { sender: userId, receiver: user?._id }
            ]
        }).populate('messages').sort({ updatedAt: -1 })

        socket.emit('message', getConversationMessage?.messages || [])
    })

    /**
     * Sự kiện khi có tin nhắn mới
     */
    socket.on('new message', async (data) => {
        // Kiểm tra xem đã có cuộc trò chuyện giữa hai người chưa
        let conversation = await ConversationModel.findOne({
            "$or": [
                { sender: data?.sender, receiver: data?.receiver },
                { sender: data?.receiver, receiver: data?.sender }
            ]
        })

        // Nếu chưa có thì tạo mới cuộc trò chuyện
        if (!conversation) {
            conversation = await new ConversationModel({
                sender: data?.sender,
                receiver: data?.receiver
            }).save()
        }

        // Tạo và lưu tin nhắn mới
        const message = new MessageModel({
            text: data.text,
            imageUrl: data.imageUrl,
            videoUrl: data.videoUrl,
            msgByUserId: data?.msgByUserId,
        })
        const saveMessage = await message.save()

        // Cập nhật cuộc trò chuyện với tin nhắn mới
        await ConversationModel.updateOne({ _id: conversation._id }, {
            "$push": { messages: saveMessage._id }
        })

        // Lấy tin nhắn mới nhất trong cuộc trò chuyện
        const getConversationMessage = await ConversationModel.findOne({
            "$or": [
                { sender: data?.sender, receiver: data?.receiver },
                { sender: data?.receiver, receiver: data?.sender }
            ]
        }).populate('messages').sort({ updatedAt: -1 })

        // Gửi tin nhắn cho cả người gửi và người nhận
        io.to(data?.sender).emit('message', getConversationMessage?.messages || [])
        io.to(data?.receiver).emit('message', getConversationMessage?.messages || [])

        // Cập nhật danh sách cuộc trò chuyện cho cả hai người
        const conversationSender = await getConversation(data?.sender)
        const conversationReceiver = await getConversation(data?.receiver)

        io.to(data?.sender).emit('conversation', conversationSender)
        io.to(data?.receiver).emit('conversation', conversationReceiver)
    })

    /**
     * Sự kiện khi cập nhật sidebar (danh sách cuộc trò chuyện)
     */
    socket.on('sidebar', async (currentUserId) => {
        const conversation = await getConversation(currentUserId)
        socket.emit('conversation', conversation)
    })

    /**
     * Sự kiện khi tin nhắn đã được xem
     */
    socket.on('seen', async (msgByUserId) => {
        const conversation = await ConversationModel.findOne({
            "$or": [
                { sender: user?._id, receiver: msgByUserId },
                { sender: msgByUserId, receiver: user?._id }
            ]
        })

        const conversationMessageId = conversation?.messages || []

        // Cập nhật trạng thái đã xem cho tin nhắn
        await MessageModel.updateMany(
            { _id: { "$in": conversationMessageId }, msgByUserId: msgByUserId },
            { "$set": { seen: true } }
        )

        // Gửi lại danh sách cuộc trò chuyện đã cập nhật
        const conversationSender = await getConversation(user?._id?.toString())
        const conversationReceiver = await getConversation(msgByUserId)

        io.to(user?._id?.toString()).emit('conversation', conversationSender)
        io.to(msgByUserId).emit('conversation', conversationReceiver)
    })

    /**
     * Sự kiện khi người dùng ngắt kết nối
     */
    socket.on('disconnect', () => {
        onlineUser.delete(user?._id?.toString())
        console.log('Người dùng ngắt kết nối:', socket.id)
    })
})

module.exports = {
    app,
    server
}
