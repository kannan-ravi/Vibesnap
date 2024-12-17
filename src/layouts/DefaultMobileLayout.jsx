import { Outlet } from "react-router-dom";

const DefaultMobileLayout = () => {
  return (
    <div className="max-w-md mx-auto">
      <Outlet />
    </div>
  );
};

export default DefaultMobileLayout;
