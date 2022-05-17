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
  TableRow,
  TableCell,
  IconButton,
  TableHead,
  TablePagination,
  Typography,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import instanciaAxios from "src/utils/instancia-axios";
import { toast } from "react-toastify";
import EditarClienteModal from "./EditarCliente";

export const CustomerListResults = ({ clientes, refrescar, ...rest }) => {
  const [limit, setLimit] = useState(25);
  const [editarCliente, setEditarCliente] = useState(null);
  const [abrirModal, setAbrirModal] = useState(false);
  const [page, setPage] = useState(0);

  const handleLimitChange = (event) => {
    setLimit(event.target.value);
  };

  const handlePageChange = (event, newPage) => {
    setPage(newPage);
  };

  const editar = (id) => {
    setEditarCliente(id);
    setAbrirModal(true);
  };

  const borrar = async (id) => {
    try {
      await instanciaAxios.delete(`/empresas/${id}`);
      toast.success("Cliente dado de baja correctamente");
      refrescar();
    } catch (error) {
      toast.error("Error al dar de baja al cliente");
    }
  };

  const handleClose = () => {
    setAbrirModal(false);
    setEditarCliente(null);
    refrescar();
  };

  return (
    <Card {...rest}>
      <PerfectScrollbar>
        <Box sx={{ minWidth: 1050 }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Nombre</TableCell>
                <TableCell>Apellido Paterno</TableCell>
                <TableCell>Apellido Materno</TableCell>
                <TableCell>Correo</TableCell>
                <TableCell>Rol</TableCell>
                <TableCell>Fecha Creacion</TableCell>
                <TableCell>Acciones</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {clientes.slice(0, limit).map((cliente) => (
                <TableRow hover key={cliente.id}>
                  <TableCell>{cliente.nombre}</TableCell>
                  <TableCell>{cliente.apellidoPaterno}</TableCell>
                  <TableCell>{cliente.apellidoMaterno}</TableCell>
                  <TableCell>{cliente.correo}</TableCell>
                  <TableCell>{cliente.rol.nombre}</TableCell>
                  <TableCell>{format(new Date(cliente.createdAt), "dd-MM-yyyy")}</TableCell>
                  <TableCell>
                    <IconButton onClick={() => editar(cliente.id)}>
                      <EditIcon style={{ color: "blue" }} />
                    </IconButton>
                    <IconButton onClick={() => borrar(cliente.id)}>
                      <DeleteIcon style={{ color: "red" }} />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Box>
      </PerfectScrollbar>
      <TablePagination
        component="div"
        count={clientes.length}
        onPageChange={handlePageChange}
        onRowsPerPageChange={handleLimitChange}
        page={page}
        rowsPerPage={limit}
        rowsPerPageOptions={[5, 10, 25]}
      />
      <EditarClienteModal id={editarCliente} open={abrirModal} handleClose={handleClose} />
    </Card>
  );
};

CustomerListResults.propTypes = {
  clientes: PropTypes.array.isRequired,
  refrescar: PropTypes.func.isRequired,
};
