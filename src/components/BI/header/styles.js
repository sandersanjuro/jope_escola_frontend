import styled from 'styled-components';
import Button from '@mui/material/Button';

export const HeaderStyled = styled.header`
  height: 21%;
  display: flex;
  margin-top: 0rem;
  align-items: end;
  justify-content: start;
  border-bottom: 1px solid black;
`;
export const ButtonMenu = styled(Button)`
  background-color: #fff;
  height: 50px;
  border-top-left-radius: 5px;
  border-top-right-radius: 5px;
  color: #616161;
  width: 200px;
  margin-left: 4px;
  &:hover {
    background-color: #0f4e74 !important;
    border-top-left-radius: 5px;
    border-top-right-radius: 5px;
    color: #fff !important;
  }
`;
