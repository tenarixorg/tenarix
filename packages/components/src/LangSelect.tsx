import React from "react";
import Select from "react-dropdown-select";
import styled from "styled-components";
import { SelectItem } from "types";
import { SearchBox } from "./SearchBox";
import { Check } from "./Elements";
import { Theme } from "utils";

interface Props {
  values: SelectItem[];
  options: SelectItem[];
  colors: Theme["dark"];
  onChange: (values: string[] | object) => void;
  title: string;
  placeholder: string;
}

const StyledSelect = styled(Select)<{ borderColor: string }>`
  .react-dropdown-select-dropdown {
    overflow: initial;
    width: 200px;
    border: none;
    outline: none;
  }

  .react-dropdown-select-dropdown-handle {
    svg {
      fill: ${(p) => p.borderColor};
    }
  }

  border: none !important;
  outline: none !important;
  box-shadow: none !important;

  &::before {
    position: absolute;
    content: "";
    bottom: 5%;
    width: 100%;
    height: 1px;
    background-color: ${(p) => p.borderColor};
    opacity: 0;
    transition: opacity 400ms ease-in-out;
  }

  &[aria-expanded="true"] {
    &::before {
      opacity: 1;
    }
  }
`;

export const LangSelect: React.FC<Props> = (props) => {
  return (
    <div style={{ margin: "0px 20px" }}>
      <StyledSelect
        borderColor={props.colors.primary}
        multi
        searchable
        values={props.values}
        options={props.options}
        onChange={(values) => {
          props.onChange(values);
        }}
        contentRenderer={() => (
          <div style={{ cursor: "pointer", color: props.colors.fontPrimary }}>
            {props.title}
          </div>
        )}
        dropdownRenderer={({
          state: { search },
          methods: { setSearch, addItem },
        }) => {
          const regexp = new RegExp(search, "i");
          return (
            <Container
              borderColor={props.colors.navbar.background}
              scrollColor={props.colors.primary}
              bg={props.colors.background1}
            >
              <SearchAndToggle>
                <SearchBox
                  m="10px 0px 5px 0px"
                  colors={props.colors}
                  value={search}
                  onChange={setSearch}
                  placeholder={props.placeholder}
                />
              </SearchAndToggle>
              <Items>
                {props.options
                  .filter((item) => regexp.test(item.label))
                  .map((option) => (
                    <Item key={option.value}>
                      <Check
                        style={{ cursor: "pointer" }}
                        type="checkbox"
                        bg={props.colors.navbar.background}
                        activeColor={props.colors.primary}
                        inactiveColor={props.colors.secondary}
                        onChange={() => addItem(option)}
                        checked={
                          !!props.values.find((u) => u.value === option.value)
                        }
                      />
                      <ItemLabel color={props.colors.fontPrimary}>
                        {option.label}
                      </ItemLabel>
                    </Item>
                  ))}
              </Items>
            </Container>
          );
        }}
      />
    </div>
  );
};

const Container = styled.div<{
  scrollColor: string;
  bg: string;
  borderColor: string;
}>`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  background-color: ${(p) => p.bg};
  align-items: flex-start;
  overflow-y: scroll;
  scroll-behavior: smooth;
  border: 1px solid ${(p) => p.borderColor};
  width: 100%;
  ::-webkit-scrollbar {
    width: 4px;
    height: 0px;
  }

  ::-webkit-scrollbar-track {
    background: transparent;
  }

  ::-webkit-scrollbar-thumb {
    background: ${(p) => p.scrollColor};
    border-radius: 30px;
  }

  ::-webkit-scrollbar-thumb:hover {
    background: ${(p) => p.scrollColor};
  }
`;

const SearchAndToggle = styled.div`
  display: flex;
  flex-direction: column;
`;

const Items = styled.div`
  min-height: 10px;
  max-height: 200px;
`;

const Item = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
  margin: 0px 5px;
  cursor: default;
`;

const ItemLabel = styled.div<{ color: string }>`
  margin: 5px 10px;
  color: ${(p) => p.color};
`;
