import Head from "next/head";
import { Box, Container, Typography } from "@mui/material";
import { DashboardLayout } from "../components/dashboard-layout";
import { Catalogos, Permisos } from "../components/settings/catalogos";

const Settings = () => (
  <>
    <Head>
      <title>Configuracion | Material Kit</title>
    </Head>
    <Box
      component="main"
      sx={{
        flexGrow: 1,
        py: 8,
      }}
    >
      <Container maxWidth="lg">
        <Typography sx={{ mb: 3 }} variant="h4">
          Configuracion
        </Typography>
        <Catalogos />
        <Box sx={{ my: 2 }}>
          <Permisos />
        </Box>
      </Container>
    </Box>
  </>
);

Settings.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default Settings;
