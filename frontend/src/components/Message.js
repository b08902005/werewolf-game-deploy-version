import { Tag } from "antd";
import styled from "styled-components";

const StyledMessage = styled.div`
    display: ${({ idx }) => (idx === -1 ? 'block' : 'flex')};
    flex-direction: ${({ isMe }) => (isMe ? 'row-reverse' : 'row')};
    align-items: center;
    margin: ${({ idx }) => (idx === -1 ? '8px 5px' : '8px 2px')};
    text-align: center;
    & p:first-child {
        margin: 0 5px;
    }

    & p:last-child {
        border-radius: 5px;
        margin: auto 0;
        padding: 2px 5px;
        background: #eee;
        color: gray;
    }
`

const Message = ({ isMe, message, idx }) => {
    return (
        <StyledMessage isMe={isMe} idx={idx}>
            {(idx === -1 || isMe) ? '' : <Tag color="blue">{idx}</Tag>}
            <p>{message}</p>
        </StyledMessage>
    );
};

export default Message;