import React from 'react';
import { TextInput } from '@contentful/f36-components';
import { MagnifyingGlassIcon } from "@contentful/f36-icons-alpha"
import './F36SearchInput.css';

interface F36SearchInputProps {
    placeholder?: string;
    value?: string;
    label?: string;
    isRequired?: boolean;
    isDisabled?: boolean;
    isInvalid?: boolean;
    size?: 'small' | 'medium';
    // Whether to render the native HTML search input (adds clear button on some platforms)
    type?: 'search' | 'text';
    showCameraIcon?: boolean;
}

export const F36SearchInput: React.FC<F36SearchInputProps> = ({
    placeholder = 'Was suchst du?',
    value = '',
    label,
    isRequired = false,
    isDisabled = false,
    isInvalid = false,
    size = 'medium',
    type = 'search',
    showCameraIcon = false,
    ...rest
}) => {

    return (
        <div
            className={`f36-search-input-wrapper size-${size} `}
            data-size={size}

        >
            <TextInput
                placeholder={placeholder}
                defaultValue={value}
                aria-label={label || placeholder}
                isRequired={isRequired}
                isDisabled={isDisabled}
                isInvalid={isInvalid}
                size={size}
                type={type}
                {...rest}
                className="f36-search-input-element"
            />
            {showCameraIcon && (
                <span className="f36-search-input-icon right" aria-hidden>

                    <MagnifyingGlassIcon
                        size='medium'
                        color='black' />
                </span>
            )}
        </div>
    );
};

export default F36SearchInput;
