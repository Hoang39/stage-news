"use client";

import { useEffect, useRef, useState } from "react";

import Link from "next/link";

import "./dropdown.css";

interface DropdownItem {
    label: string;
    href?: string;
    onClick?: () => void;
    icon?: React.ReactNode;
}

interface DropdownProps {
    trigger: React.ReactNode;
    items: DropdownItem[];
    className?: string;
    align?: "left" | "right" | "center";
    width?: string;
}

const Dropdown: React.FC<DropdownProps> = ({ trigger, items, className = "", align = "left", width = "auto" }) => {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const contentRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleToggle = () => {
        setIsOpen(!isOpen);
    };

    const handleItemClick = (item: DropdownItem) => {
        if (item.onClick) {
            item.onClick();
        }
        setIsOpen(false);
    };

    const getAlignmentClass = () => {
        switch (align) {
            case "right":
                return "right-0";
            case "center":
                return "left-1/2 transform -translate-x-1/2";
            default:
                return "left-0";
        }
    };

    return (
        <div ref={dropdownRef} className={`dropdown-container ${className}`}>
            <div onClick={handleToggle} className='dropdown-trigger'>
                {trigger}
            </div>

            <div
                ref={contentRef}
                className={`dropdown-content ${getAlignmentClass() === "right-0" ? "align-right" : getAlignmentClass() === "left-1/2 transform -translate-x-1/2" ? "align-center" : ""} ${
                    isOpen ? "show" : "hide"
                }`}
                style={{ width }}
            >
                <div className='dropdown-menu'>
                    {items.map((item, index) => (
                        <div key={index} className='dropdown-item'>
                            {item.href ? (
                                <Link href={item.href} onClick={() => handleItemClick(item)}>
                                    {item.icon && <span className='icon'>{item.icon}</span>}
                                    {item.label}
                                </Link>
                            ) : (
                                <button onClick={() => handleItemClick(item)}>
                                    {item.icon && <span className='icon'>{item.icon}</span>}
                                    {item.label}
                                </button>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Dropdown;
