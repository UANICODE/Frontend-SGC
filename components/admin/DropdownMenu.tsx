
"use client";

import { useState, useRef, useEffect } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";

interface DropdownItem {
    label: string;
    icon?: React.ReactNode;
    onClick: () => void;
    disabled?: boolean;
    variant?: 'default' | 'danger' | 'success' | 'warning';
}

interface DropdownMenuProps {
    label: string;
    icon?: React.ReactNode;
    items: DropdownItem[];
    variant?: 'primary' | 'secondary' | 'ghost';
}

export function DropdownMenu({ label, icon, items, variant = 'primary' }: DropdownMenuProps) {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const variants = {
        primary: 'bg-gradient-to-r from-primary to-secondary text-white hover:shadow-lg',
        secondary: 'bg-gray-100 text-gray-700 hover:bg-gray-200',
        ghost: 'bg-transparent text-gray-600 hover:bg-gray-100',
    };

    const getItemStyles = (variant?: string) => {
        switch (variant) {
            case 'danger': return 'text-red-600 hover:bg-red-50';
            case 'success': return 'text-green-600 hover:bg-green-50';
            case 'warning': return 'text-yellow-600 hover:bg-yellow-50';
            default: return 'text-gray-700 hover:bg-gray-100';
        }
    };

    return (
        <div className="relative" ref={dropdownRef}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className={`px-4 py-2.5 rounded-xl font-medium transition-all duration-300 flex items-center gap-2 ${
                    variants[variant]
                } ${isOpen ? 'scale-95' : ''}`}
            >
                {icon}
                {label}
                {isOpen ? (
                    <ChevronUp className="w-4 h-4" />
                ) : (
                    <ChevronDown className="w-4 h-4" />
                )}
            </button>

            {isOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-xl border border-gray-100 overflow-hidden z-50 animate-slideDown">
                    <div className="py-1">
                        {items.map((item, index) => (
                            <button
                                key={index}
                                onClick={() => {
                                    item.onClick();
                                    setIsOpen(false);
                                }}
                                disabled={item.disabled}
                                className={`w-full px-4 py-2.5 text-sm flex items-center gap-3 transition-colors duration-200 ${
                                    getItemStyles(item.variant)
                                } ${item.disabled ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-50'}`}
                            >
                                {item.icon && <span className="w-5 h-5 flex items-center justify-center">{item.icon}</span>}
                                {item.label}
                            </button>
                        ))}
                    </div>
                </div>
            )}

            <style jsx>{`
                @keyframes slideDown {
                    from {
                        opacity: 0;
                        transform: translateY(-10px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }
                .animate-slideDown {
                    animation: slideDown 0.2s ease-out;
                }
            `}</style>
        </div>
    );
}