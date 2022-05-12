import Head from "next/head";
import { Box, Container } from "@mui/material";
import { TablaFactura } from "../../components/facturas/TablaFactura";
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
    getData(searchText);
  }, []);

  const getData = async (searchText = "") => {
    try {
      const response = await instanciaAxios.get("/facturas", {
        params: {
          searchText: searchText,
        },
      });
      setData(response.data);
      if (response.data.length === 0) {
        toast.warning("No se encontraron facturas");
      }
    } catch (error) {
      toast.error("Error al obtener facturas");
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
        <title>Facturas</title>
      </Head>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          py: 10,
        }}
      >
        <Container maxWidth={false}>
          <Toolbar
            title="Facturas"
            btnText={"Nueva factura"}
            onClickBtn={() => router.push("/facturas/create")}
            searchText="Buscar facturas"
            onSearch={onSearch}
          />
          <Box sx={{ mt: 3 }}>
            <TablaFactura data={data} refetch={getData} />
          </Box>
        </Container>
      </Box>
    </>
  );
};
Customers.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default Customers;
