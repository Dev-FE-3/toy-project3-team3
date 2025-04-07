import drop from "@/assets/images/drop.svg";
import menu from "@/assets/images/menu.svg";
import { useEffect, useRef, useState } from "react";
import styled from "@emotion/styled";

type DropdownVariant = "icon" | "text";

interface DropboxProps {
  variant: DropdownVariant;
  onSelect?: (selected: string) => void;
  iconSize?: number; // 기본 12, 필요시 지정
}

const Dropbox: React.FC<DropboxProps> = ({
  variant,
  onSelect,
  iconSize = 12,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const [defaultValue, setDefaultValue] = useState("최신순");

  const iconOptions = ["수정하기", "삭제하기"];
  const textOptions = ["최신순", "인기순"];
  const options = variant === "icon" ? iconOptions : textOptions;

  const handleToggle = () => setIsOpen((prev) => !prev);
  const handleSelect = (item: string) => {
    setDefaultValue(item);
    setIsOpen(false);
    onSelect?.(item);
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
      <DropdownToggle onClick={handleToggle} variant={variant}>
        {variant === "icon" ? (
          <img
            src={menu}
            alt="메뉴 드롭다운"
            width={iconSize}
            height={iconSize}
          />
        ) : (
          <>
            <span>{defaultValue}</span>
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
        <DropdownMenu>
          {options.map((option, index) => (
            <li key={index}>
              <DropdownOption
                isActive={defaultValue === option}
                variant={variant}
                onClick={() => handleSelect(option)}
              >
                {option}
              </DropdownOption>
            </li>
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
  width: ${({ variant }) => (variant === "text" ? "85px" : "90px")};
  height: ${({ variant, iconSize }) =>
    variant === "icon" ? `${iconSize}px` : "auto"};
`;

const DropdownToggle = styled.button<{ variant: string }>`
  display: flex;
  justify-content: space-between;
  width: 100%;
  align-items: center;
  gap: 4px;
  background: var(--background-color);
  border: ${({ variant }) =>
    variant === "text" ? "1px solid var(--disabled)" : "none"};
  border-radius: ${({ variant }) => (variant === "text" ? "10px" : "0")};
  padding: ${({ variant }) => (variant === "text" ? "6px 10px" : "0")};
  font-size: var(--font-size-primary);
  font-weight: 500;
  color: var(--text-secondary);
  cursor: pointer;
`;

const DropdownMenu = styled.ul`
  position: absolute;
  width: 100%;
  top: 100%;
  left: 0;
  background: var(--background-color);
  border: 1px solid var(--disabled);
  border-radius: 10px;
  padding: 6px 0;
  z-index: 10;
`;

const DropdownOption = styled.button<{ isActive: boolean; variant: string }>`
  background: none;
  border: none;
  padding: 8px 0;
  width: 100%;
  text-align: center;
  font-size: var(--font-size-primary);
  cursor: pointer;
  /* color: ${({ isActive }) =>
    isActive ? "var(--primary)" : "var(--text-secondary)"}; */
  color: ${({ isActive, variant }) =>
    variant === "text" && isActive
      ? "var(--primary)"
      : "var(--text-secondary)"};
  font-weight: 500;

  &:hover {
    background-color: #f5f5f5;
  }
`;