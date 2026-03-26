import { Button, Chip, Grid, IconButton, Tooltip, Typography } from '@mui/material';
import RecipeReviewCard from 'components/RecipeViewCard/RecipeViewCard';
import DeleteIcon from '@mui/icons-material/Delete';
import ReopenIcon from '@mui/icons-material/Autorenew';
import CheckIcon from '@mui/icons-material/Check';
import RecipeViewTechnical from 'components/RecipeViewTechnical/RecipeViewTechnical';
import AutoGraphIcon from '@mui/icons-material/AutoGraph';

export default function renderTasks(props) {
    const task = props.tasks || [];
    const id_role = parseInt(props.id_role);
    const path = window.location.pathname;
    function defineRoute(id, moduleOs, inicioAtendimento = '') {
        return `chamado_gerente/${id}/view`;
    }
    function defineModule() {
        let modulePath = path.split('/')[1];
        let moduleDispatch = '';
        if (modulePath === 'corretivas') {
            return (moduleDispatch = 'corretiva');
        } else {
            return (moduleDispatch = 'preventiva');
        }
    }
    return task.map((desc) => (
        <Grid xs={12} sm={3} item sx={{ mt: 0 }}>
            {id_role === 3 ? (
                <RecipeViewTechnical navigate={props.navigate} route={defineRoute(desc.id, props.moduleOs, desc.inicio_atendimento)}>
                    <Typography height={20} fontSize={15}>
                        {`OS ${desc.id}`}
                    </Typography>
                    <Typography height={15} fontSize={12}>
                        <b>Sla Atendimento: </b>
                        {desc.sla_atendimento ? desc.sla_atendimento : 'N/A'}
                    </Typography>
                    <Typography height={15} fontSize={12}>
                        <b>Sla Solução: </b>
                        {desc.sla_solucao ? desc.sla_solucao : 'N/A'}
                    </Typography>
                    <Typography height={15} fontSize={12}>
                        {`${desc.categoria_ativo} - ${desc.ativo}`}
                    </Typography>
                </RecipeViewTechnical>
            ) : (
                <RecipeReviewCard
                    title={`OS ${desc.id}`}
                    navigate={props.navigate}
                    created={desc.data_abertura}
                    nature={desc.natureza}
                    atendimento={desc.slaAtendimentoEstourado}
                    solucao={desc.slaConclusaoEstourado}
                    route={defineRoute(desc.id, props.moduleOs, desc.inicio_atendimento)}
                    status={
                        desc.atrasado && desc.natureza_id == 1 ? (
                            <Chip label="Atrasado" color="error" />
                        ) : (
                            <Chip label={desc.status} color={desc.cor} />
                        )
                    }
                    buttonCancel={
                        id_role == 1 ? (
                            <>
                                <IconButton
                                    aria-label="delete"
                                    size="large"
                                    disabled={parseInt(desc.status_id) === 1 || parseInt(desc.status_id) === 2 ? false : true}
                                    onClick={() => props.onCancel(desc.id)}
                                    color="error"
                                    variant="contained"
                                >
                                    <DeleteIcon fontSize="inherit" />
                                </IconButton>
                                {/* <IconButton
                                    aria-label="reabrir"
                                    size="large"
                                    disabled={parseInt(desc.status_id) !== 5 ? true : false}
                                    onClick={() => props.navigate({ pathname: `/${defineModule()}/${desc.id}/reopen` })}
                                    // onClick={() => props.onReopen(desc.id)}
                                    color="primary"
                                    variant="contained"
                                >
                                    <ReopenIcon fontSize="inherit" />
                                </IconButton> */}
                                {/* <IconButton
                                    aria-label="Finalizar"
                                    size="large"
                                    disabled={parseInt(desc.status_id) == 5 ? true : false}
                                    onClick={() => props.navigate({ pathname: `/atendimento/${desc.id}` })}
                                    color="primary"
                                    variant="contained"
                                >
                                    <CheckIcon fontSize="inherit" />
                                </IconButton> */}
                            </>
                        ) : id_role == 4 ? (
                            <>
                                <Tooltip title="Avaliar">
                                    <IconButton
                                        aria-label="avaliar"
                                        size="large"
                                        disabled={
                                            parseInt(desc.status_id) !== 5 && desc.ps !== null && desc.data_reabertura == null
                                        }
                                        onClick={() => props.onModalEvaluation(desc.id)}
                                        color="success"
                                        variant="contained"
                                    >
                                        <AutoGraphIcon fontSize="inherit" />
                                    </IconButton>
                                </Tooltip>
                                <IconButton
                                    aria-label="delete"
                                    size="large"
                                    disabled={desc.sla_atendimento || parseInt(desc.status_id) == 3 ? true : false}
                                    onClick={() => props.onCancel(desc.id)}
                                    color="error"
                                    variant="contained"
                                >
                                    <DeleteIcon fontSize="inherit" />
                                </IconButton>
                            </>
                        ) : (
                            <></>
                        )
                        // <Button
                        //     disabled={parseInt(desc.status_id) === 1 || parseInt(desc.status_id) === 2 ? false : true}
                        //     onClick={() => props.onCancel(desc.id)}
                        //     color="error"
                        //     variant="contained"
                        //     endIcon={<CancelIcon />}
                        // >
                        //     Cancelar
                        // </Button>
                    }
                    // route={props.moduleOs === 1 ? `corretiva/${desc.id}/view` : `preventiva/${desc.id}/view`}
                    contentMain={
                        <>
                            {props.moduleOs === 1 && (
                                <>
                                    <Typography height={40} fontSize={15}>
                                        <b>Sla Atendimento: </b>
                                        {desc.sla_atendimento ? desc.sla_atendimento : 'N/A'}
                                    </Typography>
                                    <Typography height={40} fontSize={15}>
                                        <b>Sla Solução: </b>
                                        {desc.sla_solucao ? desc.sla_solucao : 'N/A'}
                                    </Typography>
                                </>
                            )}
                            <Typography height={40} fontSize={15}>
                                <b>Unidade: </b>
                                {desc.unidade}
                            </Typography>
                            {/* <Typography fontSize={15}>
                                <b>Aberto por : </b>
                                {desc.created_by}
                            </Typography> */}
                            <Typography height={40} fontSize={15}>
                                <b>Solicitante: </b>
                                {desc.solicitante}
                            </Typography>
                            <Typography height={40} fontSize={15}>
                                <b>Problema : </b>
                                {desc.tipo_problema}
                            </Typography>
                            <Typography height={40} fontSize={15}>
                                <b>Ativo: </b>
                                {`${desc.ativo} - ${desc.andar}`}
                            </Typography>
                            <Typography height={50} fontSize={15}>
                                <b>Tipo OS : </b>
                                {desc.tipo_os}
                            </Typography>
                        </>
                    }
                    contentSecondary={
                        <>
                            <h2>Técnicos</h2>
                            <hr></hr>
                            <h2>Ativos</h2>
                            <hr></hr>
                            <h2>Descrição</h2>
                            <hr></hr>
                        </>
                    }
                />
            )}
        </Grid>
    ));
}
