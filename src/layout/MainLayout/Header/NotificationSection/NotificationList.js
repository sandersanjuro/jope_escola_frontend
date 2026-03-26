// material-ui
import { useTheme, styled } from '@mui/material/styles';
import {
    Avatar,
    Button,
    Card,
    CardContent,
    Chip,
    Divider,
    Grid,
    List,
    ListItem,
    ListItemAvatar,
    ListItemSecondaryAction,
    ListItemText,
    Stack,
    Typography
} from '@mui/material';

// assets
import { IconBrandTelegram, IconBuildingStore, IconMailbox, IconPhoto } from '@tabler/icons';
import User1 from 'assets/images/users/user-round.svg';
import { getBrlFormatDate } from 'utils/date';
import { sawNotification } from 'services/notification';
import { useDispatch } from 'react-redux';
import { loadTotalNotification } from 'store/notificationReducer';

// styles
const ListItemWrapper = styled('div')(({ theme }) => ({
    cursor: 'pointer',
    padding: 16,
    '&:hover': {
        background: theme.palette.primary.light
    },
    '& .MuiListItem-root': {
        padding: 0
    }
}));

// ==============================|| NOTIFICATION LIST ITEM ||============================== //

const NotificationList = ({ notification, nome, navigate }) => {
    const theme = useTheme();
    const dispatch = useDispatch();

    const chipSX = {
        height: 24,
        padding: '0 6px'
    };
    const chipErrorSX = {
        ...chipSX,
        color: theme.palette.orange.dark,
        backgroundColor: theme.palette.orange.light,
        marginRight: '5px'
    };

    const chipWarningSX = {
        ...chipSX,
        color: theme.palette.warning.dark,
        backgroundColor: theme.palette.warning.light
    };

    const chipSuccessSX = {
        ...chipSX,
        color: theme.palette.success.dark,
        backgroundColor: theme.palette.success.light,
        height: 28
    };

    const saw = async (id) => {
        sawNotification(id).then(() => loadTotalNotification(dispatch));
    };

    return (
        <List
            sx={{
                width: '100%',
                maxWidth: 330,
                py: 0,
                borderRadius: '10px',
                [theme.breakpoints.down('md')]: {
                    maxWidth: 300
                },
                '& .MuiListItemSecondaryAction-root': {
                    top: 22
                },
                '& .MuiDivider-root': {
                    my: 0
                },
                '& .list-container': {
                    pl: 7
                }
            }}
        >
            {notification.map((desc) => (
                <>
                    <ListItemWrapper
                        key={desc.id}
                        onClick={() => {
                            saw(desc.id);
                            navigate({ pathname: `${desc.redirecionamento}` });
                        }}
                    >
                        <ListItem alignItems="center">
                            <ListItemAvatar>
                                <Avatar>N</Avatar>
                            </ListItemAvatar>
                            <ListItemText primary="Chamado Gerente" />
                            <ListItemSecondaryAction>
                                <Grid container justifyContent="flex-end">
                                    <Grid item xs={12}>
                                        <Typography variant="caption" display="block" gutterBottom>
                                            {getBrlFormatDate(desc.created_at)}
                                        </Typography>
                                    </Grid>
                                </Grid>
                            </ListItemSecondaryAction>
                        </ListItem>
                        <Grid container direction="column" className="list-container">
                            <Grid item xs={12} sx={{ pb: 2 }}>
                                <Typography variant="subtitle2">{desc.descricao}</Typography>
                            </Grid>
                            {/* <Grid item xs={12}>
                                <Grid container>
                                    <Grid item>
                                        <Chip label="Não Vista" sx={chipErrorSX} />
                                    </Grid>
                                    <Grid item>
                                        <Chip label="Recente" sx={chipWarningSX} />
                                    </Grid>
                                </Grid>
                            </Grid> */}
                        </Grid>
                    </ListItemWrapper>
                    <Divider />
                </>
            ))}
            {/* <Divider />
            <ListItemWrapper>
                <ListItem alignItems="center">
                    <ListItemAvatar>
                        <Avatar
                            sx={{
                                color: theme.palette.success.dark,
                                backgroundColor: theme.palette.success.light,
                                border: 'none',
                                borderColor: theme.palette.success.main
                            }}
                        >
                            <IconBuildingStore stroke={1.5} size="1.3rem" />
                        </Avatar>
                    </ListItemAvatar>
                    <ListItemText primary={<Typography variant="subtitle1">Verificação concluída</Typography>} />
                    <ListItemSecondaryAction>
                        <Grid container justifyContent="flex-end">
                            <Grid item xs={12}>
                                <Typography variant="caption" display="block" gutterBottom>
                                    2 min mar
                                </Typography>
                            </Grid>
                        </Grid>
                    </ListItemSecondaryAction>
                </ListItem>
                <Grid container direction="column" className="list-container">
                    <Grid item xs={12} sx={{ pb: 2 }}>
                        <Typography variant="subtitle2">Recebemos sua solicitação com sucesso.</Typography>
                    </Grid>
                    <Grid item xs={12}>
                        <Grid container>
                            <Grid item>
                                <Chip label="Não Vista" sx={chipErrorSX} />
                            </Grid>
                        </Grid>
                    </Grid>
                </Grid>
            </ListItemWrapper>
            <Divider />
            <ListItemWrapper>
                <ListItem alignItems="center">
                    <ListItemAvatar>
                        <Avatar
                            sx={{
                                color: theme.palette.primary.dark,
                                backgroundColor: theme.palette.primary.light,
                                border: 'none',
                                borderColor: theme.palette.primary.main
                            }}
                        >
                            <IconMailbox stroke={1.5} size="1.3rem" />
                        </Avatar>
                    </ListItemAvatar>
                    <ListItemText primary={<Typography variant="subtitle1">Verifique seu email.</Typography>} />
                    <ListItemSecondaryAction>
                        <Grid container justifyContent="flex-end">
                            <Grid item>
                                <Typography variant="caption" display="block" gutterBottom>
                                    2 min mar
                                </Typography>
                            </Grid>
                        </Grid>
                    </ListItemSecondaryAction>
                </ListItem>
                <Grid container direction="column" className="list-container">
                    <Grid item xs={12} sx={{ pb: 2 }}>
                        <Typography variant="subtitle2">Tudo feito! Agora, verifique sua caixa de entrada</Typography>
                    </Grid>
                    <Grid item xs={12}>
                        <Grid container>
                            <Grid item>
                                <Button variant="contained" disableElevation endIcon={<IconBrandTelegram stroke={1.5} size="1.3rem" />}>
                                    Email
                                </Button>
                            </Grid>
                        </Grid>
                    </Grid>
                </Grid>
            </ListItemWrapper>
            <Divider />
            <ListItemWrapper>
                <ListItem alignItems="center">
                    <ListItemAvatar>
                        <Avatar alt="John Doe" src={User1} />
                    </ListItemAvatar>
                    <ListItemText primary={<Typography variant="subtitle1">Sander Eto</Typography>} />
                    <ListItemSecondaryAction>
                        <Grid container justifyContent="flex-end">
                            <Grid item xs={12}>
                                <Typography variant="caption" display="block" gutterBottom>
                                    2 min mar
                                </Typography>
                            </Grid>
                        </Grid>
                    </ListItemSecondaryAction>
                </ListItem>
                <Grid container direction="column" className="list-container">
                    <Grid item xs={12} sx={{ pb: 2 }}>
                        <Typography component="span" variant="subtitle2">
                            Dois arquivos enviados em &nbsp;
                            <Typography component="span" variant="h6">
                                08 Mar 2022
                            </Typography>
                        </Typography>
                    </Grid>
                    <Grid item xs={12}>
                        <Grid container>
                            <Grid item xs={12}>
                                <Card
                                    sx={{
                                        backgroundColor: theme.palette.secondary.light
                                    }}
                                >
                                    <CardContent>
                                        <Grid container direction="column">
                                            <Grid item xs={12}>
                                                <Stack direction="row" spacing={2}>
                                                    <IconPhoto stroke={1.5} size="1.3rem" />
                                                    <Typography variant="subtitle1">rehagro.jpg</Typography>
                                                </Stack>
                                            </Grid>
                                        </Grid>
                                    </CardContent>
                                </Card>
                            </Grid>
                        </Grid>
                    </Grid>
                </Grid>
            </ListItemWrapper>
            <Divider /> */}
        </List>
    );
};

export default NotificationList;
