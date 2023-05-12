import DropDownPicker from "../../../DropDownPicker";
import {OutlinedButton, OutlinedButtonLight} from "../CreateStyles";
import styled from "styled-components";

type SnippetGroupPickerProps = {
    title: string,
    avlblVariants: { label: string, value: any }[],
    selectedVariant?: any,
    onVariantChange: (event: React.ChangeEvent<HTMLSelectElement>) => void
}

function SnippetGroupPicker({title = "Snippet Group", avlblVariants, selectedVariant, onVariantChange}: SnippetGroupPickerProps): JSX.Element {

    return <SnippetView>
        <DropDownPicker
            title={title}
            options={avlblVariants}
            selectedValue={selectedVariant}
            onChange={onVariantChange}
        />
    </SnippetView>
}

const SnippetView = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
`;

export default SnippetGroupPicker;