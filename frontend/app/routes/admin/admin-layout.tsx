import { Navigate, Outlet } from "react-router";
import { SidebarComponent } from "@syncfusion/ej2-react-navigations";
import { MobileSidebar, NavItems } from "components";
import { useUser } from "~/context/UserContext";
import.meta.env.VITE_BACKEND_URL;

const AdminLayout = () => {
  const { user, loading } = useUser();

  //user is loading
  if (loading) {
    return <div>Loading...</div>;
  }

  //user is not logged in
  if (!user) {
    return <Navigate to="/sign-in" replace />;
  }

  //user does not have rights to see dashboard page
  if(user.status !== 'USER') {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="admin-layout">
      <MobileSidebar />
      <aside className="w-full max-w-[270px] hidden lg:block">
        <SidebarComponent width={270} enableGestures={false}>
          <NavItems />
        </SidebarComponent>
      </aside>
      <aside className="children">
        <Outlet />
      </aside>
    </div>
  );
};

export default AdminLayout;
