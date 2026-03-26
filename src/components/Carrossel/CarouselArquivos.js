import Slider from "react-slick";
import { Box, Typography } from "@mui/material";
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';

const getFileExtension = (url) => {
    try {
        const pathname = new URL(url).pathname;
        return pathname.split('.').pop().toLowerCase();
    } catch (err) {
        return '';
    }
};

// Estilo para as setas
const arrowStyle = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: '#000',
    color: '#fff',
    borderRadius: '50%',
    width: 40,
    height: 40,
    zIndex: 10,
    cursor: 'pointer',
    opacity: 0.7,
    transition: 'all 0.3s ease',
    position: 'absolute',
    top: '50%',
    transform: 'translateY(-50%)',
};

const CustomNextArrow = ({ onClick }) => (
    <div style={{ ...arrowStyle, right: 10 }} onClick={onClick}>
        <ChevronRightIcon />
    </div>
);

const CustomPrevArrow = ({ onClick }) => (
    <div style={{ ...arrowStyle, left: 10 }} onClick={onClick}>
        <ChevronLeftIcon />
    </div>
);

const CarouselArquivos = ({ arquivos }) => {
    const settings = {
        dots: true,
        infinite: false,
        speed: 500,
        slidesToShow: 1,
        slidesToScroll: 1,
        adaptiveHeight: true,
        nextArrow: <CustomNextArrow />,
        prevArrow: <CustomPrevArrow />
    };

    return (
        <Box sx={{ mt: 4 }}>
            {/* <Typography variant="h5" sx={{ mb: 2 }}>
                Arquivos do Atendimento
            </Typography> */}
            <Box
                sx={{
                    position: 'relative',
                    width: '100%',
                    maxWidth: '900px',
                    mx: 'auto'
                }}
            >
                <Slider {...settings}>
                    {arquivos.map((arquivo, index) => {
                        const caminho = arquivo.caminho;
                        const ext = getFileExtension(caminho);

                        const isImg = ['jpg', 'jpeg', 'png', 'gif', 'webp'].includes(ext);
                        const isVideo = ['mp4', 'webm', 'ogg'].includes(ext);
                        const isPdf = ext === 'pdf';

                        return (
                            <Box
                                key={index}
                                sx={{
                                    minHeight: '500px',
                                    backgroundColor: '#f0f0f0',
                                    borderRadius: '10px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    overflow: 'hidden',
                                    px: 2,
                                    textAlign: 'center'
                                }}
                            >
                                {isImg && (
                                    <a href={caminho} target="_blank" rel="noopener noreferrer" style={{ width: '100%' }}>
                                        <img
                                            src={caminho}
                                            alt={`img-${index}`}
                                            style={{
                                                maxHeight: '500px',
                                                maxWidth: '100%',
                                                objectFit: 'contain',
                                                borderRadius: '8px',
                                                cursor: 'zoom-in',
                                                margin: '0 auto',
                                                display: 'block'
                                            }}
                                        />
                                    </a>
                                )}

                                {isVideo && (
                                    <video
                                        src={caminho}
                                        controls
                                        style={{
                                            width: '100%',
                                            maxHeight: '500px',
                                            borderRadius: '8px'
                                        }}
                                    />
                                )}

                                {isPdf && (
                                    <a href={caminho} target="_blank" rel="noopener noreferrer" style={{ width: '100%' }}>
                                        <iframe
                                            src={caminho}
                                            title={`pdf-${index}`}
                                            style={{
                                                width: '100%',
                                                height: '500px',
                                                border: 'none',
                                                borderRadius: '8px',
                                                cursor: 'pointer'
                                            }}
                                        />
                                    </a>
                                )}

                                {!isImg && !isVideo && !isPdf && (
                                    <a href={caminho} target="_blank" rel="noreferrer">
                                        Baixar arquivo
                                    </a>
                                )}
                            </Box>
                        );
                    })}
                </Slider>
            </Box>
        </Box>
    );
};

export default CarouselArquivos;
