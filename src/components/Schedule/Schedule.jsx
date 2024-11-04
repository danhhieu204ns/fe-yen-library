import React from 'react';
import backgroundImage from 'src/assets/images/background.png'; // Đường dẫn đến ảnh nền

const HomeComponent = () => {
  return (
    <div
      className="min-h-screen flex flex-col justify-center items-center bg-cover"
      style={{ backgroundImage: `url(${backgroundImage})` }} // Thêm background
    >
      <h2 className="text-4xl font-bold text-white">Welcome to</h2>
      <p className="text-2xl text-white">SCHEDULE</p>
    </div>
  );
};

export default HomeComponent;