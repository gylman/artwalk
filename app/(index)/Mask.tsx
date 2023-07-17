import type { HTMLAttributes } from "react";

export default function Mask(props: HTMLAttributes<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      xmlnsXlink="http://www.w3.org/1999/xlink"
      className={`isolate ${props.className}`}
      viewBox="0 0 393 568"
    >
      <defs>
        <clipPath id="_clipPath_VDY2icBrpLbMfH4W7uGfAQ4IZ0PASVLF">
          <rect width="393" height="568" />
        </clipPath>
      </defs>
      <g clipPath="url(#_clipPath_VDY2icBrpLbMfH4W7uGfAQ4IZ0PASVLF)">
        <path
          d=" M 150.361 0 L 0 0 L 0 117.838 C 2.488 115.362 5.107 112.921 7.862 110.52 C 46.785 76.602 93.233 70.809 132.12 76.949 C 131.16 71.549 130.542 65.787 130.511 59.834 C 130.388 35.699 138.707 15.731 150.361 0 Z  M 393 360.963 L 393 568 L 204.078 568 C 224.938 567.95 245.905 561.332 263.212 547.817 C 302.763 516.93 308.22 461.718 275.402 424.496 C 254.924 401.271 237.283 378.5 218.216 353.718 C 234.803 362.917 253.818 370.718 275.518 375.523 C 287.397 378.153 305.021 381.04 324.711 380.392 C 340.669 379.866 367.367 376.716 393 360.963 Z  M 203.603 568 L 0 568 L 0 367.874 C 10.174 383.222 20.644 396.589 29.728 407.965 C 38.976 419.547 48.965 432.505 59.474 446.138 C 82.044 475.416 107.012 507.803 132.177 536.345 C 150.525 557.155 176.953 567.936 203.603 568 Z "
          fillRule="evenodd"
          fill="currentColor"
        />
      </g>
    </svg>
  );
}
