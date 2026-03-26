import React, { useState, useEffect, useRef } from 'react';
import { useTheme } from '@mui/material/styles';
import { useSelector } from 'react-redux';
import {
    Box,
    Button,
    FormControl,
    Grid,
    useMediaQuery,
    Alert,
    Snackbar,
    MenuItem,
    Select,
    InputLabel,
    CircularProgress,
    LinearProgress,
    Typography,
    Card,
    CardContent,
    TextField
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { ptBR } from 'date-fns/locale';
import MainCard from 'ui-component/cards/MainCard';
import AnimateButton from 'ui-component/extended/AnimateButton';
import Loading from 'components/Loading/Loading';
import { gridSpacing } from 'store/constant';
import { app } from 'services/Api';
import DownloadIcon from '@mui/icons-material/Download';

const TaskPdf = () => {
    const theme = useTheme();
    const matchDownSM = useMediaQuery(theme.breakpoints.down('md'));
    const unit = useSelector((state) => state.user.unit || '');

    // Estados para filtros
    const [naturezaId, setNaturezaId] = useState('');
    const [tipoOsId, setTipoOsId] = useState('');
    const [dataInicial, setDataInicial] = useState(null);
    const [dataFinal, setDataFinal] = useState(null);

    // Estados para dados dos filtros
    const [naturezaOptions, setNaturezaOptions] = useState([]);
    const [tipoOsOptions, setTipoOsOptions] = useState([]);

    // Estados de controle
    const [loading, setLoading] = useState(false);
    const [loadingFilters, setLoadingFilters] = useState(true);
    const [error, setError] = useState('');
    const [openSnackbar, setOpenSnackbar] = useState(false);
    const [progress, setProgress] = useState(0);
    const [elapsedTime, setElapsedTime] = useState(0);
    const intervalRef = useRef(null);
    const startTimeRef = useRef(null);

    useEffect(() => {
        loadFilterOptions();
    }, []);

    const loadFilterOptions = async () => {
        try {
            setLoadingFilters(true);
            
            // Buscar naturezas
            const naturezasResponse = await app.get('/task_pdf/natures');
            if (naturezasResponse.data) {
                setNaturezaOptions(naturezasResponse.data);
            }

            // Buscar tipos de OS
            const tipoOsResponse = await app.get('/task_pdf/type_os');
            if (tipoOsResponse.data) {
                setTipoOsOptions(tipoOsResponse.data);
            }
        } catch (err) {
            setError('Erro ao carregar opções de filtro: ' + (err.response?.data?.error || err.message));
            setOpenSnackbar(true);
        } finally {
            setLoadingFilters(false);
        }
    };

    const handleDownload = async () => {
        if (!naturezaId) {
            setError('Por favor, selecione uma natureza de operação.');
            setOpenSnackbar(true);
            return;
        }

        if (!dataInicial || !dataFinal) {
            setError('Por favor, selecione o período (data inicial e data final).');
            setOpenSnackbar(true);
            return;
        }

        if (dataInicial > dataFinal) {
            setError('A data inicial não pode ser maior que a data final.');
            setOpenSnackbar(true);
            return;
        }

        try {
            setLoading(true);
            setError('');
            setProgress(0);
            setElapsedTime(0);
            startTimeRef.current = Date.now();

            // Iniciar contador de progresso simulado
            intervalRef.current = setInterval(() => {
                const elapsed = Math.floor((Date.now() - startTimeRef.current) / 1000);
                setElapsedTime(elapsed);
                
                // Progresso simulado que aumenta gradualmente até 90%
                // Os últimos 10% serão completados quando o download terminar
                const simulatedProgress = Math.min(90, Math.floor(elapsed * 2));
                setProgress(simulatedProgress);
            }, 500);

            // Formatar datas para YYYY-MM-DD
            const formatDate = (date) => {
                if (!date) return null;
                const year = date.getFullYear();
                const month = String(date.getMonth() + 1).padStart(2, '0');
                const day = String(date.getDate()).padStart(2, '0');
                return `${year}-${month}-${day}`;
            };

            const response = await app.post(
                '/task_pdf/download',
                {
                    natureza_id: naturezaId,
                    tipo_os_id: tipoOsId || null,
                    data_inicial: formatDate(dataInicial),
                    data_final: formatDate(dataFinal),
                    unidade_id: unit || null
                },
                {
                    responseType: 'blob',
                    onDownloadProgress: (progressEvent) => {
                        if (progressEvent.total) {
                            const percentCompleted = Math.round(
                                (progressEvent.loaded * 100) / progressEvent.total
                            );
                            setProgress(Math.min(95, percentCompleted));
                        }
                    }
                }
            );

            // Completar progresso
            setProgress(100);
            
            // Limpar intervalo
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
                intervalRef.current = null;
            }

            // Criar link para download
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `chamados_${new Date().toISOString().split('T')[0]}.zip`);
            document.body.appendChild(link);
            link.click();
            link.remove();
            window.URL.revokeObjectURL(url);

            // Resetar após um pequeno delay
            setTimeout(() => {
                setProgress(0);
                setElapsedTime(0);
            }, 1000);

            setOpenSnackbar(true);
        } catch (err) {
            // Limpar intervalo em caso de erro
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
                intervalRef.current = null;
            }
            setProgress(0);
            setElapsedTime(0);
            
            const errorMessage = err.response?.data?.error || 'Erro ao gerar PDFs. Verifique se existem chamados finalizados com os filtros selecionados.';
            setError(errorMessage);
            setOpenSnackbar(true);
        } finally {
            setLoading(false);
        }
    };

    // Limpar intervalo ao desmontar componente
    useEffect(() => {
        return () => {
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
            }
        };
    }, []);

    const handleCloseSnackbar = () => {
        setOpenSnackbar(false);
    };

    if (loadingFilters) {
        return <Loading />;
    }

    return (
        <MainCard title="Download de PDFs de Chamados">
            <Grid container spacing={gridSpacing}>
                <Grid item xs={12}>
                    <Alert severity="info" sx={{ mb: 2 }}>
                        Selecione a natureza de operação, o período e opcionalmente o tipo de OS para baixar os PDFs dos chamados finalizados.
                    </Alert>
                </Grid>

                <Grid item xs={12} md={6}>
                    <FormControl fullWidth required>
                        <InputLabel id="natureza-label">Natureza de Operação</InputLabel>
                        <Select
                            labelId="natureza-label"
                            id="natureza-select"
                            value={naturezaId}
                            label="Natureza de Operação"
                            onChange={(e) => setNaturezaId(e.target.value)}
                        >
                            <MenuItem value="">
                                <em>Selecione uma natureza</em>
                            </MenuItem>
                            {naturezaOptions.map((natureza) => (
                                <MenuItem key={natureza.id} value={natureza.id}>
                                    {natureza.label}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </Grid>

                <Grid item xs={12} md={6}>
                    <FormControl fullWidth>
                        <InputLabel id="tipo-os-label">Tipo de OS (Opcional)</InputLabel>
                        <Select
                            labelId="tipo-os-label"
                            id="tipo-os-select"
                            value={tipoOsId}
                            label="Tipo de OS (Opcional)"
                            onChange={(e) => setTipoOsId(e.target.value)}
                        >
                            <MenuItem value="">
                                <em>Todos os tipos</em>
                            </MenuItem>
                            {tipoOsOptions.map((tipoOs) => (
                                <MenuItem key={tipoOs.id} value={tipoOs.id}>
                                    {tipoOs.label}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </Grid>

                <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={ptBR}>
                    <Grid item xs={12} md={6}>
                        <DatePicker
                            label="Data Inicial *"
                            value={dataInicial}
                            onChange={(newValue) => setDataInicial(newValue)}
                            renderInput={(params) => <TextField {...params} fullWidth required />}
                        />
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <DatePicker
                            label="Data Final *"
                            value={dataFinal}
                            onChange={(newValue) => setDataFinal(newValue)}
                            minDate={dataInicial}
                            renderInput={(params) => <TextField {...params} fullWidth required />}
                        />
                    </Grid>
                </LocalizationProvider>

                {loading && (
                    <Grid item xs={12}>
                        <Card sx={{ mt: 2, mb: 2 }}>
                            <CardContent>
                                <Box sx={{ mb: 2 }}>
                                    <Typography variant="h6" gutterBottom>
                                        Gerando PDFs...
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                                        Tempo decorrido: {elapsedTime} segundos
                                    </Typography>
                                    <LinearProgress 
                                        variant="determinate" 
                                        value={progress} 
                                        sx={{ height: 8, borderRadius: 4 }}
                                    />
                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 1 }}>
                                        <Typography variant="body2" color="text.secondary">
                                            {progress}% concluído
                                        </Typography>
                                        <Typography variant="body2" color="text.secondary">
                                            {progress < 100 ? 'Processando...' : 'Concluído!'}
                                        </Typography>
                                    </Box>
                                </Box>
                            </CardContent>
                        </Card>
                    </Grid>
                )}

                <Grid item xs={12}>
                    <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
                        <AnimateButton>
                            <Button
                                variant="contained"
                                color="primary"
                                size="large"
                                onClick={handleDownload}
                                disabled={loading || !naturezaId || !dataInicial || !dataFinal}
                                startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <DownloadIcon />}
                            >
                                {loading ? 'Gerando PDFs...' : 'Baixar PDFs'}
                            </Button>
                        </AnimateButton>
                    </Box>
                </Grid>
            </Grid>

            <Snackbar
                open={openSnackbar}
                autoHideDuration={6000}
                onClose={handleCloseSnackbar}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
            >
                <Alert
                    onClose={handleCloseSnackbar}
                    severity={error ? 'error' : 'success'}
                    sx={{ width: '100%' }}
                >
                    {error || 'PDFs gerados com sucesso!'}
                </Alert>
            </Snackbar>
        </MainCard>
    );
};

export default TaskPdf;

