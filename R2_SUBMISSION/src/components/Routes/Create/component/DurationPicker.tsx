import DropDownPicker from "../../../DropDownPicker";
import { OutlinedButton, OutlinedButtonLight } from "../CreateStyles";
import styled from "styled-components";
import { useEffect } from "react";


/*
* After template Selection, we have n Snippet Groups with n Audious.
* After the audios are there and final changes in CMS is made for variants of above snippet groups.
* We import all those (n) clips into DESCRIPT.
*
* And then De-Script transcribes them into a paragraph,
* where manual finishing touches can be made on WORD format and hence on export of MP3 wil done.
* */
type DurationPickerProps = {
    allDurations: { label: string, value: any }[],
    selectedDuration?: any,
    onDurationChange: (event: React.ChangeEvent<HTMLSelectElement>) => void
}

export const DurationPicker = ({ allDurations, selectedDuration, onDurationChange }: DurationPickerProps) => {
    return <DurationView>
        <DropDownPicker
            title={" Duration"}
            options={allDurations}
            selectedValue={selectedDuration}
            onChange={onDurationChange}
        />
        {/*<OutlinedButtonLight>
            Select
        </OutlinedButtonLight>*/}
    </DurationView>
}

const DurationView = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
`;