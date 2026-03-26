// styles.js
import styled from 'styled-components';

export const Container = styled.div`
    width: 80%;
    margin: auto;
    overflow: hidden;
    padding: 20px;
`;

export const Heading1 = styled.h1`
    color: #0056b3;
    border-bottom: 2px solid #0056b3;
    padding-bottom: 10px;
`;

export const Heading2 = styled.h2`
    color: #0056b3;
    margin-top: 15px;
`;

export const Paragraph = styled.p`
    margin: 10px 0;
`;

export const List = styled.ul`
    list-style: none;
    padding: 0;
`;

export const ListItem = styled.li`
    background: #e4e4e4;
    margin: 5px 0;
    padding: 10px;
    border-left: 5px solid #0056b3;
`;

export const LastUpdated = styled.p`
    text-align: right;
    font-size: 0.9em;
    color: #555;
`;

export const ContactInfo = styled.div`
    background: #e4e4f4;
    padding: 10px;
    border-left: 5px solid #0056b3;
`;

export const Link = styled.a`
    color: #0056b3;
    text-decoration: none;

    &:hover {
        text-decoration: underline;
    }
`;
