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
import { useRouter } from "next/router";
import { isEmpty } from "lodash";

const variablesColDefs = [
  { field: "Nombre" },
  { field: "Grupo" },
  { field: "Valor" },
  { field: "Tipo" },
];

const useStyles = makeStyles({
  cardHeader: {
    paddingTop: "10px",
    paddingBottom: "10px",
  },
  item: {
    paddingTop: "5px !important",
  },
  cardContent: {
    padding: "10px !important",
  },
  grid: {
    "& .ag-cell": {
      height: "100% !important",
    },
  },
});

export const Detalle = (props) => {
  const { formData, isEdit } = props;
  const classes = useStyles();
  const router = useRouter();
  const variableRef = useRef();
  const [gridData, setGridData] = useState([]);
  const [state, setState] = useState({
    nombreColumna: "",
    nombreGrupo: "",
  });
  const [gridApi, setGridApi] = useState();
  const [clientes, setClientes] = useState([]);
  const [columnDefs, setColumnDefs] = useState([]);

  const formik = useFormik({
    initialValues: {
      empresaId: formData.empresaId,
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
        const newData = {
          ...data,
          columnas: columnDefs,
        };
        if (isEdit) {
          respuesta = await instanciaAxios.patch(`/dinamicos/` + formData.id, newData);
        } else {
          respuesta = await instanciaAxios.post(`/dinamicos/`, newData);
        }
        if (!respuesta.data.id) {
          throw new Error();
        }
        router.push("/documento/" + respuesta.data.id);
        handleClose();
      } catch (error) {
        //
      }
    },
  });

  const getRowData = () => {
    const rowData = [];
    gridApi.forEachNode((node) => {
      rowData.push(node.data);
    });
    return rowData;
  };

  useMount(() => {
    obtenerClientes();
    if (Object.entries(formData).length) {
      setGridData(formData.comprobanteDiarioItem);
    }
  });

  const obtenerClientes = async () => {
    const empresas = await instanciaAxios.get(`/empresas`);
    setClientes(empresas.data);
  };

  const onChange = (event) => {
    setState((prev) => ({
      ...prev,
      [event.target.name]: event.target.value,
    }));
  };

  const onAgregar = () => {
    const newColDefs = [...columnDefs];
    let col = { field: state.nombreColumna };
    let index = -1;
    if (!state.nombreColumna) return;
    if (state.nombreGrupo) {
      index = newColDefs.findIndex((row) => row.headerName === state.nombreGrupo);
      if (index !== -1) {
        col = newColDefs[index];
        col = {
          headerName: state.nombreGrupo,
          children: col.children
            ? [...col.children, { field: state.nombreColumna }]
            : [{ field: state.nombreColumna }],
        };
      } else {
        col = {
          headerName: state.nombreGrupo,
          children: [{ field: state.nombreColumna }],
        };
      }
    }
    if (isEmpty(col)) return;
    if (index !== -1) {
      newColDefs[index] = col;
    } else {
      newColDefs.push(col);
    }
    console.log({ newColDefs });
    setColumnDefs(newColDefs);
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
      <Box sx={{ my: "16px" }}>
        <Card sx={{ borderRadius: 0 }}>
          <CardContent classes={{ root: classes.cardContent }}>
            <div>
              <div>
                <Button
                  startIcon={<AddCircleOutlined />}
                  onClick={() => {
                    variableRef.current?.api?.applyTransaction({ add: [{ isNewRow: true }] });
                  }}
                >
                  Agregar fila
                </Button>
              </div>
              <div
                className={"ag-theme-alpine " + classes.grid}
                style={{ height: 150, width: "100%" }}
              >
                <AgGridReact
                  ref={variableRef}
                  rowData={[]}
                  rowHeight={30}
                  headerHeight={30}
                  columnDefs={variablesColDefs}
                  defaultColDef={{
                    editable: true,
                    flex: 1,
                  }}
                />
              </div>
            </div>
          </CardContent>
        </Card>
      </Box>
      <div
        className={"ag-theme-alpine " + classes.grid}
        style={{ height: 400, width: "100%", marginTop: 15 }}
      >
        {/* <div>
          <Button
            startIcon={<AddCircleOutlined />}
            sx={{ mr: 1 }}
            onClick={() => {
              gridApi.applyTransaction({ add: [{ isNewRow: true }] });
            }}
          >
            Agregar fila
          </Button>
        </div> */}
        <AgGridReact
          rowData={[]}
          rowHeight={30}
          headerHeight={30}
          columnDefs={columnDefs}
          defaultColDef={{
            editable: true,
            flex: 1,
          }}
          onGridReady={(params) => {
            params.api.sizeColumnsToFit();
            setGridApi(params.api);
          }}
        />
      </div>
    </>
  );
};
