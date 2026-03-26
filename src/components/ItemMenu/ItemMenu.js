import * as React from 'react';
import { styled } from '@mui/material/styles';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import { Link } from 'react-router-dom';

const Item = styled(Paper)(({ theme }) => ({
    backgroundColor: 'LightGrey',
    padding: theme.spacing(1),
    textAlign: 'center',
    color: 'black',
    borderRadius: 2
}));

export default function ItemMenu(props) {
    return (
        <Box sx={{ width: '100%' }}>
            <Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 3, md: 3 }}>
                {props.data.map((value) => (
                    <Grid item xs={4}>
                        <Item>
                            <Link style={{ textDecoration: 'none' }} to={value.url}>
                                {value.icon}
                            </Link>
                        </Item>
                        <Item>
                            <Link style={{ textDecoration: 'none' }} to={value.url}>
                                {value.title}
                            </Link>
                        </Item>
                    </Grid>
                ))}
            </Grid>
        </Box>
    );
}
