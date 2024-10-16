import { useState, useMemo, MouseEvent } from "react";
import { useNavigate } from "react-router-dom";
import { Link as RouterLink } from "react-router-dom";
// material-ui
import {
  Box,
  Button,
  Chip,
  Tooltip,
  Grid,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from "@mui/material";
import AlertItemDelete from "sections/apps/kanban/Board/AlertItemDelete";

// third-party
import IconButton from "components/@extended/IconButton";
import {
  useTable,
  useFilters,
  usePagination,
  Column,
  HeaderGroup,
  Row,
  Cell,
} from "react-table";

// project-imports
// import makeData from 'data/react-table';
import MainCard from "components/MainCard";
import ScrollX from "components/ScrollX";
import { dispatch } from "store";
import { openSnackbar } from "store/reducers/snackbar";
import { Edit, Trash } from "iconsax-react";

import { TablePagination } from "components/third-party/ReactTable";
import axios from "utils/axios";
// ==============================|| REACT TABLE ||============================== //

import { Add } from "iconsax-react";
interface UserData {
  name: string;
  email: string;
  phone: string;
  designation: string;
  role: string;
  _id: string;
}

function ReactTable({
  columns,
  data,
  top,
}: {
  columns: Column[];
  data: UserData[];
  top?: boolean;
}) {
  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    page,
    prepareRow,
    gotoPage,
    setPageSize,
    state: { pageIndex, pageSize },
  } = useTable(
    {
      columns,
      data,
      initialState: { pageIndex: 0, pageSize: 10 },
    },
    useFilters,
    usePagination
  );

  return (
    <Stack>
      {top && (
        <Box sx={{ p: 2 }}>
          <TablePagination
            gotoPage={gotoPage}
            rows={rows}
            setPageSize={setPageSize}
            pageIndex={pageIndex}
            pageSize={pageSize}
          />
        </Box>
      )}

      <Table {...getTableProps()}>
        <TableHead sx={{ borderTopWidth: top ? 2 : 1 }}>
          {headerGroups.map((headerGroup) => (
            <TableRow {...headerGroup.getHeaderGroupProps()}>
              {headerGroup.headers.map((column: HeaderGroup) => (
                <TableCell
                  {...column.getHeaderProps([{ className: column.className }])}
                >
                  {column.render("Header")}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableHead>
        <TableBody {...getTableBodyProps()}>
          {page.map((row: Row) => {
            prepareRow(row);
            return (
              <TableRow {...row.getRowProps()}>
                {row.cells.map((cell: Cell) => (
                  <TableCell
                    {...cell.getCellProps([
                      { className: cell.column.className },
                    ])}
                  >
                    {cell.render("Cell")}
                  </TableCell>
                ))}
              </TableRow>
            );
          })}

          {!top && (
            <TableRow>
              <TableCell sx={{ p: 2 }} colSpan={7}>
                <TablePagination
                  gotoPage={gotoPage}
                  rows={rows}
                  setPageSize={setPageSize}
                  pageIndex={pageIndex}
                  pageSize={pageSize}
                />
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </Stack>
  );
}

// ==============================|| REACT TABLE - PAGINATION ||============================== //

const PaginationTable = () => {
  const handleModalClose = (status: boolean) => {
    setOpen(false);
    if (status) {
      deleteUser(userId);
      dispatch(
        openSnackbar({
          open: true,
          message: "User Deleted successfully",
          anchorOrigin: { vertical: "top", horizontal: "right" },
          variant: "alert",
          alert: {
            color: "success",
          },
          close: true,
        })
      );
    }
  };
  const [open, setOpen] = useState(false);
  const [userId, setUserId] = useState("");

  const navigate = useNavigate();
  const [data, setData] = useState<UserData[]>([]);
  const fetchData = async () => {
    const serviceToken = localStorage.getItem("serviceToken");
    try {
      await axios
        .get(process.env.REACT_APP_API_URL + "/api/user/admin/list", {
          headers: {
            Authorization: `Bearer ${serviceToken}`,
          },
        })
        .then((response) => {
          setData(response.data);
        });
    } catch (error: any) {
      dispatch(
        openSnackbar({
          open: true,
          message: error.error,
          anchorOrigin: { vertical: "top", horizontal: "right" },
          variant: "alert",
          alert: {
            color: "error",
          },
          close: true,
        })
      );
      navigate("/3d-models/list", { replace: true }); // Add this line to navigate to 403 page
    }
  };

  const deleteUser = async (id: string) => {
    const serviceToken = localStorage.getItem("serviceToken");
    try {
      await axios.delete(
        `${process.env.REACT_APP_API_URL}/api/user/admin/delete/${id}`,
        {
          headers: {
            Authorization: `Bearer ${serviceToken}`,
          },
        }
      );
      // Fetch updated list of models after deletion
      fetchData();
    } catch (error) {
      console.error("Error deleting model:", error);
    }
  };

  useMemo(() => fetchData(), []);

  const deleteUserUpdateList = async (id: string) => {
    setUserId(id);
    setOpen(true);
  };
  const columns = useMemo(
    () => [
      {
        Header: "Name",
        accessor: "name",
      },
      {
        Header: "Email",
        accessor: "email",
      },
      {
        Header: "Phone",
        accessor: "phone",
      },
      {
        Header: "Designation",
        accessor: "designation",
      },
      {
        Header: "Role",
        accessor: "role",
        Cell: ({ value }: { value: string }) => {
          switch (value) {
            case "Admin":
              return (
                <Chip
                  color="error"
                  label="Admin"
                  size="small"
                  variant="light"
                />
              );
            case "Auther":
              return (
                <Chip
                  color="info"
                  label="Auther"
                  size="small"
                  variant="light"
                />
              );
            default:
              return (
                <Chip
                  color="info"
                  label="Auther"
                  size="small"
                  variant="light"
                />
              );
          }
        },
      },
      {
        Header: "Action",
        accessor: "_id",
        Cell: ({ value }: { value: string }) => (
          <Box>
            <Tooltip title="Edit">
              <IconButton
                color="primary"
                onClick={() => navigate("/users/edit/" + value)}
              >
                <Edit />
              </IconButton>
            </Tooltip>
            <Tooltip title="Delete">
              <IconButton
                color="error"
                onClick={(e: MouseEvent<HTMLButtonElement>) => {
                  deleteUserUpdateList(value);
                  e.stopPropagation();
                }}
              >
                <Trash />
              </IconButton>
            </Tooltip>
          </Box>
        ),
      },
    ],
    []
  );

  return (
    <Grid container spacing={3}>
      <Grid item xs={12}>
        <MainCard
          title="Users"
          content={false}
          secondary={
            <Button
              component={RouterLink}
              variant="contained"
              startIcon={<Add />}
              to="/users/add"
              size="large"
            >
              Add User
            </Button>
          }
        >
          <ScrollX>
            <ReactTable columns={columns} data={data} />
          </ScrollX>
        </MainCard>
      </Grid>
      <AlertItemDelete title="" open={open} handleClose={handleModalClose} />
    </Grid>
  );
};

export default PaginationTable;
