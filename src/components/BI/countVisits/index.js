import { GridMain, GridFilter, GridMainContainer, Card, GridCard } from './styles';
import GraphicBar from '../graphicBar/index';
import { GraphicArea } from '../graphicArea';
import FilterDates from '../filterDates';
// import { getCourses } from 'services/bi';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import FilterList from '../filterList';
import { getCountVisitsBi, getManagerBi, getTasksBi } from 'services/bi';
import ModalFilter from 'components/Modal/ModalFilter';
import { Grid, Button, Box } from '@mui/material';
import AnimateButton from 'ui-component/extended/AnimateButton';
import { GraphicLine } from '../graphicLine';
import FilterDatesCount from '../filterDateCount';
import { getUnitContador } from 'services/unit';
import FilterListCount from '../filterListCount';

const CountVisits = () => {
    const [allDataMonth, setAllDataMonth] = useState([]);
    const [taskFiltered, setTaskFiltered] = useState(['']);
    const [totalTask, setTotalTask] = useState(0);
    const [filter, setFilter] = useState([]);
    const filterDate = useSelector((state) => state.bi.filterDateCountFormat);
    const filterUnit = useSelector((state) => state.bi.filterUnitCount);
    const [modalInfo, setModalInfo] = useState(false);
    const [information, setInformation] = useState([]);
    const [find, setFind] = useState({});

    useEffect(() => {
        getAllCounts();
    }, [filterDate, filterUnit]);

    function getFilter() {
        getUnitContador().then((resp) => setFilter(resp.data));
    }

    function getAllCounts() {
        getCountVisitsBi(filterDate, filterUnit)
            .then((resp) => {
                setAllDataMonth(resp.data);
            })
            .catch((error) => {
                console.error(error);
            });
    }

    useEffect(() => {
        getFilter();
        getAllCounts();
    }, []);

    const handleCloseInfo = () => setModalInfo(false);

    return (
        <>
            <GridMainContainer container>
                <GridMain item xs={9}>
                    <GraphicLine data={allDataMonth} width="100%" />
                </GridMain>
                <GridFilter item xs={2}>
                    {/* <GridCard>
                        <h2>Total de Chamados</h2>
                        <Card>
                            <p>{totalTask}</p>
                        </Card>
                    </GridCard> */}
                    <FilterDatesCount />
                    <FilterListCount registersFilter={filter} originFilter="unit" title="Por Unidade" />
                </GridFilter>
            </GridMainContainer>
        </>
    );
};

export default CountVisits;
