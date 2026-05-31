export default function HafynLogo({ className = '' }) {
  return (
    <span
      className={`text-xl font-extrabold text-white md:text-2xl ${className}`}
      style={{ fontWeight: 800, letterSpacing: '0.15em' }}
      aria-label="HAFYN X"
    >
      HAFYN
      <span className="hafyn-logo-x"> X</span>
    </span>
  )
}
