import { HeaderStyled, ButtonMenu, ButtonMenuSelected } from './styles';
import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
const Header = () => {
    const [optionSelected, setOptionSelected] = useState('SLA GERENTE');
    const options = ['SLA GERENTE', 'CONTAGEM VISITAS'];
    const dispatch = useDispatch();

    const handleChangeOption = (newValue) => {
        dispatch({ type: 'SET_OPTION_MENU', payload: newValue });
        setOptionSelected(newValue);
    };
    return (
        <HeaderStyled>
            {options.map((value) => (
                <ButtonMenu
                    onClick={() => handleChangeOption(value)}
                    style={
                        optionSelected !== value
                            ? {
                                  backgroundColor: '#fff'
                              }
                            : {
                                  backgroundColor: '#0f4e74',
                                  color: '#fff'
                              }
                    }
                >
                    {value}
                </ButtonMenu>
            ))}
        </HeaderStyled>
    );
};

export default Header;
