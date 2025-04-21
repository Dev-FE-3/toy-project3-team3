import styled from "@emotion/styled";

export const TabMenu = styled.div`
  width: 600px;
  height: 60px;
  display: flex;
  font-size: var(--font-size-large);
`;

export const TabButton = styled.div<{ isActive: boolean }>`
  width: 300px;
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  font-weight: ${(props) => (props.isActive ? 700 : 400)};
  border-bottom: ${(props) =>
    props.isActive
      ? `3px solid var(--primary)`
      : `3px solid var(--disabled-2)`};
  color: ${(props) =>
    props.isActive ? `var(--primary)` : `var(--text-primary)`};
  &:hover {
    background-color: var(--profile-background);
    transition: background-color 0.3s ease-in-out;
  }
`;
