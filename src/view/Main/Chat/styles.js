import styled from 'styled-components';

export const Container = styled.div`
    padding: 24px;
    height: 100%;
    background-color: #001529b8;
    border-radius: 10px;
    z-index: 100;
    position: relative;
`;

export const TextChatDiv = styled.div`
    padding: 3px;
    color: azure;

    > div p {
        margin: 4px;
        height: auto;
        width: auto;
        background-color: #ffffff;
        border-radius: 5px;
        padding: 11px;
        display: inline-block;
    }
`;

export const ContainerTableSearh = styled.div`
    max-height: 50vh;
    overflow-y: scroll;
`;