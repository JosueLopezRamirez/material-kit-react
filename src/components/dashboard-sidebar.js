import { useEffect, useMemo } from "react";
import { useRouter } from "next/router";
import PropTypes from "prop-types";
import { Box, Button, Divider, Drawer, useMediaQuery } from "@mui/material";
import { Cog as CogIcon } from "../icons/cog";
import ReceiptIcon from "@mui/icons-material/Receipt";
import AppRegistrationIcon from "@mui/icons-material/AppRegistration";
import { User as UserIcon } from "../icons/user";
import { Users as UsersIcon } from "../icons/users";
import { XCircle as XCircleIcon } from "../icons/x-circle";
import { NavItem } from "./nav-item";
import InsertDriveFileIcon from "@mui/icons-material/InsertDriveFile";
import LogoutIcon from "@mui/icons-material/Logout";
import { useStore } from "src/utils/store";
import { makeStyles } from "@mui/styles";

const items = [
  {
    href: "/",
    icon: <UsersIcon fontSize="small" />,
    title: "Clientes",
  },
  // {
  //   href: "/products",
  //   icon: <ShoppingBagIcon fontSize="small" />,
  //   title: "Products",
  // },
  {
    href: "/account",
    icon: <AppRegistrationIcon fontSize="small" />,
    title: "Comprobantes de diario",
  },
  {
    href: "/facturas",
    icon: <ReceiptIcon fontSize="small" />,
    title: "Facturas",
  },
  {
    href: "/users",
    icon: <UserIcon fontSize="small" />,
    title: "Usuarios",
  },
  {
    href: "/configuracion",
    icon: <CogIcon fontSize="small" />,
    title: "Configuracion",
  },
  {
    href: "/generador",
    icon: <InsertDriveFileIcon fontSize="small" />,
    title: "Plantilla de documentos",
  },
  {
    href: "/404",
    icon: <XCircleIcon fontSize="small" />,
    title: "Error",
  },
];

const useStyles = makeStyles({
  item: {
    paddingLeft: 0,
    paddingRight: 0,
  },
});

export const DashboardSidebar = (props) => {
  const { open, onClose } = props;
  const router = useRouter();
  const classes = useStyles();
  const { usuario, setUsuario } = useStore();

  const paginas = useMemo(() => {
    const rol = usuario?.rol;
    if (rol?.nombre === "Administrador") return items;

    const permisos = rol?.permisos;
    return items?.filter((item) =>
      permisos?.some(
        (permiso) => permiso.pagina.toLowerCase() === item.title.toLowerCase() && permiso.ver
      )
    );
  }, [usuario]);

  const lgUp = useMediaQuery((theme) => theme.breakpoints.up("lg"), {
    defaultMatches: true,
    noSsr: false,
  });

  useEffect(
    () => {
      if (!router.isReady) {
        return;
      }

      if (open) {
        onClose?.();
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [router.asPath]
  );

  const cerrarSesion = () => {
    localStorage.setItem("token", "");
    setUsuario(null);
    router.push("/login");
  };

  const content = (
    <>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          height: "100%",
        }}
      >
        <Box sx={{ flexGrow: 1, mt: 5 }}>
          {paginas.map((item) => (
            <NavItem
              key={item.title}
              icon={item.icon}
              href={item.href}
              title={item.title}
              classes={{ root: classes.item }}
            />
          ))}
        </Box>
        <Box>
          <Button
            startIcon={<LogoutIcon fontSize="small" sx={{ ml: 2, color: "#9CA3AF" }} />}
            onClick={cerrarSesion}
          >
            <span
              style={{
                color: "#9CA3AF",
              }}
            >
              Cerrar sesion
            </span>
          </Button>
        </Box>
        <Divider sx={{ borderColor: "#2D3748" }} />
      </Box>
    </>
  );

  if (lgUp) {
    return (
      <Drawer
        anchor="left"
        open
        PaperProps={{
          sx: {
            backgroundColor: "neutral.900",
            color: "#FFFFFF",
            width: 280,
          },
        }}
        variant="permanent"
      >
        {content}
      </Drawer>
    );
  }

  return (
    <Drawer
      anchor="left"
      onClose={onClose}
      open={open}
      PaperProps={{
        sx: {
          backgroundColor: "neutral.900",
          color: "#FFFFFF",
          width: 280,
        },
      }}
      sx={{ zIndex: (theme) => theme.zIndex.appBar + 100 }}
      variant="temporary"
    >
      {content}
    </Drawer>
  );
};

DashboardSidebar.propTypes = {
  onClose: PropTypes.func,
  open: PropTypes.bool,
};
