import React, { useState, useEffect } from 'react';
import { useTheme } from '@mui/material/styles';
import { useSelector } from 'react-redux';
import { 
    Box, 
    Button, 
    FormControl, 
    Grid, 
    TextField, 
    useMediaQuery,
    Alert,
    Snackbar,
    MenuItem,
    Chip,
    OutlinedInput,
    Select,
    FormControlLabel,
    Checkbox,
    FormGroup
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { ptBR } from 'date-fns/locale';
import MainCard from 'ui-component/cards/MainCard';
import AnimateButton from 'ui-component/extended/AnimateButton';
import Loading from 'components/Loading/Loading';
import { gridSpacing } from 'store/constant';
import ReportService from 'services/report';
import DownloadIcon from '@mui/icons-material/Download';
import FilterListIcon from '@mui/icons-material/FilterList';

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
    PaperProps: {
        style: {
            maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
            width: 250,
        },
    },
};

const ReportTaskNew = () => {
    const theme = useTheme();
    const matchDownSM = useMediaQuery(theme.breakpoints.down('md'));
    
    // Captura a unidade do Redux
    const unit = useSelector((state) => state.user.unit || '');
    
    // Estados para filtros
    const [initialDate, setInitialDate] = useState(null);
    const [finalDate, setFinalDate] = useState(null);
    const [selectedTipoOs, setSelectedTipoOs] = useState([]);
    const [selectedNaturezas, setSelectedNaturezas] = useState([]);
    const [selectedStatus, setSelectedStatus] = useState([]);
    
    // Estados para dados dos filtros
    const [tipoOsOptions, setTipoOsOptions] = useState([]);
    const [naturezaOptions, setNaturezaOptions] = useState([]);
    const [statusOptions, setStatusOptions] = useState([]);
    
    // Estados de controle
    const [loading, setLoading] = useState(false);
    const [loadingFilters, setLoadingFilters] = useState(true);
    const [success, setSuccess] = useState('');
    const [error, setError] = useState('');

    useEffect(() => {
        loadFilterOptions();
    }, []);

    const loadFilterOptions = async () => {
        try {
            setLoadingFilters(true);
            const response = await ReportService.getFilterOptions();
            
            if (response.data.success) {
                setTipoOsOptions(response.data.data.tipo_os);
                setNaturezaOptions(response.data.data.naturezas);
                setStatusOptions(response.data.data.status);
            } else {
                setError('Erro ao carregar opções de filtro');
            }
        } catch (err) {
            setError('Erro ao carregar opções de filtro: ' + err.message);
        } finally {
            setLoadingFilters(false);
        }
    };

    const handleTipoOsChange = (event) => {
        const value = event.target.value;
        setSelectedTipoOs(typeof value === 'string' ? value.split(',') : value);
    };

    const handleNaturezaChange = (event) => {
        const value = event.target.value;
        setSelectedNaturezas(typeof value === 'string' ? value.split(',') : value);
    };

    const handleStatusChange = (event) => {
        const value = event.target.value;
        setSelectedStatus(typeof value === 'string' ? value.split(',') : value);
    };

    const handleExport = async () => {
        try {
            // Filtros são opcionais - não há validação obrigatória

            setLoading(true);
            setError('');
            setSuccess('');

            const filters = {
                initial_date: initialDate ? initialDate.toISOString().split('T')[0] : null,
                final_date: finalDate ? finalDate.toISOString().split('T')[0] : null,
                tipo_os_ids: selectedTipoOs,
                natureza_ids: selectedNaturezas,
                status_ids: selectedStatus,
                unit_id: unit
            };

            const response = await ReportService.exportReport(filters);
            
            // Criar blob e fazer download
            const blob = new Blob([response.data], { 
                type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' 
            });
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = `relatorio_os_${new Date().toISOString().split('T')[0]}.xlsx`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            window.URL.revokeObjectURL(url);

            setSuccess('Relatório exportado com sucesso!');
            setTimeout(() => setSuccess(''), 3000);

        } catch (err) {
            setError('Erro ao exportar relatório: ' + (err.response?.data?.error || err.message));
            setTimeout(() => setError(''), 5000);
        } finally {
            setLoading(false);
        }
    };

    const clearFilters = () => {
        setInitialDate(null);
        setFinalDate(null);
        setSelectedTipoOs([]);
        setSelectedNaturezas([]);
        setSelectedStatus([]);
    };

    if (loadingFilters) {
        return (
            <Grid container alignItems="center" justifyContent="center">
                <MainCard style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Loading color="#015641" type="cubes" />
                </MainCard>
            </Grid>
        );
    }

    return (
        <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={ptBR}>
            <MainCard spacing={gridSpacing} style={{ padding: 15, margin: 25 }}>
                <Grid xs={12} md={12} sm={12} container>
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
                        <FilterListIcon /> Relatório de Ordens de Serviço
                    </h1>
                    <hr style={{ width: '100%', marginTop: 0 }}></hr>
                </Grid>

                {error && (
                    <Snackbar open={true} autoHideDuration={6000}>
                        <Alert
                            severity="error"
                            sx={{
                                width: '100%',
                                backgroundColor: 'red',
                                color: '#FFF'
                            }}
                        >
                            {error}
                        </Alert>
                    </Snackbar>
                )}

                {success && (
                    <Snackbar open={true} autoHideDuration={6000}>
                        <Alert
                            severity="success"
                            sx={{
                                width: '100%',
                                backgroundColor: 'green',
                                color: '#FFF'
                            }}
                        >
                            {success}
                        </Alert>
                    </Snackbar>
                )}

                <div style={{ display: loading ? 'none' : 'block' }}>
                    <Grid container spacing={matchDownSM ? 0 : 2}>
                        {/* Filtros de Data */}
                        <Grid item xs={12} sm={6} sx={{ marginTop: 3 }}>
                            <DatePicker
                                label="Data Inicial"
                                value={initialDate}
                                onChange={(newValue) => setInitialDate(newValue)}
                                renderInput={(params) => <TextField {...params} fullWidth />}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6} sx={{ marginTop: 3 }}>
                            <DatePicker
                                label="Data Final"
                                value={finalDate}
                                onChange={(newValue) => setFinalDate(newValue)}
                                renderInput={(params) => <TextField {...params} fullWidth />}
                            />
                        </Grid>

                        {/* Filtro de Tipo de OS */}
                        <Grid item xs={12} sm={6} sx={{ marginTop: 3 }}>
                            <FormControl fullWidth>
                                <TextField
                                    select
                                    label="Tipo de OS"
                                    value={selectedTipoOs}
                                    onChange={handleTipoOsChange}
                                    SelectProps={{
                                        multiple: true,
                                        renderValue: (selected) => (
                                            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                                                {selected.map((value) => {
                                                    const option = tipoOsOptions.find(opt => opt.id == value);
                                                    return (
                                                        <Chip key={value} label={option?.nome || value} />
                                                    );
                                                })}
                                            </Box>
                                        ),
                                        MenuProps: MenuProps,
                                    }}
                                >
                                    {tipoOsOptions.map((option) => (
                                        <MenuItem key={option.id} value={option.id}>
                                            {option.nome}
                                        </MenuItem>
                                    ))}
                                </TextField>
                            </FormControl>
                        </Grid>

                        {/* Filtro de Natureza */}
                        <Grid item xs={12} sm={6} sx={{ marginTop: 3 }}>
                            <FormControl fullWidth>
                                <TextField
                                    select
                                    label="Natureza"
                                    value={selectedNaturezas}
                                    onChange={handleNaturezaChange}
                                    SelectProps={{
                                        multiple: true,
                                        renderValue: (selected) => (
                                            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                                                {selected.map((value) => {
                                                    const option = naturezaOptions.find(opt => opt.id == value);
                                                    return (
                                                        <Chip key={value} label={option?.nome || value} />
                                                    );
                                                })}
                                            </Box>
                                        ),
                                        MenuProps: MenuProps,
                                    }}
                                >
                                    {naturezaOptions.map((option) => (
                                        <MenuItem key={option.id} value={option.id}>
                                            {option.nome}
                                        </MenuItem>
                                    ))}
                                </TextField>
                            </FormControl>
                        </Grid>

                        {/* Filtro de Status */}
                        <Grid item xs={12} sm={6} sx={{ marginTop: 3 }}>
                            <FormControl fullWidth>
                                <TextField
                                    select
                                    label="Status"
                                    value={selectedStatus}
                                    onChange={handleStatusChange}
                                    SelectProps={{
                                        multiple: true,
                                        renderValue: (selected) => (
                                            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                                                {selected.map((value) => {
                                                    const option = statusOptions.find(opt => opt.id == value);
                                                    return (
                                                        <Chip key={value} label={option?.nome || value} />
                                                    );
                                                })}
                                            </Box>
                                        ),
                                        MenuProps: MenuProps,
                                    }}
                                >
                                    {statusOptions.map((option) => (
                                        <MenuItem key={option.id} value={option.id}>
                                            {option.nome}
                                        </MenuItem>
                                    ))}
                                </TextField>
                            </FormControl>
                        </Grid>
                    </Grid>

                    {/* Botões de Ação */}
                    <Grid container alignItems="end" justifyContent="end" sx={{ mt: 3 }}>
                        <Grid item>
                            <Box sx={{ mt: 2, mr: 3 }}>
                                <AnimateButton>
                                    <Button
                                        disableElevation
                                        disabled={loading}
                                        fullWidth
                                        size="large"
                                        type="button"
                                        variant="outlined"
                                        color="secondary"
                                        onClick={clearFilters}
                                    >
                                        Limpar Filtros
                                    </Button>
                                </AnimateButton>
                            </Box>
                        </Grid>
                        <Grid item>
                            <Box sx={{ mt: 2, mr: 3 }}>
                                <AnimateButton>
                                    <Button
                                        disableElevation
                                        disabled={loading}
                                        fullWidth
                                        size="large"
                                        type="button"
                                        variant="contained"
                                        color="primary"
                                        startIcon={<DownloadIcon />}
                                        onClick={handleExport}
                                    >
                                        {loading ? 'Exportando...' : 'Exportar Relatório'}
                                    </Button>
                                </AnimateButton>
                            </Box>
                        </Grid>
                    </Grid>
                </div>

                {loading && (
                    <Grid container alignItems="center" justifyContent="center">
                        <MainCard style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <Loading color="#015641" type="cubes" />
                        </MainCard>
                    </Grid>
                )}
            </MainCard>
        </LocalizationProvider>
    );
};

export default ReportTaskNew;
