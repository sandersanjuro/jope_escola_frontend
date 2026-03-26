    import { useState, useEffect } from 'react';
    import { Link, useNavigate, useParams } from 'react-router-dom';
    import { useDispatch, useSelector } from 'react-redux';

    // material-uialertse
    import { useTheme, createTheme, ThemeProvider } from '@mui/material/styles';
    import { Box, Button, FormHelperText, Grid, TextField, useMediaQuery, Alert, Stack, Snackbar, Autocomplete, Typography } from '@mui/material';
    import IconButton from '@mui/material/IconButton';
    import PhotoCamera from '@mui/icons-material/PhotoCamera';

    // third party
    import * as Yup from 'yup';
    import { Formik } from 'formik';

    // project imports
    import useScriptRef from 'hooks/useScriptRef';
    import AnimateButton from 'ui-component/extended/AnimateButton';
    import { gridSpacing } from 'store/constant';
    import MainCard from 'ui-component/cards/MainCard';
    import Loading from 'components/Loading/Loading';
    import Switch from '@mui/material/Switch';
    import FormControlLabel from '@mui/material/FormControlLabel';
    import { finalAttendance, getTaskPerId, getTechinalDispatch, getTechnicalTask, taskEndPerId } from 'services/task';
    import 'react-responsive-carousel/lib/styles/carousel.min.css'; // requires a loader
    import { Carousel } from 'react-responsive-carousel';
    import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
    import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
    import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
    import { ptBR } from 'date-fns/locale';
    import imageCompression from 'browser-image-compression';
    import { parse, format } from 'date-fns';
import { getDatabaseDate } from 'utils/date';
import { useDropzone } from 'react-dropzone';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';


    // ===========================|| FIREBASE - REGISTER ||=========================== //

    const FinalTask = ({ ...others }) => {
        const themeButton = createTheme({
            status: {
                danger: '#e53e3e'
            },
            palette: {
                primary: {
                    main: '#0971f1',
                    darker: '#053e85'
                },
                neutral: {
                    main: '#64748B',
                    contrastText: '#fff'
                }
            }
        });
        const initialValues = {
            initialPhoto: '',
            description: '',
            finalPhoto: '',
            problemResolved: true,
            endDate: '',
            status_id: '',
            data_abertura: '',
            inicio_atendimento: ''
        };
        const dispatch = useDispatch();
        const path = window.location.pathname;
        const navigate = useNavigate();
        const theme = useTheme();
        const params = useParams();
        const scriptedRef = useScriptRef();
        const id_role = useSelector((state) => state.auth.user.perfil_id);
        const matchDownSM = useMediaQuery(theme.breakpoints.down('md'));
        const [loading, setLoading] = useState(false);
        const [success, setSuccess] = useState('');
        const [error, setError] = useState('');
        const [valuesEdit, setValuesEdit] = useState(initialValues);
        const [isDisabled, setIdDisabled] = useState(true);
        const [technicals, setTechnicals] = useState('');
        const [finalPhoto, setFinalPhoto] = useState('');
        const [taskData, setTaskData] = useState(null);

        useEffect(() => {
            taskPerId();
        }, [params.id]);
        // useEffect(() => {
        //     technicalPerOs();
        // }, [params.id]);

        function taskPerId() {
            getTaskPerId(params.id).then((resp) => {
                console.log('Task Data:', resp.data);

                const parsedDate = resp.data.inicio_atendimento 
                    ? parse(resp.data.inicio_atendimento, 'dd/MM/yyyy HH:mm', new Date(), { locale: ptBR })
                    : null;

                setTaskData(resp.data);
                setValuesEdit({
                    ...initialValues,
                    status_id: resp.data.status_id,
                    data_abertura: resp.data.data_abertura,
                    inicio_atendimento: resp.data.inicio_atendimento ? resp.data.inicio_atendimento : null,
                });
                setIdDisabled(resp.data.status_id === 5);

                // 🔥 chama depois de configurar os dados
                return getTechnicalTask(params.id);
            })
            .then((respTech) => {
                setTechnicals(respTech.data);
            })
            .catch((err) => {
                console.error("Erro ao carregar task ou técnicos:", err);
            });
        }
        // function technicalPerOs() {
        //     getTechinalPerTypeOs().then((resp) => setTechnicals(resp.data));
        // }
        // function technicalPerOs() {
        //     getTechnicalTask(params.id).then((resp) => setTechnicals(resp.data));
        // }
        function srcset(image, width, height, rows = 1, cols = 1) {
            return {
                src: `${image}?w=${width * cols}&h=${height * rows}&fit=crop&auto=format`,
                srcSet: `${image}?w=${width * cols}&h=${height * rows}&fit=crop&auto=format&dpr=2 2x`
            };
        }
        function formatDateTime(dateTime) {
            let dateTimeFull = params.action ? new Date(dateTime) : dateTime;
            const year = dateTimeFull.getFullYear();
            const month = dateTimeFull.getUTCMonth() + 1;
            const day = dateTimeFull.getDate().toString().padStart(2, '0');
            let date = `${year}-${month}-${day} ${dateTimeFull.getHours()}:${dateTimeFull.getMinutes()}`;
            return date;
        }

        function formatDateBR(dateString) {
            if (!dateString) return '';
            try {
                const date = new Date(dateString);
                return format(date, 'dd/MM/yyyy HH:mm', { locale: ptBR });
            } catch (error) {
                return String(dateString);
            }
        }

        function safeString(value) {
            if (value === null || value === undefined) return 'Não informado';
            if (typeof value === 'object') {
                console.log('Object detected:', value);
                return 'Objeto não renderizável';
            }
            return String(value);
        }

        function safeRender(value) {
            try {
                if (value === null || value === undefined) return 'Não informado';
                if (typeof value === 'object' && value !== null) {
                    console.log('Object being rendered:', value);
                    // Se for um objeto com propriedade label, tenta usar a label
                    if (value.label) {
                        return String(value.label);
                    }
                    // Se for um objeto com propriedade nome, tenta usar o nome
                    if (value.nome) {
                        return String(value.nome);
                    }
                    // Se for um objeto com propriedade tecnico, tenta usar o tecnico
                    if (value.tecnico) {
                        return String(value.tecnico);
                    }
                    return 'Objeto não renderizável';
                }
                return String(value);
            } catch (error) {
                console.error('Error rendering value:', error, value);
                return 'Erro ao renderizar';
            }
        }

        function formatFileSize(bytes) {
            if (!bytes) return '0 B';
            const k = 1024;
            const sizes = ['B', 'KB', 'MB', 'GB'];
            const i = Math.floor(Math.log(bytes) / Math.log(k));
            return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
        }

        async function handleFinalImageUpload(event) {
            const file = event.target.files[0];
        
            if (!file) return;
        
            // Verifica se o arquivo é uma imagem ou um PDF
            if (file.type.startsWith('image/')) {
                const options = {
                    maxSizeMB: 0.3,
                    maxWidthOrHeight: 1920
                };
                try {
                    const compressedFile = await imageCompression(file, options);
                    setFinalPhoto(compressedFile);
                } catch (error) {
                    console.log('Erro ao comprimir imagem:', error);
                }
            } else if (file.type === 'application/pdf') {
                setFinalPhoto(file);
            } else {
                console.log('Formato não suportado.');
            }
        }

        const onDrop = async (acceptedFiles) => {
            if (!acceptedFiles || acceptedFiles.length === 0) {
                console.log('Nenhum arquivo selecionado');
                return;
            }
        
            const file = acceptedFiles[0];
            const isImage = file.type.startsWith('image/');
            const isPDF = file.type === 'application/pdf';
            
            if (!isImage && !isPDF) {
                setError('Por favor, selecione apenas arquivos de imagem ou PDF');
                return;
            }
            
            try {
                if (isImage) {
                    const options = {
                        maxSizeMB: 0.3,
                        maxWidthOrHeight: 1920,
                        useWebWorker: true
                    };
                    const compressedFile = await imageCompression(file, options);
                    setFinalPhoto(compressedFile);
                } else {
                    setFinalPhoto(file); // PDFs não precisam de compressão
                }
                
                setError(''); // Limpa qualquer erro anterior
            } catch (error) {
                console.error('Erro ao processar o arquivo:', error);
                setError('Erro ao processar o arquivo. Tente novamente.');
                setFinalPhoto(null);
            }
        };
    
        const { getRootProps, getInputProps, isDragActive } = useDropzone({
            onDrop,
            accept: {
                'image/*': ['.jpeg', '.jpg', '.png', '.gif'],
                'application/pdf': ['.pdf']
            },
            multiple: false,
            disabled: isDisabled,
            maxSize: 20242880, // 20MB
            onDropRejected: () => {
                setError('Arquivo muito grande ou tipo não suportado');
            }
        });

        return (
            <>
                <Formik
                    initialValues={{
                        initialPhoto: valuesEdit.initialPhoto,
                        description: valuesEdit.description,
                        submit: null,
                        finalPhoto: valuesEdit.finalPhoto,
                        problemResolved: valuesEdit.problemResolved,
                        date_inicio: valuesEdit.inicio_atendimento,
                        date_fim: '',
                        technical: '',
                        data_abertura: valuesEdit.data_abertura
                    }}
                    enableReinitialize
                    validationSchema={Yup.object().shape({
                        technical: id_role == 1 ? Yup.object().required('Técnico obrigatório') : Yup.mixed(),
                        description: Yup.string().required('Descrição obrigatório'),
                        date_inicio: Yup.date()
                            .required('Data de início obrigatória')
                            .nullable()
                            .test('is-greater', 'Data de início deve ser maior que a data de abertura', function (value) {
                                const { data_abertura } = this.parent; // Obtendo data_abertura do contexto
                                return value && data_abertura ? new Date(value) > new Date(data_abertura) : true; // Retorna true se a data de início for maior
                            })
                            .test('is-less', 'Data de início deve ser menor que a data de fim', function (value) {
                                const { date_fim } = this.parent; // Obtendo date_fim do contexto
                                return value && date_fim ? new Date(value) < new Date(date_fim) : true; // Retorna true se a data de início for menor
                            })
                            .test('is-not-future', 'Data de início não pode ser maior que a data e hora atuais', function (value) {
                                const currentDate = new Date();
                                return value && new Date(value) <= currentDate;
                            }),
                        date_fim: Yup.date()
                            .required('Data de fim obrigatória')
                            .nullable()
                            .test('is-greater', 'Data de fim deve ser maior que a data de início', function (value) {
                                const { date_inicio } = this.parent; // Obtendo date_inicio do contexto
                                return value && date_inicio ? new Date(value) > new Date(date_inicio) : true; // Verifica se date_fim é maior que date_inicio
                            })
                            .test('is-greater-than-abertura', 'Data de fim deve ser maior que a data de abertura', function (value) {
                                const { data_abertura } = this.parent; // Obtendo data_abertura do contexto
                                return value && data_abertura ? new Date(value) > new Date(data_abertura) : true; // Verifica se date_fim é maior que data_abertura
                            })
                            .test('is-not-future', 'Data de fim não pode ser maior que a data e hora atuais', function (value) {
                                const currentDate = new Date();
                                return value && new Date(value) <= currentDate;
                            }),
                    })}
                    onSubmit={async (values, { setErrors, setStatus, setSubmitting, resetForm }) => {
                        try {
                            console.log(parse(valuesEdit.data_abertura, 'yyyy-MM-dd HH:mm:ss', new Date()));
                            if (scriptedRef.current) {
                                setStatus({ success: true });
                                setSubmitting(false);
                            }
                            setLoading(true);
                            const data = new FormData();
                            data.append('technical', values.technical?.id);
                            data.append('date_inicio', valuesEdit.inicio_atendimento ? valuesEdit.inicio_atendimento : formatDateTime(values.date_inicio));
                            data.append('date_fim', formatDateTime(values.date_fim));
                            data.append('initialPhoto', values.initialPhoto);
                            data.append('finalPhoto', finalPhoto);
                            data.append('description', values.description);
                            data.append('problemResolved', values.problemResolved === true ? 1 : 0);
                            console.log(data);
                            finalAttendance(params.id, data)
                                .then((resp) => {
                                    dispatch({ type: 'SET_PAGE_TASK', payload: 1 });
                                    setLoading(false);
                                    setSuccess(resp.data.success);
                                    setTimeout(() => {
                                        navigate({ pathname: `/${params.module}s` });
                                        // window.location.reload();
                                    }, 2000);
                                })
                                .catch((e) => {
                                    setLoading(false);
                                    setSuccess('');
                                    setError(e.response.data.error);
                                    setTimeout(() => {
                                        setError('');
                                    }, 2000);
                                });
                        } catch (err) {
                            console.log(err);
                            if (scriptedRef.current) {
                                setStatus({ success: false });
                                setErrors({ submit: err.message });
                                setSubmitting(false);
                            }
                        }
                    }}
                >
                    {({ errors, handleBlur, handleChange, handleSubmit, isSubmitting, touched, values, setFieldValue }) => (
                        <>
                            {loading && (
                                <Grid container alignItems="center" justifyContent="center">
                                    <MainCard style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                        <Loading color="#00008B" type="cubes" />
                                    </MainCard>
                                </Grid>
                            )}
                            <div style={{ display: loading ? 'none' : 'block', marginTop: '40px' }}>
                                <MainCard spacing={gridSpacing} style={{ marginTop: 15 }}>
                                    <Grid container>
                                        <h1
                                            style={{
                                                font: 'normal normal bold 35px/44px Myriad Pro',
                                                letterSpacing: '0px',
                                                color: 'var(--unnamed-color-015641)',
                                                Color: '#015641',
                                                opacity: 1,
                                                padding: 15,
                                                marginLeft: '2%'
                                            }}
                                        >
                                            {`OS${params.id}`}
                                        </h1>
                                        <hr style={{ width: '100%', marginTop: 0 }}></hr>
                                    </Grid>
                                    
                                    {/* Seção de Informações da OS */}
                                    {taskData && Object.keys(taskData).length > 0 && (
                                        <MainCard spacing={gridSpacing} style={{ marginTop: 15, marginBottom: 15 }}>
                                            <Typography variant="h5" sx={{ mb: 2, color: '#015641', fontWeight: 'bold' }}>
                                                Informações do Chamado
                                            </Typography>
                                            
                                                                                        <Grid container spacing={3}>
                                                {/* Informações Básicas */}
                                                <Grid item xs={12} md={4}>
                                                    <Typography variant="h6" sx={{ mb: 1, color: '#015641' }}>
                                                        Informações Básicas
                                                    </Typography>
                                                    <Box sx={{ p: 2, backgroundColor: '#f8f9fa', borderRadius: 1, height: '100%' }}>
                                                        <Typography variant="body2" sx={{ mb: 1 }}>
                                                            <strong>Descrição:</strong> {safeRender(taskData.descricao)}
                                                        </Typography>
                                                        <Typography variant="body2" sx={{ mb: 1 }}>
                                                            <strong>Status:</strong> 
                                                            <span style={{ 
                                                                color: taskData.status?.cor === 'error' ? '#d32f2f' : 
                                                                       taskData.status?.cor === 'success' ? '#2e7d32' : '#1976d2',
                                                                fontWeight: 'bold',
                                                                marginLeft: '5px'
                                                            }}>
                                                                {safeRender(taskData.status?.nome)}
                                                            </span>
                                                        </Typography>
                                                        <Typography variant="body2" sx={{ mb: 1 }}>
                                                            <strong>Data de Abertura:</strong> {formatDateBR(taskData.data_abertura)}
                                                        </Typography>
                                                        <Typography variant="body2" sx={{ mb: 1 }}>
                                                            <strong>Solicitante:</strong> {safeRender(taskData.solicitante)}
                                                        </Typography>
                                                        <Typography variant="body2" sx={{ mb: 1 }}>
                                                            <strong>Email:</strong> {safeRender(taskData.email_solicitante)}
                                                        </Typography>
                                                        {taskData.telefone && (
                                                            <Typography variant="body2" sx={{ mb: 1 }}>
                                                                <strong>Telefone:</strong> {safeRender(taskData.telefone)}
                                                            </Typography>
                                                        )}
                                                    </Box>
                                                </Grid>

                                                {/* Informações Técnicas */}
                                                <Grid item xs={12} md={4}>
                                                    <Typography variant="h6" sx={{ mb: 1, color: '#015641' }}>
                                                        Informações Técnicas
                                                    </Typography>
                                                    <Box sx={{ p: 2, backgroundColor: '#f8f9fa', borderRadius: 1, height: '100%' }}>
                                                        <Typography variant="body2" sx={{ mb: 1 }}>
                                                            <strong>Família:</strong> {safeRender(taskData.family?.label)}
                                                        </Typography>
                                                        <Typography variant="body2" sx={{ mb: 1 }}>
                                                            <strong>Natureza:</strong> {safeRender(taskData.natureOfOperation?.label)}
                                                        </Typography>
                                                        <Typography variant="body2" sx={{ mb: 1 }}>
                                                            <strong>Tipo de OS:</strong> {safeRender(taskData.typeOfOs?.label)}
                                                        </Typography>
                                                        <Typography variant="body2" sx={{ mb: 1 }}>
                                                            <strong>Tipo de Equipamento:</strong> {safeRender(taskData.typeOfEquipament?.label)}
                                                        </Typography>
                                                        <Typography variant="body2" sx={{ mb: 1 }}>
                                                            <strong>Tipo de Problema:</strong> {safeRender(taskData.typeOfProblem?.label)}
                                                        </Typography>
                                                        {taskData.codigo_inventys && (
                                                            <Typography variant="body2" sx={{ mb: 1 }}>
                                                                <strong>Código Inventys:</strong> {safeRender(taskData.codigo_inventys)}
                                                            </Typography>
                                                        )}
                                                    </Box>
                                                </Grid>

                                                {/* Localização */}
                                                <Grid item xs={12} md={4}>
                                                    <Typography variant="h6" sx={{ mb: 1, color: '#015641' }}>
                                                        Localização
                                                    </Typography>
                                                    <Box sx={{ p: 2, backgroundColor: '#f8f9fa', borderRadius: 1, height: '100%' }}>
                                                        <Typography variant="body2" sx={{ mb: 1 }}>
                                                            <strong>Unidade:</strong> {safeRender(taskData.unit?.label)}
                                                        </Typography>
                                                        {taskData.operating && taskData.operating.length > 0 && taskData.operating[0] && (
                                                            <Typography variant="body2" sx={{ mb: 1 }}>
                                                                <strong>Operacional:</strong> {safeRender(taskData.operating[0]?.label)}
                                                            </Typography>
                                                        )}
                                                        {taskData.operating && taskData.operating.length > 0 && taskData.operating[0] && taskData.operating[0]?.andar && (
                                                            <Typography variant="body2" sx={{ mb: 1 }}>
                                                                <strong>Andar:</strong> {safeRender(taskData.operating[0]?.andar)}
                                                            </Typography>
                                                        )}
                                                        {taskData.operating && taskData.operating.length > 0 && taskData.operating[0] && taskData.operating[0]?.categoria && (
                                                            <Typography variant="body2" sx={{ mb: 1 }}>
                                                                <strong>Categoria:</strong> {safeRender(taskData.operating[0]?.categoria)}
                                                            </Typography>
                                                        )}
                                                    </Box>
                                                </Grid>

                                                {/* SLA e Prazos */}
                                                <Grid item xs={12} md={6}>
                                                    <Typography variant="h6" sx={{ mb: 1, color: '#015641' }}>
                                                        SLA e Prazos
                                                    </Typography>
                                                    <Box sx={{ p: 2, backgroundColor: '#f8f9fa', borderRadius: 1 }}>
                                                        {taskData.sla_atendimento && (
                                                            <Typography variant="body2" sx={{ mb: 1 }}>
                                                                <strong>SLA Atendimento:</strong> {formatDateBR(taskData.sla_atendimento)}
                                                            </Typography>
                                                        )}
                                                        {taskData.sla_solucao && (
                                                            <Typography variant="body2" sx={{ mb: 1 }}>
                                                                <strong>SLA Solução:</strong> {formatDateBR(taskData.sla_solucao)}
                                                            </Typography>
                                                        )}
                                                        {taskData.sla && (
                                                            <Typography variant="body2" sx={{ mb: 1 }}>
                                                                <strong>SLA Geral:</strong> {safeRender(taskData.sla?.label)}
                                                            </Typography>
                                                        )}
                                                        {taskData.prazo_final_preventiva && (
                                                            <Typography variant="body2" sx={{ mb: 1 }}>
                                                                <strong>Prazo Final Preventiva:</strong> {formatDateBR(taskData.prazo_final_preventiva)}
                                                            </Typography>
                                                        )}
                                                        {taskData.atrasado && (
                                                            <Typography variant="body2" sx={{ mb: 1 }}>
                                                                <strong>Situação:</strong> 
                                                                <span style={{ 
                                                                    color: taskData.atrasado?.cor === 'error' ? '#d32f2f' : '#1976d2',
                                                                    fontWeight: 'bold',
                                                                    marginLeft: '5px'
                                                                }}>
                                                                    {safeRender(taskData.atrasado?.nome)}
                                                                </span>
                                                            </Typography>
                                                        )}
                                                    </Box>
                                                </Grid>

                                                {/* Fotos Anexadas */}
                                                <Grid item xs={12} md={6}>
                                                    <Typography variant="h6" sx={{ mb: 1, color: '#015641' }}>
                                                        Fotos Anexadas
                                                    </Typography>
                                                    <Box sx={{ p: 2, backgroundColor: '#f8f9fa', borderRadius: 1 }}>
                                                        {taskData.file && taskData.file.length > 0 ? (
                                                            <Grid container spacing={2}>
                                                                {taskData.file.map((file, index) => (
                                                                    <Grid item xs={12} sm={6} md={4} key={file.id}>
                                                                        <Box sx={{ 
                                                                            border: '1px solid #e0e0e0', 
                                                                            borderRadius: 1, 
                                                                            backgroundColor: 'white',
                                                                            overflow: 'hidden',
                                                                            boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                                                                        }}>
                                                                            <img
                                                                                src={file.url || `/api/files/${file.id}`}
                                                                                alt={`Foto ${index + 1}`}
                                                                                style={{
                                                                                    width: '100%',
                                                                                    height: '150px',
                                                                                    objectFit: 'cover',
                                                                                    display: 'block'
                                                                                }}
                                                                                onError={(e) => {
                                                                                    e.target.style.display = 'none';
                                                                                    e.target.nextSibling.style.display = 'flex';
                                                                                }}
                                                                            />
                                                                            <Box
                                                                                sx={{
                                                                                    display: 'none',
                                                                                    height: '150px',
                                                                                    alignItems: 'center',
                                                                                    justifyContent: 'center',
                                                                                    backgroundColor: '#f5f5f5',
                                                                                    color: '#666'
                                                                                }}
                                                                            >
                                                                                <Typography variant="body2" sx={{ textAlign: 'center' }}>
                                                                                    Imagem não disponível
                                                                                </Typography>
                                                                            </Box>
                                                                            <Box sx={{ p: 1 }}>
                                                                                <Typography variant="caption" sx={{ color: '#666', fontSize: '0.75rem' }}>
                                                                                    {file.name}
                                                                                </Typography>
                                                                            </Box>
                                                                        </Box>
                                                                    </Grid>
                                                                ))}
                                                            </Grid>
                                                        ) : (
                                                            <Typography variant="body2" sx={{ mb: 1, fontStyle: 'italic' }}>
                                                                Nenhuma foto anexada
                                                            </Typography>
                                                        )}
                                                    </Box>
                                                </Grid>

                                                {/* Informações Adicionais */}
                                                <Grid item xs={12}>
                                                    <Typography variant="h6" sx={{ mb: 1, color: '#015641' }}>
                                                        Informações Adicionais
                                                    </Typography>
                                                    <Box sx={{ p: 2, backgroundColor: '#f8f9fa', borderRadius: 1 }}>
                                                        <Grid container spacing={2}>
                                                            <Grid item xs={12} md={6}>
                                                                <Typography variant="body2" sx={{ mb: 1 }}>
                                                                    <strong>ID da OS:</strong> {safeRender(taskData.id)}
                                                                </Typography>
                                                                <Typography variant="body2" sx={{ mb: 1 }}>
                                                                    <strong>UUID:</strong> {safeRender(taskData.uuid)}
                                                                </Typography>
                                                                <Typography variant="body2" sx={{ mb: 1 }}>
                                                                    <strong>Criado em:</strong> {formatDateBR(taskData.created_at)}
                                                                </Typography>
                                                                <Typography variant="body2" sx={{ mb: 1 }}>
                                                                    <strong>Atualizado em:</strong> {formatDateBR(taskData.updated_at)}
                                                                </Typography>
                                                            </Grid>
                                                            <Grid item xs={12} md={6}>
                                                                <Typography variant="body2" sx={{ mb: 1 }}>
                                                                    <strong>Repactuação:</strong> {taskData.repactuacao ? 'Sim' : 'Não'}
                                                                </Typography>
                                                                {taskData.data_repactuacao && (
                                                                    <Typography variant="body2" sx={{ mb: 1 }}>
                                                                        <strong>Data Repactuação:</strong> {formatDateBR(taskData.data_repactuacao)}
                                                                    </Typography>
                                                                )}
                                                                {taskData.descricao_repactuacao && (
                                                                    <Typography variant="body2" sx={{ mb: 1 }}>
                                                                        <strong>Descrição Repactuação:</strong> {safeRender(taskData.descricao_repactuacao)}
                                                                    </Typography>
                                                                )}
                                                                {taskData.notification_email && (
                                                                    <Typography variant="body2" sx={{ mb: 1 }}>
                                                                        <strong>Notificação por Email:</strong> {taskData.notification_email ? 'Sim' : 'Não'}
                                                                    </Typography>
                                                                )}
                                                            </Grid>
                                                        </Grid>
                                                    </Box>
                                                </Grid>
                                            </Grid>
                                        </MainCard>
                                    )}
                                    {error || success ? (
                                        <Snackbar open={true} autoHideDuration={6000}>
                                            <Alert
                                                severity={error ? 'error' : 'success'}
                                                sx={{
                                                    width: '100%',
                                                    backgroundColor: error ? 'red' : success ? 'green' : 'orange',
                                                    color: '#FFF'
                                                }}
                                            >
                                                {error ? error : success ? success : ''}
                                            </Alert>
                                        </Snackbar>
                                    ) : (
                                        ''
                                    )}
                                    
                                    {/* Seção de Finalização */}
                                    <MainCard spacing={gridSpacing} style={{ marginTop: 15 }}>
                                        <Typography variant="h5" sx={{ mb: 2, color: '#015641', fontWeight: 'bold' }}>
                                            Finalizar Atendimento
                                        </Typography>
                                        
                                        <form noValidate onSubmit={handleSubmit} {...others}>
                                        <Grid container spacing={matchDownSM ? 0 : 2}>
                                                <>
                                                    <Grid item xs={12} sm={12} sx={{ marginTop: 3 }}>
                                                        <Autocomplete
                                                            fullWidth
                                                            select
                                                            label="Técnico"
                                                            id="technical"
                                                            value={values.technical || null}
                                                            name="technical"
                                                            onBlur={handleBlur}
                                                            onChange={(e, newValue) => setFieldValue('technical', newValue)}
                                                            options={technicals || []}
                                                            renderInput={(params) => (
                                                                <TextField
                                                                    {...params}
                                                                    label="Técnico"
                                                                    helperText={touched.technical && errors.technical ? errors.technical : ''}
                                                                    error={Boolean(touched.technical && errors.technical)}
                                                                />
                                                            )}
                                                        />
                                                    </Grid>
                                                    <Grid item xs={12} sm={6} sx={{ marginTop: 3 }}>
                                                        <LocalizationProvider locale={ptBR} dateAdapter={AdapterDateFns}>
                                                            <Stack spacing={3}>
                                                                <DateTimePicker
                                                                    fullWidth
                                                                    ampm={false}
                                                                    error={Boolean(touched.date_inicio && errors.date_inicio)}
                                                                    label="Data de Início"
                                                                    id="date_inicio"
                                                                    type="date_inicio"
                                                                    value={values.date_inicio}
                                                                    name="date_inicio"
                                                                    onBlur={handleBlur}
                                                                    onChange={(e) => setFieldValue('date_inicio', e)}
                                                                    helperText={
                                                                        touched.date_inicio && errors.date_inicio ? errors.date_inicio : ''
                                                                    }
                                                                    disabled={valuesEdit.inicio_atendimento ? true : false}
                                                                    renderInput={(params) => <TextField {...params}  helperText={touched.date_inicio && errors.date_inicio ? errors.date_inicio : ''} error={Boolean(touched.date_inicio && errors.date_inicio)} />}
                                                                />
                                                            </Stack>
                                                        </LocalizationProvider>
                                                    </Grid>
                                                <Grid item xs={12} sm={6} sx={{ marginTop: 3 }}>
                                                    <LocalizationProvider locale={ptBR} dateAdapter={AdapterDateFns}>
                                                        <Stack spacing={3}>
                                                            <DateTimePicker
                                                                fullWidth
                                                                ampm={false}
                                                                error={Boolean(touched.date_fim && errors.date_fim)}
                                                                label="Data de Fim"
                                                                id="date_fim"
                                                                type="date_fim"
                                                                value={values.date_fim}
                                                                name="date_fim"
                                                                onBlur={handleBlur}
                                                                onChange={(e) => setFieldValue('date_fim', e)}
                                                                helperText={touched.date_fim && errors.date_fim ? errors.date_fim : ''}
                                                                renderInput={(params) => <TextField {...params} onBlur={handleBlur} helperText={touched.date_fim && errors.date_fim ? errors.date_fim : ''} error={Boolean(touched.date_fim && errors.date_fim)} />}
                                                            />
                                                        </Stack>
                                                    </LocalizationProvider>
                                                </Grid>
                                            </>
                                        <Grid item xs={12} sx={{ marginTop: 3 }}>
                                            <TextField
                                                fullWidth
                                                error={Boolean(touched.description && errors.description)}
                                                label="Descrição"
                                                multiline
                                                rows={4}
                                                id="description"
                                                type="text"
                                                value={values.description}
                                                name="description"
                                                onBlur={handleBlur}
                                                onChange={handleChange}
                                                helperText={touched.description && errors.description ? errors.description : ''}
                                                disabled={isDisabled}
                                            />
                                        </Grid>
                                        <Grid item xs={12} sx={{ marginTop: 3 }}>
                                            <Box
                                                {...getRootProps()}
                                                sx={{
                                                    border: '2px dashed #cccccc',
                                                    borderRadius: '4px',
                                                    padding: '20px',
                                                    textAlign: 'center',
                                                    cursor: isDisabled ? 'not-allowed' : 'pointer',
                                                    backgroundColor: isDragActive ? '#f0f0f0' : 'white',
                                                    opacity: isDisabled ? 0.6 : 1,
                                                    '&:hover': {
                                                        backgroundColor: isDisabled ? 'white' : '#f0f0f0'
                                                    }
                                                }}
                                            >
                                                <input {...getInputProps()} />
                                                {finalPhoto ? (
                                                    <Box>
                                                        <p>Arquivo selecionado: {finalPhoto.name}</p>
                                                        {finalPhoto instanceof File && finalPhoto.type.startsWith('image/') && (
                                                            <img
                                                                src={URL.createObjectURL(finalPhoto)}
                                                                alt="Preview"
                                                                style={{ maxWidth: '200px', marginTop: '10px' }}
                                                                onError={() => {
                                                                    setError('Erro ao carregar preview da imagem');
                                                                    setFinalPhoto(null);
                                                                }}
                                                            />
                                                        )}
                                                    </Box>
                                                ) : (
                                                    <Box>
                                                        <PhotoCamera sx={{ fontSize: 40, color: '#666666', mb: 1 }} />
                                                        <p>{isDragActive 
                                                            ? 'Solte a imagem aqui' 
                                                            : 'Arraste e solte uma imagem aqui, ou clique para selecionar'}
                                                        </p>
                                                        <p style={{ fontSize: '12px', color: '#666' }}>
                                                            (Tamanho máximo: 20MB, formatos: JPG, PNG, GIF, PDF)
                                                        </p>
                                                    </Box>
                                                )}
                                            </Box>
                                        </Grid>
                                        <Grid item xs={12} sx={{ marginTop: 1 }}>
                                            <FormControlLabel
                                                value={values.problemResolved}
                                                control={
                                                    <Switch
                                                        disabled={isDisabled}
                                                        color="primary"
                                                        checked={values.problemResolved}
                                                        onChange={(e) => setFieldValue('problemResolved', !values.problemResolved)}
                                                    />
                                                }
                                                label="Problema Resolvido ?"
                                                labelPlacement="start"
                                            />
                                        </Grid>
                                    </Grid>
                                    <Grid container alignItems="end" justifyContent="end" sx={{ mt: 3 }}>
                                        <Grid item>
                                            <Box sx={{ mt: 2, mr: 3 }}>
                                                <ThemeProvider theme={themeButton}>
                                                    <AnimateButton>
                                                        <Button
                                                            disableElevation
                                                            disabled={isSubmitting || isDisabled}
                                                            fullWidth
                                                            size="large"
                                                            type="submit"
                                                            variant="contained"
                                                            color="primary"
                                                        >
                                                            Finalizar
                                                        </Button>
                                                    </AnimateButton>
                                                </ThemeProvider>
                                            </Box>
                                        </Grid>
                                        <Grid item>
                                            <Box sx={{ mt: 2, mr: 3 }}>
                                                <ThemeProvider theme={themeButton}>
                                                    <AnimateButton>
                                                        <Button
                                                            disableElevation
                                                            disabled={isSubmitting}
                                                            fullWidth
                                                            size="large"
                                                            type="button"
                                                            variant="contained"
                                                            color="neutral"
                                                            onClick={() => navigate(-1)}
                                                        >
                                                            Voltar
                                                        </Button>
                                                    </AnimateButton>
                                                </ThemeProvider>
                                            </Box>
                                        </Grid>
                                    </Grid>
                                    {errors.submit && (
                                        <Box sx={{ mt: 3 }}>
                                            <FormHelperText error>{errors.submit}</FormHelperText>
                                        </Box>
                                    )}
                                </form>
                            </MainCard>
                        </MainCard>
                        </div>
                    </>
                )}
            </Formik>
        </>
    );
};

export default FinalTask;
