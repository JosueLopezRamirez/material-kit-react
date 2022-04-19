import { useMemo, useState } from "react";
import {
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  Divider,
  Grid,
  MenuItem,
  TextField,
} from "@mui/material";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useMount } from "react-use";
import instanciaAxios from "src/utils/instancia-axios";
import { DatePicker, LocalizationProvider } from "@mui/lab";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { makeStyles } from "@mui/styles";
import { AgGridReact } from "ag-grid-react";

const useStyles = makeStyles({
  cardHeader: {
    paddingTop: "10px",
    paddingBottom: "10px",
  },
  item: {
    paddingTop: "5px !important",
  },
  cardContent: {
    paddingTop: "15px",
    paddingBottom: "15px",
  },
});

export const AccountProfileDetails = (props) => {
  const classes = useStyles();

  const [clientes, setClientes] = useState([]);
  const formik = useFormik({
    initialValues: {
      clienteId: "",
      nombre: "",
      fecha: "",
    },
    validationSchema: Yup.object({
      nombre: Yup.string().max(255).required("Nombre es requerido"),
      clienteId: Yup.string().max(255).required("Cliente es requerido"),
      fecha: Yup.string().max(255).required("Fecha es requerido"),
    }),
    onSubmit: async (data) => {
      try {
        await instanciaAxios.post(`/comprobante-diario/`, data);
        toast.success("Comprobante de diario creado correctamente");
        handleClose();
      } catch (error) {
        toast.error("Error al crear comprobante de diario");
      }
    },
  });

  useMount(() => {
    obtenerClientes();
  });

  const columnDefs = useMemo(
    () => [
      { field: "numeroCuenta" },
      { field: "descripcion" },
      { field: "parcial" },
      { field: "debito" },
      { field: "haber" },
    ],
    []
  );

  const obtenerClientes = async () => {
    const empresas = await instanciaAxios.get(`/empresas`);
    setClientes(empresas.data);
  };

  return (
    <>
      <form autoComplete="off" noValidate {...props}>
        <Card>
          <CardHeader title="Detalle del comprobante" classes={{ root: classes.cardHeader }} />
          <Divider />
          <CardContent classes={{ root: classes.cardContent }}>
            <Grid container spacing={3}>
              <Grid item md={12} xs={12} classes={{ item: classes.item }}>
                <TextField
                  fullWidth
                  label="Clientes"
                  name="cliente"
                  select
                  value={formik.values.clienteId}
                  onChange={formik.handleChange}
                  error={Boolean(formik.touched.clienteId && formik.errors.clienteId)}
                  helperText={formik.touched.clienteId && formik.errors.clienteId}
                  onBlur={formik.handleBlur}
                  margin="dense"
                  variant="standard"
                >
                  {clientes.map((option) => (
                    <MenuItem value={option.id}>{option.nombre}</MenuItem>
                  ))}
                </TextField>
              </Grid>
              <Grid item md={6} xs={12} classes={{ item: classes.item }}>
                <TextField
                  fullWidth
                  label="Nombre"
                  name="nombre"
                  type="text"
                  value={formik.values.nombre}
                  onChange={formik.handleChange}
                  error={Boolean(formik.touched.nombre && formik.errors.nombre)}
                  helperText={formik.touched.nombre && formik.errors.nombre}
                  onBlur={formik.handleBlur}
                  margin="dense"
                  variant="standard"
                />
              </Grid>
              <Grid item md={6} xs={12} classes={{ item: classes.item }}>
                <LocalizationProvider dateAdapter={AdapterDateFns}>
                  <DatePicker
                    label="Fecha"
                    name="fecha"
                    value={formik.values.fecha}
                    onChange={(val) => {
                      console.log(val);
                      formik.setFieldValue("fecha", val);
                    }}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        name="fecha"
                        fullWidth
                        margin="dense"
                        disabled
                        variant="standard"
                      />
                    )}
                  />
                </LocalizationProvider>
              </Grid>
            </Grid>
          </CardContent>
          <Divider />
          <Box
            sx={{
              display: "flex",
              justifyContent: "flex-start",
              p: 2,
            }}
          >
            <Button color="primary" variant="contained">
              Guardar
            </Button>
          </Box>
        </Card>
      </form>
      <div className="ag-theme-alpine" style={{ height: 400, width: "100%", marginTop: 15 }}>
        <AgGridReact rowData={[]} columnDefs={columnDefs}></AgGridReact>
      </div>
    </>
  );
};
