import Head from "next/head";
import { Box, Container } from "@mui/material";
import {
  CustomerListResults,
  TablaComprobanteDiario,
} from "../../components/account/TablaComprobanteDiario";
import { Toolbar } from "../../components/toolbar/Toolbar";
import { DashboardLayout } from "../../components/dashboard-layout";
import { useEffect, useState } from "react";
import instanciaAxios from "src/utils/instancia-axios";
import { toast } from "react-toastify";
import { useRouter } from "next/router";

let timeout = null;

const Customers = () => {
  const router = useRouter();
  const [data, setData] = useState([]);
  const [searchText, setSearchText] = useState("");

  useEffect(() => {
    getData();
  }, []);

  const getData = async (searchText = "") => {
    try {
      const response = await instanciaAxios.get("/comprobante-diario", {
        params: {
          searchText: searchText,
        },
      });
      setData(response.data);
      if (response.data.length === 0) {
        toast.warning("No se encontraron comprobantes de diario");
      }
    } catch (error) {
      toast.error("Error al obtener comprobantes de diario");
    }
  };

  const onSearch = (event) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => {
      setSearchText(event.target.value);
    }, 800);
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
          <Toolbar
            title="Comprobantes de diario"
            btnText={"Nuevo comprobante de diario"}
            onClickBtn={() => router.push("/account/create")}
            searchText="Buscar Comprobante de diario"
            onSearch={onSearch}
          />
          <Box sx={{ mt: 3 }}>
            <TablaComprobanteDiario data={data} refetch={getData} />
          </Box>
        </Container>
      </Box>
    </>
  );
};
Customers.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default Customers;
