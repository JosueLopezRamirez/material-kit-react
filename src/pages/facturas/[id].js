import Head from "next/head";
import { Box, Container, Grid, Typography } from "@mui/material";
import { DetalleFactura } from "../../components/facturas/DetalleFactura";
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
    const detalle = await instanciaAxios.get("/facturas/" + query.id);
    setDetalle(detalle.data);
  });

  return (
    <>
      <Head>
        <title>Detalle - Facturas</title>
      </Head>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          py: 8,
        }}
      >
        <Container
          maxWidth="lg"
          sx={{ paddingLeft: "0px !important", paddingRight: "0px !important" }}
        >
          <Typography sx={{ mb: 3 }} variant="h5">
            Detalle de facturas
          </Typography>
          <Grid container>
            <Grid item lg={12} md={12} xs={12} sx={{ paddingLeft: 0, paddingRight: 0 }}>
              {detalle && <DetalleFactura formData={detalle} isEdit={query.id !== "create"} />}
            </Grid>
          </Grid>
        </Container>
      </Box>
    </>
  );
};

Account.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default Account;
