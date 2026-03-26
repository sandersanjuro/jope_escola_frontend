import { Grid, Typography } from '@mui/material';
import RecipeReviewCard from 'components/RecipeViewCard/RecipeViewCard';

export default function renderTasks(props) {
    const task = props.tasks || [];
    return task.map((desc) => (
        <Grid xs={12} sm={3} item sx={{ mt: 5, margin: 1 }}>
            <RecipeReviewCard
                title={`OS ${desc.id}`}
                created={desc.data_abertura}
                contentMain={
                    <>
                        <Typography fontSize={15}>
                            <b>Unidade: </b>
                            {desc.unidade}
                        </Typography>
                        <Typography fontSize={15}>
                            <b>Aberto por : </b>
                            {desc.created_by}
                        </Typography>
                        <Typography fontSize={15}>
                            <b>Solicitante: </b>
                            {desc.solicitante}
                        </Typography>
                        <Typography fontSize={15}>
                            <b>Tipo OS : </b>
                            {desc.tipo_os}
                        </Typography>
                        <Typography fontSize={15}>
                            <b>Problema : </b>
                            {desc.tipo_problema}
                        </Typography>
                        <Typography fontSize={15}>
                            <b>Vencimento: </b>
                            {desc.vencimento}
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
