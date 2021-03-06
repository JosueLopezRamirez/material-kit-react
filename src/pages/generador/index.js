import Head from "next/head";
import { Box, Container } from "@mui/material";
import { Tabla } from "../../components/plantilla/Tabla";
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
      const response = await instanciaAxios.get("/plantillas", {
        params: {
          searchText: searchText,
        },
      });
      setData(response.data);
      if (response.data.length === 0) {
        toast.warning("No se encontraron plantillas");
      }
    } catch (error) {
      toast.error("Error al obtener plantillas");
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
        <title>Documento</title>
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
            title="Plantillas"
            btnText={"Nueva plantilla"}
            onClickBtn={() => router.push("/generador/create")}
            searchText="Buscar plantilla"
            onSearch={onSearch}
          />
          <Box sx={{ mt: 3 }}>
            <Tabla data={data} refetch={getData} />
          </Box>
        </Container>
      </Box>
    </>
  );
};
Customers.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default Customers;
