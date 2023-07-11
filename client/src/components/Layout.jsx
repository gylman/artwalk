import { Frame } from "./Frame";

export function Layout({ children, ...props }) {
  return (
    <Frame
      wrapperStyle={{
        backgroundColor: "#E8F5FF",
      }}
      {...props}
    >
      {children}
    </Frame>
  );
}
