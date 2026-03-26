import PropTypes from 'prop-types';
import { useState, useEffect } from 'react';

// material-ui
import { useTheme, styled } from '@mui/material/styles';
import { Box, Select, MenuItem } from '@mui/material';

// third-party
import { shouldForwardProp } from '@mui/system';

// project imports
import { getUnit } from 'services/unit';
import { useDispatch, useSelector } from 'react-redux';

const OutlineInputStyle = styled(Select, { shouldForwardProp })(({ theme }) => ({
    width: 300,
    marginLeft: 16,
    paddingLeft: 16,
    paddingRight: 16,
    '& input': {
        background: 'transparent !important',
        paddingLeft: '4px !important'
    },
    [theme.breakpoints.down('xs')]: {
        width: '100%',
        marginLeft: 4,
        background: '#fff'
    },
    [theme.breakpoints.down('lg')]: {
        width: 250
    },
    [theme.breakpoints.down('md')]: {
        width: '100%',
        marginLeft: 4,
        background: '#fff'
    }
}));

// ==============================|| SEARCH INPUT ||============================== //

const SearchSection = () => {
    const theme = useTheme();
    const [optionsUnit, setOptionsUnit] = useState([]);
    const idUnit = useSelector((state) => state.user.unit || '');
    const id_role = useSelector((state) => state.auth.user.perfil_id);
    const supervisor = useSelector((state) => state.auth.user.supervisor);
    const dispatch = useDispatch();

    useEffect(() => {
        getUnits();
    }, []);

    function getUnits() {
        getUnit().then((resp) =>
            setOptionsUnit(id_role == 1 || id_role == 7 || id_role == 8 || supervisor == 1 ? [{ id: 14725896312, nome: 'TODOS', unidade_modelo: 0 }, ...resp.data] : resp.data)
        );
    }

    function renderOptions() {
        return optionsUnit.map((name) => (
            <MenuItem key={name.id} value={name.id}>
                {name.nome}
            </MenuItem>
        ));
    }

    const handleUnitChange = (e) => {
        const selectedId = e.target.value;
        // acha a unidade correspondente pelo id
        const selectedUnit = optionsUnit.find((u) => u.id === selectedId);

        dispatch({ type: 'SET_LOADING', payload: true });
        // salva o id normalmente
        dispatch({ type: 'SET_UNIT_USER', payload: selectedId });
        // salva o unidade_modelo
        dispatch({
            type: 'SET_UNIT_MODELO_USER',
            payload: selectedUnit ? selectedUnit.unidade_modelo : null
        });

        localStorage.setItem('unit', selectedId);
        localStorage.setItem(
            'unidade_modelo',
            selectedUnit ? selectedUnit.unidade_modelo : ''
        );

        setTimeout(() => {
            window.location.reload();
        }, 500);
    };

    // Adiciona um listener para o evento load da janela
    useEffect(() => {
        const handleLoad = () => {
            dispatch({ type: 'SET_LOADING', payload: false });
        };
        window.addEventListener('load', handleLoad);
        return () => {
            window.removeEventListener('load', handleLoad);
        };
    }, []);

    return (
        <>
            <Box
                sx={{
                    ml: 2,
                    mr: 3,
                    [theme.breakpoints.down('md')]: {
                        mr: 2
                    }
                }}
            >
                <OutlineInputStyle
                    id="input-search-header"
                    value={idUnit}
                    onChange={handleUnitChange}
                    placeholder="Pesquisar"
                    aria-describedby="search-helper-text"
                    inputProps={{ 'aria-label': 'weight' }}
                >
                    {renderOptions()}
                </OutlineInputStyle>
            </Box>
        </>
    );
};

SearchSection.propTypes = {
    children: PropTypes.node
};

export default SearchSection;
