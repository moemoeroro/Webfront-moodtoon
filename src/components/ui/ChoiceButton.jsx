import "./ChoiceButton.css";

function ChoiceButton({
  children,
  selected = false,
  className = "",
  ...props
}) {
  return (
    <button
      className={`
        choice-button
        ${selected ? "selected" : ""}
        ${className}
      `}
      {...props}
    >
      {children}
    </button>
  );
}

export default ChoiceButton;