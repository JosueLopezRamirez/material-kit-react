import { useStore } from "../../utils/store";
import { makeStyles } from "@mui/styles";

const useStyles = makeStyles(() => ({
  disable: {
    opacity: 0.3,
    pointerEvents: "none",
    display: "inline-block",
    backgroundColor: "#C0C0C0",
    border: "1px solid #C0C0C0",
    borderRadius: "2.5px",
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
    if (usuario?.rol?.nombre === "Administrador") return classes.normal;
    const permisoPorPagina = usuario?.rol?.permisos?.find((permiso) => permiso.pagina === pagina);
    if (permiso === "edicion" && permisoPorPagina?.edicion) return classes.normal;
    if (permiso === "borrado" && permisoPorPagina?.borrado) return classes.normal;
    return classes.disable;
  };

  return <div className={getStyles()}>{props.children}</div>;
};
