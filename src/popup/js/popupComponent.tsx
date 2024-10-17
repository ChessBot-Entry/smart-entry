import { ReactElement, useState } from "react";
import { ConfigName, ConfigUIRealType, ConfigUIType } from "src/common/config";
import styled from 'styled-components';
import { sendMessage } from 'src/common/utils/utils'

interface PopupComponentArg<T extends ConfigUIType> {
    id: ConfigName
    defaultValue: ConfigUIRealType[T]
}

type PopupComponentType<T extends ConfigUIType> = ReactElement<PopupComponentArg<T>>


const ToggleContainer = styled.div`
position: relative;
padding: 5px 0px 5px 0px;
`;

const ToggleBackground = styled.span`
position: absolute;
cursor: pointer;
width: 40px;
height: 20px;
border-radius: 20px;
right: 0%;
bottom: 48%;
background-color: #5F5F5F;
transition: background-color 0.3s ease;

&.checked {
  background-color: #FE5448;
}
`;

const ToggleCircle = styled.span`
position: absolute;
width: 13px;
height: 13px;
border-radius: 20px;
right: 57%;
bottom: 17%;
background-color: rgb(255, 255, 255);
transition: transform 0.3s ease;
transform: translateX(0px);

&.checked {
  transform: translateX(19px);
}
`

export function ConfigToggleButton({id, defaultValue}: PopupComponentArg<"boolean">): PopupComponentType<"boolean"> {
    const [checked, setChecked] = useState(defaultValue)

    const onClick = () => {
        setChecked(!checked)
        sendMessage({[id]: !checked})
        chrome.storage.sync.set({[id]: !checked})
    }

    return (
    <ToggleContainer>
        <ToggleBackground onClick={onClick} className={checked ? "checked" : ""} >
            <ToggleCircle className={checked ? "checked" : ""} />
        </ToggleBackground>
    </ToggleContainer>
    )
}