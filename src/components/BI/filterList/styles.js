import styled from 'styled-components';
import { Grid } from '@mui/material';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Checkbox from '@mui/material/Checkbox';
import List from '@mui/material/List';
export const GridMainContainer = styled(Grid)`
  border: 1px solid black;
  border-radius: 7px;
  margin-top: 20px;
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
  background-color: #3a6647;
  &:hover {
    background-color: #6fb283;
  }
`;

export const CheckboxStyled = styled(Checkbox)`
  color: #3a6647;
`;
export const ListStyled = styled(List)`
  ::-webkit-scrollbar {
    border-radius: 10px;
    width: 0.4rem;
    height: 0.4rem;
  }

  ::-webkit-scrollbar-thumb {
    border-radius: 10px;
    background: #aaa;
  }

  ::-webkit-scrollbar-thumb:hover {
    border-radius: 10px;
    background: #3a6647;
  }
`;
