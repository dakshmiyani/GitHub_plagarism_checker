import { useTheme } from "../context/ThemeContext";

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      style={{
        cursor: "pointer",
        padding: "8px 16px",
        borderRadius: "8px",
        border: "1px solid #00ffcc",
        background: "transparent",
        color: "#00ffcc",
        fontSize: "14px",
        filter: theme === "light" ? "invert(1) hue-rotate(180deg)" : "none",
      }}
    >
      {theme === "dark" ? "☀️ Light Mode" : "🌙 Dark Mode"}
    </button>
  );
}