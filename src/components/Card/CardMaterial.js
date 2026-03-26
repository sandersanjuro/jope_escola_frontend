import * as React from 'react';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import CardHeader from '@mui/material/CardHeader';
import IconButton from '@mui/material/IconButton';
import MoreVertIcon from '@mui/icons-material/Close';

const bull = (
    <Box component="span" sx={{ display: 'inline-block', mx: '2px', transform: 'scale(0.8)' }}>
        •
    </Box>
);
export default function CardMaterial(props) {
    return (
        <Box sx={{ minWidth: 275, boxShadow: '0px 9px 18px rgba(0, 0, 0, 0.18)', overflow: 'visible' }}>
            <Card variant="outlined">
                <CardContent>
                    <CardHeader
                        title={props.title}
                        sx={{ height: 20 }}
                        action={
                            !props.action && (
                                <IconButton onClick={() => props.handleDelete(props.idDelete)} aria-label="fechar">
                                    <MoreVertIcon />
                                </IconButton>
                            )
                        }
                    />
                    <hr></hr>
                    {props.content}
                </CardContent>
            </Card>
        </Box>
    );
}
