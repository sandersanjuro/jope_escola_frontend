// material-ui
import React from 'react';
import { Autocomplete, Button, Card, Grid, Snackbar, SpeedDial, SpeedDialAction, TextField, Typography } from '@mui/material';
import RecipeReviewCard from 'components/RecipeViewCard/RecipeViewCard';
import { useDispatch, useSelector } from 'react-redux';
import { cancelTask, getResourceTask, getTasks } from 'services/task';
import Pagination from '@mui/material/Pagination';
import Stack from '@mui/material/Stack';
import PersonAdd from '@mui/icons-material/PersonAdd';
import { Link, useNavigate } from 'react-router-dom';
import SpeedDialIcon from '@mui/material/SpeedDialIcon';
import { useTheme, makeStyles } from '@mui/material/styles';
import MainCard from 'ui-component/cards/MainCard';
import { BrowserView, MobileView } from 'react-device-detect';
import AddButton from 'components/Buttons/AddButton';
import Alert from '@mui/material/Alert';
import BasicModal from '../../../components/Modal/BasicModal';
import AnimateButton from 'ui-component/extended/AnimateButton';
import { getExport } from 'services/logs';

// ==============================|| Index ||============================== //
const Logs = () => {
    const path = window.location.pathname;
    const dispatch = useDispatch();
    const [success, setSuccess] = React.useState('');
    const initialDate = useSelector((state) => state.logs.initialDate);
    const finalDate = useSelector((state) => state.logs.finalDate);
    const [error, setError] = React.useState('');
    const withLink = (to, children) => <Link to={to}>{children}</Link>;
    function formatDate() {
        let data = new Date();
        let dia = String(data.getDate()).padStart(2, '0');
        let mes = String(data.getMonth() + 1).padStart(2, '0');
        let ano = data.getFullYear();
        let horas = String(data.getHours()).padStart(2, '0');
        let minutos = String(data.getMinutes()).padStart(2, '0');
        let dataAtual = `${dia}${mes}${ano}${horas}${minutos}`;
        return dataAtual;
    }
    const download = () => {
        try {
            if (!initialDate && !finalDate) {
                return [
                    setError('Preencha uma das datas.'),
                    setTimeout(() => {
                        setError('');
                    }, 3000)
                ];
            }
            getExport(initialDate, finalDate).then((resp) => {
                var a = document.createElement('a');
                a.href = 'data:attachment/csv;charset=utf-8,' + encodeURI(resp.data);
                a.target = '_blank';
                a.download = 'inova' + formatDate() + '.csv';
                // a.download = 'filename.csv';
                document.body.appendChild(a);
                a.click();
                setSuccess('Logs gerados com sucesso.');
                setTimeout(() => {
                    setSuccess('');
                }, 2000);
            });
        } catch (err) {
            console.log(err);
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
                            color: 'var(--unnamed-color-015641)',
                            color: 'black',
                            opacity: 1,
                            padding: 15,
                            marginLeft: '2%'
                        }}
                    >
                        LOGS
                    </h1>
                    <hr style={{ width: '95%', marginTop: 0 }}></hr>
                </Grid>
                {error || success ? (
                    <Snackbar open={true} autoHideDuration={6000}>
                        <Alert
                            severity={error ? 'error' : success ? 'success' : ''}
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
                <Grid container spacing={2} alignItems="center" justifyContent="center">
                    <Grid item xs={12} sm={2} sx={{ marginTop: 3 }}>
                        <TextField
                            fullWidth
                            id="outlined-initialDate"
                            type="date"
                            label="De"
                            value={initialDate}
                            onChange={(e) => dispatch({ type: 'SET_INITIALDATE_LOGS_FILTER', payload: e.target.value })}
                            name="initialDate"
                            InputLabelProps={{
                                shrink: true
                            }}
                        />
                    </Grid>
                    <Grid item xs={12} sm={2} sx={{ marginTop: 3 }}>
                        <TextField
                            fullWidth
                            id="outlined-finalDate"
                            type="date"
                            label="Até"
                            value={finalDate}
                            onChange={(e) => dispatch({ type: 'SET_FINALDATE_LOGS_FILTER', payload: e.target.value })}
                            name="finalDate"
                            InputLabelProps={{
                                shrink: true
                            }}
                        />
                    </Grid>
                    <Grid item xs={6} sm={1} sx={{ mt: 4 }}>
                        <AnimateButton>
                            <Button variant="contained" color="primary" onClick={download}>
                                Baixar
                            </Button>
                        </AnimateButton>
                    </Grid>
                    {/* <Grid item xs={6} sm={1} sx={{ mt: 4, ml: -4 }}>
                        <AnimateButton>
                            <Button variant="contained" color="error">
                                Limpar
                            </Button>
                        </AnimateButton>
                    </Grid> */}
                </Grid>
            </MainCard>
        </>
    );
};

export default Logs;
