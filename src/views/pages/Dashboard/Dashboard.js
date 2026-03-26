import React, { useState } from 'react';
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
    Tabs,
    Tab,
    Paper,
    CircularProgress,
    LinearProgress
} from '@mui/material';
import { styled } from '@mui/material/styles';
import MainCard from 'ui-component/cards/MainCard';
import { gridSpacing } from 'store/constant';

// Styled components para o gauge
const GaugeContainer = styled(Box)(({ theme }) => ({
    position: 'relative',
    width: 180,
    height: 90,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    margin: '0 auto',
}));

const GaugeBackground = styled(Box)(({ theme }) => ({
    position: 'absolute',
    width: '100%',
    height: '100%',
    borderRadius: '90px 90px 0 0',
    background: 'conic-gradient(from 180deg, #4CAF50 0deg 204.48deg, #E0E0E0 204.48deg 360deg)',
    '&::before': {
        content: '""',
        position: 'absolute',
        top: '15%',
        left: '15%',
        right: '15%',
        bottom: '0',
        background: 'white',
        borderRadius: '70px 70px 0 0',
    }
}));

const GaugeText = styled(Box)(({ theme }) => ({
    position: 'absolute',
    top: '45%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    textAlign: 'center',
    zIndex: 1,
}));

// Styled components para os cards de métricas
const MetricCard = styled(Card)(({ theme }) => ({
    background: '#E0E0E0',
    borderRadius: 6,
    minHeight: 30,
    minWidth: 70,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
    padding: '2px 4px',
    '&:hover': {
        boxShadow: theme.shadows[4],
    }
}));

const MetricValue = styled(Box)(({ theme }) => ({
    background: 'white',
    borderRadius: 4,
    padding: '2px 6px',
    marginTop: 2,
    fontWeight: 'bold',
    fontSize: '1rem',
    color: theme.palette.text.primary,
    border: '1px solid #E0E0E0',
    minWidth: 35,
    textAlign: 'center',
}));

const CriticalMetricValue = styled(MetricValue)(({ theme }) => ({
    border: '2px solid #F44336',
    color: '#F44336',
    background: '#FFEBEE',
}));

// Componente para conectar cards com linha vertical
const VerticalConnector = styled(Box)(({ theme }) => ({
    width: '2px',
    height: '20px',
    background: '#000',
    margin: '0 auto',
}));

// Componente para seta horizontal
const HorizontalArrow = styled(Box)(({ theme }) => ({
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    margin: '0 10px',
    '&::after': {
        content: '"→"',
        fontSize: '2.5rem',
        color: '#000',
        fontWeight: 'bold',
    }
}));

// Componente do gauge
const SLAGauge = ({ value = 56.8 }) => {
    const percentage = Math.min(Math.max(value, 0), 100);
    
    return (
        <GaugeContainer>
            <GaugeBackground />
            <GaugeText>
                <Typography variant="h4" component="div" sx={{ fontWeight: 'bold', color: '#015641', fontSize: '1.8rem' }}>
                    {percentage.toFixed(1)}%
                </Typography>
            </GaugeText>
        </GaugeContainer>
    );
};

// Componente principal do Dashboard
const Dashboard = () => {
    const [selectedIndicator, setSelectedIndicator] = useState('engenharia-clinica');
    const [selectedPeriod, setSelectedPeriod] = useState('agosto-2025');
    const [activeTab, setActiveTab] = useState(0);

    const handleTabChange = (event, newValue) => {
        setActiveTab(newValue);
    };

    // Dados mockados
    const mockData = {
        chamados: {
            abertos: 600,
            fechados: 580
        },
        sla: 56.8,
        backlog: 50,
        resolucao: {
            dentroPrazo: 330,
            foraPrazo: 250
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
                            DASHBOARD GESTÃO DOS CHAMADOS
                        </Typography>
                    </Grid>
                    <Grid item>
                        <Typography variant="h6" sx={{ color: 'rgba(255,255,255,0.8)' }}>
                            InovaBH
                        </Typography>
                    </Grid>
                </Grid>
            </Box>

            {/* Tabs de navegação */}
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
                    <Tab label="Dados Resumo" />
                    <Tab label="Planilha dados" />
                    <Tab label="Gráficos" />
                    <Tab label="Planejamento" />
                    <Tab label="Mapa" />
                </Tabs>
            </Paper>

            {/* Conteúdo principal */}
            <Card sx={{ padding: 3, minHeight: 500 }}>
                <CardContent>
                    {/* Filtros */}
                    <Grid container spacing={3} sx={{ marginBottom: 4 }}>
                        <Grid item xs={12} sm={6} md={4}>
                            <FormControl fullWidth>
                                <InputLabel>Indicadores Engenharia Clinica</InputLabel>
                                <Select
                                    value={selectedIndicator}
                                    label="Indicadores Engenharia Clinica"
                                    onChange={(e) => setSelectedIndicator(e.target.value)}
                                >
                                    <MenuItem value="engenharia-clinica">Engenharia Clínica</MenuItem>
                                    <MenuItem value="manutencao">Manutenção</MenuItem>
                                    <MenuItem value="suporte">Suporte Técnico</MenuItem>
                                </Select>
                            </FormControl>
                        </Grid>
                        <Grid item xs={12} sm={6} md={4}>
                            <FormControl fullWidth>
                                <InputLabel>Período</InputLabel>
                                <Select
                                    value={selectedPeriod}
                                    label="Período"
                                    onChange={(e) => setSelectedPeriod(e.target.value)}
                                >
                                    <MenuItem value="agosto-2025">Agosto/2025</MenuItem>
                                    <MenuItem value="setembro-2025">Setembro/2025</MenuItem>
                                    <MenuItem value="outubro-2025">Outubro/2025</MenuItem>
                                </Select>
                            </FormControl>
                        </Grid>
                    </Grid>

                    {/* <Box sx={{ textAlign: 'right', marginTop: 2 }}>
                        <MetricCard sx={{ minWidth: 100, display: 'inline-block' }}>
                            <Typography variant="body2" sx={{ color: '#666', fontWeight: 'bold', fontSize: '0.9rem' }}>
                                BACKLOG
                            </Typography>
                        </MetricCard>
                        <VerticalConnector />
                        <MetricValue sx={{ minWidth: 100, display: 'inline-block' }}>
                            {mockData.backlog}
                        </MetricValue>
                    </Box> */}

                    {/* Fluxo principal - CHAMADOS e SLA lado a lado */}
                    <Box sx={{ marginBottom: 4, position: 'relative' }}>
                        {/* Títulos superiores */}
                        <Grid container spacing={4} sx={{ marginBottom: 2 }}>
                            <Grid item xs={6}>
                                <Typography variant="h6" sx={{ color: '#015641', fontWeight: 'bold', display: 'flex', alignItems: 'center' }}>
                                    📊 CHAMADOS
                                </Typography>
                            </Grid>
                            <Grid item xs={6}>
                                {/* Espaço vazio - SLA movido para o centro */}
                            </Grid>
                        </Grid>

                        <Grid container spacing={2} alignItems="center" justifyContent="center">
                            <Grid item>
                                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center' }}>
                                    <SLAGauge value={mockData.sla} />
                                    <Typography variant="h6" sx={{ color: '#015641', fontWeight: 'bold', marginBottom: 1, fontSize: '0.9rem' }}>
                                        SLA de solução
                                    </Typography>
                                    <Typography variant="body2" sx={{ color: '#666', fontSize: '0.7rem', marginBottom: 1 }}>
                                        0.0% - 100.0%
                                    </Typography>
                                </Box>
                            </Grid>
                        </Grid>
                    {/* Títulos superiores - CHAMADOS, SLA e BACKLOG */}
                    
                    {/* Cards de métricas - ABERTOS, FECHADOS, DENTRO DO PRAZO, FORA DO PRAZO */}
                    <Grid container spacing={2} alignItems="flex-start">
                        {/* ABERTOS */}
                        <Grid item xs={3}>
                            <Box sx={{ textAlign: 'center' }}>
                                <MetricCard>
                                    <Typography variant="body2" sx={{ color: '#666', fontWeight: 'bold', fontSize: '0.7rem' }}>
                                        ABERTOS
                                    </Typography>
                                </MetricCard>
                                <VerticalConnector />
                                <MetricValue>
                                    {mockData.chamados.abertos}
                                </MetricValue>
                            </Box>
                        </Grid>

                        {/* FECHADOS */}
                        <Grid item xs={3}>
                            <Box sx={{ textAlign: 'center' }}>
                                <MetricCard>
                                    <Typography variant="body2" sx={{ color: '#666', fontWeight: 'bold', fontSize: '0.7rem' }}>
                                        FECHADOS
                                    </Typography>
                                </MetricCard>
                                <VerticalConnector />
                                <MetricValue>
                                    {mockData.chamados.fechados}
                                </MetricValue>
                            </Box>
                        </Grid>

                        {/* Seta de conexão com SLA Gauge centralizado acima */}
                        <Grid item xs={1}>
                            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
                                <HorizontalArrow />
                            </Box>
                        </Grid>

                        {/* DENTRO DO PRAZO */}
                        <Grid item xs={2.5}>
                            <Box sx={{ textAlign: 'center' }}>
                                <MetricCard>
                                    <Typography variant="body2" sx={{ color: '#666', fontWeight: 'bold', fontSize: '0.6rem', lineHeight: 1.2 }}>
                                        DENTRO DO PRAZO
                                    </Typography>
                                </MetricCard>
                                <VerticalConnector />
                                <MetricValue>
                                    {mockData.resolucao.dentroPrazo}
                                </MetricValue>
                            </Box>
                        </Grid>

                        {/* FORA DO PRAZO */}
                        <Grid item xs={2.5}>
                            <Box sx={{ textAlign: 'center' }}>
                                <MetricCard>
                                    <Typography variant="body2" sx={{ color: '#666', fontWeight: 'bold', fontSize: '0.6rem', lineHeight: 1.2 }}>
                                        FORA DO PRAZO
                                    </Typography>
                                </MetricCard>
                                <VerticalConnector />
                                <CriticalMetricValue>
                                    {mockData.resolucao.foraPrazo}
                                </CriticalMetricValue>
                            </Box>
                        </Grid>
                    </Grid>

                    </Box>
                </CardContent>
            </Card>

            {/* Footer */}
            <Box sx={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center',
                marginTop: 3,
                padding: 2,
                color: '#666',
                fontSize: '0.9rem'
            }}>
                <Typography variant="body2">
                    Jope Infraestrutura Social Brasil
                </Typography>
                <Typography variant="body2">
                    {new Date().toLocaleDateString('pt-BR', { 
                        weekday: 'long', 
                        year: 'numeric', 
                        month: 'long', 
                        day: 'numeric' 
                    })}
                </Typography>
            </Box>
        </MainCard>
    );
};

export default Dashboard;
