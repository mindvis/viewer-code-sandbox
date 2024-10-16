import { useState } from "react";
// import { Link } from 'react-router-dom';

// material-ui
import { useTheme } from "@mui/material/styles";
import {
  Stack,
  CardContent,
  ToggleButtonGroup,
  Divider,
  ToggleButton,
  Tooltip,
  Typography,
} from "@mui/material";
import { Copy, Code } from "iconsax-react";
// import { useParams } from "react-router";
// project-imports
import MainCard from "components/MainCard";
import SyntaxHighlight from "utils/SyntaxHighlight";
import { CopyToClipboard } from "react-copy-to-clipboard";
// import axios from "axios";
// import { facebookColor, linkedInColor } from 'config';

// assets
// import { Apple, Camera, Facebook, Google, More } from 'iconsax-react';
// import IconButton from 'components/@extended/IconButton';

// types
// import { ThemeMode } from 'types/config';

// const avatarImage = require.context('assets/images/users', true);

// ==============================|| USER PROFILE - TABS ||============================== //

interface Props {
  focusInput: () => void;
}

const ModelViewRight = ({ focusInput }: Props) => {
  // const { id } = useParams();
  const theme = useTheme();
  const [visible, setVisible] = useState(false);
  // const serviceToken = localStorage.getItem("serviceToken");
  // const [modelDescription, setModelDescription] = useState(null);

  const handleSourceCodeVisible = () => {
    setVisible(!visible);
  };
  const iframeEmbedCode =
    `<iframe src="` +
    process.env.REACT_APP_API_URL +
    `/3d-viewer/" frameborder="0" scrolling="yes"
  seamless="seamless" style="display:block; width:100%; height:100vh;"></iframe>`;
  const link = process.env.REACT_APP_API_URL + `/3d-viewer/`;
  // axios.get(process.env.REACT_APP_API_URL+'/api/model/fetch/'+id,{
  //   headers:{
  //     "Authorization": `Bearer ${serviceToken}`
  //   }
  // }).then(response => {
  //   if (!response || !response.data || !response.data.file) {
  //       console.error("Invalid response object or missing file URL");
  //       return;
  //   }
  //   const fileUrl = process.env.REACT_APP_UPLOADS+'response.data.file';
  //   if (!fileUrl) {
  //       console.error("Missing file URL");
  //       return;
  //   }
  //   // setModelDescription(response.data.description);
  // });

  return (
    <MainCard
      title="Share and embed 3D"
      border={false}
      shadow={theme.customShadows.z1}
      sx={{ height: "100%" }}
    >
      <CardContent>
        <Stack height={200} spacing={1.5} alignItems="center">
          {/* <img
            src={process.env.REACT_APP_UPLOADS + `/qrcodes/` + id + `.svg`}
            height="200"
          /> */}
        </Stack>
      </CardContent>
      <Divider />
      <ToggleButtonGroup
        fullWidth
        color="primary"
        exclusive
        aria-label="text alignment"
        size="small"
        sx={{
          p: 1,
          "& .MuiToggleButton-root": {
            borderRadius: 0,
            p: 0.75,
            "&:not(.Mui-selected)": {
              borderTopColor: "transparent",
              borderBottomColor: "transparent",
            },
            "&:first-of-type": {
              borderLeftColor: "transparent",
            },
            "&:last-of-type": {
              borderRightColor: "transparent",
            },
            "&:hover": {
              bgcolor: "transparent",
              color: theme.palette.primary.main,
            },
          },
        }}
      >
        <ToggleButton value="web" aria-label="web">
          <CopyToClipboard text={link}>
            <Tooltip title="Copy Link" aria-label="add">
              <Copy />
            </Tooltip>
          </CopyToClipboard>
        </ToggleButton>
        <ToggleButton value="android" aria-label="android">
          <CopyToClipboard text={iframeEmbedCode}>
            <Tooltip title="Copy Embed Code" aria-label="add">
              <Copy />
            </Tooltip>
          </CopyToClipboard>
        </ToggleButton>
        <ToggleButton value="ios" aria-label="ios">
          <Tooltip title="Show the source" aria-label="add">
            <Code onClick={handleSourceCodeVisible} />
          </Tooltip>
        </ToggleButton>
      </ToggleButtonGroup>
      <>
        {visible == true ? (
          <>
            <SyntaxHighlight>{iframeEmbedCode}</SyntaxHighlight>
          </>
        ) : (
          <></>
        )}
      </>
      <Typography
        variant="h6"
        sx={{ width: "auto", pl: 2, pr: 2, pt: 5 }}
      ></Typography>
    </MainCard>
  );
};

export default ModelViewRight;
