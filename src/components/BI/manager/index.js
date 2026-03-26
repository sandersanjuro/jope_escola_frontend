import { GridMain, GridFilter, GridMainContainer, Card, GridCard } from './styles';
import GraphicBar from '../graphicBar/index';
import { GraphicArea } from '../graphicArea';
import FilterDates from '../filterDates';
// import { getCourses } from 'services/bi';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import FilterList from '../filterList';
import { getManagerBi, getTasksBi } from 'services/bi';
import ModalFilter from 'components/Modal/ModalFilter';
import { Grid, Button, Box } from '@mui/material';
import AnimateButton from 'ui-component/extended/AnimateButton';

const BiManager = () => {
    const header = ['Mês', 'Sla', { role: 'style' }];
    // const data = [
    //     // ['Meses', 'Sla', { role: 'style' }],
    //     ['jan', 80, 'color: red'],
    //     ['fev', 95, 'color: green'],
    //     ['mar', 88, 'color: red'],
    //     ['abr', 92, 'color: green']
    // ];
    const [allDataMonth, setAllDataMonth] = useState([]);
    const [taskFiltered, setTaskFiltered] = useState(['']);
    const [totalTask, setTotalTask] = useState(0);
    const [filter, setFilter] = useState([]);
    const filterDate = useSelector((state) => state.bi.filterDate);
    const filterUnit = useSelector((state) => state.bi.filterUnit);
    const [modalInfo, setModalInfo] = useState(false);
    const [information, setInformation] = useState([]);
    const [find, setFind] = useState({});

    useEffect(() => {
        getAllTasks();
    }, [filterDate, filterUnit]);

    const handleClick = (chartWrapper) => {
        let coordenates = chartWrapper.getChart().getSelection();
        let position = coordenates[0].row + 1;
        let findInformation = information.find((desc) => desc.mes_descricao == allDataMonth[position][0]);
        setFind(findInformation);
        setModalInfo(true);
    };

    function getAllTasks() {
        getManagerBi(filterDate, filterUnit)
            .then((resp) => {
                console.log(resp.data.information);
                // setAllData(resp.data.content);
                setAllDataMonth([header].concat(resp.data.content));
                setInformation(resp.data.information);
                setFilter([{ id: 14725896312, nome: 'TODOS' }, ...resp.data.unit]);
                // setTotalTask(resp.data.total);
            })
            .catch((error) => {
                console.error(error);
            });
    }

    useEffect(() => {
        getAllTasks();
    }, []);

    const handleCloseInfo = () => setModalInfo(false);

    return (
        <>
            <GridMainContainer container>
                <ModalFilter
                    open={modalInfo}
                    title="Informações do Mês"
                    handleClose={handleCloseInfo}
                    width="400px"
                    content={
                        <>
                            <ul>
                                <li>
                                    <span style={{ fontWeight: 700 }}>% SLA ABERTURA GERENTE:</span> {`${parseFloat(find?.total)}%`}
                                </li>
                                <li>
                                    <span style={{ fontWeight: 700 }}>Chamados abertos:</span> {`${find?.qtde_chamado}`}
                                </li>
                                <li>
                                    <span style={{ fontWeight: 700 }}>Chamados atendidos dentro do prazo:</span>{' '}
                                    {`${find?.qtde_atendida_dentro_sla_registro}`}
                                </li>
                                <li>
                                    <span style={{ fontWeight: 700 }}>Tempo médio de atendimento:</span>{' '}
                                    {`${parseFloat(find?.tempo_medio)} Horas`}
                                </li>
                            </ul>
                        </>
                    }
                />
                <GridMain item xs={9}>
                    <GraphicBar handleClick={handleClick} allData={allDataMonth} width="100%" />
                </GridMain>
                <GridFilter item xs={2}>
                    {/* <GridCard>
                        <h2>Total de Chamados</h2>
                        <Card>
                            <p>{totalTask}</p>
                        </Card>
                    </GridCard> */}
                    <FilterDates />
                    <FilterList registersFilter={filter} originFilter="unit" title="Por Unidade" />
                </GridFilter>
            </GridMainContainer>
        </>
    );
};

export default BiManager;
