import { useState, useEffect } from 'react';
import { Grid, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, MenuItem, Select, FormControl, InputLabel, Typography, Tabs, Tab, Card, CardContent } from '@mui/material';
import MainCard from 'ui-component/cards/MainCard';
import { getPainelChamado, getResourcePainelChamado } from 'services/biPainelChamado';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';

const formatSLA = (hours, minutes) => `${hours}:${minutes.toString().padStart(2, '0')}`;

const getSLAColor = (hours, minutes) => {
    const totalMinutes = hours * 60 + minutes;
    if (totalMinutes > 24 * 60) return 'yellow';
    if (totalMinutes < 24 * 60 && totalMinutes > 0 * 60) return 'orange';
    return 'red';
};

const Home = () => {
    const [data, setData] = useState([]);
    const [users, setUsers] = useState([]);
    const selectedUser= useSelector((state) => state.painelChamado.selectedUser);
    const [tabIndex, setTabIndex] = useState(0);
    const [category, setCategory] = useState('Vencidos');
    
    const id_role = useSelector((state) => state.auth.user.perfil_id);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await getPainelChamado(selectedUser);
                setData(response.data);
            } catch (error) {
                console.error('Erro ao buscar dados:', error);
            }
        };

        fetchData();
    }, [selectedUser]);

    useEffect(() => {
        const fetchDataResource = async () => {
            try {
                const response = await getResourcePainelChamado();
                setUsers(response.data);
            } catch (error) {
                console.error('Erro ao buscar dados:', error);
            }
        };

        fetchDataResource();
    }, []);

    const handleOSClick = (osId) => {
        dispatch({
            type: 'SET_OS_TASK_FILTER',
            payload: osId
        });
        navigate('/corretivas');
    };

    const sortedSLA = [...data].sort((a, b) => (a.solucao_horas * 60 + a.solucao_minutos) - (b.solucao_horas * 60 + b.solucao_minutos));
    const sortedSLAAtendimento = [...data]
        .filter(row => row.status_id !== 2) // Filtra os itens onde status_id não é 2
        .sort((a, b) => (a.atendimento_horas * 60 + a.atendimento_minutos) - (b.atendimento_horas * 60 + b.atendimento_minutos));

    // Função para contar as OSs por categoria
    const countByCategory = (tabIndex) => {
        const filteredData = (tabIndex === 0 ? sortedSLA : sortedSLAAtendimento);
        return {
            Vencidos: filteredData.filter(row => {
                const totalMinutes = (tabIndex === 0 ? row.solucao_horas : row.atendimento_horas) * 60 + (tabIndex === 0 ? row.solucao_minutos : row.atendimento_minutos);
                return totalMinutes < 0;
            }).length,
            'Menos que 24': filteredData.filter(row => {
                const totalMinutes = (tabIndex === 0 ? row.solucao_horas : row.atendimento_horas) * 60 + (tabIndex === 0 ? row.solucao_minutos : row.atendimento_minutos);
                return totalMinutes > 0 && totalMinutes <= 24 * 60;
            }).length,
            'Mais que 24': filteredData.filter(row => {
                const totalMinutes = (tabIndex === 0 ? row.solucao_horas : row.atendimento_horas) * 60 + (tabIndex === 0 ? row.solucao_minutos : row.atendimento_minutos);
                return totalMinutes > 24 * 60;
            }).length
        };
    };

    const categoryCount = countByCategory(tabIndex);

    const handleCategoryClick = (newCategory) => {
        setCategory(newCategory);
    };

    useEffect(() => {
        setCategory('Vencidos'); // Reseta a categoria para "Vencidos" ao alterar o supervisor
    }, [selectedUser]);

    useEffect(() => {
        setCategory('Vencidos'); // Reseta a categoria ao mudar de tab
    }, [tabIndex]);

    // Filtrando os dados conforme a categoria e tabIndex
    const filteredData = (tabIndex === 0 ? sortedSLA : sortedSLAAtendimento).filter(row => {
        const totalMinutes = (tabIndex === 0 ? row.solucao_horas : row.atendimento_horas) * 60 + (tabIndex === 0 ? row.solucao_minutos : row.atendimento_minutos);
        switch (category) {
            case 'Vencidos':
                return totalMinutes < 0;
            case 'Menos que 24':
                return totalMinutes > 0 && totalMinutes <= 24 * 60;
            case 'Mais que 24':
                return totalMinutes > 24 * 60;
            default:
                return true;
        }
    });

    if (id_role == 1 || id_role == 3) {
        return (
            <MainCard 
                title="Monitoramento de OS" 
                sx={{
                    position: 'relative',
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    padding: '20px'
                }}
            >
                <FormControl fullWidth sx={{ marginBottom: 2 }}>
                    <InputLabel>Filtrar por Supervisor</InputLabel>
                    <Select
                        value={selectedUser}
                        onChange={(e) => dispatch({ type: 'SET_SUPERVISOR_PAINEL_CHAMADO', payload: e.target.value })}
                        label="Filtrar por Supervisor"
                    >
                        <MenuItem value="">Todos</MenuItem>
                        {users.map(user => (
                            <MenuItem key={user.id} value={user.id}>{user.nome}</MenuItem>
                        ))}
                    </Select>
                </FormControl>
    
                <Tabs value={tabIndex} onChange={(e, newIndex) => setTabIndex(newIndex)}>
                    <Tab label="SLA SOLUÇÃO" />
                    <Tab label="SLA ATENDIMENTO" />
                </Tabs>

                {/* Cards de Categorias */}
                <Grid container spacing={2} sx={{ marginTop: 2 }}>
                    {['Vencidos', 'Menos que 24', 'Mais que 24'].map((cat) => (
                        <Grid item xs={12} sm={4} key={cat}>
                            <Card
                                sx={{
                                    backgroundColor: category === cat ? (cat === 'Vencidos' ? 'red' : cat === 'Menos que 24' ? '#FFA500' : '#FFFF00') : 'white',
                                    cursor: 'pointer',
                                    border: '1px solid #ccc',
                                    '&:hover': { backgroundColor: 'lightgrey', color: 'black' }
                                }}
                                onClick={() => handleCategoryClick(cat)}
                            >
                                <CardContent>
                                    <Typography
                                        variant="h6"
                                        style={{
                                            fontWeight: 600,
                                            color: category === 'Vencidos' && cat === 'Vencidos' ? 'white' : 'black'
                                        }}
                                    >
                                        {cat}
                                    </Typography>
                                    <Typography
                                        variant="body2"
                                        style={{
                                            color: category === 'Vencidos' && cat === 'Vencidos' ? 'white' : 'black'
                                        }}
                                    >
                                        {categoryCount[cat]} OS
                                    </Typography>
                                </CardContent>
                            </Card>
                        </Grid>
                    ))}
                </Grid>

    
                {tabIndex === 0 && (
                    <TableContainer component={Paper} sx={{ backgroundColor: 'rgba(255, 255, 255, 0.8)', maxHeight: 400, overflowY: 'auto', marginTop: 2 }}>
                        <Table stickyHeader>
                            <TableHead>
                                <TableRow>
                                    <TableCell>OS</TableCell>
                                    <TableCell>EQUIPE</TableCell>
                                    <TableCell>Unidade</TableCell>
                                    <TableCell>SLA Solução</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {filteredData.map((row, index) => (
                                    <TableRow key={index}>
                                        <TableCell 
                                            style={{ 
                                                fontSize: 18, 
                                                backgroundColor: getSLAColor(row.solucao_horas, row.solucao_minutos), 
                                                color: getSLAColor(row.solucao_horas, row.solucao_minutos) === 'red' ? 'white' : 'black', 
                                                cursor: 'pointer',
                                                textDecoration: 'underline'
                                            }}
                                            onClick={() => handleOSClick(row.id)}
                                        >
                                            {row.id}
                                        </TableCell>
                                        <TableCell style={{ fontSize: 18 }}>{row.equipe}</TableCell>
                                        <TableCell style={{ fontSize: 18 }}>{row.unidade}</TableCell>
                                        <TableCell style={{ fontSize: 18, fontWeight: 600 }}>{formatSLA(row.solucao_horas, row.solucao_minutos)}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                )}
    
                {tabIndex === 1 && (
                    <TableContainer component={Paper} sx={{ backgroundColor: 'rgba(255, 255, 255, 0.8)', maxHeight: 400, overflowY: 'auto', marginTop: 2 }}>
                        <Table stickyHeader>
                            <TableHead>
                                <TableRow>
                                    <TableCell>OS</TableCell>
                                    <TableCell>EQUIPE</TableCell>
                                    <TableCell>Unidade</TableCell>
                                    <TableCell>SLA Atendimento</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {filteredData.map((row, index) => (
                                    <TableRow key={index}>
                                        <TableCell 
                                            style={{ 
                                                fontSize: 18, 
                                                backgroundColor: getSLAColor(row.atendimento_horas, row.atendimento_minutos), 
                                                color: getSLAColor(row.atendimento_horas, row.atendimento_minutos) === 'red' ? 'white' : 'black', 
                                                cursor: 'pointer',
                                                textDecoration: 'underline'
                                            }}
                                            onClick={() => handleOSClick(row.id)}
                                        >
                                            {row.id}
                                        </TableCell>
                                        <TableCell style={{ fontSize: 18 }}>{row.equipe}</TableCell>
                                        <TableCell style={{ fontSize: 18 }}>{row.unidade}</TableCell>
                                        <TableCell style={{ fontSize: 18, fontWeight: 600 }}>{formatSLA(row.atendimento_horas, row.atendimento_minutos)}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                )}
            </MainCard>
        );
    } else {
        return <MainCard style={{ height: '100%', background: 'rgba(0,0,0,0)', border: 0 }} />;
    }
};

export default Home;
