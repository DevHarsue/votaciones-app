import {
    Document,
    Page,
    Text,
    Image,
    StyleSheet,
} from '@react-pdf/renderer';
import { Artist,User } from '../ui/types';

interface Data{
    voter: User
    artist: Artist
}

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
        fontWeight: 'bold',
    },
    textItem: {
        marginBottom: 3,
    },
    image: {
        width: 100,
        height: 100,
        marginVertical: 10,
        alignSelf: 'center', // Centrar las imágenes
        marginBottom: 20
    },
    separator: {
        marginTop: 20,
    },
});

// Componente que genera el contenido del PDF
const MyPdfDocument = ({ data }:{data:Data}) => {
    data.voter.gender= data.voter.gender=="M" ? "Masculino" : data.voter.gender=="F" ? "Femenino" : "Otro";
    data.artist.gender= data.artist.gender=="M" ? "Masculino" : data.artist.gender=="F" ? "Femenino" : "Otro";
    const logo = process.env.NEXT_PUBLIC_API_URL + "public\\animals-logo1.png"
    return (
        <Document>
            <Page style={pdfStyles.page}>
            <Text style={pdfStyles.header}>CNU</Text>
            {/* Logo encima del título */}
            {logo && <Image style={pdfStyles.logo} source={{ uri: logo}} />}

            {/* Título */}
            <Text style={pdfStyles.header}>Detalles de Voto:</Text>

            {/* Sección del votante */}
            <Text style={pdfStyles.section}>Votante:</Text>
            <Text style={pdfStyles.textItem}>{(data?.voter?.nationality + "-" +data?.voter?.ci) || 'N/A'}</Text> {/* Cédula */}
            <Text style={pdfStyles.textItem}>{(data?.voter?.name + " " + data?.voter.lastname) || 'N/A'}</Text>
            <Text style={pdfStyles.textItem}>{data?.voter?.gender || 'N/A'}</Text>
            <Text style={pdfStyles.textItem}>{data?.voter?.email || 'N/A'}</Text>
            {data?.voter?.image_url && (
                <Image style={pdfStyles.image} source={{ uri: process.env.NEXT_PUBLIC_API_URL+data.voter.image_url }} />
            )}

            {/* Separador */}
            <Text style={pdfStyles.separator}></Text>

            {/* Sección del artista (votado) */}
            <Text style={pdfStyles.section}>Artista Votado:</Text>
            <Text style={pdfStyles.textItem}>{data?.artist?.starname || 'N/A'}</Text>
            <Text style={pdfStyles.textItem}>{(data?.artist?.name + " " + data?.artist.lastname) || 'N/A'}</Text>
            <Text style={pdfStyles.textItem}>{data?.artist?.gender || 'N/A'}</Text>
            {data?.artist?.image_url && (
                <Image style={pdfStyles.image} source={{ uri: process.env.NEXT_PUBLIC_API_URL+data.artist.image_url }} />
            )}
            </Page>
        </Document>
    );
}


import { pdf } from '@react-pdf/renderer';

export const generarPDF = async (data: Data) => {
    try {
        // Generar el PDF como Blob
        const blob = await pdf(<MyPdfDocument data={data} />).toBlob();
        
        // Crear un objeto URL temporal
        const url = URL.createObjectURL(blob);
        
        // Crear un enlace y simular click
        const link = document.createElement('a');
        link.href = url;
        link.download = 'voto-cnu-'+data.voter.id+'.pdf'; // Nombre del archivo
        document.body.appendChild(link);
        link.click();
        
        // Limpiar
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    } catch (error) {
        console.error('Error al generar PDF:', error);
    }
};