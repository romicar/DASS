import DropDownPicker from "../../../DropDownPicker";
import {OutlinedButton, OutlinedButtonLight} from "../CreateStyles";
import styled from "styled-components";
import {useEffect} from "react";


/*
* After template Selection, we have n Snippet Groups with n Audious.
* After the audios are there and final changes in CMS is made for variants of above snippet groups.
* We import all those (n) clips into DESCRIPT.
*
* And then De-Script transcribes them into a paragraph,
* where manual finishing touches can be made on WORD format and hence on export of MP3 wil done.
* */
type SilenceLevelPickerProps = {
    allSilenceLevels: { label: string, value: any }[],
    selectedSilenceLevel?: any,
    onSilenceLevelChange: (event: React.ChangeEvent<HTMLSelectElement>) => void
}

export const SilenceLevelPicker = ({allSilenceLevels, selectedSilenceLevel, onSilenceLevelChange}: SilenceLevelPickerProps) => {
    return <SilenceLevelView>
        <DropDownPicker
            title={"SilenceLevel"}
            options={allSilenceLevels}
            selectedValue={selectedSilenceLevel}
            onChange={onSilenceLevelChange}
        />
        {/*<OutlinedButtonLight>
            Select
        </OutlinedButtonLight>*/}
    </SilenceLevelView>
}

const SilenceLevelView = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
`;