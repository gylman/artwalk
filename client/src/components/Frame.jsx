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
          // width: "min(100vw, 66.7vh)",
          // margin: "0 auto",
          ...props.style,
        }}
      >
        {children}
      </div>
    </div>
  );
}
