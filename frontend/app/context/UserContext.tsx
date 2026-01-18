import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
} from "react";
import axios from "axios";
import { useNavigate } from "react-router";

interface UserContextType {
  user: CreatedUser | null;
  setUser: (user: CreatedUser | null) => void;
  logout: () => Promise<void>;
  users: CreatedUser[];
  fetchUsers: (pageIndex: number, pageSize: number) => Promise<void>;
  pageIndex: number;
  pageSize: number;
  setPageIndex: React.Dispatch<React.SetStateAction<number>>;
  setPageSize: React.Dispatch<React.SetStateAction<number>>;
  totalElements: number;
  loading: boolean;
}

export const UserContext = createContext<UserContextType | undefined>(
  undefined
);

export const UserProvider = ({ children }: { children: React.ReactNode }) => {
  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  const navigate = useNavigate();

  const [user, setUser] = useState<CreatedUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState<CreatedUser[]>([]);
  const [pageIndex, setPageIndex] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [totalElements, setTotalElements] = useState(0);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const { data } = await axios.get(`${backendUrl}/users/me`, {
          withCredentials: true,
        });
        setUser(data);
      } catch (error) {
        console.log("Failed to fetch user", error);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  const fetchUsers = useCallback(
    async (pageIndex: number, pageSize: number) => {
      try {
        const { data } = await axios.get(`${backendUrl}/users`, {
          params: { pageIndex, pageSize },
          withCredentials: true,
        });
        setUsers(data.content);
        setTotalElements(data.totalElements);
      } catch (error) {
        console.error("Failed to fetch users", error);
      }
    },
    [backendUrl]
  );

  const logout = async () => {
    try {
      await axios.post(
        `${backendUrl}/auth/logout`,
        {},
        { withCredentials: true }
      );
      setUser(null);
      navigate("/sign-in", { replace: true });
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <UserContext.Provider
      value={{
        user,
        setUser,
        users,
        fetchUsers,
        logout,
        pageIndex,
        pageSize,
        setPageIndex,
        setPageSize,
        totalElements,
        loading,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const ctx = useContext(UserContext);
  if (!ctx) throw new Error("useUser must be used inside UserProvider");
  return ctx;
};
