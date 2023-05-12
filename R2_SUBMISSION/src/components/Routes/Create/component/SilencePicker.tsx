import { InputField, InputMeta, InputView } from "../../../DropDownPicker/InputStyles";
import React, { useState } from "react";
import DeleteIcon from '@mui/icons-material/Delete';
import { IconDelete } from "../CreateTemplate/CreateTemplateStyle";

type SilencePickerProps = {
    selectedSilenceDuration: number,
    defaultSilenceDuration: number,
    onSilenceDurationChange: (event: React.ChangeEvent<HTMLInputElement>) => void,
}

export const SilencePicker = (
    { selectedSilenceDuration, defaultSilenceDuration, onSilenceDurationChange }: SilencePickerProps
) => {
    const [value, setValue] = useState(defaultSilenceDuration)

    return <InputView>
        <div style={{ width: "400px", overflowWrap: "break-word" }}>
            {"Silence Duration"}
        </div>
        <InputField
            value={value}
            placeholder={"Set Silence Duration"}
            onChange={(event) => {
                setValue(parseFloat(event.target.value) || 0)
                onSilenceDurationChange(event)
            }}
        />
        <InputMeta>
            {"Template Default: " + defaultSilenceDuration}
        </InputMeta>
    </InputView>
}