import { ForwardedRef, forwardRef } from "react";

interface SelectProps {
  label: string;
  defaultValue?: string;
  children: { label: string; value: string | number }[];
}

const Select = forwardRef(function (
  { label, defaultValue, children }: SelectProps,
  ref: ForwardedRef<HTMLSelectElement>,
) {
  return (
    <label className="w-full h-12 [&:focus-within>span]:text-primary">
      <span className="block h-4 font-sans text-xs text-gray-500 transition-colors duration-150">
        {label}
      </span>
      <select
        ref={ref}
        name={label}
        defaultValue={defaultValue}
        className="w-full h-8 leading-8 transition-colors duration-150 bg-transparent border-b-2 border-gray-300 outline-none focus:border-primary font-display"
      >
        {children.map(({ label, value }) => (
          <option key={label} value={value}>
            {label}
          </option>
        ))}
      </select>
    </label>
  );
});
Select.displayName = "Select";

export default Select;
