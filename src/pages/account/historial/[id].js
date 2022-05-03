import Head from "next/head";
import { Box, Container, Grid, Typography } from "@mui/material";
import { DashboardLayout } from "../../../components/dashboard-layout";
import { useRouter } from "next/router";
import { useMount } from "react-use";
import instanciaAxios from "src/utils/instancia-axios";
import { useMemo, useState } from "react";
import { AgGridReact } from "ag-grid-react";
import { format } from "date-fns";

const Historial = () => {
  const { query } = useRouter();
  const [detalle, setDetalle] = useState([]);

  useMount(async () => {
    const detalle = await instanciaAxios.get("/historial-comprobante-diario/" + query.id);
    setDetalle(
      detalle.data.map((row) => ({
        usuario: row.usuario.nombre,
        comprobanteDeDiario: row.comprobanteDiario.nombre,
        fechaDeCreacion: format(new Date(row.createdAt), "dd-MM-yyyy"),
        fechaDeActualizacion: format(new Date(row.updatedAt), "dd-MM-yyyy"),
        horaDeActualizacion: format(new Date(row.updatedAt), "h:mm a"),
      }))
    );
  });

  const columnDefs = useMemo(
    () => [
      { field: "comprobanteDeDiario" },
      { field: "usuario", headerName: "Usuario" },
      { field: "fechaDeCreacion" },
      { field: "fechaDeActualizacion" },
      { field: "horaDeActualizacion" },
    ],
    []
  );

  return (
    <>
      <Head>
        <title>Historial - comprobantes de diario</title>
      </Head>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          py: 8,
        }}
      >
        <Container maxWidth="lg">
          <Typography sx={{ mb: 3 }} variant="h5">
            Historial de actualizacion
          </Typography>
          <Grid container spacing={3}>
            <Grid item lg={12} md={12} xs={12}>
              <div
                className="ag-theme-alpine"
                style={{ height: 600, width: "100%", marginTop: 15 }}
              >
                <AgGridReact
                  rowData={detalle}
                  columnDefs={columnDefs}
                  defaultColDef={{
                    flex: 1,
                    editable: false,
                  }}
                />
              </div>
            </Grid>
          </Grid>
        </Container>
      </Box>
    </>
  );
};

Historial.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default Historial;
