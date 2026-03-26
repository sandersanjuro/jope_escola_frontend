import * as React from 'react';
import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import ButtonBase from '@mui/material/ButtonBase';
import Typography from '@mui/material/Typography';
import ImageCor from './img/corretiva.jpg';
import ImagePrev from './img/preventiva.png';
import ImageConf from './img/conf.jpg';
import ImageRel from './img/relatorio.png';
import ImagePan from './img/painel.png';
import { useNavigate } from 'react-router';
import { useSelector } from 'react-redux';

const images = [
    {
        url: ImageCor,
        title: 'Corretivas',
        width: '40%',
        to: '/corretivas'
    },
    {
        url: ImagePrev,
        title: 'Preventivas',
        width: '40%',
        to: '/preventivas'
    },
    {
        url: ImageConf,
        title: 'Configurações Gerais',
        width: '40%',
        to: '/configuracoes'
    },
    {
        url: ImageConf,
        title: 'Configurações Locais',
        width: '40%',
        to: '/configuracoes_unidade'
    },
    {
        url: ImageConf,
        title: 'Administração',
        width: '40%',
        to: '/administracoes'
    },
    {
        url: ImageRel,
        title: 'Relatórios',
        width: '40%',
        to: '/index'
    },
    {
        url: ImagePan,
        title: 'Painéis',
        width: '40%',
        to: '/index'
    }
];
const imagesTechnical = [
    {
        url: ImageCor,
        title: 'Corretivas',
        width: '40%',
        to: '/corretivas'
    },
    {
        url: ImagePrev,
        title: 'Preventivas',
        width: '40%',
        to: '/preventivas'
    }
];

const ImageButton = styled(ButtonBase)(({ theme }) => ({
    position: 'relative',
    height: 200,
    [theme.breakpoints.down('sm')]: {
        width: '100% !important', // Overrides inline-style
        height: 100
    },
    '&:hover, &.Mui-focusVisible': {
        zIndex: 1,
        '& .MuiImageBackdrop-root': {
            opacity: 0.15
        },
        '& .MuiImageMarked-root': {
            opacity: 0
        },
        '& .MuiTypography-root': {
            border: '4px solid currentColor'
        }
    }
}));

const ImageSrc = styled('span')({
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    backgroundSize: 'cover',
    backgroundPosition: 'center 40%'
});

const Image = styled('span')(({ theme }) => ({
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: theme.palette.common.white
}));

const ImageBackdrop = styled('span')(({ theme }) => ({
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    backgroundColor: theme.palette.common.black,
    opacity: 0.4,
    transition: theme.transitions.create('opacity')
}));

const ImageMarked = styled('span')(({ theme }) => ({
    height: 3,
    width: 18,
    backgroundColor: theme.palette.common.white,
    position: 'absolute',
    bottom: -2,
    left: 'calc(50% - 9px)',
    transition: theme.transitions.create('opacity')
}));

export default function ButtonBases() {
    const navigate = useNavigate();
    const id_role = useSelector((state) => state.auth.user.perfil_id);
    const imageList = id_role === 3 ? imagesTechnical : images;
    return (
        <Box sx={{ display: 'flex', flexWrap: 'wrap', minWidth: 300, width: '100%', justifyContent: 'center' }}>
            {imageList.map((image) => (
                <ImageButton
                    focusRipple
                    key={image.title}
                    style={{
                        width: image.width,
                        margin: 4
                    }}
                    onClick={() => navigate({ pathname: image.to })}
                >
                    <ImageSrc style={{ backgroundImage: `url(${image.url})` }} />
                    <ImageBackdrop className="MuiImageBackdrop-root" />
                    <Image>
                        <Typography
                            component="span"
                            variant="subtitle1"
                            color="inherit"
                            sx={{
                                position: 'relative',
                                p: 4,
                                pt: 2,
                                pb: (theme) => `calc(${theme.spacing(1)} + 6px)`
                            }}
                        >
                            {image.title}
                            <ImageMarked className="MuiImageMarked-root" />
                        </Typography>
                    </Image>
                </ImageButton>
            ))}
        </Box>
    );
}
