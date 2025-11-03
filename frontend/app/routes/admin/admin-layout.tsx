import { Navigate, Outlet } from "react-router";
import { SidebarComponent } from "@syncfusion/ej2-react-navigations";
import { MobileSidebar, NavItems } from "components";
import { useUser } from "~/context/UserContext";
import.meta.env.VITE_BACKEND_URL;

const AdminLayout = () => {
  const { user } = useUser();

  if (user === undefined) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return <Navigate to="/sign-in" replace />;
  }

  return (
    <div className="admin-layout">
      <MobileSidebar />
      <aside className="w-full max-w-[270px] hidden lg:block">
        <SidebarComponent width={270} enableGestures={false}>
          <NavItems user={user} />
        </SidebarComponent>
      </aside>
      <aside className="children">
        <Outlet context={{ user }} />
      </aside>
    </div>
  );
};

export default AdminLayout;
