import React, { useEffect, useState, useCallback } from 'react';
import MainCard from 'ui-component/cards/MainCard';
import Loading from 'components/Loading/Loading';
import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Checkbox,
    Button,
    Box,
    Typography,
    Alert,
    Snackbar,
} from '@mui/material';
import AnimateButton from 'ui-component/extended/AnimateButton';
import { getRotaUnidadeConfig, syncRotaUnidade } from 'services/rotaUnidade';

/** Nomes em inglês (Carbon dayName), como gravado em `rota.nome` */
const DIA_PT = {
    Monday: 'Segunda',
    Tuesday: 'Terça',
    Wednesday: 'Quarta',
    Thursday: 'Quinta',
    Friday: 'Sexta',
    Saturday: 'Sábado',
    Sunday: 'Domingo',
};

function labelDia(nome) {
    const n = (nome || '').trim();
    return DIA_PT[n] || n;
}

export default function RotaUnidadeManage() {
    const [loading, setLoading] = useState(true);
    const [rotas, setRotas] = useState([]);
    const [units, setUnits] = useState([]);
    /** unidade_id -> Set(rota_id) */
    const [selections, setSelections] = useState({});
    const [savingId, setSavingId] = useState(null);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const load = useCallback(async () => {
        setLoading(true);
        setError('');
        try {
            const { data } = await getRotaUnidadeConfig();
            setRotas(data.rotas || []);
            setUnits(data.units || []);
            const next = {};
            (data.units || []).forEach((u) => {
                next[u.id] = new Set((u.rota_ids || []).map(Number));
            });
            setSelections(next);
        } catch (e) {
            setError(e.response?.data?.error || 'Erro ao carregar configuração.');
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        load();
    }, [load]);

    const toggleRota = (unidadeId, rotaId) => {
        setSelections((prev) => {
            const cur = new Set(prev[unidadeId] || []);
            if (cur.has(rotaId)) {
                cur.delete(rotaId);
            } else {
                cur.add(rotaId);
            }
            return { ...prev, [unidadeId]: cur };
        });
    };

    const marcarTodos = (unidadeId) => {
        setSelections((prev) => ({
            ...prev,
            [unidadeId]: new Set(rotas.map((r) => r.id)),
        }));
    };

    const limpar = (unidadeId) => {
        setSelections((prev) => ({
            ...prev,
            [unidadeId]: new Set(),
        }));
    };

    const salvarUnidade = async (unidadeId) => {
        setSavingId(unidadeId);
        setError('');
        setSuccess('');
        try {
            const ids = Array.from(selections[unidadeId] || []);
            await syncRotaUnidade(unidadeId, ids);
            setSuccess('Configuração salva.');
            setTimeout(() => setSuccess(''), 2500);
        } catch (e) {
            setError(e.response?.data?.error || e.message || 'Erro ao salvar.');
        } finally {
            setSavingId(null);
        }
    };

    if (loading) {
        return <Loading />;
    }

    return (
        <MainCard title="Dias para criação de chamados (por unidade)">
            <Typography variant="body2" color="textSecondary" sx={{ mb: 2, maxWidth: 900 }}>
                Marque em quais dias da semana a unidade pode abrir chamados (proativas fora do modo emergencial). É
                possível selecionar vários dias. Os nomes internos seguem o padrão em inglês (Monday, Tuesday…), como
                usado pelo sistema na validação de rota.
            </Typography>

            {error ? (
                <Snackbar open={Boolean(error)} autoHideDuration={6000} onClose={() => setError('')}>
                    <Alert severity="error" onClose={() => setError('')} sx={{ width: '100%' }}>
                        {error}
                    </Alert>
                </Snackbar>
            ) : null}
            {success ? (
                <Snackbar open={Boolean(success)} autoHideDuration={3000} onClose={() => setSuccess('')}>
                    <Alert severity="success" onClose={() => setSuccess('')} sx={{ width: '100%' }}>
                        {success}
                    </Alert>
                </Snackbar>
            ) : null}

            {rotas.length === 0 ? (
                <Alert severity="warning">
                    Nenhum registro de rota (dias) cadastrado para o negócio da sua regional. Cadastre registros na tabela{' '}
                    <strong>rota</strong> (campo nome = Monday, Tuesday, etc.) vinculados ao negócio.
                </Alert>
            ) : (
                <TableContainer component={Paper} sx={{ maxHeight: '70vh' }}>
                    <Table size="small" stickyHeader>
                        <TableHead>
                            <TableRow>
                                <TableCell
                                    sx={{
                                        minWidth: 200,
                                        left: 0,
                                        zIndex: 3,
                                        backgroundColor: '#015641',
                                        color: '#fff',
                                        fontWeight: 600,
                                    }}
                                >
                                    Unidade
                                </TableCell>
                                {rotas.map((r) => (
                                    <TableCell
                                        key={r.id}
                                        align="center"
                                        sx={{ minWidth: 100, backgroundColor: '#015641', color: '#fff', fontWeight: 600 }}
                                    >
                                        {labelDia(r.nome)}
                                    </TableCell>
                                ))}
                                <TableCell align="right" sx={{ minWidth: 220, backgroundColor: '#015641', color: '#fff' }}>
                                    Ações
                                </TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {units.map((u) => (
                                <TableRow key={u.id} hover>
                                    <TableCell
                                        sx={{
                                            position: 'sticky',
                                            left: 0,
                                            zIndex: 1,
                                            backgroundColor: 'background.paper',
                                            fontWeight: 500,
                                        }}
                                    >
                                        {u.nome}
                                    </TableCell>
                                    {rotas.map((r) => (
                                        <TableCell key={r.id} align="center">
                                            <Checkbox
                                                checked={(selections[u.id] || new Set()).has(r.id)}
                                                onChange={() => toggleRota(u.id, r.id)}
                                                size="small"
                                            />
                                        </TableCell>
                                    ))}
                                    <TableCell align="right">
                                        <Box sx={{ display: 'flex', gap: 0.5, justifyContent: 'flex-end', flexWrap: 'wrap' }}>
                                            <Button size="small" onClick={() => marcarTodos(u.id)}>
                                                Todos
                                            </Button>
                                            <Button size="small" onClick={() => limpar(u.id)}>
                                                Limpar
                                            </Button>
                                            <AnimateButton>
                                                <Button
                                                    variant="contained"
                                                    size="small"
                                                    disabled={savingId === u.id}
                                                    onClick={() => salvarUnidade(u.id)}
                                                >
                                                    {savingId === u.id ? 'Salvando…' : 'Salvar'}
                                                </Button>
                                            </AnimateButton>
                                        </Box>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            )}
        </MainCard>
    );
}
