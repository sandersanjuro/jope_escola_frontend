import React, { useEffect, useState } from 'react';
import {
    Grid,
    TextField,
    Button,
    MenuItem,
    FormControl,
    InputLabel,
    Select,
    OutlinedInput,
    Checkbox,
    ListItemText,
    Alert,
    Snackbar,
    Box,
    Typography,
} from '@mui/material';
import MainCard from 'ui-component/cards/MainCard';
import AnimateButton from 'ui-component/extended/AnimateButton';
import Loading from 'components/Loading/Loading';
import { getUnit } from 'services/unit';
import { getResourceMaintenancePlan, exportMaintenancePlanReport } from 'services/maintenancePlan';
import DownloadIcon from '@mui/icons-material/Download';

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
    PaperProps: {
        style: {
            maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
            width: 280,
        },
    },
};

const MaintenancePlanReport = () => {
    const [loading, setLoading] = useState(false);
    const [loadingOptions, setLoadingOptions] = useState(true);
    const [success, setSuccess] = useState('');
    const [error, setError] = useState('');

    const [units, setUnits] = useState([]);
    const [frequencyOptions, setFrequencyOptions] = useState([]);
    const [equipeOptions, setEquipeOptions] = useState([]);

    const [idUnit, setIdUnit] = useState('');
    const [initialDate, setInitialDate] = useState('');
    const [finalDate, setFinalDate] = useState('');
    const [dateBasis, setDateBasis] = useState('proxima');
    const [datePerspective, setDatePerspective] = useState('');
    const [tipoFrequenciaId, setTipoFrequenciaId] = useState([]);
    const [equipeId, setEquipeId] = useState('');
    const [descricao, setDescricao] = useState('');
    const [tecnicoKeyword, setTecnicoKeyword] = useState('');

    useEffect(() => {
        const load = async () => {
            try {
                setLoadingOptions(true);
                const [unitsRes, resPlan] = await Promise.all([getUnit(), getResourceMaintenancePlan('')]);
                setUnits(Array.isArray(unitsRes.data) ? unitsRes.data : []);
                setFrequencyOptions(resPlan.data?.frequency || []);
                setEquipeOptions(resPlan.data?.equipe || []);
            } catch (e) {
                setError('Não foi possível carregar filtros do relatório.');
            } finally {
                setLoadingOptions(false);
            }
        };
        load();
    }, []);

    const handleFrequencyChange = (event) => {
        const v = event.target.value;
        const arr = typeof v === 'string' ? v.split(',') : v;
        setTipoFrequenciaId(arr.map((x) => parseInt(x, 10)).filter((n) => !Number.isNaN(n) && n > 0));
    };

    const handleExport = async () => {
        setError('');
        setSuccess('');
        setLoading(true);
        try {
            const payload = {
                idUnit: idUnit || '',
                initialDate: initialDate || '',
                finalDate: finalDate || '',
                dateBasis,
                datePerspective: initialDate || finalDate ? '' : datePerspective,
                tipoFrequenciaId: tipoFrequenciaId.length ? tipoFrequenciaId : '',
                equipeId: equipeId || '',
                descricao: descricao.trim(),
                tecnicoKeyword: tecnicoKeyword.trim(),
            };

            const response = await exportMaintenancePlanReport(payload);
            const ctype = (response.headers['content-type'] || '').toLowerCase();
            if (ctype.includes('application/json')) {
                const text = await response.data.text();
                let msg = 'Erro ao gerar relatório.';
                try {
                    const j = JSON.parse(text);
                    msg = j.error || j.message || msg;
                } catch (ignore) {
                    /* mantém msg padrão */
                }
                setError(msg);
                return;
            }

            const blob = new Blob([response.data], {
                type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
            });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'relatorio_plano_manutencao_preventiva.xlsx';
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
            setSuccess('Relatório gerado com sucesso.');
            setTimeout(() => setSuccess(''), 3000);
        } catch (e) {
            setError(e.response?.data?.error || e.message || 'Erro ao gerar relatório.');
        } finally {
            setLoading(false);
        }
    };

    if (loadingOptions) {
        return <Loading />;
    }

    return (
        <MainCard title="Relatório — plano de manutenção preventiva">
            <Typography variant="body2" color="textSecondary" sx={{ mb: 2, maxWidth: 960 }}>
                Exportação em Excel com duas abas: <strong>Planos cadastrados</strong> (unidade, ativo, periodicidade,
                quantidade, datas do plano, tipo de OS planejado, equipe planejada, descrição e se o plano está ativo) e{' '}
                <strong>OS preventivas (histórico)</strong> — chamados preventivos vinculados ao plano, data de
                abertura da OS, descrições, status e técnicos escalados. O intervalo de datas da tela aplica-se à
                referência escolhida na primeira aba; na segunda aba, o mesmo intervalo filtra a{' '}
                <strong>data de abertura da OS</strong>. Sem datas, use a visão rápida (passadas / hoje / futuras) só
                para os campos do plano. Dados limitados à regional do usuário.
            </Typography>

            {error ? (
                <Snackbar open={Boolean(error)} autoHideDuration={6000} onClose={() => setError('')}>
                    <Alert severity="error" onClose={() => setError('')} sx={{ width: '100%' }}>
                        {error}
                    </Alert>
                </Snackbar>
            ) : null}
            {success ? (
                <Snackbar open={Boolean(success)} autoHideDuration={4000} onClose={() => setSuccess('')}>
                    <Alert severity="success" onClose={() => setSuccess('')} sx={{ width: '100%' }}>
                        {success}
                    </Alert>
                </Snackbar>
            ) : null}

            <Grid container spacing={2}>
                <Grid item xs={12} md={4}>
                    <FormControl fullWidth>
                        <InputLabel id="unit-label">Unidade</InputLabel>
                        <Select
                            labelId="unit-label"
                            label="Unidade"
                            value={idUnit}
                            onChange={(e) => setIdUnit(e.target.value)}
                        >
                            <MenuItem value="">
                                <em>Todas (regional)</em>
                            </MenuItem>
                            {units.map((u) => (
                                <MenuItem key={u.id} value={String(u.id)}>
                                    {u.nome}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </Grid>
                <Grid item xs={12} md={4}>
                    <TextField
                        fullWidth
                        type="date"
                        label="Data início (intervalo)"
                        InputLabelProps={{ shrink: true }}
                        value={initialDate}
                        onChange={(e) => setInitialDate(e.target.value)}
                    />
                </Grid>
                <Grid item xs={12} md={4}>
                    <TextField
                        fullWidth
                        type="date"
                        label="Data fim (intervalo)"
                        InputLabelProps={{ shrink: true }}
                        value={finalDate}
                        onChange={(e) => setFinalDate(e.target.value)}
                    />
                </Grid>

                <Grid item xs={12} md={4}>
                    <FormControl fullWidth>
                        <InputLabel id="basis-label">Datas do plano — referência</InputLabel>
                        <Select
                            labelId="basis-label"
                            label="Datas do plano — referência"
                            value={dateBasis}
                            onChange={(e) => setDateBasis(e.target.value)}
                        >
                            <MenuItem value="proxima">Próxima manutenção</MenuItem>
                            <MenuItem value="inicio">Início do plano</MenuItem>
                            <MenuItem value="ultprocessamento">Último processamento</MenuItem>
                        </Select>
                    </FormControl>
                </Grid>
                <Grid item xs={12} md={4}>
                    <FormControl fullWidth disabled={Boolean(initialDate || finalDate)}>
                        <InputLabel id="persp-label">Visão rápida (sem intervalo)</InputLabel>
                        <Select
                            labelId="persp-label"
                            label="Visão rápida (sem intervalo)"
                            value={datePerspective}
                            onChange={(e) => setDatePerspective(e.target.value)}
                        >
                            <MenuItem value="">
                                <em>Todas as datas</em>
                            </MenuItem>
                            <MenuItem value="past">Passadas (antes de hoje)</MenuItem>
                            <MenuItem value="today">Hoje</MenuItem>
                            <MenuItem value="future">Futuras (após hoje)</MenuItem>
                        </Select>
                    </FormControl>
                </Grid>
                <Grid item xs={12} md={4}>
                    <FormControl fullWidth>
                        <InputLabel id="freq-label">Periodicidade</InputLabel>
                        <Select
                            labelId="freq-label"
                            multiple
                            value={tipoFrequenciaId}
                            onChange={handleFrequencyChange}
                            input={<OutlinedInput label="Periodicidade" />}
                            renderValue={(selected) =>
                                frequencyOptions
                                    .filter((f) => selected.some((s) => Number(s) === Number(f.id)))
                                    .map((f) => f.label)
                                    .join(', ')
                            }
                            MenuProps={MenuProps}
                        >
                            {frequencyOptions.map((f) => (
                                <MenuItem key={f.id} value={f.id}>
                                    <Checkbox checked={tipoFrequenciaId.some((s) => Number(s) === Number(f.id))} />
                                    <ListItemText primary={f.label} />
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </Grid>

                <Grid item xs={12} md={4}>
                    <FormControl fullWidth>
                        <InputLabel id="equipe-label">Equipe planejada</InputLabel>
                        <Select
                            labelId="equipe-label"
                            label="Equipe planejada"
                            value={equipeId}
                            onChange={(e) => setEquipeId(e.target.value)}
                        >
                            <MenuItem value="">
                                <em>Todas</em>
                            </MenuItem>
                            {equipeOptions.map((eq) => (
                                <MenuItem key={eq.id} value={String(eq.id)}>
                                    {eq.label}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </Grid>
                <Grid item xs={12} md={8}>
                    <TextField
                        fullWidth
                        label="Descrição das atividades (contém)"
                        value={descricao}
                        onChange={(e) => setDescricao(e.target.value)}
                        placeholder="Filtra texto no plano (aba Planos) e plano/OS (aba Histórico)"
                    />
                </Grid>
                <Grid item xs={12} md={4}>
                    <TextField
                        fullWidth
                        label="Técnico (histórico OS)"
                        value={tecnicoKeyword}
                        onChange={(e) => setTecnicoKeyword(e.target.value)}
                        placeholder="Nome do técnico escalado"
                    />
                </Grid>
            </Grid>

            <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}>
                <AnimateButton>
                    <Button
                        variant="contained"
                        color="primary"
                        size="large"
                        startIcon={<DownloadIcon />}
                        disabled={loading}
                        onClick={handleExport}
                    >
                        {loading ? 'Gerando…' : 'Exportar Excel'}
                    </Button>
                </AnimateButton>
            </Box>
        </MainCard>
    );
};

export default MaintenancePlanReport;
