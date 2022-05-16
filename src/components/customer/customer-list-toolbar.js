import {
  Box,
  Button,
  Card,
  CardContent,
  TextField,
  InputAdornment,
  SvgIcon,
  Typography,
} from "@mui/material";
import { useState } from "react";
import { CLIENTE, permiso } from "src/utils/Constants";
import { Search as SearchIcon } from "../../icons/search";
import { FeatureFlag } from "../FeatureFlag";
import CrearClienteModal from "./CrearCliente";

export const CustomerListToolbar = (props) => {
  const [abrirModal, setAbrirModal] = useState(false);

  return (
    <Box {...props}>
      <CrearClienteModal
        open={abrirModal}
        handleClose={() => {
          setAbrirModal(false);
          props.refrescar();
        }}
      />
      <Box
        sx={{
          alignItems: "center",
          display: "flex",
          justifyContent: "space-between",
          flexWrap: "wrap",
          m: -1,
        }}
      >
        <Typography sx={{ m: 1 }} variant="h4">
          Clientes
        </Typography>
        <Box sx={{ m: 1 }}>
          <FeatureFlag pagina={CLIENTE} permiso={permiso.EDICION}>
            <Button color="primary" variant="contained">
              <span onClick={() => setAbrirModal(true)}>Agregar Cliente</span>
            </Button>
          </FeatureFlag>
        </Box>
      </Box>
      <Box sx={{ mt: 3 }}>
        <Card sx={{ borderRadius: 0 }}>
          <CardContent>
            <Box sx={{ maxWidth: "100%" }}>
              <TextField
                fullWidth
                size="small"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SvgIcon color="action" fontSize="small">
                        <SearchIcon />
                      </SvgIcon>
                    </InputAdornment>
                  ),
                }}
                placeholder="Buscar cliente"
                variant="outlined"
              />
            </Box>
          </CardContent>
        </Card>
      </Box>
    </Box>
  );
};
