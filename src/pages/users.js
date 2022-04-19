import Head from "next/head";
import { Box, Container } from "@mui/material";
import { CustomerListResults } from "../components/usuarios/customer-list-results";
import { CustomerListToolbar } from "../components/usuarios/customer-list-toolbar";
import { DashboardLayout } from "../components/dashboard-layout";
import { useEffect, useState } from "react";
import instanciaAxios from "src/utils/instancia-axios";
import { toast } from "react-toastify";

const Customers = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    obtenerData();
  }, []);

  const obtenerData = async () => {
    try {
      const response = await instanciaAxios.post("/usuario/get");
      setData(response.data);
      if (response.data.length === 0) {
        toast.warning("No se encontraron clientes");
      }
    } catch (error) {
      toast.error("Error al obtener los clientes");
    }
  };
  return (
    <>
      <Head>
        <title>Usuarios</title>
      </Head>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          py: 8,
        }}
      >
        <Container maxWidth={false}>
          <CustomerListToolbar refrescar={obtenerData} />
          <Box sx={{ mt: 3 }}>
            <CustomerListResults clientes={data} refrescar={obtenerData} />
          </Box>
        </Container>
      </Box>
    </>
  );
};
Customers.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default Customers;
