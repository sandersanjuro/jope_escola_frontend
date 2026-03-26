import * as React from 'react';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Checkbox from '@mui/material/Checkbox';
import IconButton from '@mui/material/IconButton';
import CommentIcon from '@mui/icons-material/Comment';
import { Divider, GridMainContainer, ListStyled } from './styles';
import { useDispatch } from 'react-redux';

export default function FilterListCount(props) {
    const dispatch = useDispatch();
    const [checked, setChecked] = React.useState('');

    const handleToggle = (value) => () => {
        let newValue = value === checked ? 14725896312 : value;
        setChecked(newValue);
        dispatch({ type: 'SET_FILTER_UNIT_COUNT', payload: newValue });
    };

    return (
        <GridMainContainer container>
            <h4>{props.title}</h4>
            <Divider />
            <ListStyled sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper', maxHeight: 200, overflow: 'auto' }}>
                {props.registersFilter.map((value) => {
                    const labelId = `checkbox-list-label-${value}`;

                    return (
                        <ListItem key={value} disablePadding>
                            <ListItemButton role={undefined} onClick={handleToggle(value.id)} dense>
                                <ListItemIcon>
                                    <Checkbox
                                        edge="start"
                                        checked={value?.id === checked}
                                        tabIndex={-1}
                                        disableRipple
                                        inputProps={{ 'aria-labelledby': labelId }}
                                    />
                                </ListItemIcon>
                                <ListItemText id={labelId} primary={value?.nome} />
                            </ListItemButton>
                        </ListItem>
                    );
                })}
            </ListStyled>
        </GridMainContainer>
    );
}
