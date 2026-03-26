import { Grid } from '@mui/material';
import { Container, GridMain, GridFilter, GridMainContainer } from './styles';
import { useEffect } from 'react';
import { MENU_OPEN } from 'store/actions';
import Header from '../../../components/BI/header';
import BITask from '../../../components/BI/task';
import { useDispatch, useSelector } from 'react-redux';
import BiManager from 'components/BI/manager';
import BiManagerUnit from 'components/BI/managerUnit';
import { GraphicLine } from 'components/BI/graphicLine';
import CountVisits from 'components/BI/countVisits';
// ============================== Index ============================== //

const Bi = () => {
    const dispatch = useDispatch();
    const optionSelected = useSelector((state) => state.bi.optionMenu);

    useEffect(() => {
        const currentIndex = document.location.pathname
            .toString()
            .split('/')
            .findIndex((id) => id === 'bi');
        if (currentIndex > -1) {
            dispatch({ type: MENU_OPEN, id: 'bi' });
        }
    }, []);

    return (
        <Container>
            <h1
                style={{
                    font: 'normal normal bold 48px Myriad Pro',
                    letterSpacing: '0px',
                    color: 'var(--unnamed-color-015641)',
                    color: 'black',
                    opacity: 1,
                    padding: 15,
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center'
                }}
            >
                INDICADORES
            </h1>
            <Header>
                <h1>Menu</h1>
            </Header>
            <main>
                {
                    {
                        // Chamados: <BITask />,
                        ['SLA GERENTE']: <BiManager />,
                        ['CONTAGEM VISITAS']: <CountVisits />
                        // Unidade: <BiManagerUnit />
                    }[optionSelected]
                }
            </main>
        </Container>
    );
};

export default Bi;
