import { useNavigate } from "react-router";
import { useUser } from "~/context/UserContext";

const PageLayout = () => {
  const { logout } = useUser();
  const navigate = useNavigate();

  return (
    <div>
      <button onClick={logout} className="cursor-pointer">
        <img
          src="/assets/icons/logout.svg"
          alt="logout"
          className="size-6"
          referrerPolicy="no-referrer"
        />
      </button>

      <button onClick={() => navigate("/dashboard")}>
        Dashboard
      </button>
    </div>
  );
};

export default PageLayout;
