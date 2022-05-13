import { useState } from "react";
import PerfectScrollbar from "react-perfect-scrollbar";
import PropTypes from "prop-types";
import { format } from "date-fns";
import {
  Box,
  Button,
  Card,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TablePagination,
  TableRow,
  IconButton,
  Tooltip,
} from "@mui/material";
import { useRouter } from "next/router";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import SummarizeIcon from "@mui/icons-material/Summarize";
import instanciaAxios from "src/utils/instancia-axios";
import { toast } from "react-toastify";
import { FeatureFlag } from "../FeatureFlag";

export const TablaComprobanteDiario = ({ data, refetch, editar, ...rest }) => {
  const [limit, setLimit] = useState(25);
  const router = useRouter();
  const [page, setPage] = useState(0);

  const handleLimitChange = (event) => {
    setLimit(event.target.value);
  };

  const handlePageChange = (event, newPage) => {
    setPage(newPage);
  };

  const borrar = async (id) => {
    try {
      await instanciaAxios.delete(`/comprobante-diario/${id}`);
      toast.success("Comprobante de diario borrado correctamente");
      refetch();
    } catch (error) {
      toast.error("Error al borrar el comprobante de diario");
    }
  };

  return (
    <Card sx={{ borderRadius: 0 }} {...rest}>
      <PerfectScrollbar>
        <Box sx={{ minWidth: 1050 }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Nombre</TableCell>
                <TableCell>Cliente</TableCell>
                <TableCell>Fecha</TableCell>
                <TableCell>Acciones</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {data.slice(0, limit).map((item) => (
                <TableRow hover key={item.id}>
                  <TableCell>{item.nombre}</TableCell>
                  <TableCell>{item.estatico.documento.empresa.nombre}</TableCell>
                  <TableCell>{format(new Date(item.fecha), "dd-MM-yyyy")}</TableCell>
                  <TableCell>
                    <FeatureFlag pagina="Comprobantes de diario" permiso="editar">
                      <Tooltip title="Editar">
                        <IconButton
                          onClick={() => router.push(`/account/${item.id}`)}
                          sx={{ mr: 1 }}
                        >
                          <EditIcon style={{ color: "blue" }} />
                        </IconButton>
                      </Tooltip>
                    </FeatureFlag>
                    <Tooltip title="Dar de baja">
                      <Button
                        startIcon={<DeleteIcon style={{ color: "red" }} />}
                        onClick={() => borrar(item.id)}
                        sx={{ mr: 1 }}
                      />
                    </Tooltip>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Box>
      </PerfectScrollbar>
      <TablePagination
        component="div"
        count={data.length}
        onPageChange={handlePageChange}
        onRowsPerPageChange={handleLimitChange}
        page={page}
        rowsPerPage={limit}
        rowsPerPageOptions={[5, 10, 25]}
      />
    </Card>
  );
};

TablaComprobanteDiario.propTypes = {
  data: PropTypes.array.isRequired,
  refetch: PropTypes.func.isRequired,
};
