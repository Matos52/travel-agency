import { Link, useLocation, useNavigate, useParams } from "react-router";
import { useUser } from "~/context/UserContext";
import { cn } from "~/lib/utils";

const RootNavbar = () => {
  const location = useLocation();
  const params = useParams();
  const { user, logout } = useUser();

  return (
    <nav
      className={cn(
        location.pathname === `/travel/${params.tripId}`
          ? "bg-white"
          : "glassmorphism",
        "w-full fixed z-50"
      )}
    >
      <header className="root-nav wrapper">
        <Link to="/" className="link-logo">
          <img
            src="/assets/icons/logo.svg"
            alt="logo"
            className="size-[30px]"
          />
          <h1>Tourvisto</h1>
        </Link>

        <aside>
          {user?.status === "ADMIN" && (
            <Link
              to="/dashboard"
              className={cn("text-base font-normal text-white", {
                "text-dark-100": location.pathname.startsWith("/travel"),
              })}
            >
              Admin Panel
            </Link>
          )}

          <img
            src={user?.imageUrl || "/assets/images/david.wepb"}
            alt="user"
            referrerPolicy="no-referrer"
          />

          <button onClick={logout} className="cursor-pointer">
            <img
              src="assets/icons/logout.svg"
              alt="logout"
              className="size-6 rotate-180"
            />
          </button>
        </aside>
      </header>
    </nav>
  );
};

export default RootNavbar;
