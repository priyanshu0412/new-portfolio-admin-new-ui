"use client"
import React, { useState } from 'react'

// -------------------------------

const TagInput = ({ label, placeholder, name, register, errors, defaultValue = "" }) => {

    const [tags, setTags] = useState(
        defaultValue ? defaultValue.split(",").map(i => i.trim()) : []
    );
    const [input, setInput] = useState("");

    const handleKeyDown = (e) => {
        if ((e.key === "Enter" || e.key === ",") && input.trim() !== "") {
            e.preventDefault();
            setTags([...tags, input.trim()]);
            setInput("");
        }
    };

    const removeTag = (i) => {
        const newTags = tags.filter((_, idx) => idx !== i);
        setTags(newTags);
    };

    return (
        <>
            <div className="flex flex-col gap-y-2 w-full">
                <label className="text-sm font-semibold">{label} *</label>

                {/* Hidden actual input for RHF */}
                <input
                    type="hidden"
                    value={tags.join(",")}
                    {...register(name, { required: `${label} is required` })}
                />

                <div className="w-full px-3 py-2.5 rounded-lg border border-gray-300 bg-white text-gray-800 shadow-sm flex flex-wrap gap-2 cursor-text">
                    {tags.map((tag, index) => (
                        <div
                            key={index}
                            className="flex items-center bg-gray-200 text-gray-700 px-2 py-1 rounded-md text-xs"
                        >
                            {tag}
                            <span
                                className="ml-2 cursor-pointer text-red-500 font-bold"
                                onClick={() => removeTag(index)}
                            >
                                ×
                            </span>
                        </div>
                    ))}

                    <input
                        type="text"
                        value={input}
                        placeholder={placeholder}
                        className="outline-none flex-1 min-w-[120px]"
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={handleKeyDown}
                    />
                </div>

                {errors[name] && <p className="text-xs text-red-600">{errors[name].message}</p>}
            </div>
        </>
    )
}

export default TagInput
