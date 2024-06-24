import styled from 'styled-components';

export const StyleMenuMiniOption = styled.div`
    position: fixed;
    height: 100vh;
    width: 100vw;
    background-color: #1677ff33;
    z-index: 10000;
    overflow-y: hidden;
`;

export const OptionMenu = styled.p`
    width: 100%;
    text-align: start;
    font-size: 18px;
`;

export const CloseMenuOption = styled.div`
    display: inline-flex;
    font-size: 15px;
    > p {
        margin-right: 10px;
    }
`;