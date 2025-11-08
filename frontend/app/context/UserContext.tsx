import { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router";

interface UserContextType {
  user: CreatedUser | null | undefined;
  setUser: (user: CreatedUser | null) => void;
  logout: () => Promise<void>;
}

export const UserContext = createContext<UserContextType | undefined>(
  undefined
);

export const UserProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<CreatedUser | null | undefined>();
  const navigate = useNavigate();
  const backendUrl = import.meta.env.VITE_BACKEND_URL;

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

  const logout = async () => {
    try {
      console.log("logout")
      const data = await axios.post(`${backendUrl}/userLogout`, {}, { withCredentials: true });
      console.log(data);
      setUser(null);
      navigate("/sign-in", { replace: true });
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <UserContext.Provider value={{ user, setUser, logout }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const ctx = useContext(UserContext);
  if (!ctx) throw new Error("useUser must be used inside UserProvider");
  return ctx;
};
