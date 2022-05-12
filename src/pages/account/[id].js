import Head from "next/head";
import { Box, Container, Grid, Typography } from "@mui/material";
import { DetalleComprobanteDiario } from "../../components/account/DetalleComprobanteDiario";
import { DashboardLayout } from "../../components/dashboard-layout";
import { useRouter } from "next/router";
import { useMount } from "react-use";
import instanciaAxios from "src/utils/instancia-axios";
import { useState } from "react";

const Account = () => {
  const { query } = useRouter();
  const [detalle, setDetalle] = useState(null);

  useMount(async () => {
    if (query.id === "create") {
      setDetalle({});
      return;
    }
    const detalle = await instanciaAxios.get("/comprobante-diario/" + query.id);
    setDetalle(detalle.data);
  });

  return (
    <>
      <Head>
        <title>Detalle - comprobantes de diario</title>
      </Head>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          py: 10,
        }}
      >
        <Container maxWidth="lg">
          <Typography sx={{ mb: 3 }} variant="h5">
            Detalle - comprobantes de Diario
          </Typography>
          <Grid container spacing={3}>
            <Grid item lg={12} md={12} xs={12}>
              {detalle && (
                <DetalleComprobanteDiario formData={detalle} isEdit={query.id !== "create"} />
              )}
            </Grid>
          </Grid>
        </Container>
      </Box>
    </>
  );
};

Account.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default Account;
