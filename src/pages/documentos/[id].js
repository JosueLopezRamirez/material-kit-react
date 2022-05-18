import Head from "next/head";
import { Box, Container, Grid, Typography } from "@mui/material";
import { Detalle } from "../../components/documento/Detalle";
import { DashboardLayout } from "../../components/dashboard-layout";
import { useRouter } from "next/router";
import { useMount } from "react-use";
import instanciaAxios from "src/utils/instancia-axios";
import { useState } from "react";
import { v4 as uuidV4 } from "uuid";

const Account = () => {
  const { query } = useRouter();
  const [detalle, setDetalle] = useState({});
  const [detalleKey, setDetalleKey] = useState(uuidV4());

  useMount(async () => {
    if (query.id === "create") return;
    const detalle = await instanciaAxios.get(`/dinamicos/${query.id}`);
    setDetalle(detalle.data);
    setDetalleKey(uuidV4());
  });

  return (
    <>
      <Head>
        <title>Detalle - documento</title>
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
            Documento
          </Typography>
          <Grid container spacing={3}>
            <Grid item lg={12} md={12} xs={12}>
              <Detalle key={detalleKey} formData={detalle} isEdit={query.id !== "create"} />
            </Grid>
          </Grid>
        </Container>
      </Box>
    </>
  );
};

Account.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default Account;
