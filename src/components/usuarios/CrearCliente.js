import React, { useEffect, useState } from "react";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import { useFormik } from "formik";
import instanciaAxios from "src/utils/instancia-axios";
import * as Yup from "yup";
import IndicadorCarga from "../IndicadorCarga";
import { makeStyles } from "@mui/styles";
import { toast } from "react-toastify";
import { MenuItem, Select } from "@mui/material";

const useStyles = makeStyles({
  root: {
    minWidth: 600,
  },
});

export default function CrearClienteModal({ open, handleClose }) {
  const classes = useStyles();
  const [cargando, setCargando] = useState(false);
  const [roles, setRoles] = useState([]);
  const formik = useFormik({
    initialValues: {
      nombre: "",
      apellidoMaterno: "",
      apellidoPaterno: "",
      correo: "",
      rolId: "",
      password: "",
    },
    validationSchema: Yup.object({
      nombre: Yup.string().max(255).required("Nombre es requerido"),
      apellidoPaterno: Yup.string().max(255).required("Apellido paterno es requerido"),
      correo: Yup.string().email("Debe ser correo valido").max(255).required("Correo es requerido"),
      password: Yup.string().max(255).required("Contraseña es requerida"),
      rolId: Yup.string().max(255).required("Rol es requerido"),
    }),
    onSubmit: async (data) => {
      try {
        setCargando(true);
        await instanciaAxios.post(`/usuario`, data);
        toast.success("Usuario creado correctamente");
        formik.setValues({
          ...formik.initialValues,
        });
        handleClose();
      } catch (error) {
        toast.error("Error al crear usuario");
      } finally {
        setCargando(false);
      }
    },
  });

  useEffect(() => {
    obtenerRoles();
  }, []);

  const obtenerRoles = async () => {
    const roles = await instanciaAxios.get(`/roles`);
    setRoles(roles.data);
  };

  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle>Crear usuario</DialogTitle>
      {cargando ? (
        <div className={classes.root}>
          <IndicadorCarga />
        </div>
      ) : (
        <form onSubmit={formik.handleSubmit}>
          <DialogContent>
            <TextField
              error={Boolean(formik.touched.nombre && formik.errors.nombre)}
              helperText={formik.touched.nombre && formik.errors.nombre}
              onBlur={formik.handleBlur}
              onChange={formik.handleChange}
              value={formik.values.nombre}
              autoFocus
              margin="dense"
              name="nombre"
              label="Nombre"
              type="text"
              fullWidth
              variant="standard"
            />
            <TextField
              error={Boolean(formik.touched.apellidoPaterno && formik.errors.apellidoPaterno)}
              helperText={formik.touched.apellidoPaterno && formik.errors.apellidoPaterno}
              onBlur={formik.handleBlur}
              onChange={formik.handleChange}
              value={formik.values.apellidoPaterno}
              autoFocus
              margin="dense"
              name="apellidoPaterno"
              label="Apellido paterno"
              type="text"
              fullWidth
              variant="standard"
            />
            <TextField
              error={Boolean(formik.touched.apellidoMaterno && formik.errors.apellidoMaterno)}
              helperText={formik.touched.apellidoMaterno && formik.errors.apellidoMaterno}
              onBlur={formik.handleBlur}
              onChange={formik.handleChange}
              value={formik.values.apellidoMaterno}
              autoFocus
              margin="dense"
              name="apellidoMaterno"
              label="Apellido materno"
              type="text"
              fullWidth
              variant="standard"
            />
            <TextField
              error={Boolean(formik.touched.correo && formik.errors.correo)}
              helperText={formik.touched.correo && formik.errors.correo}
              onBlur={formik.handleBlur}
              onChange={formik.handleChange}
              value={formik.values.correo}
              margin="dense"
              name="correo"
              label="Correo"
              type="email"
              fullWidth
              variant="standard"
            />
            <TextField
              error={Boolean(formik.touched.password && formik.errors.password)}
              helperText={formik.touched.password && formik.errors.password}
              onBlur={formik.handleBlur}
              onChange={formik.handleChange}
              value={formik.values.password}
              margin="dense"
              name="password"
              label="Contraseña"
              type="password"
              fullWidth
              variant="standard"
            />
            <TextField
              value={formik.values.rolId}
              select
              label="Rol"
              name="rolId"
              onChange={formik.handleChange}
              error={Boolean(formik.touched.rolId && formik.errors.rolId)}
              helperText={formik.touched.rolId && formik.errors.rolId}
              onBlur={formik.handleBlur}
              fullWidth
              margin="dense"
              sx={{ marginTop: 2 }}
              variant="standard"
            >
              {roles.map((rol) => (
                <MenuItem value={rol.id}>{rol.nombre}</MenuItem>
              ))}
            </TextField>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose}>Cancelar</Button>
            <Button type="submit">Guardar</Button>
          </DialogActions>
        </form>
      )}
    </Dialog>
  );
}
