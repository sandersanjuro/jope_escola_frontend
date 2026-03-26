import styled from 'styled-components';
import { Grid } from '@mui/material';

export const Container = styled(Grid)`
  background-color: #fff;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;

  > header {
    height: 21%;
    display: flex;
    align-items: end;
    justify-content: start;
    border-bottom: 1px solid black;
  }
`;

export const GridMainContainer = styled(Grid)`
  padding: 0.5rem;
`;

export const GridMain = styled(Grid)`
  background-color: red;
  margin-right: 2rem;
  margin-bottom: 1rem;
`;

export const GridFilter = styled(Grid)`
  background-color: red;
  margin-bottom: 1rem;
`;
