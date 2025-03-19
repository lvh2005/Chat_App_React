import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { RouterProvider } from 'react-router-dom';
import router from './rotues';
import { Provider } from 'react-redux';
import { store } from './redux/store';

// Khởi tạo root element cho ứng dụng React
const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <React.StrictMode>
    {/* Cung cấp Redux store cho toàn bộ ứng dụng */}
    <Provider store={store}>
      {/* Cung cấp router cho ứng dụng với React Router */}
      <RouterProvider router={router}>
        <App />
      </RouterProvider>
    </Provider>
  </React.StrictMode>
);

// Đo lường hiệu suất của ứng dụng (tùy chọn)
// Có thể ghi log hoặc gửi kết quả đến dịch vụ phân tích
reportWebVitals();
