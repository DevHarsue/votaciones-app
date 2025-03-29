import React from 'react';
import {
  PDFDownloadLink,
  Document,
  Page,
  Text,
  Image,
  StyleSheet,
} from '@react-pdf/renderer';
import './App.css'; // Importa el archivo de estilos externo

// Estilos para el PDF con Times New Roman
const pdfStyles = StyleSheet.create({
  page: {
    padding: 20,
    fontFamily: 'Times-Roman', // Fuente Times New Roman
    fontSize: 14,
    lineHeight: 1.5,
    textAlign: 'center', // Centro del texto
  },
  logo: {
    width: 100, // Tamaño del logo
    height: 100,
    alignSelf: 'center', // Centrar el logo
    marginBottom: 10, // Espacio debajo del logo
  },
  header: {
    marginBottom: 15,
    fontSize: 20,
    fontWeight: 'bold',
  },
  section: {
    marginBottom: 20,
  },
  textItem: {
    marginBottom: 3,
  },
  image: {
    width: 100,
    height: 100,
    marginVertical: 10,
    alignSelf: 'center', // Centrar las imágenes
  },
  separator: {
    marginTop: 20,
  },
});

// Componente que genera el contenido del PDF
const MyPdfDocument = ({ data }) => (
  <Document>
    <Page style={pdfStyles.page}>
      {/* Logo encima del título */}
      {data?.logo && <Image style={pdfStyles.logo} source={{ uri: data.logo }} />}

      {/* Título */}
      <Text style={pdfStyles.header}>Detalles de la Votación</Text>

      {/* Sección del votante */}
      <Text style={pdfStyles.section}>Votante:</Text>
      <Text style={pdfStyles.textItem}>{data?.voter?.fullName || 'N/A'}</Text>
      <Text style={pdfStyles.textItem}>{data?.voter?.ci || 'N/A'}</Text> {/* Cédula */}
      <Text style={pdfStyles.textItem}>{data?.voter?.nationality || 'N/A'}</Text>
      <Text style={pdfStyles.textItem}>{data?.voter?.gender || 'N/A'}</Text>
      <Text style={pdfStyles.textItem}>{data?.voter?.email || 'N/A'}</Text>
      {data?.voter?.imageUrl && (
        <Image style={pdfStyles.image} source={{ uri: data.voter.imageUrl }} />
      )}

      {/* Separador */}
      <Text style={pdfStyles.separator}></Text>

      {/* Sección del artista (votado) */}
      <Text style={pdfStyles.section}>Artista Votado:</Text>
      <Text style={pdfStyles.textItem}>{data?.artist?.fullName || 'N/A'}</Text>
      <Text style={pdfStyles.textItem}>{data?.artist?.starName || 'N/A'}</Text>
      <Text style={pdfStyles.textItem}>{data?.artist?.gender || 'N/A'}</Text>
      {data?.artist?.imageUrl && (
        <Image style={pdfStyles.image} source={{ uri: data.artist.imageUrl }} />
      )}
    </Page>
  </Document>
);

// Componente que provee el enlace para descargar el PDF
const PdfGenerator = ({ data }) => (
  <div className="pdf-generator">
    <PDFDownloadLink
      document={<MyPdfDocument data={data} />}
      fileName="DetallesVotacion.pdf"
      className="download-link"
    >
      {({ loading }) => (loading ? 'Generando PDF...' : 'Descargar PDF')}
    </PDFDownloadLink>
  </div>
);

// Componente principal
const App = () => {
  const voteData = {
    logo: '/logo.png', // Logo encima del título
    voter: {
      
    },
    artist: {
     
    },
  };

  return (
    <div className="app-container">
      <h1 className="title">Generador de PDF para Votación</h1>
      <p className="description">
        Descarga el PDF con los detalles de la votación a continuación:
      </p>
      <PdfGenerator data={voteData} />
    </div>
  );
};

export default App;
