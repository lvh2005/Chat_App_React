import { createSlice } from '@reduxjs/toolkit';

// Khởi tạo trạng thái ban đầu cho người dùng
const initialState = {
  _id: "",            // ID người dùng
  name: "",           // Tên người dùng
  email: "",          // Email người dùng
  profile_pic: "",    // URL ảnh đại diện của người dùng
  token: "",          // Token xác thực đăng nhập
  onlineUser: [],     // Danh sách người dùng đang online
  socketConnection: null // Đối tượng kết nối socket (ví dụ: Socket.io)
};

// Tạo slice cho người dùng với Redux Toolkit
export const userSlice = createSlice({
  name: 'user',         // Tên slice
  initialState,         // Trạng thái ban đầu
  reducers: {           // Các hàm reducer để cập nhật trạng thái
    // Cập nhật thông tin người dùng
    setUser: (state, action) => {
      state._id = action.payload._id;
      state.name = action.payload.name;
      state.email = action.payload.email;
      state.profile_pic = action.payload.profile_pic;
    },
    // Cập nhật token đăng nhập
    setToken: (state, action) => {
      state.token = action.payload;
    },
    // Đăng xuất: reset lại các thông tin người dùng và hủy kết nối socket
    logout: (state, action) => {
      state._id = "";
      state.name = "";
      state.email = "";
      state.profile_pic = "";
      state.token = "";
      state.socketConnection = null;
    },
    // Cập nhật danh sách người dùng đang online
    setOnlineUser: (state, action) => {
      state.onlineUser = action.payload;
    },
    // Cập nhật đối tượng kết nối socket
    setSocketConnection: (state, action) => {
      state.socketConnection = action.payload;
    }
  },
});

// Action creators tự động được tạo cho từng reducer
export const { setUser, setToken, logout, setOnlineUser, setSocketConnection } = userSlice.actions;

// Export reducer của slice để tích hợp vào Redux store
export default userSlice.reducer;
