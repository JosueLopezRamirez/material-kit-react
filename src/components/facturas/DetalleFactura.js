import { useEffect, useMemo, useRef, useState } from "react";
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
import { AddCircleOutlined } from "@mui/icons-material";
import { toast } from "react-toastify";
import { useRouter } from "next/router";
import { RemoveRenderer } from "../renderers";

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
  removeHeader: {
    border: "none !important",
  },
  removeCell: {
    border: "none !important",
    borderRight: "none !important",
  },
  grid: {
    "& .ag-cell": {
      height: "100% !important",
    },
  },
});

export const DetalleFactura = (props) => {
  const { formData, isEdit } = props;
  const classes = useStyles();
  const router = useRouter();
  const gridRef = useRef();
  const [gridData, setGridData] = useState([]);
  const [clientes, setClientes] = useState([]);

  const formik = useFormik({
    initialValues: {
      empresaId: formData.estatico.documento.empresaId,
      nombre: formData.nombre,
      fecha: formData.fecha,
    },
    validationSchema: Yup.object({
      nombre: Yup.string().max(255).required("Nombre es requerido"),
      empresaId: Yup.string().max(255).required("Cliente es requerido"),
      fecha: Yup.string().max(255).required("Fecha es requerido"),
    }),
    onSubmit: async (data) => {
      try {
        let respuesta = null;
        const rowData = getRowData();
        if (isEdit) {
          respuesta = await instanciaAxios.patch(`/facturas/` + formData.id, {
            factura: data,
            facturaItems: rowData,
          });
        } else {
          respuesta = await instanciaAxios.post(`/facturas/`, {
            factura: data,
            facturaItems: rowData,
          });
        }
        if (!isEdit) {
          router.push("/facturas/" + respuesta.data.id);
        }
        toast.success(`Factura ${isEdit ? "actualizada" : "creada"} correctamente`);
      } catch (error) {
        console.log({ error });
        toast.error(`Error al ${isEdit ? "actualizar" : "crear"} factura`);
      }
    },
  });

  const getRowData = () => {
    const rowData = [];
    gridRef.current.api.forEachNode((node) => {
      rowData.push(node.data);
    });
    return rowData;
  };

  useMount(() => {
    obtenerClientes();
    if (Object.entries(formData).length) {
      setGridData(formData.facturasItems);
    }
  });

  const columnDefs = [
    { field: "numeroFactura" },
    { field: "descripcion" },
    { field: "ventasExoneradas" },
    { field: "ventasExentas" },
    { field: "ventasGrabadas" },
    {
      field: "montoTotal",
      valueGetter: (params) => {
        const data = params.data;
        const val =
          parseFloat(data.ventasExoneradas ?? 0) +
          parseFloat(data.ventasExentas ?? 0) +
          parseFloat(data.ventasGrabadas ?? 0) +
          parseFloat(data.ventasGrabadas * 0.15 ?? 0);
        return isNaN(val) ? 0 : val.toFixed(2);
      },
    },
    {
      field: "iva",
      headerName: "15% IVA",
      valueGetter: (params) => {
        const val = params.data.ventasGrabadas * 0.15;
        return isNaN(val) ? 0 : val.toFixed(2);
      },
    },
    {
      field: "ventas",
      valueGetter: (params) => {
        const data = params.data;
        const val =
          parseFloat(data.ventasExoneradas ?? 0) +
          parseFloat(params.data.ventasExentas ?? 0) +
          parseFloat(params.data.ventasGrabadas ?? 0);
        return isNaN(val) ? 0 : val.toFixed(2);
      },
    },
    {
      field: "remove",
      headerName: "",
      width: 40,
      maxWidth: 40,
      sortable: false,
      rezisable: false,
      suppressSizeToFit: true,
      editable: false,
      cellRenderer: "removeRenderer",
      cellClass: classes.removeCell,
      headerClass: classes.removeHeader,
      cellStyle: { backgroundColor: "white", border: "none !important" },
    },
  ];

  const obtenerClientes = async () => {
    const empresas = await instanciaAxios.get(`/empresas`);
    setClientes(empresas.data);
  };

  return (
    <>
      <form onSubmit={formik.handleSubmit}>
        <Card sx={{ borderRadius: 0 }}>
          <CardContent classes={{ root: classes.cardContent }}>
            <Grid container spacing={3}>
              <Grid item md={12} xs={12} classes={{ item: classes.item }}>
                <TextField
                  fullWidth
                  label="Clientes"
                  name="empresaId"
                  select
                  value={formik.values.empresaId}
                  onChange={formik.handleChange}
                  error={Boolean(formik.touched.empresaId && formik.errors.empresaId)}
                  helperText={formik.touched.empresaId && formik.errors.empresaId}
                  onBlur={formik.handleBlur}
                  margin="dense"
                  variant="standard"
                  disabled={isEdit}
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
            <Button color="primary" variant="contained" type="submit">
              Guardar
            </Button>
          </Box>
        </Card>
      </form>

      <div
        className={"ag-theme-alpine " + classes.grid}
        style={{ height: 400, width: "100%", marginTop: 15 }}
      >
        <div>
          <Button
            startIcon={<AddCircleOutlined />}
            sx={{ mr: 1 }}
            onClick={() => {
              gridRef.current.api.applyTransaction({ add: [{ isNewRow: true }] });
            }}
          >
            Agregar fila
          </Button>
        </div>
        <AgGridReact
          ref={gridRef}
          rowHeight={30}
          headerHeight={30}
          rowData={gridData}
          columnDefs={columnDefs}
          defaultColDef={{
            flex: 1,
            editable: true,
          }}
          components={{
            removeRenderer: RemoveRenderer,
          }}
        />
      </div>
    </>
  );
};
