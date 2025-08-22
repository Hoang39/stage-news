"use client";

import { useEffect, useRef, useState } from "react";

import { ChevronDown } from "lucide-react";

type CustomSelectProps<T> = {
    options: T[];
    value: T;
    onChange: (value: T) => void;
    getLabel?: (option: T) => string;
};

const CustomSelect = <T,>({ options, value, onChange, getLabel }: CustomSelectProps<T>) => {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    return (
        <div className='custom-select' ref={dropdownRef}>
            <div className='select-toggle' onClick={() => setIsOpen(!isOpen)}>
                {getLabel ? getLabel(value) : (value as string)}
                <ChevronDown size={12} />
            </div>

            {isOpen && (
                <div className='select-dropdown'>
                    {options.map((option, index) => (
                        <div
                            key={index}
                            className={`select-item ${option === value ? "active" : ""}`}
                            onClick={() => {
                                onChange(option);
                                setIsOpen(false);
                            }}
                        >
                            {getLabel ? getLabel(option) : (option as string)}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default CustomSelect;
