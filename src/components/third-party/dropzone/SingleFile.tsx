//@ts-nocheck
// material-ui
import { useState } from "react";
import { styled, useTheme } from "@mui/material/styles";
import { Box, Button, Stack } from "@mui/material";

// third-party
import { useDropzone } from "react-dropzone";

// project-imports
import RejectionFiles from "./RejectionFiles";
import PlaceholderContent from "./PlaceholderContent";

// types
import { CustomFile, UploadProps } from "types/dropzone";

import useAuth from "hooks/useAuth";
import axios from "axios";
import LinearWithLabel from "components/@extended/progress/LinearWithLabel";
const DropzoneWrapper = styled("div")(({ theme }) => ({
  outline: "none",
  overflow: "hidden",
  position: "relative",
  padding: theme.spacing(5, 1),
  borderRadius: theme.shape.borderRadius,
  transition: theme.transitions.create("padding"),
  backgroundColor: theme.palette.background.paper,
  border: `1px dashed ${theme.palette.secondary.main}`,
  "&:hover": { opacity: 0.72, cursor: "pointer" },
}));

// ==============================|| UPLOAD - SINGLE FILE ||============================== //

const SingleFileUpload = ({
  error,
  file,
  setFieldValue,
  setFilename,
  sx,
  fieldname,
  ...other
}: UploadProps) => {
  const theme = useTheme();
  const { retrieveServiceToken } = useAuth();
  const serviceToken = retrieveServiceToken();
  const [progress, setProgress] = useState(0);
  const {
    getRootProps,
    getInputProps,
    isDragActive,
    isDragReject,
    fileRejections,
  } = useDropzone({
    accept: {
      "glb/*": [],
      "fbx/*": [],
    },
    multiple: false,
    onDrop: (acceptedFiles: CustomFile[]) => {
      if (fieldname != undefined) {
        setFieldValue(
          fieldname,
          acceptedFiles.map((file) => file)
        );
      }

      const formData = new FormData();
      for (const file of acceptedFiles) {
        formData.append("s3d_file", file);
      }

      axios
        .post(process.env.REACT_APP_API_URL + "/api/model/upload", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${serviceToken}`,
          },
          onUploadProgress: (progressEvent) => {
            if (progressEvent.total != undefined) {
              const progress = Math.round(
                (progressEvent.loaded / progressEvent.total) * 100
              );
              setProgress(progress);
            }
          },
        })
        .then((response) => {
          if (setFilename) {
            setFilename(response.data.filename, null);
          }
        })
        .catch((error) => {
          console.log("Error in upload :", error);
        });
    },
  });

  const thumbs =
    file &&
    file.map((item: CustomFile) => (
      <img
        key={item.name}
        alt={item.name}
        src={item.preview}
        style={{
          top: 8,
          left: 8,
          borderRadius: 2,
          position: "absolute",
          width: "calc(100% - 16px)",
          height: "calc(100% - 16px)",
          background: theme.palette.background.paper,
        }}
        onLoad={() => {
          // URL.revokeObjectURL(item.preview!);
        }}
      />
    ));

  const onRemove = () => {
    if (fieldname != undefined) {
      setFieldValue(fieldname, null);
      setProgress(0);
    }
  };

  return (
    <Box sx={{ width: "100%", ...sx }}>
      <DropzoneWrapper
        {...getRootProps()}
        sx={{
          ...(isDragActive && { opacity: 0.72 }),
          ...((isDragReject || error) && {
            color: "error.main",
            borderColor: "error.light",
            bgcolor: "error.lighter",
          }),
          ...(file && {
            padding: "12% 0",
          }),
        }}
      >
        <input {...getInputProps()} />
        <PlaceholderContent />
        {thumbs}
      </DropzoneWrapper>

      {fileRejections.length > 0 && (
        <RejectionFiles fileRejections={fileRejections} />
      )}

      {file && file.length > 0 && (
        <Stack direction="row" justifyContent="flex-end" sx={{ mt: 1.5 }}>
          <Button variant="contained" color="error" onClick={onRemove}>
            Remove
          </Button>
        </Stack>
      )}
      <>
        {progress > 0 ? (
          <>
            <Stack sx={{ mt: 2.5 }}>
              <LinearWithLabel variant="determinate" value={progress} />
            </Stack>
          </>
        ) : (
          <></>
        )}
      </>
    </Box>
  );
};

export default SingleFileUpload;
