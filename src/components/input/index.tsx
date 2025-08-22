import React, { ReactElement, useState } from "react";

import { Eye, EyeOff } from "lucide-react";
import { FieldError, UseFormRegisterReturn } from "react-hook-form";

interface InputProps {
    register?: UseFormRegisterReturn;
    type: string;
    accept?: string;
    title?: string;
    min?: string;
    placeholder?: string;
    defaultValue?: string | number;
    className?: string;
    id?: string;
    autoFocus?: boolean;
    disabled?: boolean;
    showPasswordToggle?: boolean;
    postfix?: ReactElement;
    error?: FieldError;
    onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

const Input: React.FC<InputProps> = ({
    register,
    type,
    title,
    min,
    placeholder,
    defaultValue,
    className,
    id,
    postfix,
    showPasswordToggle = false,
    autoFocus = false,
    disabled = false,
    error,
    accept
}) => {
    const [showPassword, setShowPassword] = useState(false);

    return (
        <>
            <span>
                <input
                    {...register}
                    type={showPassword ? "text" : type}
                    title={title}
                    accept={accept}
                    id={id}
                    className={className}
                    defaultValue={defaultValue}
                    placeholder={placeholder}
                    min={min}
                    autoFocus={autoFocus}
                    disabled={disabled}
                />
                {postfix}
                {showPasswordToggle && type == "password" && (
                    <button type='button' className='input-password-eye' onClick={() => setShowPassword(!showPassword)}>
                        {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                )}
            </span>
            {error && (
                <span
                    style={{
                        color: "red",
                        fontSize: "12px"
                    }}
                >
                    <i className='far fa-circle-exclamation'></i> {error.message}
                </span>
            )}
        </>
    );
};

export default Input;
