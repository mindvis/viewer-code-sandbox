import React, {
  createContext,
  useState,
  useContext,
  ReactNode,
  useCallback,
} from "react";
// import axios from "utils/axios";

interface UserData {
  name: string;
  _id?: string;
  designation: string;
  avatar?: string;
  role?: string;
  [key: string]: any;
}

interface UserContextProps {
  userData: UserData | null;
  setUserData: React.Dispatch<React.SetStateAction<UserData | null>>;
  updateAvatar: (avatar: string) => void;
}

const UserContext = createContext<UserContextProps | undefined>(undefined);

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [userData, setUserData] = useState<UserData | null>(null);

  const updateAvatar = useCallback((avatar: string | { avatar: string }) => {
    let avatarUrl: string;
    if (typeof avatar === "object" && avatar !== null) {
      avatarUrl = process.env.REACT_APP_UPLOADS + "avatar/" + avatar.avatar;
    } else {
      avatarUrl = avatar;
    }

    setUserData((prevData) =>
      prevData ? { ...prevData, avatar: avatarUrl } : null
    );
  }, []);

  // useEffect(() => {
  //   const fetchData = async () => {
  //     try {
  //       const serviceToken = localStorage.getItem("serviceToken");
  //       const response = await axios.get(
  //         process.env.REACT_APP_API_URL + "/api/auth/profile",
  //         {
  //           headers: {
  //             Authorization: `Bearer ${serviceToken}`,
  //           },
  //         }
  //       );
  //       console.log(response.data);
  //       setUserData(response.data);
  //     } catch (error) {
  //       console.error("Error fetching model data:", error);
  //     }
  //   };

  //   fetchData();
  // }, []);

  return (
    <UserContext.Provider value={{ userData, setUserData, updateAvatar }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
};
