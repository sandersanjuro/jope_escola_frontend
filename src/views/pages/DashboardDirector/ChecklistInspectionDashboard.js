import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
    Box,
    Typography,
    Card,
    Select,
    MenuItem,
    FormControl,
    InputLabel,
    Button,
    IconButton,
    CircularProgress,
    Alert
} from '@mui/material';
import DarkModeOutlinedIcon from '@mui/icons-material/DarkModeOutlined';
import LightModeOutlinedIcon from '@mui/icons-material/LightModeOutlined';
import Chart from 'react-apexcharts';
import dashboardService from 'services/dashboardService';

const nf = new Intl.NumberFormat('pt-BR');
const nfPct = new Intl.NumberFormat('pt-BR', { minimumFractionDigits: 1, maximumFractionDigits: 1 });

/** Quantidade de unidades exibidas no gráfico (escolhidas aleatoriamente). */
const CHART_UNITS_SAMPLE = 13;

/** Embaralha uma cópia da lista e retorna até `n` itens (ou todos se houver menos que `n`). */
function pickRandomUnits(list, n) {
    if (!list?.length) return [];
    const copy = [...list];
    for (let i = copy.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [copy[i], copy[j]] = [copy[j], copy[i]];
    }
    return copy.length <= n ? copy : copy.slice(0, n);
}

function tokens(mode) {
    const light = {
        bg: '#f7f6f2',
        surface: '#ffffff',
        surface2: '#f9f8f5',
        border: 'rgba(40, 37, 29, 0.12)',
        divider: 'rgba(40, 37, 29, 0.08)',
        text: '#28251d',
        textMuted: '#7a7974',
        textFaint: '#bab9b4',
        primary: '#01696f',
        primaryHover: '#0c4e54',
        success: '#437a22',
        warning: '#da7101',
        warningBg: '#fdf0e0',
        error: '#c0392b',
        errorBg: '#fce8e6',
        chartInsp: '#01696f',
        chartNao: '#e05c2a',
        chartProb: '#c0392b',
        shadow: '0 1px 3px rgba(40,37,29,0.07)'
    };
    const dark = {
        bg: '#141312',
        surface: '#1c1b19',
        surface2: '#232220',
        border: 'rgba(220,215,205,0.1)',
        divider: 'rgba(220,215,205,0.06)',
        text: '#e0ddd8',
        textMuted: '#8a8883',
        textFaint: '#4f4e4c',
        primary: '#4f98a3',
        primaryHover: '#5fb0bc',
        success: '#6daa45',
        warning: '#fdab43',
        warningBg: '#3a2a10',
        error: '#e05c5c',
        errorBg: '#3a1414',
        chartInsp: '#4f98a3',
        chartNao: '#fdab43',
        chartProb: '#e05c5c',
        shadow: '0 1px 3px rgba(0,0,0,0.2)'
    };
    return mode === 'dark' ? dark : light;
}

function ProgressArc({ pct }) {
    const r = 28;
    const c = 2 * Math.PI * r;
    const p = Math.min(100, Math.max(0, pct)) / 100;
    const dashOffset = c * (1 - p);
    return (
        <svg width={72} height={72} viewBox="0 0 72 72" aria-hidden>
            <circle cx="36" cy="36" r={r} fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="6" />
            <circle
                cx="36"
                cy="36"
                r={r}
                fill="none"
                stroke="white"
                strokeWidth="6"
                strokeDasharray={c}
                strokeDashoffset={dashOffset}
                strokeLinecap="round"
                transform="rotate(-90 36 36)"
            />
            <text
                x="36"
                y="40"
                textAnchor="middle"
                fill="white"
                fontSize="13"
                fontWeight="700"
                fontFamily="'Plus Jakarta Sans', sans-serif"
            >
                {nfPct.format(pct)}%
            </text>
        </svg>
    );
}

const ChecklistInspectionDashboard = () => {
    const [mode, setMode] = useState('light');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [payload, setPayload] = useState(null);
    const [chartHorizontal, setChartHorizontal] = useState(false);
    const [selectedUnitId, setSelectedUnitId] = useState('');
    const [updatedLabel, setUpdatedLabel] = useState('');
    /** Incrementado ao sortear de novo; também altera a key do gráfico. */
    const [chartSampleNonce, setChartSampleNonce] = useState(0);

    const t = tokens(mode);

    const load = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);
            const res = await dashboardService.getChecklistBiDashboard();
            if (res && res.success && res.data) {
                setPayload(res.data);
                const now = new Date();
                setUpdatedLabel(
                    `Atualizado em: ${now.toLocaleDateString('pt-BR')} ${now.toLocaleTimeString('pt-BR', {
                        hour: '2-digit',
                        minute: '2-digit'
                    })}`
                );
            } else {
                throw new Error(res?.message || 'Resposta inválida da API');
            }
        } catch (e) {
            setError(e.message || 'Erro ao carregar dados');
            setPayload(null);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        load();
    }, [load]);

    const units = payload?.units || [];
    const kpis = payload?.kpis;

    const chartUnits = useMemo(
        () => pickRandomUnits(units, CHART_UNITS_SAMPLE),
        [units, chartSampleNonce]
    );

    const selectedUnit = useMemo(() => {
        if (!selectedUnitId) return null;
        return units.find((u) => String(u.id) === String(selectedUnitId)) || null;
    }, [units, selectedUnitId]);

    const chartOptions = useMemo(() => {
        const categories = chartUnits.map((u) => (u.name && u.name.length > 20 ? `${u.name.substring(0, 18)}…` : u.name || ''));
        return {
            chart: {
                type: 'bar',
                fontFamily: 'Inter, sans-serif',
                toolbar: { show: false },
                background: 'transparent',
                events: {
                    dataPointSelection: (event, chartContext, config) => {
                        const idx = config.dataPointIndex;
                        const u = chartUnits[idx];
                        if (u) setSelectedUnitId(String(u.id));
                    }
                }
            },
            plotOptions: {
                bar: {
                    horizontal: chartHorizontal,
                    borderRadius: 4,
                    columnWidth: chartHorizontal ? '65%' : '55%'
                }
            },
            dataLabels: { enabled: false },
            stroke: { show: true, width: 1, colors: [t.surface, t.surface, t.surface] },
            colors: [t.chartInsp, t.chartNao, t.chartProb],
            xaxis: {
                categories,
                labels: {
                    style: { colors: t.textMuted, fontSize: '11px' },
                    rotate: chartHorizontal ? 0 : -35
                },
                axisBorder: { color: t.divider },
                axisTicks: { color: t.divider }
            },
            yaxis: {
                labels: {
                    style: { colors: t.textMuted, fontSize: '11px' }
                }
            },
            grid: {
                borderColor: t.divider,
                strokeDashArray: 4
            },
            legend: { show: false },
            tooltip: {
                theme: mode === 'dark' ? 'dark' : 'light',
                intersect: false,
                shared: true,
                y: {
                    formatter: (val) => nf.format(val)
                }
            },
            states: {
                hover: { filter: { type: 'darken', value: 0.92 } }
            }
        };
    }, [chartUnits, chartHorizontal, t, mode]);

    const chartSeries = useMemo(
        () => [
            { name: 'Inspecionados', data: chartUnits.map((u) => u.inspecionados) },
            { name: 'Não Inspecionados', data: chartUnits.map((u) => u.naoInspecionados) },
            { name: 'Com Problema', data: chartUnits.map((u) => u.comProblema) }
        ],
        [chartUnits]
    );

    if (loading) {
        return (
            <Card sx={{ p: 3, display: 'flex', justifyContent: 'center', minHeight: 400 }}>
                <CircularProgress />
            </Card>
        );
    }

    if (error) {
        return (
            <Card sx={{ p: 3 }}>
                <Alert severity="error" action={<Button onClick={load}>Tentar novamente</Button>}>
                    {error}
                </Alert>
            </Card>
        );
    }

    const pct = kpis?.percentRealizado ?? 0;

    return (
        <Card
            sx={{
                p: 0,
                overflow: 'hidden',
                bgcolor: t.bg,
                color: t.text,
                border: `1px solid ${t.border}`,
                boxShadow: t.shadow
            }}
        >
            {/* Cabeçalho estilo mock */}
            <Box
                sx={{
                    bgcolor: t.surface,
                    borderBottom: `1px solid ${t.border}`,
                    px: { xs: 2, md: 4 },
                    py: 2,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    flexWrap: 'wrap',
                    gap: 2
                }}
            >
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                    <Box
                        sx={{
                            width: 36,
                            height: 36,
                            borderRadius: 1,
                            bgcolor: t.primary,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: '#fff'
                        }}
                    >
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" aria-hidden>
                            <path d="M9 11l3 3L22 4" />
                            <path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11" />
                        </svg>
                    </Box>
                    <Box>
                        <Typography sx={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 700, fontSize: '1rem' }}>
                            Jope Inova
                        </Typography>
                        <Typography sx={{ fontSize: '0.75rem', color: t.textMuted, display: { xs: 'none', sm: 'block' } }}>
                            Gestão de Inspeções
                        </Typography>
                    </Box>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                    <Typography
                        sx={{
                            fontSize: '0.75rem',
                            color: t.textMuted,
                            bgcolor: t.surface2,
                            border: `1px solid ${t.border}`,
                            borderRadius: '9999px',
                            px: 1.5,
                            py: 0.25,
                            display: { xs: 'none', sm: 'inline' }
                        }}
                    >
                        {updatedLabel}
                    </Typography>
                    <IconButton
                        size="small"
                        onClick={() => setMode((m) => (m === 'dark' ? 'light' : 'dark'))}
                        aria-label="Alternar tema"
                        sx={{
                            border: `1px solid ${t.border}`,
                            bgcolor: t.surface2,
                            color: t.textMuted,
                            borderRadius: 1,
                            '&:hover': { bgcolor: t.surface2, color: t.text }
                        }}
                    >
                        {mode === 'dark' ? <LightModeOutlinedIcon fontSize="small" /> : <DarkModeOutlinedIcon fontSize="small" />}
                    </IconButton>
                </Box>
            </Box>

            <Box sx={{ p: { xs: 2, md: 4 }, display: 'flex', flexDirection: 'column', gap: 3, maxWidth: 1600, mx: 'auto' }}>
                {/* KPIs */}
                <Box
                    sx={{
                        display: 'grid',
                        gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', md: '1fr repeat(4, 1fr)' },
                        gap: 2
                    }}
                >
                    <Box
                        sx={{
                            bgcolor: t.primary,
                            borderRadius: 3,
                            p: 2.5,
                            display: 'flex',
                            alignItems: 'center',
                            gap: 2,
                            boxShadow: t.shadow,
                            gridColumn: { xs: 'span 1', md: 'span 1' }
                        }}
                    >
                        <ProgressArc pct={pct} />
                        <Box>
                            <Typography sx={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 700, fontSize: '1.5rem', color: '#fff' }}>
                                {nfPct.format(pct)}%
                            </Typography>
                            <Typography sx={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.75)', lineHeight: 1.3 }}>
                                Percentual
                                <br />
                                Realizado
                            </Typography>
                        </Box>
                    </Box>

                    <KpiCard label="Unidades" value={kpis?.unidades} sub="Unidades ativas" t={t} />
                    <KpiCard label="Total Ativos" value={kpis?.totalAtivos} sub="Cadastrados" t={t} />
                    <KpiCard label="Sem Inspeção" value={kpis?.semInspecao} sub="Pendentes" t={t} variant="warning" />
                    <KpiCard label="Problemas" value={kpis?.problemas} sub="Identificados" t={t} variant="danger" />
                </Box>

                {/* Grid conteúdo */}
                <Box
                    sx={{
                        display: 'grid',
                        gridTemplateColumns: { xs: '1fr', lg: '1fr 420px' },
                        gap: 3,
                        alignItems: 'start'
                    }}
                >
                    {/* Gráfico */}
                    <Box
                        sx={{
                            bgcolor: t.surface,
                            border: `1px solid ${t.border}`,
                            borderRadius: 3,
                            boxShadow: t.shadow,
                            overflow: 'hidden'
                        }}
                    >
                        <Box
                            sx={{
                                px: 3,
                                pt: 2.5,
                                pb: 2,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'space-between',
                                flexWrap: 'wrap',
                                gap: 2,
                                borderBottom: `1px solid ${t.divider}`
                            }}
                        >
                            <Box sx={{ flex: 1, minWidth: 200 }}>
                                <Typography sx={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 700 }}>Inspeções por Unidade</Typography>
                                {units.length > CHART_UNITS_SAMPLE && (
                                    <Typography sx={{ fontSize: '0.72rem', color: t.textMuted, mt: 0.5 }}>
                                        Gráfico com {CHART_UNITS_SAMPLE} unidades sorteadas aleatoriamente entre {units.length}. O seletor ao lado lista
                                        todas.
                                    </Typography>
                                )}
                            </Box>
                            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.75, alignItems: 'center', justifyContent: 'flex-end' }}>
                                {units.length > CHART_UNITS_SAMPLE && (
                                    <Button
                                        size="small"
                                        variant="outlined"
                                        onClick={() => setChartSampleNonce((n) => n + 1)}
                                        sx={{
                                            textTransform: 'none',
                                            fontSize: '0.72rem',
                                            py: 0.25,
                                            px: 1,
                                            borderColor: t.border,
                                            color: t.textMuted
                                        }}
                                    >
                                        Sortear outras
                                    </Button>
                                )}
                            <Box sx={{ display: 'flex', gap: 0.5 }}>
                                <Button
                                    size="small"
                                    onClick={() => setChartHorizontal(false)}
                                    sx={{
                                        minWidth: 0,
                                        px: 2,
                                        py: 0.5,
                                        fontSize: '0.75rem',
                                        fontWeight: 600,
                                        borderRadius: '8px 8px 0 0',
                                        bgcolor: !chartHorizontal ? t.surface : 'transparent',
                                        color: !chartHorizontal ? t.primary : t.textMuted,
                                        border: !chartHorizontal ? `1px solid ${t.border}` : '1px solid transparent',
                                        borderBottom: !chartHorizontal ? `1px solid ${t.surface}` : 'none',
                                        mb: '-1px',
                                        textTransform: 'none'
                                    }}
                                >
                                    Barras
                                </Button>
                                <Button
                                    size="small"
                                    onClick={() => setChartHorizontal(true)}
                                    sx={{
                                        minWidth: 0,
                                        px: 2,
                                        py: 0.5,
                                        fontSize: '0.75rem',
                                        fontWeight: 600,
                                        borderRadius: '8px 8px 0 0',
                                        bgcolor: chartHorizontal ? t.surface : 'transparent',
                                        color: chartHorizontal ? t.primary : t.textMuted,
                                        border: chartHorizontal ? `1px solid ${t.border}` : '1px solid transparent',
                                        borderBottom: chartHorizontal ? `1px solid ${t.surface}` : 'none',
                                        mb: '-1px',
                                        textTransform: 'none'
                                    }}
                                >
                                    Horizontal
                                </Button>
                            </Box>
                            </Box>
                        </Box>
                        <Box sx={{ p: 2, height: 380 }}>
                            {chartUnits.length > 0 ? (
                                <Chart
                                    key={`${mode}-${chartHorizontal}-${chartSampleNonce}`}
                                    options={chartOptions}
                                    series={chartSeries}
                                    type="bar"
                                    height={340}
                                    width="100%"
                                />
                            ) : (
                                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', color: t.textMuted }}>
                                    Nenhum dado de unidade
                                </Box>
                            )}
                        </Box>
                        <Box sx={{ display: 'flex', gap: 4, px: 3, py: 2, borderTop: `1px solid ${t.divider}`, flexWrap: 'wrap' }}>
                            <LegendDot color={t.chartInsp} label="Inspecionados" muted={t.textMuted} />
                            <LegendDot color={t.chartNao} label="Não Inspecionados" muted={t.textMuted} />
                            <LegendDot color={t.chartProb} label="Com Problema" muted={t.textMuted} />
                        </Box>
                    </Box>

                    {/* Painel unidade */}
                    <Box
                        sx={{
                            bgcolor: t.surface,
                            border: `1px solid ${t.border}`,
                            borderRadius: 3,
                            boxShadow: t.shadow,
                            overflow: 'hidden'
                        }}
                    >
                        <Box sx={{ px: 3, pt: 2.5, pb: 2, borderBottom: `1px solid ${t.divider}` }}>
                            <Typography sx={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 700 }}>Detalhes por Unidade</Typography>
                        </Box>

                        <Box sx={{ px: 3, py: 2, borderBottom: `1px solid ${t.divider}` }}>
                            <FormControl fullWidth size="small">
                                <InputLabel id="unit-select-label">Selecionar Unidade</InputLabel>
                                <Select
                                    labelId="unit-select-label"
                                    label="Selecionar Unidade"
                                    value={selectedUnitId}
                                    onChange={(e) => setSelectedUnitId(e.target.value)}
                                    sx={{
                                        bgcolor: t.surface2,
                                        borderRadius: 1,
                                        '& .MuiOutlinedInput-notchedOutline': { borderColor: t.border }
                                    }}
                                >
                                    <MenuItem value="">
                                        <em>— Selecione uma unidade —</em>
                                    </MenuItem>
                                    {units.map((u) => (
                                        <MenuItem key={u.id} value={String(u.id)}>
                                            {u.name}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </Box>

                        {selectedUnit && (
                            <Box
                                sx={{
                                    display: 'grid',
                                    gridTemplateColumns: '1fr 1fr',
                                    gap: 1.5,
                                    px: 3,
                                    py: 2,
                                    borderBottom: `1px solid ${t.divider}`
                                }}
                            >
                                <UnitStat label="Inspecionados" value={selectedUnit.inspecionados} color={t.success} t={t} />
                                <UnitStat label="Não Inspecionados" value={selectedUnit.naoInspecionados} color={t.warning} t={t} />
                                <UnitStat label="Com Problema" value={selectedUnit.comProblema} color={t.error} t={t} />
                                <UnitStat
                                    label="Total Ativos"
                                    value={selectedUnit.inspecionados + selectedUnit.naoInspecionados}
                                    color={t.text}
                                    t={t}
                                />
                            </Box>
                        )}

                        <Box sx={{ px: 0 }}>
                            <Box sx={{ px: 3, pt: 2, pb: 1 }}>
                                <Typography
                                    sx={{
                                        fontSize: '0.75rem',
                                        fontWeight: 600,
                                        textTransform: 'uppercase',
                                        letterSpacing: '0.05em',
                                        color: t.textMuted
                                    }}
                                >
                                    Ativos Pendentes de Inspeção
                                </Typography>
                            </Box>
                            <Box sx={{ maxHeight: 340, overflowY: 'auto' }}>
                                {!selectedUnit ? (
                                    <EmptyState
                                        t={t}
                                        title="Nenhuma unidade selecionada"
                                        text="Selecione uma unidade acima para ver os ativos pendentes."
                                    />
                                ) : selectedUnit.pendentes.length === 0 ? (
                                    <EmptyState t={t} title="Tudo em dia!" text="Nenhum ativo pendente nesta unidade." icon="check" />
                                ) : (
                                    selectedUnit.pendentes.map((p, i) => (
                                        <Box
                                            key={`${p.ativo}-${i}`}
                                            sx={{
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'space-between',
                                                gap: 1.5,
                                                px: 3,
                                                py: 1.25,
                                                borderBottom: `1px solid ${t.divider}`,
                                                '&:last-child': { borderBottom: 'none' },
                                                '&:hover': { bgcolor: t.surface2 }
                                            }}
                                        >
                                            <Typography sx={{ fontSize: '0.75rem', color: t.text, flex: 1, lineHeight: 1.4 }}>{p.ativo}</Typography>
                                            <Typography
                                                component="span"
                                                sx={{
                                                    fontSize: '0.75rem',
                                                    fontWeight: 600,
                                                    px: 1,
                                                    py: 0.25,
                                                    borderRadius: '9999px',
                                                    flexShrink: 0,
                                                    bgcolor: p.status === 'problema' ? t.errorBg : t.warningBg,
                                                    color: p.status === 'problema' ? t.error : t.warning
                                                }}
                                            >
                                                {p.status === 'problema' ? 'Problema' : 'Pendente'}
                                            </Typography>
                                        </Box>
                                    ))
                                )}
                            </Box>
                        </Box>
                    </Box>
                </Box>
            </Box>
        </Card>
    );
};

function KpiCard({ label, value, sub, t, variant }) {
    const warn = variant === 'warning';
    const danger = variant === 'danger';
    return (
        <Box
            sx={{
                bgcolor: warn ? t.warningBg : danger ? t.errorBg : t.surface,
                border: `1px solid ${warn || danger ? 'transparent' : t.border}`,
                borderRadius: 3,
                p: 2.5,
                display: 'flex',
                flexDirection: 'column',
                gap: 0.5,
                boxShadow: t.shadow
            }}
        >
            <Typography sx={{ fontSize: '0.75rem', color: t.textMuted, fontWeight: 500, letterSpacing: '0.04em', textTransform: 'uppercase' }}>
                {label}
            </Typography>
            <Typography
                sx={{
                    fontFamily: "'Plus Jakarta Sans', sans-serif",
                    fontSize: '1.75rem',
                    fontWeight: 700,
                    fontVariantNumeric: 'tabular-nums',
                    lineHeight: 1,
                    color: warn ? t.warning : danger ? t.error : t.text
                }}
            >
                {value !== undefined && value !== null ? nf.format(value) : '—'}
            </Typography>
            <Typography sx={{ fontSize: '0.75rem', color: t.textMuted, fontVariantNumeric: 'tabular-nums' }}>{sub}</Typography>
        </Box>
    );
}

function UnitStat({ label, value, color, t }) {
    return (
        <Box sx={{ bgcolor: t.surface2, borderRadius: 2, px: 2, py: 1.5 }}>
            <Typography sx={{ fontSize: '0.75rem', color: t.textMuted, mb: 0.25 }}>{label}</Typography>
            <Typography sx={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 700, fontSize: '1.125rem', color, fontVariantNumeric: 'tabular-nums' }}>
                {nf.format(value)}
            </Typography>
        </Box>
    );
}

function LegendDot({ color, label, muted }) {
    return (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
            <Box sx={{ width: 10, height: 10, borderRadius: '3px', bgcolor: color, flexShrink: 0 }} />
            <Typography sx={{ fontSize: '0.75rem', color: muted }}>{label}</Typography>
        </Box>
    );
}

function EmptyState({ t, title, text, icon }) {
    return (
        <Box
            sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                textAlign: 'center',
                py: 8,
                px: 4,
                color: t.textMuted,
                gap: 1.5
            }}
        >
            <Box sx={{ color: t.textFaint }}>
                {icon === 'check' ? (
                    <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden>
                        <path d="M9 11l3 3L22 4" />
                        <path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11" />
                    </svg>
                ) : (
                    <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden>
                        <circle cx="11" cy="11" r="8" />
                        <path d="m21 21-4.35-4.35" />
                        <path d="M11 8v3m0 3h.01" />
                    </svg>
                )}
            </Box>
            <Typography sx={{ color: t.text, fontSize: '0.875rem', fontWeight: 600 }}>{title}</Typography>
            <Typography sx={{ fontSize: '0.75rem', maxWidth: '28ch' }}>{text}</Typography>
        </Box>
    );
}

export default ChecklistInspectionDashboard;
