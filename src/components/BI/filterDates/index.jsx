import { useEffect, useState } from 'react';
import { Formik } from 'formik';
import { GridMainContainer, Divider, StackStyled, ButtonStyled } from './styles';
import TextField from '@mui/material/TextField';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { useDispatch, useSelector } from 'react-redux';
const FilterDates = () => {
    const dispatch = useDispatch();
    const filterDate = useSelector((state) => state.bi.filterDate);
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
                    const monthInitialDate = values.initialDate.$M + 1;
                    const yearInitialDate = values.initialDate.$y;
                    var initialDateF = `${yearInitialDate}`;
                    dispatch({ type: 'SET_FILTER_DATE', payload: initialDateF });
                }}
            >
                {({ values, errors, touched, handleChange, handleBlur, handleSubmit, isSubmitting, setFieldValue }) => (
                    <form onSubmit={handleSubmit}>
                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                            <StackStyled>
                                <DateTimePicker
                                    views={['year']}
                                    fullWidth
                                    inputFormat="YYYY"
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

export default FilterDates;
