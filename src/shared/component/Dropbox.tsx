import drop from "@/assets/images/drop.svg";
import menu from "@/assets/images/menu.svg";
import { useEffect, useRef, useState } from "react";

/** 드롭다운 종류 구분 */
type DropdownVariant = 'icon' | 'text';

interface DropboxProps {
  /** 드롭다운 종류: 아이콘 드롭다운 or 일반 텍스트 드롭다운 */
  variant: DropdownVariant;
  /** 항목 선택 시 실행될 콜백 */
  onSelect?: (selected: string) => void;
}

const Dropbox: React.FC<DropboxProps> = ({variant, onSelect}) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const [defaultValue, setDefaultValue] = useState('최신순')

  /** variant에 따라 고정된 옵션 분기 */
  const iconOptions = ['수정하기', '삭제하기'];
  const textOptions = ['최신순', '인기순'];

  /** 실제 렌더링할 옵션 */
  const options = variant === 'icon' ? iconOptions : textOptions;

  const handleToggle = () => {
    setIsOpen((prev) => ! prev);
  }

  const handleSelect = (item: string) => {
    setDefaultValue(item)
    setIsOpen(false);
    onSelect?.(item);
  }

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false)
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  return (
    <div>
      <div ref={containerRef}>
        <button onClick={handleToggle}>
          {variant === 'icon' ?
          (
            <img src={menu} alt="메뉴 드롭다운" style={{ width: 24, height: 24 }} />
          ) : (
            <button>
              {defaultValue}
              <img
              src={drop}
              alt="드롭다운 아이콘"
              style={{ width: 16, height: 16 }}
            />
            </button>
          )}
        </button>
        {isOpen && (<ul>
          {options.map((option, index) => (
            <li key={index}>
               <button onClick={() => handleSelect(option)}>{option}</button>
            </li>
          ))}
        </ul>)}
      </div>
    </div>
  )
}

export default Dropbox