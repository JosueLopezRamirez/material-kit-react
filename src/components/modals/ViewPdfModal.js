import { Button, Grid } from "@mui/material";
import { makeStyles } from "@mui/styles";
import React from "react";
import { Rnd } from "react-rnd";
import { ComprobanteDiarioDocument } from "../Pdfs/ComprobanteDiarioDocument";

const useStyles = makeStyles({
  container: {
    padding: "8px",
    backgroundColor: "#FFFF",
    boxShadow: "3px 4px 7px 0px rgba(0,0,0,0.58);",
  },
  modal: {
    background: "#4895ef",
    padding: "16px",
    borderRadius: 5,
  },
  titleWrapper: {
    width: "100%",
    padding: 5,
    backgroundColor: "#FFFF",
    cursor: "all-scroll",
  },
  title: {
    color: "black",
  },
  grid: {
    "& .ag-cell": {
      height: "100% !important",
    },
  },
});

export const ViewPdfModal = ({ variant, id, onClose }) => {
  const classes = useStyles();

  const renderDocument = () => {
    if (variant === "comprobante") return <ComprobanteDiarioDocument id={id} />;
    return <></>;
  };

  return (
    <Rnd
      minWidth={1015}
      minHeight={315}
      bounds=".zone-pages"
      enableResizing={false}
      style={{ zIndex: 2000 }}
      default={{
        x: window.innerWidth / 6,
        y: 50,
        width: 1000,
        height: 315,
      }}
    >
      <Grid className={classes.container}>
        {renderDocument()}
        <Grid
          style={{
            backgroundColor: "white",
            padding: 5,
            display: "flex",
            justifyContent: "flex-end",
            borderBottomLeftRadius: 5,
            borderBottomRightRadius: 5,
          }}
        >
          <Button size="small" variant="contained" onClick={onClose}>
            Cerrar
          </Button>
        </Grid>
      </Grid>
    </Rnd>
  );
};
