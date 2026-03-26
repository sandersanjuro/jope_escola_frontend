import { Grid } from '@mui/material';
import styled from 'styled-components';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';

export const GridMainContainer = styled(Grid)`
  padding: 0.5rem;
`;

export const GridMain = styled(Grid)`
  display: flex;
  align-items: center;
  margin-right: 2rem;
  margin-bottom: 1rem;
  border: 1px solid black;
  border-radius: 7px;
  padding: 1rem;
`;

export const GridFilter = styled(Grid)`
  margin-bottom: 1rem;
  height: 100%;
`;

export const GridMainContainerFilter = styled(Grid)`
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

export const StackStyled = styled(Stack)`
  padding: 8px;
`;

export const ButtonStyled = styled(Button)`
  background-color: #3a6647;
  &:hover {
    background-color: #6fb283;
  }
`;

export const Card = styled.div`
  background-color: #0f4e74 !important;
  border: 1px solid black;
  border-radius: 7px;
  width: 180px;
  height: 100px;
  display: flex;
  align-items: center;
  justify-content: center;
  > p {
    font-size: 32px;
    font-weight: 700;
    color: #fff;
  }
`;

export const GridCard = styled.div`
  margin-bottom: 20px;
  padding: 20px;
  border: 1px solid black;
  border-radius: 7px;
  display: flex;
  align-items: center;
  justify-content: center;
  > h4 {
    margin: 5px;
  }
`;
