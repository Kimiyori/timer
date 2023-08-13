import React from "react";
import "./styles.css";
import { v4 as uuidv4 } from "uuid";

const Timer = ({ onRemove, maxMs }) => {
  const [ms, setMs] = React.useState(0);
  const el = React.useRef(null);
  React.useEffect(() => {
    const timer = setTimeout(() => setMs((currentMs) => currentMs + 100), 100);
    return () => clearTimeout(timer);
  }, [ms]);
  React.useEffect(() => {
    ms > maxMs && onRemove();
  }, [ms, maxMs, onRemove]);

  React.useLayoutEffect(() => {
    const hotMs = 2500 - Math.min(2500, maxMs - ms);
    const hot = hotMs / 2500;
    el.current.style.setProperty("--timer-hot", Math.min(1, hot));
  }, [ms, maxMs]);

  return (
    <div className="timer" ref={el} onClick={onRemove}>
      <div>
        {(ms / 1000).toFixed(1)}s / {(maxMs / 1000).toFixed(1)}s
      </div>
    </div>
  );
};
export default function App() {
  const [newMaxMs, setNewMaxMs] = React.useState(5000);
  const [timers, setTimers] = React.useState([]);

  const removeTimerAt = React.useCallback((idx) => {
    setTimers((currentTimers) =>
      currentTimers.filter((item) => item.id !== idx)
    );
  }, []);
  const addTimer = React.useCallback(() => {
    setTimers((currentTimers) => [
      ...currentTimers,
      { id: uuidv4(), maxMs: newMaxMs },
    ]);
  }, [newMaxMs, setTimers]);

  return (
    <div>
      <label>
        New timer length:
        <input
          type="range"
          min="1000"
          max="20000"
          step="100"
          value={newMaxMs}
          onChange={(e) => setNewMaxMs(Number(e.target.value))}
        />
        {(newMaxMs / 1000).toFixed(1)}s
      </label>
      <button onClick={addTimer}>Add</button>
      <hr />
      <div className="grid">
        {timers.map((timer) => (
          <Timer
            key={timer.id}
            onRemove={() => removeTimerAt(timer.id)}
            maxMs={timer.maxMs}
          />
        ))}
      </div>
    </div>
  );
}
