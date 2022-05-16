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
  const [clientes, setClientes] = useState([]);
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
        router.push("/generador/" + respuesta.data.id);
      } catch (error) {
        console.log({ error });
      }
    },
  });

  const getVariableRowData = () => {
    let rowData = [];
    variableRef?.current?.api?.forEachNodeAfterFilterAndSort((node) => {
      rowData.push(node.data);
    });
    return rowData;
  };

  useMount(() => {
    obtenerClientes();
    if (isEmpty(formData)) return;
    const variablesRows = JSON.parse(formData.columnas);
    setVariableRowData(variablesRows);
  });

  const obtenerClientes = async () => {
    const empresas = await instanciaAxios.get(`/empresas`);
    setClientes(empresas.data);
  };

  const getValue = (data) => {
    if (data.Tipo === "Numerico") {
      if (!data.Valor) return 1500;
      else return data.Valor;
    }
    console.log({ Tipo: data.Tipo, Valor: data.Valor });
    if (data.Tipo === "Texto") {
      if (!data.Valor) return "Documento";
      else return data.Valor;
    }
    if (data.Tipo === "Fecha") {
      if (!data.Valor) return "05/15/2022";
      else return data.Valor;
    }
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
            <Button color="primary" variant="contained" type="submit" disabled={!formik.isValid}>
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
                <Button
                  startIcon={<DeleteIcon />}
                  onClick={() => {
                    const gridApi = variableRef.current?.api;
                    const selectedRows = gridApi.getSelectedRows();
                    gridApi?.applyTransaction({ remove: selectedRows });
                  }}
                >
                  Borrar
                </Button>
                <Button
                  startIcon={<VisibilityIcon />}
                  onClick={() => {
                    let colDefs = [];
                    let rowData = [];
                    variableRef.current.api.forEachNodeAfterFilterAndSort((node) => {
                      let options = {};
                      if (node.data.Tipo === "Lista")
                        options = {
                          cellEditor: "agSelectCellEditor",
                          cellEditorParams: {
                            values: node.data?.Valor?.split(","),
                          },
                        };
                      if (node.data.Tipo === "Texto") {
                        options = {
                          valueGetter: (params) => {
                            if (params.node.Valor) return params.node.Valor;
                            return node.data.Valor;
                          },
                        };
                      }
                      if (node.data.Tipo === "Numerico") {
                        const expression = node?.data?.Valor?.split(" ");
                        console.log("expression", expression);
                        options = {
                          editable: false,
                          valueGetter: (params) => {
                            if (params?.node?.Valor) return params?.node?.Valor;
                            return node?.data?.Valor;
                          },
                        };
                      }
                      let colDef = {};
                      const index = colDefs.findIndex((col) => col.headerName === node.data.Grupo);
                      if (index === -1) {
                        colDef = {
                          headerName: node.data.Grupo,
                          children: [
                            {
                              field: node.data.Nombre,
                              //...options,
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
                              field: node.data.Nombre,
                              //...options,
                            },
                          ],
                        };
                      }
                      rowData = {
                        ...rowData,
                        [node.data.Nombre]: getValue(node.data),
                      };
                    });
                    gridRef.current.api.setColumnDefs(colDefs);
                    setExpanded(true);
                    console.log({ rowData, coldef: gridRef.current.api.getColumnDefs() });
                    gridRef.current.api.setRowData(Array(8).fill(rowData));
                  }}
                >
                  Visualizar
                </Button>
              </div>
              <div
                className={"ag-theme-alpine " + classes.grid}
                style={{ height: 200, width: "100%" }}
              >
                <AgGridReact
                  ref={variableRef}
                  rowData={variableRowData}
                  rowHeight={30}
                  headerHeight={30}
                  columnDefs={variablesColDefs}
                  defaultColDef={{
                    editable: true,
                    flex: 1,
                  }}
                  components={{
                    inputOnlyLetters: InputOnlyLettersRenderer,
                  }}
                />
              </div>
            </div>
          </CardContent>
        </Card>
      </Box>
      <Accordion expanded={expanded} onChange={() => setExpanded(false)}>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel1a-content"
          id="panel1a-header"
        >
          Visualizacion
        </AccordionSummary>
        <AccordionDetails>
          <div
            className={"ag-theme-alpine " + classes.grid}
            style={{ height: 400, width: "100%", marginTop: 15 }}
          >
            <AgGridReact
              ref={gridRef}
              rowData={[]}
              rowHeight={30}
              headerHeight={30}
              defaultColDef={{
                editable: false,
                flex: 1,
              }}
            />
          </div>
        </AccordionDetails>
      </Accordion>
    </>
  );
};
