import {
    Document,
    Page,
    Text,
    Image,
    View,
    StyleSheet,
} from '@react-pdf/renderer';
import { Artist, User } from '../ui/types';
import { pdf } from '@react-pdf/renderer';

interface Data {
    voter: User
    artist: Artist
}

// Mejorado: Estilos organizados y mejor legibilidad
const pdfStyles = StyleSheet.create({
    page: {
        padding: 40,
        fontFamily: 'Times-Roman',
        fontSize: 12,
        lineHeight: 1.5,
    },
    headerContainer: {
        marginBottom: 20,
        alignItems: 'center',
    },
    logo: {
        width: 80,
        height: 80,
        marginBottom: 10,
    },
    title: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 5,
    },
    subtitle: {
        fontSize: 14,
        marginBottom: 15,
    },
    section: {
        marginBottom: 20,
    },
    sectionTitle: {
        fontSize: 14,
        fontWeight: 'bold',
        marginBottom: 10,
        textDecoration: 'underline',
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 5,
    },
    label: {
        fontWeight: 'bold',
        width: '30%',
        textAlign: 'right',
    },
    value: {
        width: '65%',
        textAlign: 'left',
    },
    separator: {
        borderBottomWidth: 1,
        borderBottomColor: '#000',
        marginVertical: 15,
    },
    photo: {
        width: 120,
        height: 150,
        marginTop: 10,
        borderWidth: 1,
        borderColor: '#ccc',
    },
    logoContainer: {
        position: 'absolute',
        top: 20,
        left: 20,
        zIndex: 1,
    },
});

// Mejorado: Componente más organizado y con mejor manejo de datos
const MyPdfDocument = ({ data }: { data: Data }) => {
    // Evitar mutación directa de props
    const voter = {
        ...data.voter,
        gender: data.voter.gender === "M" ? "Masculino" : 
                data.voter.gender === "F" ? "Femenino" : "Otro"
    };

    const artist = {
        ...data.artist,
        gender: data.artist.gender === "M" ? "Masculino" : 
               data.artist.gender === "F" ? "Femenino" : "Otro"
    };

    const formatCI = () => {
        return `${voter.nationality}-${voter.ci}`;
    };

    const buildImageUrl = (path: string) => {
        // Mejorado: Manejo seguro de URLs
        const baseUrl = process.env.NEXT_PUBLIC_API_URL || '';
        return `${baseUrl}${path.replace(/\\/g, '/')}`;
    };

    return (
        <Document>
            <Page style={pdfStyles.page}>
                <View style={pdfStyles.logoContainer}>
                    <Image 
                        style={pdfStyles.logo} 
                        source={{ uri: buildImageUrl("public/animals-logo1.png") }} 
                    />
                </View>
                <View style={pdfStyles.headerContainer}>
                    <Text style={pdfStyles.title}>CONSEJO NACIONAL UNICO</Text>
                    <Text style={pdfStyles.subtitle}>Comprobante de Voto</Text>
                </View>

                <View style={pdfStyles.section}>
                    <Text style={pdfStyles.sectionTitle}>DATOS DEL VOTANTE</Text>
                    
                    <View style={pdfStyles.row}>
                        <Text style={pdfStyles.label}>Cédula:</Text>
                        <Text style={pdfStyles.value}>{formatCI()}</Text>
                    </View>
                    
                    <View style={pdfStyles.row}>
                        <Text style={pdfStyles.label}>Nombre:</Text>
                        <Text style={pdfStyles.value}>{`${voter.name} ${voter.lastname}`}</Text>
                    </View>
                    
                    <View style={pdfStyles.row}>
                        <Text style={pdfStyles.label}>Género:</Text>
                        <Text style={pdfStyles.value}>{voter.gender}</Text>
                    </View>
                    
                    <View style={pdfStyles.row}>
                        <Text style={pdfStyles.label}>Email:</Text>
                        <Text style={pdfStyles.value}>{voter.email}</Text>
                    </View>

                    {voter.image_url && (
                        <View style={{ alignItems: 'center', marginTop: 10 }}>
                            <Text style={{ marginBottom: 5 }}>Foto de perfil:</Text>
                            <Image 
                                style={pdfStyles.photo} 
                                source={{ uri: buildImageUrl(voter.image_url) }} 
                            />
                        </View>
                    )}
                </View>

                <View style={pdfStyles.separator} />

                <View style={pdfStyles.section}>
                    <Text style={pdfStyles.sectionTitle}>ARTISTA SELECCIONADO</Text>
                    
                    <View style={pdfStyles.row}>
                        <Text style={pdfStyles.label}>Nombre Artístico:</Text>
                        <Text style={pdfStyles.value}>{artist.starname}</Text>
                    </View>
                    
                    <View style={pdfStyles.row}>
                        <Text style={pdfStyles.label}>Nombre Real:</Text>
                        <Text style={pdfStyles.value}>{`${artist.name} ${artist.lastname}`}</Text>
                    </View>
                    
                    <View style={pdfStyles.row}>
                        <Text style={pdfStyles.label}>Género:</Text>
                        <Text style={pdfStyles.value}>{artist.gender}</Text>
                    </View>

                    {artist.image_url && (
                        <View style={{ alignItems: 'center', marginTop: 10 }}>
                            <Text style={{ marginBottom: 5 }}>Foto del artista:</Text>
                            <Image 
                                style={pdfStyles.photo} 
                                source={{ uri: buildImageUrl(artist.image_url) }} 
                            />
                        </View>
                    )}
                </View>
            </Page>
        </Document>
    );
};

// Función de generación de PDF (se mantiene similar pero con mejor nombre)
export const generarComprobantePDF = async (data: Data) => {
    try {
        const blob = await pdf(<MyPdfDocument data={data} />).toBlob();
        const url = URL.createObjectURL(blob);
        
        const link = document.createElement('a');
        link.href = url;
        link.download = `comprobante-voto-${data.voter.ci}.pdf`;
        document.body.appendChild(link);
        link.click();
        
        // Limpieza
        setTimeout(() => {
            document.body.removeChild(link);
            URL.revokeObjectURL(url);
        }, 100);
    } catch (error) {
        console.error('Error generando comprobante:', error);
        throw new Error('No se pudo generar el comprobante');
    }
};