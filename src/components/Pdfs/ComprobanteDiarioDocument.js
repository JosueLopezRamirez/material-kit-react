import React, { useState } from "react";
import { Document, Page, Text, View, StyleSheet, PDFViewer } from "@react-pdf/renderer";
import { useMount } from "react-use";
import instanciaAxios from "src/utils/instancia-axios";

// Create styles
const styles = StyleSheet.create({
  page: {
    flexDirection: "column",
    backgroundColor: "#E4E4E4",
    width: "100%",
    padding: 5,
  },
  section: {
    margin: 10,
    padding: 10,
    flexGrow: 1,
  },
  titleSection: {
    display: "flex",
    width: "100%",
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 25,
  },
  titleItem: {
    paddingTop: 5,
    paddingBottom: 5,
  },
  tableHeader: {
    flexDirection: "row",
    borderBottomColor: "#000000",
    backgroundColor: "#bff0fd",
    borderBottomWidth: 1,
    alignItems: "center",
    border: "1px solid #000000",
    height: "24px",
    textAlign: "center",
    fontStyle: "bold",
  },
  row: {
    flexDirection: "row",
    borderBottomColor: "#000000",
    borderBottomWidth: 1,
    alignItems: "center",
    border: "1px solid #000000",
    height: "24px",
    textAlign: "center",
  },
  headerItem: {
    width: "20%",
    borderRightColor: "#000000",
    borderRightWidth: 1,
  },
  cell: {
    width: "20%",
    borderRightColor: "#000000",
    borderRightWidth: 1,
  },
});

const getDebeTotal = (comprobante) => {
  let suma = 0;
  comprobante.comprobanteDiarioItem.forEach((element) => {
    suma = suma + element.parcial;
  });
  return suma;
};

const getHaberTotal = (comprobante) => {
  let suma = 0;
  comprobante.comprobanteDiarioItem.forEach((element) => {
    suma =
      suma +
      parseFloat(element.debito) +
      (parseFloat(element.parcial) - parseFloat(element.debito));
  });
  return suma;
};

// Create Document Component
const ComprobanteDocument = ({ comprobante }) => (
  <Document>
    <Page size="A3" style={styles.page}>
      <View style={styles.titleSection}>
        <View style={{ display: "flex", alignItems: "center" }}>
          <Text style={styles.titleItem}>{comprobante.estatico.documento.empresa.nombre}</Text>
          <Text style={styles.titleItem}>{comprobante.estatico.documento.empresa.descripcion}</Text>
          <Text style={styles.titleItem}>RUC: {comprobante.estatico.documento.empresa.ruc}</Text>
        </View>
      </View>
      <View style={{ display: "flex", alignItems: "center", marginTop: 10 }}>
        <Text style={styles.titleItem}>{comprobante.nombre}</Text>
      </View>
      <View style={styles.tableHeader}>
        <Text style={styles.headerItem}>No de cuenta</Text>
        <Text style={styles.headerItem}>Descripcion</Text>
        <Text style={styles.headerItem}>Parcial</Text>
        <Text style={styles.headerItem}>Debito</Text>
        <Text style={styles.headerItem}>Haber</Text>
      </View>
      {comprobante.comprobanteDiarioItem.map((item, index) => {
        const haber = parseFloat(item.parcial) - parseFloat(item.debito ?? 0);
        return (
          <View style={styles.row} key={`ComprobanteItem-${index}`}>
            <Text style={styles.cell}>{item.numeroCuenta}</Text>
            <Text style={styles.cell}>{item.descripcion}</Text>
            <Text style={styles.cell}>{item.parcial}</Text>
            <Text style={styles.cell}>{isNaN(item.debito) ? "" : item.debito}</Text>
            <Text style={styles.cell}>{isNaN(haber) ? "" : haber}</Text>
          </View>
        );
      })}
    </Page>
  </Document>
);

export const ComprobanteDiarioDocument = ({ id }) => {
  const [document, setDocument] = useState();

  useMount(async () => {
    const response = await instanciaAxios.get(`/comprobante-diario/${id}`);
    setDocument(response.data);
  });

  return (
    <PDFViewer width={1000} height={700}>
      {document && <ComprobanteDocument comprobante={document} />}
    </PDFViewer>
  );
};
