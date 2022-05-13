import { useStore } from "../../utils/store";
import { makeStyles } from "@mui/styles";

const useStyles = makeStyles(() => ({
  disable: {
    opacity: 0.2,
    pointerEvents: "none",
    display: "inline",
  },
  normal: {
    display: "inline",
  },
}));

export const FeatureFlag = (props) => {
  const { permiso, pagina } = props;
  const classes = useStyles();
  const { usuario } = useStore();

  const getStyles = () => {
    if (usuario.rol.nombre === "Administrador") return classes.normal;
    const permisoPorPagina = usuario?.rol?.permisos?.find((permiso) => permiso.pagina === pagina);
    if (permiso === "editar" && permisoPorPagina?.editar) return classes.normal;
    if (permiso === "borrar" && permisoPorPagina?.borrar) return classes.normal;
    return classes.disable;
  };

  return <div className={getStyles()}>{props.children}</div>;
};
