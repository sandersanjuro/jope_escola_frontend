import { GridMain, GridFilter, GridMainContainer, Card, GridCard } from './styles';
import GraphicBar from '../graphicBar/index';
import { GraphicArea } from '../graphicArea';
import FilterDates from '../filterDates';
// import { getCourses } from 'services/bi';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import FilterList from '../filterList';
import { getTasksBi } from 'services/bi';

const BITasks = () => {
    const [allData, setAllData] = useState([]);
    const [allDataMonth, setAllDataMonth] = useState([]);
    const [taskFiltered, setTaskFiltered] = useState(['']);
    const [totalTask, setTotalTask] = useState(0);
    const [filter, setFilter] = useState([]);
    const filterDate = useSelector((state) => state.bi.filterDate);
    const filterUnit = useSelector((state) => state.bi.filterUnit);

    useEffect(() => {
        getAllTasks();
    }, [filterDate, filterUnit]);

    function getAllTasks() {
        getTasksBi(filterDate, filterUnit)
            .then((resp) => {
                setAllData(resp.data.content);
                setAllDataMonth(resp.data.contentMonth);
                setFilter(resp.data.filter);
                setTotalTask(resp.data.total);
            })
            .catch((error) => {
                console.error(error);
            });
    }

    useEffect(() => {
        getAllTasks();
    }, []);

    return (
        <>
            <GridMainContainer container>
                <GridMain item xs={9}>
                    <GraphicBar allData={allData} width="100%" />
                </GridMain>
                <GridFilter item xs={2}>
                    <GridCard>
                        <h2>Total de Chamados</h2>
                        <Card>
                            <p>{totalTask}</p>
                        </Card>
                    </GridCard>
                    <FilterDates />
                    <FilterList registersFilter={filter?.unit} originFilter="unit" title="Por Unidade" />
                </GridFilter>
                <GridMain item xs={9}>
                    {/* <GraphicArea allData={likesFiltered} width="100%" /> */}
                    <GraphicBar allData={allDataMonth} width="100%" />
                </GridMain>
            </GridMainContainer>
        </>
    );
};

export default BITasks;
