import { useState } from "react";
import PerfectScrollbar from "react-perfect-scrollbar";
import PropTypes from "prop-types";
import { format } from "date-fns";
import {
  Box,
  Card,
  Table,
  TableBody,
  Tooltip,
  TableCell,
  TableHead,
  IconButton,
  TablePagination,
  TableRow,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import instanciaAxios from "src/utils/instancia-axios";
import { toast } from "react-toastify";
import EditarClienteModal from "./EditarCliente";
import { CLIENTE, permiso } from "src/utils/Constants";
import { FeatureFlag } from "../FeatureFlag";

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
    <Card sx={{ borderRadius: 0 }} {...rest}>
      <PerfectScrollbar>
        <Box sx={{ minWidth: 1050 }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Nombre</TableCell>
                <TableCell>Descripcion</TableCell>
                <TableCell>Ruc</TableCell>
                <TableCell>Telefono</TableCell>
                <TableCell>Fecha Creacion</TableCell>
                <TableCell>Acciones</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {clientes.slice(0, limit).map((cliente) => (
                <TableRow hover key={cliente.id}>
                  <TableCell>{cliente.nombre}</TableCell>
                  <TableCell>{cliente.descripcion}</TableCell>
                  <TableCell>{cliente.ruc}</TableCell>
                  <TableCell>{cliente.telefono}</TableCell>
                  <TableCell>{format(new Date(cliente.createdAt), "dd-MM-yyyy")}</TableCell>
                  <TableCell>
                    <FeatureFlag pagina={CLIENTE} permiso={permiso.EDICION}>
                      <Tooltip title="Editar">
                        <IconButton onClick={() => editar(cliente.id)}>
                          <EditIcon style={{ color: "blue" }} />
                        </IconButton>
                      </Tooltip>
                    </FeatureFlag>
                    <FeatureFlag pagina={CLIENTE} permiso={permiso.ELIMINACION}>
                      <Tooltip title="Borrado">
                        <IconButton onClick={() => borrar(cliente.id)}>
                          <DeleteIcon style={{ color: "red" }} />
                        </IconButton>
                      </Tooltip>
                    </FeatureFlag>
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
