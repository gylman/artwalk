import { animated, useSpring } from "@react-spring/web";
import { useGesture } from "@use-gesture/react";
import { useRef, useState } from "react";

export default function Gloss({ children, style }) {
  const [shadow, setShadow] = useState(false);
  const ref = useRef();
  const rect = useRef({});
  const prevAngleTurns = useRef([135, 0]);

  const [props, api] = useSpring(() => ({
    x: 0,
    y: 0,
    rotateX: 0,
    rotateY: 0,
    scale: 1,
  }));

  const rotX = (py) =>
    (py - props.y.get() - rect.current.y - rect.current.height / 2) / 8;
  const rotY = (px) =>
    -(px - props.x.get() - rect.current.x - rect.current.width / 2) / 8;

  const defaultBgShine = () => {
    prevAngleTurns.current[0] = 135;
    return `linear-gradient(${
      prevAngleTurns.current[0] - 360 * prevAngleTurns.current[1]
    }deg,rgba(255,255,255,0.25) 0%,rgba(255, 255, 255, 0) 60%)`;
  };

  const bgShine = (px, py) => {
    const cx = rect.current.x + rect.current.width / 2;
    const cy = rect.current.y + rect.current.height / 2;
    const arad = Math.atan2(py - cy, px - cx);
    const rawAngle = (arad * 180) / Math.PI - 90;
    const [prevAngle, prevTurns] = prevAngleTurns.current;

    const delta_a = rawAngle - prevAngle;
    const turns = Math.abs(delta_a) > 270
      ? prevTurns + Math.sign(delta_a)
      : prevTurns;
    const angle = rawAngle - 360 * turns;
    prevAngleTurns.current = [rawAngle, turns];

    const intensity = ((py - rect.current.y) / rect.current.height) * 0.6 + 0.2;

    return `linear-gradient(${angle}deg, rgba(255, 255, 255, ${intensity}) 0%, rgba(255, 255, 255, 0) 80%)`;
  };

  const [shine, apiShine] = useSpring(() => ({ background: defaultBgShine() }));

  const bind = useGesture(
    {
      onHover: ({ active }) => {
        apiShine.start({ background: defaultBgShine() });
        setShadow(active);
      },
      onDrag: ({ first, xy: [px, py] }) => {
        if (first) rect.current = ref.current.getBoundingClientRect();
        api.start({ rotateX: rotX(py), rotateY: rotY(px) });
        apiShine.start({ background: bgShine(px, py) });
      },
      onMove: ({ first, xy: [px, py] }) => {
        if (first) rect.current = ref.current.getBoundingClientRect();
        api.start({ rotateX: rotX(py), rotateY: rotY(px) });
        apiShine.start({ background: bgShine(px, py) });
      },
      onDragEnd: () => {
        api.start({ rotateX: 0, rotateY: 0 });
      },
    },
  );

  return (
    <animated.div
      ref={ref}
      {...bind()}
      style={{
        ...props,
        ...style,
        touchAction: "none",
        width: "fit-content",
        transition: "box-shadow 200ms ease-out",
        boxShadow: shadow
          ? "0 45px 100px rgba(14, 21, 47, 0.2), 0 16px 40px rgba(14, 21, 47, 0.1)"
          : "0 8px 30px rgba(14, 21, 47, 0.1)",
      }}
    >
      {children}
      <animated.div
        style={{
          ...shine,
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
        }}
      />
    </animated.div>
  );
}
