import styled from 'styled-components';

export const Container = styled.ul`
  margin-top: 20px;
  padding-inline-start: 0px;
  li {
    display: flex;
    justify-content: space-between;
    align-items: left;
    color: #444;
    font-size: 10px;

    & + li {
      margin-top: 15px;
    }
  }
`;
export const FileInfo = styled.div`
  display: flex;
  align-items: center;
  div {
    display: flex;
    flex-direction: column;

    span {
      font-size: 10px;
      color: #999;
      margin-top: 5px;
      a {
        border: 0;
        background: transparent;
        color: #e57878;
        cursor: pointer;
      }
    }
  }
`;
export const Preview = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 5px;
  background-image: url(${(props) => props.src});
  background-repeat: no-repeat;
  background-size: cover;
  background-position: 50% 50%;
  margin-right: 10px;
`;
