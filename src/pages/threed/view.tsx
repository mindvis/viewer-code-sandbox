import { useEffect, useRef, useState } from 'react';

// material-ui
import { Grid, CardMedia  } from '@mui/material';


// project-imports
// import ModelViewLeft from 'sections/cards/models/ModelViewLeft';
import ModelViewRight from 'sections/cards/models/ModelViewRight';

const mediaSX = {
  width: "100%",
  height: "100%",
  border: "none",
};

// ==============================|| PROFILE - USER ||============================== //

const ThreeDModelView = () => {
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [containerSize, setContainerSize] = useState<{ width: number; height: number } | null>(null);
 
  useEffect(() => {
    if (containerRef.current) {
        console.log(containerRef.current.offsetWidth, containerRef.current.offsetHeight);
	const { offsetWidth, offsetHeight } = containerRef.current;
        setContainerSize({ width: offsetWidth, height: offsetHeight });
    }
  }, [containerRef]);


  const focusInput = () => {
    inputRef.current?.focus();
  };

  const link = process.env.REACT_APP_API_URL + `/left-viewer/`;
  return (
    <Grid container spacing={3}>
      <Grid item xs={12} md={8} style={{ minHeight: "50vh" }}>
        <CardMedia component="iframe" src={link} sx={mediaSX} />
      </Grid>
      <Grid item xs={12} md={4}>
        <ModelViewRight focusInput={focusInput} />
      </Grid>
    </Grid>
  );
};

export default ThreeDModelView;
