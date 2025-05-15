import { useState, useRef, useEffect, useCallback } from "react";
import { ImCross } from "react-icons/im";

const CustomSelectDropDown = ({
    options = [],
    selected,
    setSelected,
    valueField,
    labelField,
    placeholder,
}) => {
    const [isOpen, setIsOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const dropdownRef = useRef(null);

    const selectedOption = options.find(o => o[valueField] === selected);

    const filteredOptions = options.filter(o =>
        o[labelField].toLowerCase().includes(searchTerm.toLowerCase())
    );

    const closeDropdown = useCallback(() => {
        setIsOpen(false);
        setSearchTerm("");
    }, []);

    const handleClickOutside = useCallback((e) => {
        if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
            closeDropdown();
        }
    }, [closeDropdown]);

    useEffect(() => {
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [handleClickOutside]);

    const handleSelect = useCallback((value) => {
        setSelected(value);
        closeDropdown();
    }, [setSelected, closeDropdown]);

    const handleClear = useCallback((e) => {
        e.stopPropagation();
        setSelected("");
        closeDropdown();
    }, [setSelected, closeDropdown]);


    console.log(selected)
    return (
        <div ref={dropdownRef} className="relative w-full">
            <button
                type="button"
                onClick={() => setIsOpen(prev => !prev)}
                className="w-full h-12 px-3 text-left bg-white border border-gray-300 rounded shadow-sm focus:outline-none flex items-center justify-between"
                aria-haspopup="listbox"
                aria-expanded={isOpen}
            >
                <span className="truncate">
                    {selectedOption ? selectedOption[labelField] : placeholder}
                </span>
                {selected !== '' && (
                    <div
                        className="ml-2 w-4 h-4 flex items-center justify-center text-red-600 cursor-pointer"
                        onClick={handleClear}
                        title="Clear selection"
                    >
                        <ImCross size={12} />
                    </div>
                )}
            </button>

            {isOpen && (

                <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded shadow-lg max-h-72 overflow-y-auto">
                    <input
                        type="text"
                        value={searchTerm}
                        onChange={e => setSearchTerm(e.target.value)}
                        className="w-full px-3 py-2 border-b border-gray-200 focus:outline-none"
                        placeholder="Search..."
                    />
                    <ul role="listbox" className="max-h-60 overflow-auto">
                        {filteredOptions.length > 0 ? (
                            filteredOptions.map(option => (
                                <li
                                    key={option[valueField]}
                                    role="option"
                                    className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                                    onClick={() => handleSelect(option[valueField])}
                                >
                                    {option[labelField]}
                                </li>
                            ))
                        ) : (
                            <li className="px-4 py-2 text-gray-500 italic">No results found</li>
                        )}
                    </ul>
                </div>


            )}
        </div>
    );
};

export default CustomSelectDropDown;
