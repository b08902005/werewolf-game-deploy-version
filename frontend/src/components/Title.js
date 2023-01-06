import styled from "styled-components";

const Wrapper = styled.div`
    opacity: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    h1 {
        margin: 0;
        margin-right: 20px;
        font-size: 5vw;
        font-family: 'Averia Libre', cursive;
        color: white;
    }
`

const Title = () => (
    <Wrapper><h1>The Werewolves of Millers Hollow</h1></Wrapper>
);
export default Title;