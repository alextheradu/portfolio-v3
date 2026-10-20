import "./LineSidebar.css";

// Section list inspired by React Bits' LineSidebar (https://reactbits.dev),
// simplified to plain CSS hover/active states (no cursor-proximity effect).
interface LineSidebarProps {
  items: string[];
  active?: number | null;
  onItemClick?: (index: number, label: string) => void;
}

export default function LineSidebar({ items, active = null, onItemClick }: LineSidebarProps) {
  return (
    <nav className="line-sidebar" aria-label="sections">
      <ul className="line-sidebar__list">
        {items.map((label, i) => (
          <li key={label}>
            <button
              type="button"
              className="line-sidebar__item"
              aria-current={active === i ? "true" : undefined}
              onClick={() => onItemClick?.(i, label)}
            >
              <span className="line-sidebar__marker" aria-hidden="true" />
              <span className="line-sidebar__index">{String(i + 1).padStart(2, "0")}</span>
              <span>{label}</span>
            </button>
          </li>
        ))}
      </ul>
    </nav>
  );
}
