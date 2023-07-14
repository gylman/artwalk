/**
 * The outermost wrapper component
 */

export function Frame({ children, wrapperStyle, ...props }) {
  return (
    <div
      style={{
        height: "100%",
        ...wrapperStyle,
      }}
    >
      <div
        {...props}
        style={{
          height: "100%",
          ...props.style,
        }}
      >
        {children}
      </div>
    </div>
  );
}
