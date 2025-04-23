import drop from "@/assets/images/drop.svg";
import menu from "@/assets/images/menu.svg";
import { useEffect, useRef, useState } from "react";
import styled from "@emotion/styled";

type DropdownVariant = "icon" | "text";

interface OptionItem {
  value: number;
  label: string;
}

interface CommonProps {
  variant: DropdownVariant;
  iconSize?: number;
}

interface TextDropdownProps extends CommonProps {
  variant: "text";
  value: number;
  onChange: (selected: number) => void;
}

interface IconDropdownProps extends CommonProps {
  variant: "icon";
  onChange?: (selected: number) => void;
  value?: never;
}

type DropboxProps = TextDropdownProps | IconDropdownProps;

const Dropbox = ({ variant, onChange, iconSize = 14, value }: DropboxProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // value + label로 구분된 옵션 배열
  const iconOptions: OptionItem[] = [
    { value: 1, label: "수정하기" },
    { value: 2, label: "삭제하기" },
  ];

  const textOptions: OptionItem[] = [
    { value: 1, label: "최신순" },
    { value: 2, label: "인기순" },
  ];

  const options = variant === "icon" ? iconOptions : textOptions;

  // 선택된 label 보여주기
  const selectedLabel =
    variant === "text"
      ? (options.find((opt) => opt.value === value)?.label ?? "")
      : "";

  const handleToggle = () => setIsOpen((prev) => !prev);

  const handleSelect = (item: number) => {
    setIsOpen(false);
    onChange?.(item);
  };

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <DropdownWrapper ref={containerRef} variant={variant} iconSize={iconSize}>
      <DropdownToggle
        type="button"
        onClick={handleToggle}
        variant={variant}
        iconSize={iconSize}
      >
        {variant === "icon" ? (
          <img
            src={menu}
            alt="메뉴 드롭다운"
            width={iconSize}
            height={iconSize}
          />
        ) : (
          <>
            <span>{selectedLabel}</span>
            <img
              src={drop}
              alt="드롭다운 아이콘"
              width={iconSize}
              height={iconSize}
            />
          </>
        )}
      </DropdownToggle>

      {isOpen && (
        <DropdownMenu variant={variant}>
          {options.map((option) => (
            <DropdownOption
              type="button"
              key={option.value}
              isActive={variant === "text" && value === option.value}
              variant={variant}
              onClick={() => handleSelect(option.value)}
            >
              {option.label}
            </DropdownOption>
          ))}
        </DropdownMenu>
      )}
    </DropdownWrapper>
  );
};

export default Dropbox;

const DropdownWrapper = styled.div<{ variant: string; iconSize: number }>`
  position: relative;
  display: inline-block;
  height: ${({ variant, iconSize }) =>
    variant === "icon" ? `${iconSize}px` : "auto"};
`;

const DropdownToggle = styled.button<{ variant: string; iconSize: number }>`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: ${({ variant }) => (variant === "text" ? "85px" : "auto")};
  height: ${({ variant, iconSize }) =>
    variant === "icon" ? `${iconSize}px` : "auto"};
  gap: 4px;
  background: ${({ variant }) =>
    variant === "text" ? "var(--background-color)" : "none"};
  border: ${({ variant }) =>
    variant === "text" ? "1px solid var(--disabled)" : "none"};
  border-radius: ${({ variant }) => (variant === "text" ? "10px" : "0")};
  padding: ${({ variant }) => (variant === "text" ? "6px 10px" : "0")};
  font-size: var(--font-size-primary);
  font-weight: 500;
  color: var(--text-secondary);
  cursor: pointer;
`;

const DropdownMenu = styled.div<{ variant: string }>`
  position: absolute;
  display: flex;
  flex-direction: column;
  width: ${({ variant }) => (variant === "text" ? "85px" : "90px")};
  right: 0;
  background: var(--background-color);
  border: 1px solid var(--disabled);
  border-radius: 10px;
  z-index: 10;
`;

const DropdownOption = styled.button<{ isActive: boolean; variant: string }>`
  background: none;
  border: none;
  padding: 8px 0;
  text-align: center;
  font-size: var(--font-size-primary);
  cursor: pointer;
  color: ${({ isActive, variant }) =>
    variant === "text" && isActive
      ? "var(--primary)"
      : "var(--text-secondary)"};
  font-weight: 500;

  &:hover {
    background-color: #f5f5f5;
  }

  &:first-of-type {
    border-top-left-radius: 10px;
    border-top-right-radius: 10px;
  }

  &:last-of-type {
    border-bottom-left-radius: 10px;
    border-bottom-right-radius: 10px;
  }
`;
