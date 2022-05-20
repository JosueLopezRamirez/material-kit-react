import { useState } from "react";
import PerfectScrollbar from "react-perfect-scrollbar";
import { AiFillFilePdf } from "react-icons/ai";
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
import { COMPORBANTE_DIARIO, permiso } from "src/utils/Constants";
import { ViewPdfModal } from "../modals/ViewPdfModal";

export const TablaComprobanteDiario = ({ data, refetch, editar, ...rest }) => {
  const [limit, setLimit] = useState(25);
  const [viewPdf, setViewPdf] = useState(null);
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
                  <TableCell style={{ display: "flex", gap: "3px" }}>
                    <FeatureFlag pagina={COMPORBANTE_DIARIO} permiso={permiso.EDICION}>
                      <Tooltip title="Editar">
                        <IconButton onClick={() => router.push(`/account/${item.id}`)}>
                          <EditIcon style={{ color: "blue" }} />
                        </IconButton>
                      </Tooltip>
                    </FeatureFlag>
                    <Tooltip title="Ver Pdf">
                      <IconButton onClick={() => setViewPdf(item.id)}>
                        <AiFillFilePdf color="red" />
                      </IconButton>
                    </Tooltip>
                    <FeatureFlag pagina={COMPORBANTE_DIARIO} permiso={permiso.ELIMINACION}>
                      <Tooltip title="Dar de baja">
                        <IconButton onClick={() => borrar(item.id)}>
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
        count={data.length}
        onPageChange={handlePageChange}
        onRowsPerPageChange={handleLimitChange}
        page={page}
        rowsPerPage={limit}
        rowsPerPageOptions={[5, 10, 25]}
      />
      {viewPdf && (
        <ViewPdfModal variant="comprobante" id={viewPdf} onClose={() => setViewPdf(null)} />
      )}
    </Card>
  );
};

TablaComprobanteDiario.propTypes = {
  data: PropTypes.array.isRequired,
  refetch: PropTypes.func.isRequired,
};
