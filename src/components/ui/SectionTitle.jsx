function SectionTitle({
  eyebrow,
  title,
  description,
  compact = false,
  children,
}) {
  return (
    <div className={`section-title ${compact ? "compact" : ""}`}>
      <div>
        {eyebrow && (
          <p className="eyebrow">
            {eyebrow}
          </p>
        )}

        <h2>{title}</h2>

        {description && (
          <p className="section-description">
            {description}
          </p>
        )}
      </div>

      {children}
    </div>
  );
}

export default SectionTitle;