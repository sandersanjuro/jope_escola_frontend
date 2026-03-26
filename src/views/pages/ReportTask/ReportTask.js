// material-ui
import React from 'react';
import { Button, Grid, MenuItem, Snackbar, TextField } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import MainCard from 'ui-component/cards/MainCard';
import Alert from '@mui/material/Alert';
import AnimateButton from 'ui-component/extended/AnimateButton';
import LinearProgress from '@mui/material/LinearProgress';
import axios from 'axios';
import { appblob } from 'services/ApiBlob';

// ==============================|| Index ||============================== //
const ReportTask = () => {
    const path = window.location.pathname;
    const dispatch = useDispatch();
    const [success, setSuccess] = React.useState('');
    const [error, setError] = React.useState('');
    const [loading, setLoading] = React.useState(false);
    const [downloadProgress, setDownloadProgress] = React.useState(0);

    const initialDate = useSelector((state) => state.report_task.initialDate);
    const finalDate = useSelector((state) => state.report_task.finalDate);
    const moduleOs = useSelector((state) => state.report_task.moduleOs);

    const optionsModule = [
        { id: 1, label: 'Corretiva' },
        { id: 2, label: 'Preventiva' }
    ];

    const download = async () => {
        try {
            if (!initialDate && !finalDate) {
                setError('Preencha uma das datas.');
                setTimeout(() => setError(''), 3000);
                return;
            }

            setLoading(true);
            setDownloadProgress(0);

            const response = await appblob.get(
                `task_export?initialDate=${initialDate}&finalDate=${finalDate}&moduleOs=${moduleOs}`,
                {
                    onDownloadProgress: (progressEvent) => {
                        const total = progressEvent.total;
                        if (total) {
                            const percentCompleted = Math.round((progressEvent.loaded * 100) / total);
                            setDownloadProgress(percentCompleted);
                        }
                    }
                }
            );

            const blob = new Blob([response.data], { type: 'application/vnd.ms-excel' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'file.xlsx';
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);

            setSuccess('Logs gerados com sucesso.');
            setTimeout(() => setSuccess(''), 2000);
        } catch (err) {
            console.error(err);
            setError('Erro ao gerar relatório.');
            setTimeout(() => setError(''), 3000);
        } finally {
            setLoading(false);
            setDownloadProgress(0);
        }
    };


    return (
        <>
            <MainCard sx={{ height: '100%' }} xs={12} md={12} sm={12} container>
                <Grid sx={{ mb: 10 }} xs={12} md={12} sm={12} container>
                    <h1
                        style={{
                            font: 'normal normal bold 35px/44px Myriad Pro',
                            letterSpacing: '0px',
                            color: 'black',
                            opacity: 1,
                            padding: 15,
                            marginLeft: '2%'
                        }}
                    >
                        Exportação de Chamados
                    </h1>
                    <hr style={{ width: '95%', marginTop: 0 }} />
                </Grid>

                {error || success ? (
                    <Snackbar open={true} autoHideDuration={6000}>
                        <Alert
                            severity={error ? 'error' : success ? 'success' : ''}
                            sx={{
                                width: '100%',
                                backgroundColor: error ? 'red' : 'green',
                                color: '#FFF'
                            }}
                        >
                            {error || success}
                        </Alert>
                    </Snackbar>
                ) : null}

                {loading && (
                    <Grid item xs={12} sx={{ mb: 2, px: 2 }}>
                        <LinearProgress />
                    </Grid>
                )}

                <Grid container spacing={2} alignItems="center" justifyContent="center">
                    <Grid item xs={12} sm={2} sx={{ marginTop: 3 }}>
                        <TextField
                            fullWidth
                            id="outlined-initialDate"
                            type="date"
                            label="De"
                            value={initialDate}
                            onChange={(e) => dispatch({ type: 'SET_INITIALDATE_REPORT_TASK_FILTER', payload: e.target.value })}
                            name="initialDate"
                            InputLabelProps={{ shrink: true }}
                        />
                    </Grid>

                    <Grid item xs={12} sm={2} sx={{ marginTop: 3 }}>
                        <TextField
                            fullWidth
                            id="outlined-finalDate"
                            type="date"
                            label="Até"
                            value={finalDate}
                            onChange={(e) => dispatch({ type: 'SET_FINALDATE_REPORT_TASK_FILTER', payload: e.target.value })}
                            name="finalDate"
                            InputLabelProps={{ shrink: true }}
                        />
                    </Grid>

                    <Grid item xs={12} sm={2} sx={{ marginTop: 3 }}>
                        <TextField
                            fullWidth
                            select
                            label="Tipo"
                            id="moduleOS"
                            type="text"
                            value={moduleOs}
                            name="moduleOS"
                            onChange={(e) => dispatch({ type: 'SET_MODULEOS_REPORT_TASK_FILTER', payload: e.target.value })}
                        >
                            {optionsModule.map((option) => (
                                <MenuItem key={option.id} value={option.id}>
                                    {option.label}
                                </MenuItem>
                            ))}
                        </TextField>
                    </Grid>

                    <Grid item xs={6} sm={1} sx={{ mt: 4 }}>
                        <AnimateButton>
                            <Button variant="contained" color="primary" onClick={download} disabled={loading}>
                                Baixar
                            </Button>
                        </AnimateButton>
                    </Grid>

                    <Grid item xs={6} sm={1} sx={{ mt: 4, ml: -5 }}>
                        <AnimateButton>
                            <Button
                                variant="contained"
                                color="error"
                                onClick={() => dispatch({ type: 'SET_CLEAR_REPORT_TASK_FILTER' })}
                                disabled={loading}
                            >
                                Limpar
                            </Button>
                        </AnimateButton>
                    </Grid>
                </Grid>
            </MainCard>
        </>
    );
};

export default ReportTask;
