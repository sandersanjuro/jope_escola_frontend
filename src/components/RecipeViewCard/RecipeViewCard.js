import * as React from 'react';
import { styled } from '@mui/material/styles';
import {
    Card,
    CardHeader,
    CardContent,
    CardActions,
    Typography,
    CardActionArea
} from '@mui/material';

export default function RecipeReviewCard(props) {
    return (
        <Card
            sx={{
                width: 370,
                height: 520, // altura total fixa
                maxWidth: '100%',
                display: 'flex',
                flexDirection: 'column',
                boxShadow: '0px 9px 18px rgba(0, 0, 0, 0.18)',
                overflow: 'hidden',
                margin: 2
            }}
        >
            <CardHeader
                sx={{
                    minHeight: 80,
                    '& .MuiCardHeader-content': {
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap'
                    },
                    flexShrink: 0
                }}
                action={props.status}
                title={<Typography variant="subtitle1" noWrap>{props.title}</Typography>}
                subheader={<Typography variant="caption" noWrap>{props.created}</Typography>}
            />

            <CardActionArea
                onClick={() => props.navigate({ pathname: `/${props.route}` })}
                sx={{
                    flexGrow: 1,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'stretch',
                    overflow: 'hidden'
                }}
            >
                <Typography sx={{ ml: '8%', mt: '-20px' }} fontSize={12} noWrap>
                    <b>{props.nature}</b>
                </Typography>

                <CardContent
                    sx={{
                        flexGrow: 1,
                        overflowY: 'auto',
                        py: 1
                    }}
                >
                    <Typography
                        variant="body2"
                        color="text.primary"
                        sx={{
                            wordBreak: 'break-word',
                            whiteSpace: 'pre-line'
                        }}
                    >
                        {props.contentMain}
                    </Typography>
                </CardContent>
            </CardActionArea>

            <CardActions
                disableSpacing
                sx={{
                    minHeight: 60, // altura fixa para manter todos iguais
                    px: 2,
                    py: 1,
                    justifyContent: 'flex-start',
                    flexWrap: 'wrap',
                    gap: 1,
                    flexShrink: 0
                }}
            >
                {props.buttonCancel}
            </CardActions>
        </Card>
    );
}
