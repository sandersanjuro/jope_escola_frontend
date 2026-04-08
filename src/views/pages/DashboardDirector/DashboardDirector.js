import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import {
    Box,
    Grid,
    Typography,
    Card,
    CardContent,
    Select,
    MenuItem,
    FormControl,
    InputLabel,
    CircularProgress,
    Alert,
    Snackbar,
    Autocomplete,
    TextField,
    Chip,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    TablePagination,
    IconButton,
    Tabs,
    Tab
} from '@mui/material';
import { Close as CloseIcon } from '@mui/icons-material';
import { Chart } from 'react-google-charts';
import MainCard from 'ui-component/cards/MainCard';
import { gridSpacing } from 'store/constant';
import dashboardService from 'services/dashboardService';
import ChecklistInspectionDashboard from './ChecklistInspectionDashboard';

const DashboardDirector = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [activeTab, setActiveTab] = useState(0);
    
    // Estados para filtros
    const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
    const [selectedTypeOs, setSelectedTypeOs] = useState([]);
    const [typeOsOptions, setTypeOsOptions] = useState([]);
    const [chartData, setChartData] = useState([]);
    
    // Estados para modal de chamados pendentes
    const [modalOpen, setModalOpen] = useState(false);
    const [modalTitle, setModalTitle] = useState('');
    const [pendentesData, setPendentesData] = useState([]);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [totalCount, setTotalCount] = useState(0);
    const [loadingModal, setLoadingModal] = useState(false);
    const [selectedMonth, setSelectedMonth] = useState(null);
    const [modalType, setModalType] = useState('pendentes'); // 'pendentes' ou 'finalizados'
    
    // Unidade do usuário logado
    const userUnit = useSelector((state) => state.user.unit || '');
    const id_role = useSelector((state) => state.auth.user.perfil_id);
    const showChecklistTab = id_role == 1;

    // Evita ficar na aba Checklist se o perfil não tiver acesso
    useEffect(() => {
        if (!showChecklistTab && activeTab === 1) {
            setActiveTab(0);
        }
    }, [showChecklistTab, activeTab]);

    // Função para mudar de aba
    const handleTabChange = (event, newValue) => {
        setActiveTab(newValue);
    };
    
    // Carregar dados iniciais
    useEffect(() => {
        loadInitialData();
    }, []);
    
    // Carregar dados do gráfico quando filtros mudarem
    useEffect(() => {
        if (selectedYear) {
            loadChartData();
        }
    }, [selectedYear, selectedTypeOs, userUnit]);

    const loadInitialData = async () => {
        try {
            setLoading(true);
            
            // Carregar tipos de OS
            const typeOsResponse = await dashboardService.getTypeOsOptions();
            if (typeOsResponse && typeOsResponse.success && typeOsResponse.data) {
                setTypeOsOptions(typeOsResponse.data);
            }
            
        } catch (error) {
            console.error('Erro ao carregar dados iniciais:', error);
            setError('Erro ao carregar dados iniciais');
            setSnackbarMessage('Erro ao carregar dados iniciais');
            setSnackbarOpen(true);
        } finally {
            setLoading(false);
        }
    };

    const loadChartData = async () => {
        try {
            setLoading(true);
            setError(null);

            const filters = {
                year: selectedYear,
                unit: userUnit,
                typeOs: selectedTypeOs.length > 0 ? selectedTypeOs.map(item => item.id) : null
            };

            console.log('Filtros enviados:', filters);
            console.log('selectedTypeOs array:', selectedTypeOs);
            console.log('typeOs IDs extraídos:', selectedTypeOs.length > 0 ? selectedTypeOs.map(item => item.id) : null);
            const response = await dashboardService.getDirectorDashboardData(filters);
            console.log('Resposta da API:', response);
            
            if (response && response.success) {
                console.log('Dados do gráfico:', response.data);
                setChartData(response.data);
            } else {
                throw new Error(response?.message || 'Erro ao carregar dados do gráfico');
            }

        } catch (error) {
            console.error('Erro ao carregar dados do gráfico:', error);
            setError('Erro ao carregar dados do gráfico');
            setSnackbarMessage('Erro ao carregar dados do gráfico');
            setSnackbarOpen(true);
        } finally {
            setLoading(false);
        }
    };

    // Carregar chamados pendentes para o modal
    const loadPendentesData = async (month, year, pageNumber = null, perPage = null) => {
        try {
            setLoadingModal(true);
            setError(null);

            const filters = {
                year: year,
                month: month,
                unit: userUnit,
                typeOs: selectedTypeOs.length > 0 ? selectedTypeOs.map(item => item.id) : null,
                page: pageNumber || page + 1,
                perPage: perPage || rowsPerPage
            };

            console.log('Carregando chamados pendentes:', filters);
            const response = await dashboardService.getPendentesData(filters);
            console.log('Resposta dos pendentes:', response);
            
            if (response && response.success) {
                setPendentesData(response.data.data);
                setTotalCount(response.data.total);
            } else {
                throw new Error(response?.message || 'Erro ao carregar chamados pendentes');
            }

        } catch (error) {
            console.error('Erro ao carregar chamados pendentes:', error);
            setError('Erro ao carregar chamados pendentes');
            setSnackbarMessage('Erro ao carregar chamados pendentes');
            setSnackbarOpen(true);
        } finally {
            setLoadingModal(false);
        }
    };

    // Carregar chamados finalizados para o modal
    const loadFinalizadosData = async (month, year, pageNumber = null, perPage = null) => {
        try {
            setLoadingModal(true);
            setError(null);

            const filters = {
                year: year,
                month: month,
                unit: userUnit,
                typeOs: selectedTypeOs.length > 0 ? selectedTypeOs.map(item => item.id) : null,
                page: pageNumber || page + 1,
                perPage: perPage || rowsPerPage
            };

            console.log('Carregando chamados finalizados:', filters);
            const response = await dashboardService.getFinalizadosData(filters);
            console.log('Resposta dos finalizados:', response);
            
            if (response && response.success) {
                setPendentesData(response.data.data);
                setTotalCount(response.data.total);
            } else {
                throw new Error(response?.message || 'Erro ao carregar chamados finalizados');
            }

        } catch (error) {
            console.error('Erro ao carregar chamados finalizados:', error);
            setError('Erro ao carregar chamados finalizados');
            setSnackbarMessage('Erro ao carregar chamados finalizados');
            setSnackbarOpen(true);
        } finally {
            setLoadingModal(false);
        }
    };

    // Preparar dados para o gráfico Google Charts
    const prepareChartData = () => {
        console.log('chartData recebido:', chartData);
        console.log('loading state:', loading);
        
        // Se não há dados da API, retorna array vazio para evitar renderização
        if (!chartData || chartData.length === 0) {
            console.log('Sem dados da API - retornando array vazio');
            return [];
        }

        // Se a API já retorna dados formatados (com cabeçalho), usa diretamente
        if (Array.isArray(chartData) && chartData.length > 0 && Array.isArray(chartData[0])) {
            console.log('API retornou dados já formatados:', chartData);
            return chartData;
        }

        // Se a API retorna dados brutos, formata
        const months = [
            'Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun',
            'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'
        ];

        const chartDataFormatted = [['Mês', 'Pendentes', 'Finalizados']];
        
        months.forEach((month, index) => {
            const monthData = chartData.find(item => item.month === index + 1);
            console.log(`Mês ${index + 1} (${month}):`, monthData);
            chartDataFormatted.push([
                month,
                monthData ? monthData.pendentes : 0,
                monthData ? monthData.finalizados : 0
            ]);
        });

        console.log('Dados formatados para o gráfico:', chartDataFormatted);
        return chartDataFormatted;
    };

    // Funções para manipular o modal
    const handleBarClick = (monthIndex, columnIndex) => {
        const months = [
            'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
            'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
        ];
        
        if (columnIndex === 1) {
            // Coluna de Pendentes
            setModalType('pendentes');
            setModalTitle(`Chamados Pendentes - ${months[monthIndex]} de ${selectedYear}`);
            setModalOpen(true);
            setPage(0);
            setSelectedMonth(monthIndex + 1);
            loadPendentesData(monthIndex + 1, selectedYear);
        } else if (columnIndex === 2) {
            // Coluna de Finalizados
            setModalType('finalizados');
            setModalTitle(`Chamados Finalizados - ${months[monthIndex]} de ${selectedYear}`);
            setModalOpen(true);
            setPage(0);
            setSelectedMonth(monthIndex + 1);
            loadFinalizadosData(monthIndex + 1, selectedYear);
        }
    };

    const handleCloseModal = () => {
        setModalOpen(false);
        setPendentesData([]);
        setPage(0);
        setTotalCount(0);
    };

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
        if (selectedMonth) {
            if (modalType === 'pendentes') {
                loadPendentesData(selectedMonth, selectedYear, newPage + 1, rowsPerPage);
            } else if (modalType === 'finalizados') {
                loadFinalizadosData(selectedMonth, selectedYear, newPage + 1, rowsPerPage);
            }
        }
    };

    const handleChangeRowsPerPage = (event) => {
        const newRowsPerPage = parseInt(event.target.value, 10);
        setRowsPerPage(newRowsPerPage);
        setPage(0);
        if (selectedMonth) {
            if (modalType === 'pendentes') {
                loadPendentesData(selectedMonth, selectedYear, 1, newRowsPerPage);
            } else if (modalType === 'finalizados') {
                loadFinalizadosData(selectedMonth, selectedYear, 1, newRowsPerPage);
            }
        }
    };

    // Função para formatar data no padrão brasileiro
    const formatDateBR = (dateString) => {
        if (!dateString) return '';
        
        try {
            const date = new Date(dateString);
            return date.toLocaleDateString('pt-BR', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            });
        } catch (error) {
            console.error('Erro ao formatar data:', error);
            return dateString;
        }
    };

    const chartOptions = {
        title: `Dashboard - ${selectedYear}`,
        hAxis: {
            title: 'Meses'
        },
        vAxis: {
            title: 'Quantidade de Chamados'
        },
        colors: ['#E0E0E0', '#4CAF50'], // Cinza para pendentes, verde para finalizados
        legend: {
            position: 'top'
        },
        chartArea: {
            width: '80%',
            height: '70%'
        }
    };

    return (
        <MainCard spacing={gridSpacing} style={{ padding: 15, margin: 25 }}>
            {/* Header */}
            <Box sx={{ 
                background: 'linear-gradient(135deg, #015641 0%, #4CAF50 100%)',
                color: 'white',
                padding: 3,
                borderRadius: 2,
                marginBottom: 3
            }}>
                <Grid container alignItems="center" justifyContent="space-between">
                    <Grid item>
                        <Typography variant="h4" component="h1" sx={{ fontWeight: 'bold' }}>
                            DASHBOARD
                        </Typography>
                    </Grid>
                    <Grid item>
                        <Typography variant="h6" sx={{ color: 'rgba(255,255,255,0.8)' }}>
                            Análise Mensal
                        </Typography>
                    </Grid>
                </Grid>
            </Box>

            {/* Tabs de navegação (Checklist só para perfil_id = 1) */}
            {showChecklistTab && (
                <Paper sx={{ marginBottom: 3 }}>
                    <Tabs
                        value={activeTab}
                        onChange={handleTabChange}
                        variant="fullWidth"
                        sx={{
                            '& .MuiTab-root': {
                                backgroundColor: '#E0E0E0',
                                color: '#666',
                                '&.Mui-selected': {
                                    backgroundColor: '#F5F5F5',
                                    color: '#015641',
                                    fontWeight: 'bold'
                                }
                            }
                        }}
                    >
                        <Tab label="Chamados" />
                        <Tab label="Checklist" />
                    </Tabs>
                </Paper>
            )}

            {/* Aba Chamados */}
            {(!showChecklistTab || activeTab === 0) && (
                <>
            {/* Filtros */}
            <Card sx={{ padding: 3, marginBottom: 3 }}>
                <CardContent>
                    <Typography variant="h6" sx={{ color: '#015641', fontWeight: 'bold', marginBottom: 2 }}>
                        Filtros
                    </Typography>
                    
                    <Grid container spacing={3}>
                        <Grid item xs={12} sm={6}>
                            <FormControl fullWidth>
                                <InputLabel>Ano</InputLabel>
                                <Select
                                    value={selectedYear}
                                    label="Ano"
                                    onChange={(e) => setSelectedYear(e.target.value)}
                                    disabled={loading}
                                >
                                    {Array.from({ length: 5 }, (_, i) => {
                                        const year = new Date().getFullYear() - i;
                                        return (
                                            <MenuItem key={year} value={year}>
                                                {year}
                                            </MenuItem>
                                        );
                                    })}
                                </Select>
                            </FormControl>
                        </Grid>
                        
                        <Grid item xs={12} sm={6}>
                            <Autocomplete
                                multiple
                                options={typeOsOptions}
                                getOptionLabel={(option) => option.nome}
                                value={selectedTypeOs}
                                onChange={(event, newValue) => {
                                    setSelectedTypeOs(newValue);
                                }}
                                disabled={loading}
                                renderTags={(value, getTagProps) =>
                                    value.map((option, index) => (
                                        <Chip
                                            variant="outlined"
                                            label={option.nome}
                                            {...getTagProps({ index })}
                                            key={option.id}
                                        />
                                    ))
                                }
                                renderInput={(params) => (
                                    <TextField
                                        {...params}
                                        label="Tipo de OS"
                                        placeholder="Selecione um ou mais tipos"
                                        helperText="Selecione múltiplos tipos ou deixe vazio para todos"
                                    />
                                )}
                                noOptionsText="Nenhum tipo encontrado"
                                clearText="Limpar seleção"
                                closeText="Fechar"
                                openText="Abrir"
                            />
                        </Grid>
                    </Grid>
                </CardContent>
            </Card>

            {/* Gráfico */}
            <Card sx={{ padding: 3 }}>
                <Box>
                    {console.log('=== RENDERIZANDO GRÁFICO ===')}
                    {console.log('loading:', loading)}
                    {console.log('chartData state:', chartData)}
                    {console.log('prepareChartData():', prepareChartData())}
                    {console.log('chartOptions:', chartOptions)}
                    <Chart
                        chartType="ColumnChart"
                        data={prepareChartData()}
                        options={chartOptions}
                        width="100%"
                        height="400px"
                        chartEvents={[
                            {
                                eventName: 'select',
                                callback: ({ chartWrapper }) => {
                                    console.log('Evento select disparado no gráfico');
                                    
                                    // Obter a seleção atual
                                    const chart = chartWrapper.getChart();
                                    const selection = chart.getSelection();
                                    
                                    console.log('Selection:', selection);
                                    
                                    if (selection.length > 0) {
                                        const selectedItem = selection[0];
                                        const monthIndex = selectedItem.row;
                                        const columnIndex = selectedItem.column;
                                        
                                        console.log('Mês selecionado:', monthIndex, 'Coluna:', columnIndex);
                                        
                                        // Abre modal para pendentes (coluna 1) ou finalizados (coluna 2)
                                        if (columnIndex === 1 || columnIndex === 2) {
                                            console.log('Abrindo modal para mês:', monthIndex, 'coluna:', columnIndex);
                                            handleBarClick(monthIndex, columnIndex);
                                        }
                                    }
                                }
                            }
                        ]}
                    />
                </Box>
            </Card>
                </>
            )}

            {/* Aba Checklist — dashboard InspecPro (vw_bi_checklist); só perfil_id = 1 */}
            {showChecklistTab && activeTab === 1 && <ChecklistInspectionDashboard />}

            {/* Snackbar para erros */}
            <Snackbar 
                open={snackbarOpen} 
                autoHideDuration={6000} 
                onClose={() => setSnackbarOpen(false)}
            >
                <Alert 
                    severity="error" 
                    sx={{ width: '100%' }}
                    onClose={() => setSnackbarOpen(false)}
                >
                    {snackbarMessage}
                </Alert>
            </Snackbar>

            {/* Modal de Chamados Pendentes */}
            <Dialog 
                open={modalOpen} 
                onClose={handleCloseModal}
                maxWidth="xl"
                fullWidth
                sx={{
                    '& .MuiDialog-paper': {
                        minHeight: '80vh',
                        maxHeight: '90vh'
                    }
                }}
            >
                <DialogTitle>
                    <Box display="flex" justifyContent="space-between" alignItems="center">
                        <Typography variant="h6">{modalTitle}</Typography>
                        <IconButton onClick={handleCloseModal} size="small">
                            <CloseIcon />
                        </IconButton>
                    </Box>
                </DialogTitle>
                
                <DialogContent>
                    {loadingModal ? (
                        <Box display="flex" justifyContent="center" p={3}>
                            <CircularProgress />
                        </Box>
                    ) : (
                        <TableContainer component={Paper}>
                            <Table>
                                <TableHead>
                                    <TableRow>
                                        <TableCell><strong>OS</strong></TableCell>
                                        <TableCell><strong>Natureza</strong></TableCell>
                                        {modalType === 'finalizados' && (
                                            <TableCell><strong>Local</strong></TableCell>
                                        )}
                                        <TableCell sx={{ minWidth: '100px', width: '100px' }}><strong>Andar</strong></TableCell>
                                        <TableCell><strong>Área</strong></TableCell>
                                        <TableCell sx={{ minWidth: '150px', width: '150px' }}><strong>Data Abertura</strong></TableCell>
                                        {modalType === 'finalizados' && (
                                            <>
                                                <TableCell sx={{ minWidth: '150px', width: '150px' }}><strong>Data Início</strong></TableCell>
                                                <TableCell sx={{ minWidth: '150px', width: '150px' }}><strong>Data Término</strong></TableCell>
                                            </>
                                        )}
                                        <TableCell><strong>Solicitante</strong></TableCell>
                                        <TableCell><strong>Descrição</strong></TableCell>
                                        {modalType === 'finalizados' && (
                                            <>
                                                <TableCell><strong>Observação</strong></TableCell>
                                                <TableCell><strong>Status</strong></TableCell>
                                            </>
                                        )}
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {pendentesData.map((item, index) => (
                                        <TableRow key={index}>
                                            <TableCell>{item.id}</TableCell>
                                            <TableCell>{item.natureza}</TableCell>
                                            {modalType === 'finalizados' && (
                                                <TableCell>{item.local}</TableCell>
                                            )}
                                            <TableCell sx={{ minWidth: '100px', width: '100px' }}>{item.andar}</TableCell>
                                            <TableCell>{item.area}</TableCell>
                                            <TableCell sx={{ minWidth: '150px', width: '150px' }}>{formatDateBR(item.data_abertura)}</TableCell>
                                            {modalType === 'finalizados' && (
                                                <>
                                                    <TableCell sx={{ minWidth: '150px', width: '150px' }}>{formatDateBR(item.inicio_atendimento)}</TableCell>
                                                    <TableCell sx={{ minWidth: '150px', width: '150px' }}>{formatDateBR(item.fim_atendimento)}</TableCell>
                                                </>
                                            )}
                                            <TableCell>{item.solicitante}</TableCell>
                                            <TableCell>{item.descricao}</TableCell>
                                            {modalType === 'finalizados' && (
                                                <>
                                                    <TableCell>{item.detalhe_servico_executado}</TableCell>
                                                    <TableCell>{item.status}</TableCell>
                                                </>
                                            )}
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                            
                            <TablePagination
                                rowsPerPageOptions={[5, 10, 25]}
                                component="div"
                                count={totalCount}
                                rowsPerPage={rowsPerPage}
                                page={page}
                                onPageChange={handleChangePage}
                                onRowsPerPageChange={handleChangeRowsPerPage}
                                labelRowsPerPage="Linhas por página:"
                                labelDisplayedRows={({ from, to, count }) => 
                                    `${from}-${to} de ${count !== -1 ? count : `mais de ${to}`}`
                                }
                            />
                        </TableContainer>
                    )}
                </DialogContent>
                
                <DialogActions>
                    <Button onClick={handleCloseModal} color="primary">
                        Fechar
                    </Button>
                </DialogActions>
            </Dialog>
        </MainCard>
    );
};

export default DashboardDirector;
