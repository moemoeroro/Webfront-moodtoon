import "./Tag.css";

function Tag({ children, size = "small", hasHash = false }) {
  return (
    <span className={`custom-tag ${size === "large" ? "large" : ""}`}>
      {hasHash ? `#${children}` : children}
    </span>
  );
}

export default Tag;