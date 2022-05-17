import Head from "next/head";
import { Box, Container } from "@mui/material";
import { Tabla } from "../../components/documento/Tabla";
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
      const response = await instanciaAxios.get("/dinamicos", {
        params: {
          searchText: searchText,
        },
      });
      setData(response.data);
      if (response.data.length === 0) {
        toast.warning("No se encontraron documentos");
      }
    } catch (error) {
      toast.error("Error al obtener documentos");
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
            title="Documentos"
            btnText={"Nueva documento"}
            onClickBtn={() => router.push("/documentos/create")}
            searchText="Buscar documento"
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
