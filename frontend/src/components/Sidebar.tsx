const navigation = [
  { label: "Panoramica", href: "#overview", icon: "⌂" },
  { label: "Candidature", href: "#application-board", icon: "▣", active: true },
  { label: "Colloqui", href: "#interviews", icon: "◷" },
  { label: "Impostazioni", href: "#settings", icon: "⚙" },
];

export default function Sidebar() {
  return (
    <aside className="sidebar">
      <div className="brand">
        <span className="brand-mark" aria-hidden="true">
          <span className="brand-sun" />
        </span>
        <span>Job Tracker</span>
      </div>

      <nav className="sidebar-nav" aria-label="Navigazione principale">
        {navigation.map((item) => (
          <a
            className={`nav-item${item.active ? " nav-item-active" : ""}`}
            href={item.href}
            key={item.label}
            aria-current={item.active ? "page" : undefined}
          >
            <span className="nav-icon" aria-hidden="true">
              {item.icon}
            </span>
            <span>{item.label}</span>
          </a>
        ))}
      </nav>

      <div className="sidebar-decoration" aria-hidden="true">
        <span className="sidebar-blob sidebar-blob-lilac" />
        <span className="sidebar-blob sidebar-blob-yellow" />
        <span className="sidebar-leaf sidebar-leaf-one" />
        <span className="sidebar-leaf sidebar-leaf-two" />
      </div>
    </aside>
  );
}
