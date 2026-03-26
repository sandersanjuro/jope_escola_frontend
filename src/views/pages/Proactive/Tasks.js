import { Button, Chip, Grid, IconButton, Tooltip, Typography } from '@mui/material';
import RecipeReviewCard from 'components/RecipeViewCard/RecipeViewCard';
import DeleteIcon from '@mui/icons-material/Delete';
import ReopenIcon from '@mui/icons-material/Autorenew';
import CheckIcon from '@mui/icons-material/Check';
import RecipeViewTechnical from 'components/RecipeViewTechnical/RecipeViewTechnical';
import Feed from '@mui/icons-material/Feed';
import InitialIcon from '@mui/icons-material/PlayCircleFilledWhite';
import CloseIcon from '@mui/icons-material/Close';
import RestartAlt from '@mui/icons-material/RestartAlt';

export default function renderTasks(props) {
    const task = props.tasks || [];
    const id_role = parseInt(props.id_role);
    const path = window.location.pathname;
    function defineRoute(id, moduleOs, inicioAtendimento = '') {
        if (moduleOs === 1) {
            // if (id_role === 3 && inicioAtendimento) {
            //     return `/atendimento/${id}`;
            // }
            return `corretiva/${id}/view`;
        } else if (moduleOs === 2) {
            // if (id_role === 3 && inicioAtendimento) {
            //     return `/atendimento/${id}`;
            // }
            return `preventiva/${id}/view`;
        } else if (moduleOs === 3) {
            // if (id_role === 3 && inicioAtendimento) {
            //     return `/atendimento/${id}`;
            // }
            return `proativa/${id}/view`;
        }
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
        <Grid xs={12} sm={3} item sx={{ mt: 0 }} key={desc.id}>
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
                        id_role == 1 || id_role == 3 ? (

                                <>
                                    {
                                        desc.status_id == 3 && (
                                            <Tooltip title="Excluir">
                                                <IconButton
                                                    aria-label="delete"
                                                    size="large"
                                                    onClick={() => props.onDelete(desc.id)}
                                                    color="error"
                                                    variant="contained" 
                                                >
                                                    <DeleteIcon fontSize="inherit" />
                                                </IconButton>
                                            </Tooltip>
                                        )
                                    }
                                    {
                                        desc.status_id == 1 && (
                                            <IconButton
                                                aria-label="delete"
                                                size="large"
                                                disabled={parseInt(desc.status_id) === 1 || parseInt(desc.status_id) === 2 ? false : true}
                                                onClick={() => props.onCancel(desc.id)}
                                                color="error"
                                                variant="contained"
                                            >
                                                <CloseIcon fontSize="inherit" />
                                            </IconButton>
                                        )
                                    }
                                    <Tooltip title="Informações">
                                        <IconButton
                                            aria-label="Informações"
                                            size="large"
                                            onClick={() => props.info(desc)}
                                            color="primary"
                                            variant="contained"
                                        >
                                            <Feed fontSize="inherit" />
                                        </IconButton>
                                    </Tooltip>
                                    {
                                        desc.status_id !== 3 && desc.status_id !== 5 && (
                                            <IconButton
                                                aria-label="Finalizar"
                                                size="large"
                                                disabled={parseInt(desc.status_id) == 5 ? true : false}
                                                onClick={() => props.navigate({ pathname: `/atendimento/proativa/${desc.id}` })}
                                                color="primary"
                                                variant="contained"
                                            >
                                                <CheckIcon fontSize="inherit" />
                                            </IconButton>
                                        )
                                    }
                                    {
                                        desc.status_id == 1 && (
                                            <Tooltip title="Iniciar">
                                                <IconButton
                                                    aria-label="Iniciar"
                                                    size="large"
                                                    onClick={() => props.handleInitialTask(desc.id)}
                                                    color="primary"
                                                    variant="contained"
                                                >
                                                    <InitialIcon fontSize="inherit" />
                                                </IconButton>
                                            </Tooltip>
                                        )
                                    }
                                     {
                                        desc.status_id !== 1 && desc.status_id !== 3 && desc.status_id !== 5 &&(
                                            <Tooltip title="Resetar Chamado">
                                                <IconButton
                                                    aria-label="Resetar Chamado"
                                                    size="large"
                                                    onClick={() => props.handleOpenReset(desc.id)}
                                                    color="primary"
                                                    variant="contained"
                                                    disabled={desc.repactuacao ? true : false}
                                                >
                                                    <RestartAlt fontSize="inherit" />
                                                </IconButton>
                                            </Tooltip>
                                        )
                                }
                                </>
                            // <Button
                            //     disabled={parseInt(desc.status_id) === 1 || parseInt(desc.status_id) === 2 ? false : true}
                            //     onClick={() => props.onCancel(desc.id)}
                            //     color="error"
                            //     variant="contained"
                            //     endIcon={<CancelIcon />}
                            // >
                            //     Cancelar
                            // </Button>
                        ) : <></>
                    }
                    // route={props.moduleOs === 1 ? `corretiva/${desc.id}/view` : `preventiva/${desc.id}/view`}
                    contentMain={
                        <>
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
        </Grid>
    ));
}
