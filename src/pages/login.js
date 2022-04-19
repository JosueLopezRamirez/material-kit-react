import Head from "next/head";
import NextLink from "next/link";
import { useRouter } from "next/router";
import { useFormik } from "formik";
import * as Yup from "yup";
import { Box, Button, Container, Grid, Link, TextField, Typography } from "@mui/material";
import instanciaAxios from "src/utils/instancia-axios";
import { toast } from "react-toastify";

const Login = () => {
  const router = useRouter();
  const formik = useFormik({
    initialValues: {
      nombreUsuario: "",
      contrasenia: "",
    },
    validationSchema: Yup.object({
      nombreUsuario: Yup.string().max(255).required("Nombre de usuario es requerido"),
      contrasenia: Yup.string().max(255).required("Contraseña es requerida"),
    }),
    onSubmit: async (data) => {
      try {
        const respuesta = await instanciaAxios.post("/autenticacion/login", data);
        toast.success(respuesta.data);
        setTimeout(() => {
          router.push("/");
        }, 1000);
      } catch (error) {
        toast.error("Error al logear");
      }
    },
  });

  return (
    <>
      <Head>
        <title>Login | Material Kit</title>
      </Head>
      <Box
        component="main"
        sx={{
          alignItems: "center",
          display: "flex",
          flexGrow: 1,
          minHeight: "100%",
        }}
      >
        <Container maxWidth="sm" sx={{ border: "1px solid lightgray", borderRadius: "10px" }}>
          <form onSubmit={formik.handleSubmit}>
            <Box sx={{ my: 3 }}>
              <Typography color="textPrimary" variant="h4">
                Iniciar Sesion
              </Typography>
            </Box>
            <TextField
              error={Boolean(formik.touched.nombreUsuario && formik.errors.nombreUsuario)}
              helperText={formik.touched.nombreUsuario && formik.errors.nombreUsuario}
              fullWidth
              label="Nombre de Usuario"
              margin="normal"
              name="nombreUsuario"
              onBlur={formik.handleBlur}
              onChange={formik.handleChange}
              type="text"
              value={formik.values.nombreUsuario}
              variant="outlined"
            />
            <TextField
              fullWidth
              error={Boolean(formik.touched.contrasenia && formik.errors.contrasenia)}
              helperText={formik.touched.contrasenia && formik.errors.contrasenia}
              onBlur={formik.handleBlur}
              onChange={formik.handleChange}
              value={formik.values.contrasenia}
              label="Contraseña"
              margin="normal"
              name="contrasenia"
              type="password"
              variant="outlined"
            />
            <Box sx={{ py: 2 }}>
              <Button
                color="primary"
                disabled={formik.isSubmitting}
                fullWidth
                size="large"
                type="submit"
                variant="contained"
              >
                Iniciar sesion
              </Button>
            </Box>
          </form>
        </Container>
      </Box>
    </>
  );
};

export default Login;
