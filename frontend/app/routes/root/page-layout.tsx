import { SidebarComponent } from "@syncfusion/ej2-react-navigations";
import { MobileSidebar, NavItems } from "components";
import { Navigate, Outlet } from "react-router";
import { useUser } from "~/context/UserContext";

const PageLayout = () => {
  const { user, loading } = useUser();

  //user is loading
  if (loading) {
    return <div>Loading...</div>;
  }

  //user is not logged in
  if (!user) {
    return <Navigate to="/sign-in" replace />;
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

export default PageLayout;
