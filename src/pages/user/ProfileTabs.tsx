import { useEffect, useState, ChangeEvent } from "react";

import axios from "utils/axios";
// material-ui
import { useTheme } from "@mui/material/styles";
import {
  Box,
  CircularProgress,
  FormLabel,
  Grid,
  TextField,
  Stack,
  Typography,
} from "@mui/material";
import useAuth from "hooks/useAuth";

// project-imports
import MainCard from "components/MainCard";
import Avatar from "components/@extended/Avatar";
import ProfileTab from "./ProfileTab";

// assets
import { Camera } from "iconsax-react";

// types
import { ThemeMode } from "types/config";
import { useUser } from "./UserContext";

// const avatarImage = require.context('assets/images/users', true);

// ==============================|| USER PROFILE - TABS ||============================== //

interface Props {
  focusInput: () => void;
}

// interface UserData {
//   name: string;
//   _id: string;
//   designation:string;
// }
const ProfileTabs = ({ focusInput }: Props) => {
  const [loading, setLoading] = useState<boolean>(false);
  const theme = useTheme();
  const { userData, updateAvatar } = useUser();
  const [selectedImage, setSelectedImage] = useState<File | undefined>(
    undefined
  );
  // const [avatar, setAvatar] = useState<string | undefined>(avatarImage(`./default.jpg`));
  const { retrieveServiceToken } = useAuth();

  useEffect(() => {
    if (selectedImage) {
      const formData = new FormData();
      formData.append("avatar", selectedImage);
      if (userData?._id) {
        formData.append("id", userData._id);
      }
      const serviceToken = retrieveServiceToken();
      setLoading(true);
      axios
        .post(process.env.REACT_APP_API_URL + "/api/user/avatar", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${serviceToken}`,
          },
        })
        .then((response) => {
          const newAvatarUrl = URL.createObjectURL(selectedImage);
          console.log(newAvatarUrl);
          updateAvatar(newAvatarUrl);
          setSelectedImage(undefined); // Reset selectedImage to prevent loop
          setLoading(false);
        })
        .catch((error) => {
          console.log("Error in upload:", error);
          setLoading(false);
        });
    }
  }, [selectedImage, userData, retrieveServiceToken, updateAvatar]);

  return (
    <MainCard>
      <Grid container spacing={6}>
        <Grid item xs={12}>
          <Stack spacing={2.5} alignItems="center">
            <FormLabel
              htmlFor="change-avtar"
              sx={{
                position: "relative",
                borderRadius: "50%",
                overflow: "hidden",
                "&:hover .MuiBox-root": { opacity: 1 },
                ".MuiBox-root": { opacity: loading ? 1 : 0 },
                cursor: "pointer",
              }}
            >
              <Avatar
                alt="Avatar 1"
                src={userData?.avatar}
                sx={{ width: 124, height: 124, border: "1px dashed" }}
              />
              <Box
                sx={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  backgroundColor:
                    theme.palette.mode === ThemeMode.DARK
                      ? "rgba(255, 255, 255, .75)"
                      : "rgba(0,0,0,.65)",
                  width: "100%",
                  height: "100%",
                  opacity: 0,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Stack spacing={0.5} alignItems="center">
                  <>
                    {loading ? (
                      <CircularProgress color="secondary" />
                    ) : (
                      // chance.bool() - use for last send msg was read or unread
                      <>
                        <Camera
                          style={{
                            color: theme.palette.secondary.lighter,
                            fontSize: "2rem",
                          }}
                        />
                        <Typography sx={{ color: "secondary.lighter" }}>
                          Upload
                        </Typography>
                      </>
                    )}
                  </>
                </Stack>
              </Box>
            </FormLabel>

            <TextField
              type="file"
              id="change-avtar"
              placeholder="Outlined"
              variant="outlined"
              sx={{ display: "none" }}
              onChange={(e: ChangeEvent<HTMLInputElement>) =>
                setSelectedImage(e.target.files?.[0])
              }
            />
            {userData && (
              <Stack spacing={0.5} alignItems="center">
                <Typography variant="h5">{userData.name}</Typography>
                <Typography color="secondary">
                  {userData?.designation}
                </Typography>
              </Stack>
            )}
          </Stack>
        </Grid>
        <Grid item sm={3} sx={{ display: { sm: "block", md: "none" } }} />

        <Grid item xs={12}>
          <ProfileTab />
        </Grid>
      </Grid>
    </MainCard>
  );
};

export default ProfileTabs;
