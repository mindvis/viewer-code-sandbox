// material-ui
import {
  Box,
  Tooltip,
  Grid,
  Stack,
  CircularProgress,
  Typography
} from '@mui/material';

import IconButton from 'components/@extended/IconButton';
import { Edit, Trash } from 'iconsax-react';
// project-imports

import MainCard from 'components/MainCard';


// ==============================|| Model - CARD ||============================== //

const ModelCardSkeleton = ({}: {}) => {

  return (
    <>
      <MainCard sx={{ height: 1, '& .MuiCardContent-root': { height: 1, display: 'flex', flexDirection: 'column' } }}>
        <Grid id="print" container>
          <Grid item xs={12}  >
            <CircularProgress sx={{ mx: '8rem',my: '5rem' }} color="success" /> 
          </Grid>
          <Grid item xs={12}>
            
          </Grid>
        </Grid>
        <Stack
          direction="row"
          className="hideforPDf"
          alignItems="center"
          spacing={1}
          justifyContent="space-between"
          sx={{ mt: 'auto', mb: 0, pt: 2.25 }}
        >
          <Typography variant="caption" color="text.secondary">
          <Grid item xs={12} >
            <Box>
              <Box
                sx={{
                  
                  flexWrap: 'wrap',
                  listStyle: 'none',
                  p: 0.5,
                  m: 0
                }}
                component="ul"
              >
                  <Typography variant="h5"  sx={{ width: 'auto', pr: 0.75 }}> </Typography>
              </Box>
            </Box>
          </Grid>
          
          </Typography>
          <Box>
              <Tooltip title="Edit">
                <IconButton
                  color="primary"
                >
                  <Edit />
                </IconButton>
              </Tooltip>
              <Tooltip title="Delete">
                <IconButton
                  color="error"
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

export default ModelCardSkeleton;
