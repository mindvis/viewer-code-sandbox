import { useEffect } from "react";
// import { useNavigate } from "react-router";
// import axios from "utils/axios";

// material-ui
// import { useTheme } from "@mui/material/styles";
import { Box } from "@mui/material";

// project-imports
// import ProfileTab from "./ProfileTab";
// import SettingTab from "./SettingTab";
// import Avatar from "components/@extended/Avatar";
// import MainCard from "components/MainCard";
// import Transitions from "components/@extended/Transitions";
// import useAuth from "hooks/useAuth";
// import { useUser } from "../../../../../pages/user/UserContext";
// assets
// import { Profile } from "iconsax-react";

// types
// import { ThemeMode } from "types/config";

// types
// interface TabPanelProps {
//   children?: ReactNode;
//   dir?: string;
//   index: number;
//   value: number;
// }

// tab panel wrapper
// function TabPanel(props: TabPanelProps) {
//   const { children, value, index, ...other } = props;

//   return (
//     <Box
//       role="tabpanel"
//       hidden={value !== index}
//       id={`profile-tabpanel-${index}`}
//       aria-labelledby={`profile-tab-${index}`}
//       {...other}
//       sx={{ p: 1 }}
//     >
//       {value === index && children}
//     </Box>
//   );
// }

// function a11yProps(index: number) {
//   return {
//     id: `profile-tab-${index}`,
//     "aria-controls": `profile-tabpanel-${index}`,
//   };
// }
// const avatarImage = require.context('assets/images/users', true);

// ==============================|| HEADER CONTENT - PROFILE ||============================== //

const ProfilePage = () => {
  // const theme = useTheme();
  // const navigate = useNavigate();
  // const [userData, setUserData] = useState<UserData | null>(null);
  // const { userData, updateAvatar } = useUser();

  // const [avatar, setAvatar] = useState<string | undefined>(avatarImage(`./default.jpg`));

  // const { logout } = useAuth();
  // const handleLogout = async () => {
  //   try {
  //     await logout();
  //     navigate(`/login`, {
  //       state: {
  //         from: "",
  //       },
  //     });
  //   } catch (err) {
  //     console.error(err);
  //   }
  // };

  useEffect(() => {
    // const fetchData = async () => {
    //   try {
    //     const serviceToken = localStorage.getItem("serviceToken");
    //     const response = await axios.get(
    //       process.env.REACT_APP_API_URL + "/api/auth/profile",
    //       {
    //         headers: {
    //           Authorization: `Bearer ${serviceToken}`,
    //         },
    //       }
    //     );
    //     updateAvatar(response.data);
    //     // setAvatar( process.env.REACT_APP_UPLOADS+'avatar/'+response.data.avatar);
    //   } catch (error) {
    //     console.error("Error fetching model data:", error);
    //   }
    // };
    // fetchData();
  }, []);
  // const anchorRef = useRef<any>(null);
  // const [open, setOpen] = useState(false);
  // const handleToggle = () => {
  //   setOpen((prevOpen) => !prevOpen);
  // };

  // const handleClose = (event: MouseEvent | TouchEvent) => {
  //   if (anchorRef.current && anchorRef.current.contains(event.target)) {
  //     return;
  //   }
  //   setOpen(false);
  // };

  // const [value, setValue] = useState(0);

  // const handleChange = (event: SyntheticEvent, newValue: number) => {
  //   setValue(newValue);
  // };

  return <Box sx={{ flexShrink: 0, ml: 0.75 }}></Box>;
};

export default ProfilePage;
