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

const useStyles = makeStyles({
  root: {
    minWidth: 600,
  },
});

export default function EditarClienteModal({ id, open, handleClose }) {
  const classes = useStyles();
  const [cargando, setCargando] = useState(false);
  const formik = useFormik({
    initialValues: {
      nombre: "",
      descripcion: "",
      ruc: "",
      telefono: "",
    },
    validationSchema: Yup.object({
      nombre: Yup.string().max(255).required("Nombre es requerido"),
      ruc: Yup.string().max(255).required("Ruc es requerido"),
      telefono: Yup.string().max(255).required("Telefono es requerido"),
    }),
    onSubmit: async (data) => {
      try {
        await instanciaAxios.patch(`/empresas/${id}`, data);
        toast.success("Cliente editado correctamente");
        handleClose();
      } catch (error) {
        toast.error("Error al editar cliente");
      }
    },
  });

  useEffect(() => {
    if (!open) return;
    pedirInformacionCliente();
  }, [open]);

  const pedirInformacionCliente = async () => {
    try {
      setCargando(true);
      const respuesta = await instanciaAxios.get(`/empresas/${id}`);
      formik.initialValues.nombre = respuesta.data.nombre;
      formik.initialValues.ruc = respuesta.data.ruc;
      formik.initialValues.telefono = respuesta.data.telefono;
    } catch (error) {
      //
    } finally {
      setTimeout(() => {
        setCargando(false);
      }, 1000);
    }
  };

  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle>Editar cliente</DialogTitle>
      {cargando ? (
        <div className={classes.root}>
          <IndicadorCarga />
        </div>
      ) : (
        <form onSubmit={formik.handleSubmit}>
          <DialogContent>
            <TextField
              error={Boolean(formik.touched.descripcion && formik.errors.descripcion)}
              helperText={formik.touched.descripcion && formik.errors.descripcion}
              onBlur={formik.handleBlur}
              onChange={formik.handleChange}
              value={formik.values.descripcion}
              autoFocus
              margin="dense"
              name="descripcion"
              label="Descripcion"
              type="textarea"
              fullWidth
              variant="standard"
            />
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
              error={Boolean(formik.touched.ruc && formik.errors.ruc)}
              helperText={formik.touched.ruc && formik.errors.ruc}
              onBlur={formik.handleBlur}
              onChange={formik.handleChange}
              value={formik.values.ruc}
              margin="dense"
              name="ruc"
              label="Ruc"
              type="text"
              fullWidth
              variant="standard"
            />
            <TextField
              error={Boolean(formik.touched.telefono && formik.errors.telefono)}
              helperText={formik.touched.telefono && formik.errors.telefono}
              onBlur={formik.handleBlur}
              onChange={formik.handleChange}
              value={formik.values.telefono}
              margin="dense"
              name="telefono"
              label="Telefono"
              type="text"
              fullWidth
              variant="standard"
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose}>Cancelar</Button>
            <Button type="submit">Editar</Button>
          </DialogActions>
        </form>
      )}
    </Dialog>
  );
}
