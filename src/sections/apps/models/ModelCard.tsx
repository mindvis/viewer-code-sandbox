import { useState, MouseEvent } from "react";
import { useNavigate } from "react-router-dom";
// material-ui
import {
  Box,
  Tooltip,
  Fade,
  Grid,
  Menu,
  MenuItem,
  Stack,
  CardMedia,
  Typography,
} from "@mui/material";

import IconButton from "components/@extended/IconButton";
import { Edit, Trash } from "iconsax-react";
// project-imports

import MainCard from "components/MainCard";

// types
// import { UserCardProps } from 'types/user-profile';
import { ThreeDModelsProps } from "types/threed-models";

//const backImage = require.context('./assets/images/profile/', true);
const backImageURL = process.env.REACT_APP_UPLOADS;

// const backImage= backImagePath(`./profile-back-1.png`);

// ==============================|| Model - CARD ||============================== //

const ModelCard = ({
  model,
  deleteModelAndUpdateList,
}: {
  model: ThreeDModelsProps;
  deleteModelAndUpdateList: (id: string) => void;
}) => {
  // const [open, setOpen] = useState(false);

  // const handleClickOpen = () => {
  //   setOpen(true);
  // };
  const navigate = useNavigate();

  const [openAlert, setOpenAlert] = useState(false);

  const handleAlertClose = () => {
    setOpenAlert(!openAlert);
    handleMenuClose();
  };

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const openMenu = Boolean(anchorEl);

  const handleMenuClose = () => {
    setAnchorEl(null);
  };
  const [add, setAdd] = useState<boolean>(false);
  const handleAdd = () => {
    setAdd(!add);
  };

  const handleClick = (event: MouseEvent<HTMLDivElement>, id: string) => {
    console.log("/3d-models/view/" + id);

    navigate("/3d-models/view/" + id);
  };

  // const deleteModel = (id: string) => {
  //   const serviceToken = localStorage.getItem('serviceToken');
  //   axios.delete(process.env.REACT_APP_API_URL+'/api/model/delete/'+id,{
  //     headers:{
  //       "Authorization": `Bearer ${serviceToken}`
  //     }
  //   }).then(response => {
  //     console.log("==============================",response.data.status);

  //   });

  // };

  const deleteModel = (id: string) => {
    // Call parent function to delete model and update list
    deleteModelAndUpdateList(id);
  };

  return (
    <>
      <MainCard
        sx={{
          height: 1,
          "& .MuiCardContent-root": {
            height: 1,
            display: "flex",
            flexDirection: "column",
          },
        }}
      >
        <Grid
          id="print"
          container
          onClick={(event: MouseEvent<HTMLDivElement>) =>
            handleClick(event, model._id)
          }
        >
          <Grid item xs={12}>
            <Menu
              id="fade-menu"
              MenuListProps={{
                "aria-labelledby": "fade-button",
              }}
              anchorEl={anchorEl}
              open={openMenu}
              onClose={handleMenuClose}
              TransitionComponent={Fade}
              anchorOrigin={{
                vertical: "bottom",
                horizontal: "right",
              }}
              transformOrigin={{
                vertical: "top",
                horizontal: "right",
              }}
            >
              <MenuItem onClick={handleAdd}>Edit</MenuItem>
              <MenuItem onClick={handleAlertClose}>Delete</MenuItem>
            </Menu>
          </Grid>
          <Grid item xs={12}>
            <CardMedia
              component="img"
              image={backImageURL + model.thumbnail}
              sx={{
                width: "100%",
                borderRadius: 1,
                cursor: "pointer",
                maxHeight: "252px",
              }}
              title="Slider5 image"
            />
          </Grid>
        </Grid>
        <Stack
          direction="row"
          className="hideforPDf"
          alignItems="center"
          spacing={1}
          justifyContent="space-between"
          sx={{ mt: "auto", mb: 0, pt: 2.25 }}
        >
          <Typography variant="caption" color="text.secondary">
            <Grid item xs={12}>
              <Box>
                <Box
                  sx={{
                    flexWrap: "wrap",
                    listStyle: "none",
                    p: 0.5,
                    m: 0,
                  }}
                  component="ul"
                >
                  {/* {model.tags.map((tag: string, index: number) => (
                  <ListItem disablePadding key={index} sx={{ width: 'auto', pr: 0.75, pb: 0.75 }}>
                    #{tag}
                  </ListItem>
                ))} */}

                  <Typography variant="h5" sx={{ width: "auto", pr: 0.75 }}>
                    {" "}
                    {model.name}{" "}
                  </Typography>
                </Box>
              </Box>
            </Grid>
          </Typography>
          <Box>
            <Tooltip title="Edit">
              <IconButton
                color="primary"
                onClick={() => navigate("/3d-models/edit/" + model._id)}
              >
                <Edit />
              </IconButton>
            </Tooltip>
            <Tooltip title="Delete">
              <IconButton
                color="error"
                onClick={(e: MouseEvent<HTMLButtonElement>) => {
                  deleteModel(model._id);
                  e.stopPropagation();
                }}
              >
                <Trash />
              </IconButton>
            </Tooltip>
          </Box>
        </Stack>
      </MainCard>
    </>
  );
};

export default ModelCard;
