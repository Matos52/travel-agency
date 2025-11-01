import { Outlet } from "react-router";
import { SidebarComponent } from "@syncfusion/ej2-react-navigations";
import { MobileSidebar, NavItems } from "components";
import { UserProvider } from "~/context/UserContext";

const adminLayout = () => {
  return (
    <UserProvider>
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
    </UserProvider>
  );
};

export default adminLayout;
