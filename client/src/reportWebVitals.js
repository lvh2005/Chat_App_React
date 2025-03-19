// Hàm reportWebVitals để đo lường các chỉ số hiệu suất của ứng dụng
const reportWebVitals = (onPerfEntry) => {
  // Kiểm tra nếu onPerfEntry tồn tại và là một function
  if (onPerfEntry && onPerfEntry instanceof Function) {
    // Dynamic import để giảm kích thước gói ban đầu và chỉ tải khi cần
    import('web-vitals').then(({ getCLS, getFID, getFCP, getLCP, getTTFB }) => {
      // Đo lường và gửi các chỉ số hiệu suất thông qua hàm onPerfEntry
      getCLS(onPerfEntry);    // Đo lường Cumulative Layout Shift (sự thay đổi bố cục)
      getFID(onPerfEntry);    // Đo lường First Input Delay (độ trễ lần đầu người dùng tương tác)
      getFCP(onPerfEntry);    // Đo lường First Contentful Paint (thời gian nội dung đầu tiên được hiển thị)
      getLCP(onPerfEntry);    // Đo lường Largest Contentful Paint (thời gian phần tử nội dung lớn nhất được hiển thị)
      getTTFB(onPerfEntry);   // Đo lường Time to First Byte (thời gian trình duyệt nhận byte đầu tiên từ server)
    });
  }
};

// Xuất hàm để sử dụng ở nơi khác trong ứng dụng
export default reportWebVitals;
