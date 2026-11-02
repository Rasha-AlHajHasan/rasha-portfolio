// src/components/TypedLines.jsx
// Text typed character by character, used on the device screens.
import React, { useEffect, useState } from "react";

import { cx } from "./utils";

// How many characters are on screen; everything at once with reduced motion
function useTypedCount(total, { reduced, delay, speed }) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (reduced) return;
    let interval;
    const start = setTimeout(() => {
      interval = setInterval(() => setCount((c) => Math.min(c + 1, total)), speed);
    }, delay);
    return () => {
      clearTimeout(start);
      clearInterval(interval);
    };
  }, [total, reduced, delay, speed]);

  return reduced ? total : count;
}

// Lines of [tone, text] tokens -> the same lines, with each token's start position
function withOffsets(lines) {
  let offset = 0;
  const placed = lines.map((tokens) =>
    tokens.map(([tone, text]) => {
      const token = { tone, text, start: offset };
      offset += text.length;
      return token;
    })
  );
  return { placed, total: offset };
}

// Text that isn't typed yet still takes up its space, so nothing shifts while typing.
// The caret sits on the last typed character; `keepCaret` leaves it there at the end.
export default function TypedLines({ lines, reduced, delay = 300, speed = 30, keepCaret = false, caretClass = "bg-wine" }) {
  const { placed, total } = withOffsets(lines);
  const count = useTypedCount(total, { reduced, delay, speed });
  const showCaret = count > 0 && (count < total || keepCaret);

  return placed.map((tokens, i) => (
    <span key={i} className="block">
      {tokens.map(({ tone, text, start }) => {
        const shown = Math.max(0, Math.min(count - start, text.length));
        const caretHere = showCaret && count > start && count <= start + text.length;

        return (
          <span key={start} className={tone}>
            {text.slice(0, shown)}
            {caretHere && (
              <span className="relative">
                <span className={cx("showcase-caret absolute inline-block h-[1em] w-[1.5px] translate-y-[0.14em]", caretClass)} />
              </span>
            )}
            <span className="invisible">{text.slice(shown)}</span>
          </span>
        );
      })}
    </span>
  ));
}
