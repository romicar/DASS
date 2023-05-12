import styled from "styled-components";

export const Picker = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  font-weight: 600;
  // width:20%;
  justify-content: space-evenly;
  font-size: 0.85rem;
`

export const PickerSelect = styled.select`
  min-width: 20rem;
  margin-left: 2rem;
  margin-right: 2rem;
  border-radius: 0.3rem;
  padding: 6px;
  border: 1px solid #3e3e3e;
  font-size: 1rem;
  color: #3e3e3e;
`;