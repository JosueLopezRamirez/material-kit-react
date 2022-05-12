import Head from "next/head";
import { Box, Container } from "@mui/material";
import { CustomerListResults } from "../components/customer/customer-list-results";
import { CustomerListToolbar } from "../components/customer/customer-list-toolbar";
import { DashboardLayout } from "../components/dashboard-layout";
import { customers } from "../__mocks__/customers";
import { useEffect, useState } from "react";
import instanciaAxios from "src/utils/instancia-axios";
import { toast } from "react-toastify";

const Customers = () => {
  const [clientes, setClientes] = useState([]);

  useEffect(() => {
    obtenerClientes();
  }, []);

  const obtenerClientes = async () => {
    try {
      const clientes = await instanciaAxios.get("/empresas");
      setClientes(clientes.data);
      if (clientes.data.length === 0) {
        toast.warning("No se encontraron clientes");
      }
    } catch (error) {
      toast.error("Error al obtener los clientes");
    }
  };
  return (
    <>
      <Head>
        <title>Clientes</title>
      </Head>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          py: 10,
        }}
      >
        <Container maxWidth={false}>
          <CustomerListToolbar refrescar={obtenerClientes} />
          <Box sx={{ mt: 3 }}>
            <CustomerListResults clientes={clientes} refrescar={obtenerClientes} />
          </Box>
        </Container>
      </Box>
    </>
  );
};
Customers.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default Customers;
