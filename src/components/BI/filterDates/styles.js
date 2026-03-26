import styled from 'styled-components';
import { Grid } from '@mui/material';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';

export const GridMainContainer = styled(Grid)`
  border: 1px solid black;
  border-radius: 7px;
  display: flex;
  align-items: center;
  justify-content: center;
  > h4 {
    margin: 5px;
  }
`;

export const Divider = styled.hr`
  width: 100%;
`;

export const GridFilter = styled(Grid)`
  margin-bottom: 1rem;
`;

export const StackStyled = styled(Stack)`
  padding: 8px;
`;

export const ButtonStyled = styled(Button)`
  background-color: #0f4e74;
  margin-top: 10px;
  &:hover {
    background-color: #0f4e74;
  }
`;
