import { useEffect, useState } from 'react';
import { Formik } from 'formik';
import { GridMainContainer, Divider, StackStyled, ButtonStyled } from './styles';
import TextField from '@mui/material/TextField';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { useDispatch, useSelector } from 'react-redux';
const FilterDatesCount = () => {
    const dispatch = useDispatch();
    const filterDate = useSelector((state) => state.bi.filterDateCount);
    // function cleanFilter() {
    //     dispatch({ type: 'CLEAN_FILTER', payload: null });
    // }

    return (
        <GridMainContainer container>
            <h4>Ano</h4>
            <Divider />
            <Formik
                initialValues={{ initialDate: filterDate, finalDate: '' }}
                onSubmit={(values, { setSubmitting }) => {
                    // Cria um objeto Date a partir da string
                    const originalDate = new Date(values.initialDate);

                    // Obtém o ano, mês e dia da data
                    const year = originalDate.getUTCFullYear();
                    const month = String(originalDate.getUTCMonth() + 1).padStart(2, '0');
                    const day = String(originalDate.getUTCDate()).padStart(2, '0');

                    // Monta a data no formato yyyy-mm-dd
                    const formattedDate = `${year}-${month}-${day}`;
                    console.log(values);
                    // const dayInitialDate = String(values.initialDate.$d).padStart(2, '0');
                    // const monthInitialDate = String(values.initialDate.$M + 1).padStart(2, '0');
                    // const yearInitialDate = values.initialDate.$y;
                    // const initialDateF = `${yearInitialDate}-${monthInitialDate}-${dayInitialDate}`;
                    // dispatch({ type: 'SET_FILTER_DATE_COUNT', payload: initialDateF });
                    dispatch({ type: 'SET_FILTER_DATE_COUNT_FORMAT', payload: formattedDate });
                }}
            >
                {({ values, errors, touched, handleChange, handleBlur, handleSubmit, isSubmitting, setFieldValue }) => (
                    <form onSubmit={handleSubmit}>
                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                            <StackStyled>
                                <DateTimePicker
                                    views={['day', 'month', 'year']}
                                    fullWidth
                                    inputFormat="DD/MM/YYYY"
                                    ampm={false}
                                    error={Boolean(touched.initialDate && errors.initialDate)}
                                    label="De"
                                    id="initialDate"
                                    type="date"
                                    value={values.initialDate}
                                    name="initialDate"
                                    onBlur={handleBlur}
                                    onChange={(e) => setFieldValue('initialDate', e)}
                                    helperText={touched.initialDate && errors.initialDate ? errors.initialDate : ''}
                                    renderInput={(params) => <TextField {...params} />}
                                />
                            </StackStyled>
                        </LocalizationProvider>
                        <StackStyled>
                            <ButtonStyled variant="contained" type="submit">
                                Pesquisar
                            </ButtonStyled>
                            {/* <ButtonStyled variant="contained" onClick={cleanFilter()}>
                                Limpar
                            </ButtonStyled> */}
                        </StackStyled>
                    </form>
                )}
            </Formik>
        </GridMainContainer>
    );
};

export default FilterDatesCount;
