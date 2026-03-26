import React from 'react';
import Button from '@mui/material/Button';
import AnimateButton from 'ui-component/extended/AnimateButton';
import TextField from '@mui/material/TextField';
import { Grid, Box, MenuItem, Autocomplete } from '@mui/material';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useDispatch, useSelector } from 'react-redux';
import grey from '@material-ui/core/colors/grey';

export default function ReportTask({ options, getAllTasks }) {
    const dispatch = useDispatch();
    const idUnit = useSelector((state) => state.task.idUnit);
    const idTypeOs = useSelector((state) => state.task.idTypeOs);
    const initialDate = useSelector((state) => state.task.initialDate);
    const finalDate = useSelector((state) => state.task.finalDate);
    return (
        <>
            <Grid container spacing={2}>
                {/* <Grid item xs={12} sm={6} sx={{ marginTop: 3 }}>
                    <Autocomplete
                        fullWidth
                        select
                        label="Unidade"
                        id="unit"
                        type="text"
                        value={idUnit || ''}
                        name="unit"
                        onChange={(e, newValue) => dispatch({ type: 'SET_IDUNITTASK_FILTER', payload: newValue == null ? '' : newValue })}
                        options={options.unit}
                        renderInput={(params) => <TextField {...params} label="Unidade" />}
                    />
                </Grid> */}
                <Grid item xs={12} sm={4} sx={{ marginTop: 3 }}>
                    <Autocomplete
                        fullWidth
                        select
                        label="Tipo de OS"
                        id="type_os"
                        type="text"
                        value={idTypeOs || ''}
                        name="type_os"
                        onChange={(e, newValue) => dispatch({ type: 'SET_IDTYPEOSTASK_FILTER', payload: newValue == null ? '' : newValue })}
                        options={options.typeOfOs}
                        renderInput={(params) => <TextField {...params} label="Tipo de OS" />}
                    />
                </Grid>
                <Grid item xs={12} sm={4} sx={{ marginTop: 3 }}>
                    <TextField
                        fullWidth
                        id="outlined-initialDate"
                        type="date"
                        label="Data Início Criação"
                        value={initialDate}
                        onChange={(e) => dispatch({ type: 'SET_INITIALDATE_TASK_FILTER', payload: e.target.value })}
                        name="initialDate"
                    />
                </Grid>
                <Grid item xs={12} sm={4} sx={{ marginTop: 3 }}>
                    <TextField
                        fullWidth
                        id="outlined-finalDate"
                        type="date"
                        label="Data Fim Criação"
                        value={finalDate}
                        onChange={(e) => dispatch({ type: 'SET_FINALDATE_TASK_FILTER', payload: e.target.value })}
                        name="finalDate"
                    />
                </Grid>
            </Grid>
            <Grid container alignItems="right" justifyContent="right" sx={{ mt: 3, mb: 3 }}>
                <Grid item>
                    <Box sx={{ mt: 2, mr: 3 }}>
                        <AnimateButton>
                            <Button
                                disable
                                Elevation
                                fullWidth
                                size="large"
                                yype="submit"
                                variant="contained"
                                style={{ backgroundColor: '#808080' }}
                                onClick={(e) => dispatch({ type: 'SET_CLEAR_TASK_FILTER' })}
                            >
                                Limpar Busca
                            </Button>
                        </AnimateButton>
                    </Box>
                </Grid>
                <Grid item>
                    <Box sx={{ mt: 2, mr: 3 }}>
                        <AnimateButton>
                            <Button
                                disableElevation
                                fullWidth
                                size="large"
                                type="button"
                                variant="contained"
                                color="primary"
                                onClick={(e) => getAllTasks()}
                            >
                                Buscar
                            </Button>
                        </AnimateButton>
                    </Box>
                </Grid>
            </Grid>
            <hr></hr>
        </>
    );
}
