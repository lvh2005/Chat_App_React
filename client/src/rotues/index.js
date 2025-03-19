import { createBrowserRouter } from "react-router-dom";
import App from "../App";
import RegisterPage from "../pages/RegisterPage";
import CheckEmailPage from "../pages/CheckEmailPage";
import CheckPasswordPage from "../pages/CheckPasswordPage";
import Home from "../pages/Home";
import MessagePage from "../components/MessagePage";
import AuthLayouts from "../layout";
import Forgotpassword from "../pages/Forgotpassword";

// Định nghĩa router sử dụng createBrowserRouter của React Router v6
const router = createBrowserRouter([
  {
    // Route gốc
    path: "/",
    element: <App />,
    children: [
      {
        // Trang đăng ký
        path: "register",
        element: (
          <AuthLayouts>
            <RegisterPage />
          </AuthLayouts>
        ),
      },
      {
        // Trang nhập email (để đăng nhập hoặc quên mật khẩu)
        path: "email",
        element: (
          <AuthLayouts>
            <CheckEmailPage />
          </AuthLayouts>
        ),
      },
      {
        // Trang nhập mật khẩu
        path: "password",
        element: (
          <AuthLayouts>
            <CheckPasswordPage />
          </AuthLayouts>
        ),
      },
      {
        // Trang quên mật khẩu
        path: "forgot-password",
        element: (
          <AuthLayouts>
            <Forgotpassword />
          </AuthLayouts>
        ),
      },
      {
        // Trang chủ của ứng dụng (hiển thị danh sách cuộc trò chuyện, sidebar, v.v.)
        path: "",
        element: <Home />,
        children: [
          {
            // Trang tin nhắn, theo ID người dùng được chọn
            path: ":userId",
            element: <MessagePage />,
          },
        ],
      },
    ],
  },
]);

export default router;
