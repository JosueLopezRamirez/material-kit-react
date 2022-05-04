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
import { Search as SearchIcon } from "../../icons/search";
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
          Usuarios
        </Typography>
        <Box sx={{ m: 1 }}>
          <Button color="primary" variant="contained">
            <span onClick={() => setAbrirModal(true)}>Agregar Usuario</span>
          </Button>
        </Box>
      </Box>
      <Box sx={{ mt: 3 }}>
        <Card>
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
                placeholder="Buscar usuario"
                variant="outlined"
              />
            </Box>
          </CardContent>
        </Card>
      </Box>
    </Box>
  );
};
