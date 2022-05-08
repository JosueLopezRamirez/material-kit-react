import { useRef, useState } from "react";
import { isEmpty, omit } from "lodash";
import { AddCircleOutline, Save } from "@mui/icons-material";
import { AgGridReact } from "ag-grid-react";
import { Box, Button } from "@mui/material";
import instanciaAxios from "src/utils/instancia-axios";
import { useMount } from "react-use";
import { v4 as uuidV4 } from "uuid";
import { makeStyles } from "@mui/styles";

const useStyles = makeStyles({
  grid: {
    "& .ag-cell": {
      height: "100% !important",
    },
  },
});

export default function GridCatalogo(props) {
  const classes = useStyles();
  const { columnas, endpoint } = props;
  const [key] = useState(uuidV4());
  const gridRef = useRef();
  const [gridData, setGridData] = useState([]);

  useMount(async () => {
    const data = await instanciaAxios.get(endpoint);
    setGridData(data.data?.map((data) => ({ ...data, esNuevo: false })));
  });

  return (
    <Box className={"ag-theme-alpine " + classes.grid} sx={{ width: "100%", height: 200 }}>
      <div>
        <Button
          startIcon={<AddCircleOutline style={{ color: "#5048E5" }} />}
          onClick={() => {
            gridRef.current.api.applyTransaction({
              add: [{ esNuevo: true }],
            });
          }}
          sx={{ mr: 0.5 }}
        >
          Agregar nuevo
        </Button>
        <Button
          startIcon={<Save style={{ color: "#5048E5" }} />}
          onClick={async () => {
            gridRef.current.api.showLoadingOverlay();
            let items = [];
            gridRef.current.api.forEachNodeAfterFilterAndSort((node) => {
              items.push(node.data);
            });
            console.log("items", items);
            items = items.filter((item) => !isEmpty(item));
            try {
              for (const item of items) {
                if (item.esNuevo) {
                  await instanciaAxios.post(endpoint, item);
                } else {
                  await instanciaAxios.patch(
                    endpoint + "/" + item.id,
                    omit(item, ["esNuevo", "fechaBorrado", "fechaCreacion"])
                  );
                }
              }
            } catch (error) {
              //
            } finally {
              gridRef.current.api.hideOverlay();
            }
          }}
          sx={{ mr: 0.5 }}
        >
          Guardar
        </Button>
      </div>
      <AgGridReact
        key={key}
        ref={gridRef}
        defaultColDef={{
          resizable: true,
          sortable: true,
          editable: true,
        }}
        suppressHorizontalScroll={true}
        scrollbarWidth={0}
        headerHeight={30}
        rowHeight={30}
        rowData={gridData}
        columnDefs={columnas}
        onGridReady={(params) => {
          params.api.sizeColumnsToFit();
        }}
        {...props.gridOptions}
      />
    </Box>
  );
}
