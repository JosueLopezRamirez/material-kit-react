import { Box, Button, Container, Grid, Typography } from "@mui/material";
import { useRouter } from "next/router";
import { useMount } from "react-use";
import instanciaAxios from "src/utils/instancia-axios";
import { useMemo, useState } from "react";
import { AgGridReact } from "ag-grid-react";
import { format } from "date-fns";
import { makeStyles } from "@mui/styles";
import { Rnd } from "react-rnd";

const useStyles = makeStyles({
  container: {
    padding: "0px !important",
    borderRadius: 5,
  },
  modal: {
    background: "#4895ef",
    padding: "16px",
    borderRadius: 5,
  },
  titleWrapper: {
    width: "100%",
    padding: 5,
    backgroundColor: "#FFFF",
    cursor: "all-scroll",
  },
  title: {
    color: "black",
  },
  grid: {
    "& .ag-cell": {
      height: "100% !important",
    },
  },
});

export const Historial = (props) => {
  const classes = useStyles();
  const { query, pathname } = useRouter();
  const [detalle, setDetalle] = useState([]);

  useMount(async () => {
    const detalle = await instanciaAxios.get(
      pathname.includes("facturas")
        ? "/historial-facturas/" + query.id
        : "/historial-comprobante-diario/" + query.id
    );
    setDetalle(
      detalle.data.map((row) => ({
        usuario: row.usuario.nombre,
        nombre: row[pathname.includes("facturas") ? "factura" : "comprobanteDiario"].nombre,
        fechaDeCreacion: format(new Date(row.createdAt), "dd-MM-yyyy"),
        fechaDeActualizacion: format(new Date(row.updatedAt), "dd-MM-yyyy"),
        horaDeActualizacion: format(new Date(row.updatedAt), "h:mm a"),
      }))
    );
  });

  const columnDefs = useMemo(
    () => [
      { field: "nombre" },
      { field: "usuario", headerName: "Usuario" },
      { field: "fechaDeCreacion" },
      { field: "fechaDeActualizacion" },
      { field: "horaDeActualizacion" },
    ],
    []
  );

  return (
    <Rnd
      minWidth={1000}
      minHeight={315}
      bounds=".zone-pages"
      enableResizing={false}
      style={{ zIndex: 2000 }}
      default={{
        x: window.innerWidth / 6,
        y: 50,
        width: 1000,
        height: 315,
      }}
      dragHandleClassName="drag-handle"
    >
      <Box className={classes.modal}>
        <Container className={classes.container}>
          <Box className={"drag-handle " + classes.titleWrapper}>
            <Typography className={classes.title} variant="p">
              Historial de actualizacion
            </Typography>
          </Box>

          <Grid lg={12} md={12} xs={12}>
            <div
              className={"ag-theme-alpine " + classes.grid}
              style={{
                height: 400,
                width: "100%",
                marginTop: 15,
                padding: 5,
                borderTopLeftRadius: 5,
                borderTopRightRadius: 5,
                backgroundColor: "#FFFF",
              }}
            >
              <AgGridReact
                rowData={detalle}
                rowHeight={30}
                headerHeight={30}
                columnDefs={columnDefs}
                defaultColDef={{
                  flex: 1,
                  editable: false,
                  sortable: true,
                }}
              />
            </div>
          </Grid>
          <Grid
            style={{
              backgroundColor: "white",
              padding: 5,
              display: "flex",
              justifyContent: "flex-end",
              borderBottomLeftRadius: 5,
              borderBottomRightRadius: 5,
            }}
          >
            <Button variant="contained" onClick={props.toggle}>
              Cerrar
            </Button>
          </Grid>
        </Container>
      </Box>
    </Rnd>
  );
};
