import styled from "styled-components";

export const BtnContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
  align-items: center;
  width: 100%;
`;

export const ThemeContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  width: 100%;
`;

export const Options = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  margin: 10px 0px;
`;

export const ColorOptContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: fit-content;
`;

export const ColorPicker = styled.input`
  border: none;
  outline: none;
  appearance: none;
  width: 22px;
  height: 24px;
  cursor: pointer;
  background-color: transparent;

  &::-webkit-color-swatch {
    border: 1px solid black;
    appearance: none;
  }
`;

export const ColorText = styled.input<{ color: string }>`
  border: none;
  outline: none;
  appearance: none;
  background-color: transparent;
  text-transform: uppercase;
  color: ${(p) => p.color};
  width: 4rem;
`;

export const RadioOpt = styled.input<{ bg: string; color: string }>`
  position: relative;
  border: 1px solid black;
  outline: none;
  appearance: none;
  background-color: ${(p) => p.bg};
  cursor: pointer;
  width: 16px;
  height: 16px;
  border-radius: 50%;
  &::after {
    position: absolute;
    content: "";
    top: calc(50% - 5px);
    left: calc(50% - 5px);
    width: 10px;
    height: 10px;
    border-radius: 50%;
  }
  &:checked {
    &::after {
      background-color: ${(p) => p.color};
    }
  }
`;

export const Label = styled.label<{
  color: string;
  fs: string;
  bold?: boolean;
  margin?: string;
}>`
  cursor: pointer;
  color: ${(p) => p.color};
  font-size: ${(p) => p.fs};
  font-weight: ${(p) => (p.bold ? "bold" : "normal")};
  margin: ${(p) => p.margin || "0px"};
`;

export const RadioContainer = styled.div<{ bg: string }>`
  display: flex;
  justify-content: flex-start;
  align-items: center;
  margin: 5px 0px;
  cursor: pointer;
  background-color: ${(p) => p.bg};
  padding: 5px 0px 5px 10px;
  border-radius: 4px;
  box-shadow: 4px 4px 9px -5px #000000;
  width: 60vw;
  transition: transform 500ms ease-in-out;

  &:hover {
    transform: translate3D(-1px, -1px, 0px);
  }
`;

export const ThemeTogleContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 100%;
  margin: 30px 0px 10px 0px;
`;

export const Btn = styled.button<{
  bg: string;
  width: string;
  heigth: string;
  margin?: string;
}>`
  border: none;
  outline: none;
  background-color: ${(p) => p.bg};
  border-radius: 4px;
  width: ${(p) => p.width};
  height: ${(p) => p.heigth};
  margin: ${(p) => p.margin || "0px"};
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: center;
  &:hover {
    background-color: ${(p) => p.bg + "aa"};
  }
`;

export const ModalContainer = styled.div<{ show?: boolean }>`
  position: sticky;
  width: 100%;
  height: 100%;
  top: 50%;
  left: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: ${(p) => (p.show ? "200" : "-1")};
  background-color: transparent;
  opacity: ${(p) => (p.show ? "1" : "0")};
  transition: opacity 200ms ease-in-out;
`;

export const FileCard = styled.form<{ bg: string }>`
  display: flex;
  margin-top: -20vh;
  justify-content: center;
  align-items: center;
  border-radius: 4px;
  width: 50vw;
  height: 20vh;
  padding: 0px 10px;
  background-color: ${(p) => p.bg};
  backdrop-filter: blur(5px);
  box-shadow: 4px 4px 9px -5px #000000;
  border: 1px solid black;
`;

export const FilenameInput = styled.input<{
  borderColor: string;
  color: string;
}>`
  width: 100%;
  border: none;
  outline: none;
  border-bottom: 1px solid ${(p) => p.borderColor};
  color: ${(p) => p.color};
  background-color: transparent;
  font-size: 16px;
  text-align: center;
`;
