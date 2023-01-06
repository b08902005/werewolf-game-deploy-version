import styled from "styled-components";
// import { UserOutlined } from "@ant-design/icons";
import { Input } from "antd";
const Wrapper = styled.div`
    opacity: 100%;
`;

const LogIn = ({ myName, setMyName, onLogin }) => {
    return (
        <Wrapper>
            <Input.Search
                size="large"
                style={{ width: 300, margin: 50 }}
                // prefix={<UserOutlined />}
                placeholder="Enter your display name"
                onChange={(e) => setMyName(e.target.value)}
                value={myName}
                enterButton="Play"
                onSearch={(name) => onLogin(name)}
            />
        </Wrapper>
    );
}

export default LogIn;