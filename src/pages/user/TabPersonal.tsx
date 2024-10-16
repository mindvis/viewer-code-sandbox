// import { RefObject } from "react";
// import { useOutletContext } from "react-router";
import MainCard from "components/MainCard";
// import { useUser } from "./UserContext";
// assets

// function useInputRef() {
//   return useOutletContext<RefObject<HTMLInputElement>>();
// }

// ==============================|| USER PROFILE - PERSONAL ||============================== //

const TabPersonal = () => {
  // interface UserData {
  //   name: string;
  //   email: string;
  //   designation: string;
  //   phone_ext: string;
  // phone: string;

  // Add other properties here
  // }
  // const [user, setUser] = useState<UserData | null>(null);
  const maxDate = new Date();
  maxDate.setFullYear(maxDate.getFullYear() - 18);
  // const inputRef = useInputRef();
  // const { updateUser } = useAuth();
  // const { userData, setUserData } = useUser();
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
  //       setUser(response.data);
  //     } catch (error) {
  //       console.error("Error fetching model data:", error);
  //     }
  //   };

  //   fetchData();
  // }, []);

  return (
    <MainCard
      content={false}
      title="Personal Information"
      sx={{ "& .MuiInputLabel-root": { fontSize: "0.875rem" } }}
    ></MainCard>
  );
};

export default TabPersonal;
