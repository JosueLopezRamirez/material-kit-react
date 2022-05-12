import PropTypes from "prop-types";
import styled from "@emotion/styled";
import { AppBar, Box, IconButton, Toolbar, Tooltip } from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import BuildIcon from "@mui/icons-material/Build";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import { useState } from "react";
import { makeStyles } from "@mui/styles";
import { Historial } from "./modals/Historial";

const DashboardNavbarRoot = styled(AppBar)(({ theme }) => ({
  backgroundColor: theme.palette.background.paper,
  boxShadow: theme.shadows[3],
}));

const useStyles = makeStyles({
  paper: {
    borderRadius: 0,
  },
});

export const DashboardNavbar = (props) => {
  const classes = useStyles();
  const { onSidebarOpen, ...other } = props;
  const [anchorEl, setAnchorEl] = useState(null);
  const [verHistorial, setVerHistorial] = useState(false);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const mostrarHistorial = () => {
    setVerHistorial(true);
    handleClose();
  };

  return (
    <>
      <DashboardNavbarRoot
        sx={{
          left: {
            lg: 280,
          },
          width: {
            lg: "calc(100% - 280px)",
          },
        }}
        {...other}
      >
        <Toolbar
          disableGutters
          sx={{
            minHeight: 50,
            left: 0,
            px: 2,
          }}
        >
          <IconButton
            onClick={onSidebarOpen}
            sx={{
              display: {
                xs: "inline-flex",
                lg: "none",
              },
            }}
          >
            <MenuIcon fontSize="small" />
          </IconButton>
          <Box sx={{ flexGrow: 1 }} />
          <Box>
            <Tooltip title="Herramientas">
              <IconButton sx={{ ml: 1 }} onClick={handleClick}>
                <BuildIcon fontSize="small" />
              </IconButton>
            </Tooltip>
            <Menu
              id="basic-menu"
              anchorEl={anchorEl}
              open={open}
              onClose={handleClose}
              MenuListProps={{
                "aria-labelledby": "basic-button",
              }}
              classes={{ paper: classes.paper }}
            >
              <MenuItem onClick={mostrarHistorial}>Mostrar historial</MenuItem>
            </Menu>
          </Box>
        </Toolbar>
        {verHistorial && <Historial toggle={() => setVerHistorial(false)} />}
      </DashboardNavbarRoot>
    </>
  );
};

DashboardNavbar.propTypes = {
  onSidebarOpen: PropTypes.func,
};
