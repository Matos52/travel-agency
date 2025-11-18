import { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router";

interface UserContextType {
  user: CreatedUser | null | undefined;
  setUser: (user: CreatedUser | null) => void;
  logout: () => Promise<void>;
  users: CreatedUser[];
  fetchUsers: (pageIndex: number, pageSize: number) => Promise<void>;
  pageIndex: number;
  pageSize: number;
  setPageIndex: React.Dispatch<React.SetStateAction<number>>;
  setPageSize: React.Dispatch<React.SetStateAction<number>>;
  totalElements: number;
}

export const UserContext = createContext<UserContextType | undefined>(
  undefined
);

export const UserProvider = ({ children }: { children: React.ReactNode }) => {
  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  const navigate = useNavigate();
  const [user, setUser] = useState<CreatedUser | null>(null);
  const [users, setUsers] = useState<CreatedUser[]>([]);
  const [pageIndex, setPageIndex] = useState(0);
  const [pageSize, setPageSize] = useState(5);
  const [totalElements, setTotalElements] = useState(0);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const { data } = await axios.get(`${backendUrl}/getUser`, {
          withCredentials: true,
        });
        setUser(data);
      } catch (error) {
        console.log("Failed to fetch user", error);
        setUser(null);
      }
    };

    fetchUser();
  }, []);

  const fetchUsers = async (pageIndex: number, pageSize: number) => {
    try {
      const { data } = await axios.get(`${backendUrl}/getUsers`, {
        params: { pageIndex, pageSize },
        withCredentials: true,
      });
      console.log(data);
      setUsers(data.content);
      setTotalElements(data.totalElements);
    } catch (error) {
      console.error("Failed to fetch users", error);
    }
  };

  const logout = async () => {
    try {
      console.log("logout");
      const data = await axios.post(
        `${backendUrl}/userLogout`,
        {},
        { withCredentials: true }
      );
      console.log(data);
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
