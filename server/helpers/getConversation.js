const { ConversationModel } = require("../models/ConversationModel");

const getConversation = async (currentUserId) => {
    if (!currentUserId) return [];

    try {
        const currentUserConversations = await ConversationModel.find({
            "$or": [
                { sender: currentUserId },
                { receiver: currentUserId }
            ]
        })
        .sort({ updatedAt: -1 })
        .populate({
            path: 'messages',
            select: 'text seen msgByUserId imageUrl videoUrl createdAt',
            options: { sort: { createdAt: -1 }, limit: 1 } // Lấy tin nhắn cuối cùng
        })
        .populate({
            path: 'sender',
            select: 'name profile_pic'
        })
        .populate({
            path: 'receiver',
            select: 'name profile_pic'
        })
        .lean();

        const conversations = currentUserConversations.map((conv) => {
            const lastMsg = conv.messages?.[0] || null;
            const unseenMsgCount = conv.messages?.reduce((count, msg) => {
                const isMsgByOtherUser = msg.msgByUserId?.toString() !== currentUserId;
                return count + (!msg.seen && isMsgByOtherUser ? 1 : 0);
            }, 0) || 0;

            return {
                _id: conv._id,
                sender: conv.sender,
                receiver: conv.receiver,
                unseenMsg: unseenMsgCount,
                lastMsg
            };
        });

        return conversations;
    } catch (error) {
        console.error("Lỗi khi lấy danh sách cuộc trò chuyện:", error);
        return [];
    }
};

module.exports = getConversation;
