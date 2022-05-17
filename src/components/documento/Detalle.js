import { useEffect, useMemo, useRef, useState } from "react";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  Divider,
  FormControlLabel,
  Grid,
  MenuItem,
  Switch,
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
import VisibilityIcon from "@mui/icons-material/Visibility";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import DeleteIcon from "@mui/icons-material/Delete";
import { isEmpty } from "lodash";
import { InputOnlyLettersRenderer } from "../renderers";

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
  variableCell: {
    paddingLeft: "0px !important",
    paddingRight: "0px !important",
  },
});

export const Detalle = (props) => {
  const { formData, isEdit } = props;
  const classes = useStyles();
  const router = useRouter();
  const variableRef = useRef();
  const gridRef = useRef();
  const [expanded, setExpanded] = useState(false);
  const [plantillaSeleccionada, setPlantillaSeleccionada] = useState(null);
  const [clientes, setClientes] = useState([]);
  const [plantillas, setPlantillas] = useState([]);
  const [variableRowData, setVariableRowData] = useState([]);

  const variablesColDefs = useMemo(
    () => [
      { field: "", checkboxSelection: true, maxWidth: 35, editable: false },
      {
        field: "Nombre",
        cellClass: classes.variableCell,
        //cellRenderer: "inputOnlyLetters",
        //editable: false,
      },
      { field: "Grupo" },
      { field: "Valor" },
      {
        field: "Tipo",
        cellEditor: "agSelectCellEditor",
        cellEditorParams: {
          values: ["Numerico", "Texto", "Lista", "Fecha"],
        },
      },
    ],
    []
  );

  const formik = useFormik({
    initialValues: {
      empresaId: formData?.documento?.empresaId,
      plantillaId: formData?.plantillaId,
      nombre: formData?.nombre,
      fecha: formData?.fecha,
    },
    validationSchema: Yup.object({
      nombre: Yup.string().max(255).required("Nombre es requerido"),
      empresaId: Yup.string().max(255).required("Cliente es requerido"),
      plantillaId: Yup.string().max(255).required("Plantilla es requerida"),
      fecha: Yup.string().max(255).required("Fecha es requerido"),
    }),
    onSubmit: async (data) => {
      try {
        let respuesta = null;
        const newData = {
          ...data,
          columnas: JSON.stringify(getVariableRowData()),
          esPlantilla: true,
        };
        if (isEdit) {
          respuesta = await instanciaAxios.patch(`/dinamicos/` + formData.id, newData);
        } else {
          respuesta = await instanciaAxios.post(`/dinamicos/`, newData);
        }
        router.push("/documentos/" + respuesta.data.id);
      } catch (error) {
        console.log({ error });
      }
    },
  });

  useEffect(() => {
    if (!plantillaSeleccionada) return;
    const columns = JSON.parse(plantillaSeleccionada.columnas);
    createColumnDefs(columns);
  }, [plantillaSeleccionada]);

  const numberNewValueHandler = (params) => {
    var valueAsNumber = parseFloat(params.newValue);
    var field = params.colDef.field;
    var data = params.data;
    data[field] = valueAsNumber;
    return true;
  };

  const createColumnDefs = (columns = []) => {
    let colDefs = [];
    let colDef = {};
    columns?.forEach((column) => {
      let options = {};
      if (column.Tipo === "Texto") {
        if (column.Valor) {
          options = {
            valueGetter: (params) => params.node.data[column.Nombre] ?? column.Valor,
          };
        }
      }
      if (column.Tipo === "Lista") {
        if (column.Valor) {
          options = {
            cellEditor: "agSelectCellEditor",
            cellEditorParams: {
              values: column.Valor.split(","),
            },
          };
        }
      }
      if (column.Tipo === "Numerico") {
        if (column.Valor) {
          if (isNaN(column.Valor)) {
            const expresiones = column.Valor.split(" ");
            let newExpression = "";
            expresiones.forEach((expression) => {
              if (["+", "-", "/", "*"].includes(expression)) {
                newExpression = newExpression + " ".concat(expression);
              } else {
                newExpression = newExpression + `parseFloat(data.${expression} ?? 0)`;
              }
            });
            console.log({ newExpression });
            options = {
              valueGetter: newExpression,
              valueFormatter: (params) => parseFloat(params.value).toFixed(2),
            };
          } else {
            options = {
              valueSetter: numberNewValueHandler,
              // valueGetter: (params) =>
              //   parseFloat(params.node.data[column.Nombre]) ?? parseFloat(column.Valor),
            };
          }
        }
      }
      if (column.Tipo === "Fecha") {
        if (column.Valor) {
          options = {
            valueGetter: (params) =>
              params.node.data[column.Nombre] ?? format(new Date(column.Valor), "dd-MM-yyyy"),
          };
        }
      }
      const index = colDefs.findIndex((col) => col.headerName === column.Grupo);
      if (index === -1) {
        colDef = {
          headerName: column.Grupo,
          children: [
            {
              field: column.Nombre,
              ...options,
            },
          ],
        };
        colDefs.push(colDef);
      } else {
        colDefs[index] = {
          ...colDefs[index],
          children: [
            ...colDefs[index].children,
            {
              field: column.Nombre,
              ...options,
            },
          ],
        };
      }
    });
    gridRef.current.api.setColumnDefs([
      { field: "", checkboxSelection: true, width: 35, maxWidth: 35 },
      ...colDefs,
    ]);
  };

  const getVariableRowData = () => {
    let rowData = [];
    variableRef?.current?.api?.forEachNodeAfterFilterAndSort((node) => {
      rowData.push(node.data);
    });
    return rowData;
  };

  useMount(() => {
    obtenerClientes();
    obtenerPlantillas();
    if (isEmpty(formData)) return;
    const variablesRows = JSON.parse(formData.filas);
    setVariableRowData(variablesRows);
  });

  const obtenerClientes = async () => {
    const empresas = await instanciaAxios.get(`/empresas`);
    setClientes(empresas.data);
  };

  const obtenerPlantillas = async () => {
    const response = await instanciaAxios.get(`/plantillas`);
    setPlantillas(response.data);
  };

  return (
    <>
      <form onSubmit={formik.handleSubmit}>
        <Card sx={{ borderRadius: 0 }}>
          <CardContent classes={{ root: classes.cardContent }}>
            <Grid container spacing={3}>
              <Grid item md={6} xs={12} classes={{ item: classes.item }}>
                <TextField
                  fullWidth
                  label="Plantilla"
                  name="plantillaId"
                  select
                  value={formik.values.plantillaId}
                  onChange={(e) => {
                    setPlantillaSeleccionada(plantillas.find((p) => p.id === e.target.value));
                    formik.handleChange(e);
                  }}
                  error={Boolean(formik.touched.plantillaId && formik.errors.plantillaId)}
                  helperText={formik.touched.plantillaId && formik.errors.plantillaId}
                  onBlur={formik.handleBlur}
                  margin="dense"
                  variant="standard"
                  disabled={isEdit}
                >
                  {plantillas.map((option) => (
                    <MenuItem value={option.id}>{option.nombre}</MenuItem>
                  ))}
                </TextField>
              </Grid>
              <Grid item md={6} xs={12} classes={{ item: classes.item }}>
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
            <Button
              color="primary"
              variant="contained"
              type="submit"
              disabled={!formik.isValid && !getVariableRowData().length}
            >
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
                    gridRef.current?.api?.applyTransaction({ add: [{ isNewRow: true }] });
                  }}
                >
                  Agregar fila
                </Button>
                <Button
                  startIcon={<DeleteIcon />}
                  onClick={() => {
                    const gridApi = gridRef.current?.api;
                    const selectedRows = gridApi.getSelectedRows();
                    gridApi?.applyTransaction({ remove: selectedRows });
                  }}
                >
                  Borrar
                </Button>
              </div>
              <div
                className={"ag-theme-alpine " + classes.grid}
                style={{ height: 400, width: "100%", marginTop: 15 }}
              >
                <AgGridReact
                  ref={gridRef}
                  rowData={variableRowData}
                  rowHeight={30}
                  headerHeight={30}
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
    </>
  );
};
