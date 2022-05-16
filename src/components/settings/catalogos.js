import {
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  Divider,
  Grid,
  Typography,
} from "@mui/material";
import { useMemo, useState } from "react";
import { useMount } from "react-use";
import instanciaAxios from "src/utils/instancia-axios";
import GridCatalogo from "../Grid/GridCatalogo";
import { SelectRenderer, SwitchRenderer } from "../renderers";

const catalogoColumnas = [
  {
    field: "nombre",
    with: "100%",
  },
];

export const Catalogos = (props) => {
  return (
    <Card sx={{ borderRadius: 0 }}>
      <CardHeader
        subheader="Administracion de catalogos"
        title="Catalogos"
        sx={{ padding: "16px" }}
      />
      <Divider />
      <CardContent sx={{ minHeight: 300, height: "fit-content", padding: "16px" }}>
        <Grid container spacing={3} wrap="wrap">
          <Grid
            item
            md={4}
            sm={6}
            sx={{
              display: "flex",
              flexDirection: "column",
            }}
            xs={12}
          >
            <Typography color="textPrimary" gutterBottom variant="h6">
              Roles
            </Typography>
            <GridCatalogo columnas={catalogoColumnas} endpoint={"/roles"} />
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
};

export const Permisos = (props) => {
  const [roles, setRoles] = useState([]);

  useMount(async () => {
    const response = await instanciaAxios.get("/roles");
    setRoles(response.data);
  });

  const permisosColumnas = useMemo(
    () => [
      {
        field: "rolId",
        headerName: "Rol",
        cellRenderer: "selectRenderer",
        cellRendererParams: {
          options: roles
            .filter((rol) => rol.nombre.toLowerCase() !== "administrador")
            .map((rol) => ({ label: rol.nombre, value: rol.id })),
        },
      },
      {
        field: "pagina",
        cellEditor: "agSelectCellEditor",
        cellEditorParams: {
          values: ["Clientes", "Comprobantes de diario", "Facturas"],
        },
      },
      {
        field: "ver",
        headerName: "Visualizacion",
        cellRenderer: "switchRenderer",
        sortable: false,
        rezisable: false,
        suppressSizeToFit: true,
        editable: false,
      },
      {
        field: "edicion",
        cellRenderer: "switchRenderer",
        sortable: false,
        rezisable: false,
        suppressSizeToFit: true,
        editable: false,
      },
      {
        field: "borrado",
        cellRenderer: "switchRenderer",
        sortable: false,
        rezisable: false,
        suppressSizeToFit: true,
        editable: false,
      },
    ],
    [roles]
  );

  return (
    <Card sx={{ borderRadius: 0 }}>
      <CardHeader
        subheader="Administracion de permisos"
        title="Permisos"
        sx={{ padding: "16px" }}
      />
      <Divider />
      <CardContent sx={{ minHeight: 300, height: "fit-content", padding: "16px" }}>
        <Grid container spacing={3} wrap="wrap">
          <Grid
            item
            md={12}
            sm={6}
            sx={{
              display: "flex",
              flexDirection: "column",
            }}
            xs={12}
          >
            <Typography color="textPrimary" gutterBottom variant="h6">
              Permisos
            </Typography>
            <GridCatalogo
              columnas={permisosColumnas}
              endpoint={"/permisos"}
              gridOptions={{
                components: {
                  switchRenderer: SwitchRenderer,
                  selectRenderer: SelectRenderer,
                },
              }}
            />
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
};
