import Head from "next/head";
import NextLink from "next/link";
import { useRouter } from "next/router";
import { useFormik } from "formik";
import * as Yup from "yup";
import { Box, Button, Container, TextField, Typography } from "@mui/material";
import instanciaAxios from "src/utils/instancia-axios";
import { toast } from "react-toastify";
import { useStore } from "src/utils/store";

const Login = () => {
  const router = useRouter();
  const setUsuario = useStore((state) => state.setUsuario);
  const formik = useFormik({
    initialValues: {
      correo: "",
      password: "",
    },
    validationSchema: Yup.object({
      correo: Yup.string().max(255).required("Nombre de usuario es requerido"),
      password: Yup.string().max(255).required("Contraseña es requerida"),
    }),
    onSubmit: async (data) => {
      try {
        const respuesta = await instanciaAxios.post("/autenticacion/login", data);
        setUsuario(respuesta.data.usuario);
        localStorage.setItem("token", respuesta.data.access_token);
        toast.success("Logeado Correctamente");
        setTimeout(() => {
          router.push("/");
        }, 1000);
      } catch (error) {
        console.log(error);
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
              error={Boolean(formik.touched.correo && formik.errors.correo)}
              helperText={formik.touched.correo && formik.errors.correo}
              fullWidth
              label="Nombre de Usuario"
              margin="normal"
              name="correo"
              onBlur={formik.handleBlur}
              onChange={formik.handleChange}
              type="text"
              value={formik.values.correo}
              variant="outlined"
            />
            <TextField
              fullWidth
              error={Boolean(formik.touched.password && formik.errors.password)}
              helperText={formik.touched.password && formik.errors.password}
              onBlur={formik.handleBlur}
              onChange={formik.handleChange}
              value={formik.values.password}
              label="Contraseña"
              margin="normal"
              name="password"
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
