import Head from "next/head";
import { Box, Container } from "@mui/material";
import { CustomerListResults } from "../../components/toolbar/customer-list-results";
import { CustomerListToolbar } from "../../components/toolbar/customer-list-toolbar";
import { DashboardLayout } from "../../components/dashboard-layout";
import { useEffect, useState } from "react";
import instanciaAxios from "src/utils/instancia-axios";
import { toast } from "react-toastify";
import { useRouter } from "next/router";

const Customers = () => {
  const router = useRouter();
  const [data, setData] = useState([]);

  useEffect(() => {
    obtenerData();
  }, []);

  const obtenerData = async () => {
    try {
      const clientes = await instanciaAxios.get("/comprobante-diario");
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
          py: 8,
        }}
      >
        <Container maxWidth={false}>
          <CustomerListToolbar
            title="Comprobantes de diario"
            btnText={"Nuevo comprobante de diario"}
            onClickBtn={() => router.push("/account/create")}
            searchText="Buscar Comprobante de diario"
          />
          <Box sx={{ mt: 3 }}>
            <CustomerListResults clientes={[]} refrescar={obtenerData} />
          </Box>
        </Container>
      </Box>
    </>
  );
};
Customers.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default Customers;
