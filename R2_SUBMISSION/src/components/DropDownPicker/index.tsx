import { wrap } from "module";
import { Picker, PickerSelect } from "./DropDownStyles";
import React, { useEffect, useState } from "react";

type DropDownPickerProps = {
    title: string,
    options: { label: string, value: any }[],
    selectedValue?: any,
    onChange: (event: React.ChangeEvent<HTMLSelectElement>) => void
};


function DropDownPicker({ title, options, selectedValue, onChange }: DropDownPickerProps): JSX.Element {

    // Will maintain local state as well and use updated parent state
    const [selected, setSelected] = useState(selectedValue);
    useEffect(() => setSelected(selectedValue), [selectedValue]);

    return (
        <Picker>
            <div style={{ width: "400px", overflowWrap: "break-word" }}>
                {title}
            </div>
            <PickerSelect
                value={selected}
                onChange={
                    (event) => {
                        setSelected(event.target.value);
                        onChange(event);
                    }
                }
            >{
                    options.map(option => {
                        return <option key={option.label}
                            value={option.value}>
                            {option.label}
                        </option>
                    })
                }
            </PickerSelect>
        </Picker>
    );
}

export default DropDownPicker;