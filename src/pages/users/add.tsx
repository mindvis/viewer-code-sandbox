// material-ui
import { dispatch } from 'store';
import { useOutletContext } from 'react-router';

import MainCard from 'components/MainCard';
import useAuth from 'hooks/useAuth';

import {
  // createFilterOptions,  
  Grid,
  InputLabel,
  Stack,
  TextField,
  InputAdornment,
  Button,
  MenuItem,
  Select,
  OutlinedInput,
  FormHelperText,
  Box
} from '@mui/material';
// import MainCard from 'components/MainCard';
// import UploadSingleFile from 'components/third-party/dropzone/SingleFile';
import { Formik } from 'formik';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import IconButton from 'components/@extended/IconButton';

// import useAuth from 'hooks/useAuth';
// import TagInput from 'components/TagInput';
// import useScriptRef from 'hooks/useScriptRef';
import { openSnackbar } from 'store/reducers/snackbar';
// import { Add } from 'iconsax-react';
import { useState, SyntheticEvent } from "react";
import { RefObject } from 'react';
import { Eye, EyeSlash } from 'iconsax-react';
import { useNavigate } from "react-router-dom";


function useInputRef() {
  return useOutletContext<RefObject<HTMLInputElement>>();
}
// ==============================|| LAYOUTS -  COLUMNS ||============================== //

// const filterSkills = createFilterOptions<string>();
// const skills = [''];
const ThreeDModelAdd = ({ forgot }: { forgot?: string }) => {
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const handleClickShowNewPassword = () => {
    setShowNewPassword(!showNewPassword);
  };
  const handleClickShowConfirmPassword = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };
  const handleMouseDownPassword = (event: SyntheticEvent) => {
    event.preventDefault();
  };

  const {  createUser } = useAuth();
  // const [userData, setUserData] = useState<UserData | null>(null);
  const navigate = useNavigate();
  const inputRef = useInputRef();
  // const [getFilename, setFilenameFromComponent] = useState("");
  // const [getThumbnail, setThumbnailFromComponent] = useState("");
  // function handleFilename(data:string) {
  //   setFilenameFromComponent(data);
  // }
  //  function handleThumbnail(data:string) {
  //   setThumbnailFromComponent(data);
  // }

  const validationSchema = Yup.object({
    skills: Yup
    .array()
    .of(
      Yup
        .string()
        .trim()
    )
    .required('Atleast 1 tag is required')
    .min(1, 'Atleast 1 tag is required')
  });
  

  const formik = useFormik({
    initialValues: {
      skills: []
    },
    validationSchema,
    onSubmit: (values) => {
      dispatch(
        openSnackbar({
          open: true,
          message: 'Autocomplete - Submit Success',
          variant: 'alert',
          anchorOrigin: { vertical: 'top', horizontal: 'right' },
          alert: {
            color: 'success'
          },
          close: true
        })
      );
    }
  });
  // const scriptedRef = useScriptRef();
  // const {  addModel } = useAuth();
  // let TagsError: boolean | string | undefined = false;
  if (formik.touched.skills && typeof formik.errors.skills) {
    if (formik.touched.skills && typeof formik.errors.skills === 'string') {
      // TagsError = formik.errors.skills;
    } else {
      formik.errors.skills &&
        typeof formik.errors.skills !== 'string' &&
        formik.errors.skills.map((item) => {
          // @ts-ignore
          if (typeof item === 'object') TagsError = item.label;
          return item;
        });
    }
  }


  return (
    <MainCard content={false} title="Add New User" sx={{ '& .MuiInputLabel-root': { fontSize: '0.875rem' } }}>
<Box sx={{ p: 2.5 }}>
    <Grid container spacing={3}>
    <Formik
        initialValues={{
          name: "",
          email: "",
          phone_ext: "",
          phone: "",
          designation: "",
          role: 'Author',
          password: '',
          confirm: '',
          submit:null
        }}
        validationSchema={Yup.object().shape({
          name: Yup.string().max(255).required('Name is required.'),
          email: Yup.string().email('Invalid email address.').max(255).required('Email is required.'),
          phone: Yup.number()
            .test('len', 'phone should be exactly 10 digit', (val) => val?.toString().length === 10)
            .required('Phone number is required'),
          designation: Yup.string().required('Designation is required'),
          role: Yup.string().required('Role is required'),
          password: Yup.string()
          .required('New Password is required')
          .matches(
            /^.*(?=.{8,})((?=.*[!@#$%^&*()\-_=+{};:,<.>]){1})(?=.*\d)((?=.*[a-z]){1})((?=.*[A-Z]){1}).*$/,
            'Password must contain at least 8 characters, one uppercase, one number and one special case character'
          ),
        confirm: Yup.string()
          .required('Confirm Password is required')
          .test('confirm', `Passwords don't match.`, (confirm: string, Yup: any) => Yup.parent.password === confirm)
        })}
          onSubmit={async (values, { setErrors, setStatus, setSubmitting }) => {
          try {
            console.log(values);
            
            await createUser(values.name, values.email, values.designation, values.phone, values.phone_ext, values.role, values.password, values.confirm);       
            dispatch(
              openSnackbar({
                open: true,
                message: 'User created successfully.',
                variant: 'alert',
                anchorOrigin: { vertical: 'top', horizontal: 'right' },
                alert: {
                  color: 'success'
                },
                close: true
              })
            );
            setStatus({ success: false });
            setSubmitting(false);
            navigate("/users/list");
          } catch (err: any) {
            setStatus({ success: false });
            console.log(err.error);
            dispatch(
              openSnackbar({
                open: true,
                message: err.error,
                variant: 'alert',
                anchorOrigin: { vertical: 'top', horizontal: 'right' },
                alert: {
                  color: 'error'
                },
                close: true
              })
            );
            
            setErrors({ submit: err.error });
            setSubmitting(false);
          }
        }}
      >
        {({ errors, handleBlur, handleChange, handleSubmit, isSubmitting, setFieldValue, touched, values }) => (
          <form onSubmit={handleSubmit}>
              <Grid item xs={12}>
              <Box sx={{ p: 2.5 }}>
              <Grid container spacing={3}>
                <Grid item xs={12} sm={6}>
                  <Stack spacing={1.25}>
                    <InputLabel htmlFor="user-first-name">Name</InputLabel>
                    <TextField
                      fullWidth
                      id="user-first-name"
                      value={values.name}
                      name="name"
                      onBlur={handleBlur}
                      onChange={handleChange}
                      placeholder="Name"
                      autoFocus
                      inputRef={inputRef}
                    />
                    {touched.name && errors.name && (
                      <FormHelperText error id="user-first-name-helper">
                        {errors.name}
                      </FormHelperText>
                    )}
                  </Stack>
                </Grid>
              
                <Grid item xs={12} sm={6}>
                  <Stack spacing={1.25}>
                    <InputLabel htmlFor="user-email">Email Address</InputLabel>
                    <TextField
                      type="email"
                      fullWidth
                      value={values.email}
                      name="email"
                      onBlur={handleBlur}
                      onChange={handleChange}
                      id="user-email"
                      placeholder="Email Address"
                    />
                    {touched.email && errors.email && (
                      <FormHelperText error id="user-email-helper">
                        {errors.email}
                      </FormHelperText>
                    )}
                  </Stack>
                </Grid>

                <Grid item xs={12} sm={6}>
                  <Stack spacing={1.25}>
                    <InputLabel htmlFor="user-phone">Phone Number</InputLabel>
                    <Stack direction="row" justifyContent="space-between" alignItems="center" spacing={2}>
                      <Select value={values.phone_ext} name="phone_ext" onBlur={handleBlur} onChange={handleChange}>
                        <MenuItem value="+91">+91</MenuItem>
                        <MenuItem value="1-671">1-671</MenuItem>
                        <MenuItem value="+36">+36</MenuItem>
                        <MenuItem value="(225)">(255)</MenuItem>
                        <MenuItem value="+39">+39</MenuItem>
                        <MenuItem value="1-876">1-876</MenuItem>
                        <MenuItem value="+7">+7</MenuItem>
                        <MenuItem value="(254)">(254)</MenuItem>
                        <MenuItem value="(373)">(373)</MenuItem>
                        <MenuItem value="1-664">1-664</MenuItem>
                        <MenuItem value="+95">+95</MenuItem>
                        <MenuItem value="(264)">(264)</MenuItem>
                      </Select>
                      <TextField
                        fullWidth
                        id="user-phone"
                        value={values.phone}
                        name="phone"
                        onBlur={handleBlur}
                        onChange={handleChange}
                        placeholder="Phone Number"
                      />
                    </Stack>
                    {touched.phone && errors.phone && (
                      <FormHelperText error id="user-phone-helper">
                        {errors.phone}
                      </FormHelperText>
                    )}
                  </Stack>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Stack spacing={1.25}>
                    <InputLabel htmlFor="user-designation">Designation</InputLabel>
                    <TextField
                      fullWidth
                      id="user-designation"
                      value={values.designation}
                      name="designation"
                      onBlur={handleBlur}
                      onChange={handleChange}
                      placeholder="Designation"
                    />
                    {touched.designation && errors.designation && (
                      <FormHelperText error id="user-designation-helper">
                        {errors.designation}
                      </FormHelperText>
                    )}
                  </Stack>
                </Grid>
                <Grid item xs={12} sm={12}>
                  <Stack spacing={1.25}>
                    <InputLabel htmlFor="user-phone">Role</InputLabel>
                    <Select value={values.role} name="role" placeholder='Select Role' onBlur={handleBlur} onChange={handleChange}>
                        <MenuItem value="Author">Author</MenuItem>
                        <MenuItem value="Admin">Admin</MenuItem>
                      </Select>
                    {touched.role && errors.role && (
                      <FormHelperText error id="user-phone-helper">
                        {errors.role}
                      </FormHelperText>
                    )}
                  </Stack>
                </Grid>

                <Grid item xs={12}>
                  <Stack spacing={1.25}>
                    <InputLabel htmlFor="password-password">Password</InputLabel>
                    <OutlinedInput
                      placeholder="Enter New Password"
                      id="password-password"
                      type={showNewPassword ? 'text' : 'password'}
                      value={values.password}
                      name="password"
                      onBlur={handleBlur}
                      onChange={handleChange}
                      endAdornment={
                        <InputAdornment position="end">
                          <IconButton
                            aria-label="toggle password visibility"
                            onClick={handleClickShowNewPassword}
                            onMouseDown={handleMouseDownPassword}
                            edge="end"
                            size="large"
                            color="secondary"
                          >
                            {showNewPassword ? <Eye /> : <EyeSlash />}
                          </IconButton>
                        </InputAdornment>
                      }
                      autoComplete="password-password"
                    />
                    {touched.password && errors.password && (
                      <FormHelperText error id="password-password-helper">
                        {errors.password}
                      </FormHelperText>
                    )}
                  </Stack>
                </Grid>
                <Grid item xs={12}>
                  <Stack spacing={1.25}>
                    <InputLabel htmlFor="password-confirm">Confirm Password</InputLabel>
                    <OutlinedInput
                      placeholder="Enter Confirm Password"
                      id="password-confirm"
                      type={showConfirmPassword ? 'text' : 'password'}
                      value={values.confirm}
                      name="confirm"
                      onBlur={handleBlur}
                      onChange={handleChange}
                      endAdornment={
                        <InputAdornment position="end">
                          <IconButton
                            aria-label="toggle password visibility"
                            onClick={handleClickShowConfirmPassword}
                            onMouseDown={handleMouseDownPassword}
                            edge="end"
                            size="large"
                            color="secondary"
                          >
                            {showConfirmPassword ? <Eye /> : <EyeSlash />}
                          </IconButton>
                        </InputAdornment>
                      }
                      autoComplete="password-confirm"
                    />
                    {touched.confirm && errors.confirm && (
                      <FormHelperText error id="password-confirm-helper">
                        {errors.confirm}
                      </FormHelperText>
                    )}
                  </Stack>
                </Grid>
              </Grid>
            </Box>
              </Grid>
              <Box sx={{ p: 2.5 }}>
              <Stack direction="row" justifyContent="flex-start" alignItems="center" spacing={2} sx={{ mt: 2.5 }}>
                <Button variant="outlined" color="secondary">
                  Cancel
                </Button>
                <Button disabled={isSubmitting || Object.keys(errors).length !== 0} type="submit" variant="contained">
                  Save 
                </Button>
              </Stack>
            </Box>
              </form>
              )}
            </Formik>
    </Grid>
    </Box>
    </MainCard>

  );
}

export default ThreeDModelAdd;
