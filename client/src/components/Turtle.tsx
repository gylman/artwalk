import type { CSSProperties } from "react";

export function Turtle({ style }: { style: CSSProperties }) {
  return (
    <svg
      style={style}
      width="268"
      height="171"
      viewBox="0 0 268 171"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M162.981 23.2848C159.627 13.9732 145.54 14.6383 150.236 6.65737C154.932 -1.32356 196.263 9.31818 189.814 29.9356C183.364 50.5529 120.05 11.9789 77.1181 27.9408C34.1864 43.9026 24.0446 80.4616 18.087 87.1322C12.1293 93.8028 4.0031 90.458 4 97.1083C3.9969 103.759 15.4915 94.8485 18.087 99.7686C20.6658 104.657 43.5803 107.085 32.1739 109.745C20.7676 112.405 2.65576 142.333 22.7826 150.314C42.9095 158.296 44.2459 118.39 54.3106 117.061C59.5529 116.368 117.964 129.404 150.236 112.409C204.992 82.3498 185.017 62.8572 202.559 37.9165C220.101 12.9758 274.338 36.5901 262.264 54.5471C250.189 72.5042 215.978 49.8916 210.611 59.2027C205.245 68.5137 227.382 69.8439 234.09 97.1083C240.798 124.373 205.916 164.95 189.814 166.941C173.712 168.933 217.32 119.725 202.559 94.448"
        stroke="currentColor"
        strokeWidth="8"
      />
    </svg>
  );
}