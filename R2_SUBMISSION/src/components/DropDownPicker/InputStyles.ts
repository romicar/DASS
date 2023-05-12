import styled from "styled-components";

export const InputView = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  font-weight: 600;
  justify-content: start;
  font-size: 0.85rem;
`;


export const InputField = styled.input`
  min-width: 10rem;
  margin-left: 2rem;
  margin-right: 2rem;
  border-radius: 0.3rem;
  padding: 4px;
  border: 1px solid #3e3e3e;
  font-size: 0.85rem;
  color: #3e3e3e;
`;

export const InputMeta = styled.span`
  font-size: 0.75rem;
  color: #3e3e3e;
  margin-left: 0.5rem;
  font-style: italic;
  font-weight: normal;
`;