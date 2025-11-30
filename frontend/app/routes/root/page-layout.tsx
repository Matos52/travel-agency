import RootNavbar from "components/RootNavbar";
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
    <div className="bg-light-200">
      <RootNavbar />
      <Outlet />
    </div>
  );
};

export default PageLayout;
