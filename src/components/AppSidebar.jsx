import { NavLink, useLocation } from 'react-router-dom';
import {
  ChevronLeft,
  ChevronRight,
  FolderKanban,
  Home,
  LayoutDashboard,
  X,
  Users,
} from 'lucide-react';

const navItems = [
  { to: '/', icon: Home, label: 'Dashboard' },
  { to: '/projects', icon: FolderKanban, label: 'Projects' },
  { to: '/employees', icon: Users, label: 'Employees' },
  { to: '/tasks', icon: LayoutDashboard, label: 'Tasks' },
];

export const SIDEBAR_WIDTH = 280;
export const COLLAPSED_SIDEBAR_WIDTH = 92;

const AppSidebar = ({
  collapsed,
  isMobile,
  mobileOpen,
  onCloseMobile,
  onToggleCollapse,
}) => {
  const location = useLocation();
  const sidebarWidth = collapsed ? COLLAPSED_SIDEBAR_WIDTH : SIDEBAR_WIDTH;
  const sidebarClassName = [
    'app-sidebar',
    collapsed && !isMobile ? 'app-sidebar-collapsed' : '',
    isMobile ? 'app-sidebar-mobile' : '',
    mobileOpen ? 'show' : '',
  ].filter(Boolean).join(' ');

  return (
    <>
      {isMobile && mobileOpen && <div className="sidebar-backdrop" onClick={onCloseMobile} />}
      <aside className={sidebarClassName} style={{ width: isMobile ? undefined : sidebarWidth }}>
        <div className="sidebar-header border-bottom">
          <div className="d-flex align-items-center gap-3 min-w-0">
            <div className="brand-mark">W</div>
            {(!collapsed || isMobile) && (
              <div className="min-w-0">
                <div className="fw-bold sidebar-brand-title">Workload</div>
                <div className="small text-secondary">Project management</div>
              </div>
            )}
          </div>
          {isMobile && (
            <button type="button" className="btn btn-link text-secondary p-0" onClick={onCloseMobile} aria-label="Close sidebar">
              <X size={18} />
            </button>
          )}
        </div>

        <div className="sidebar-body">
          {(!collapsed || isMobile) && (
            <div className="sidebar-caption text-uppercase">Navigation</div>
          )}

          <nav className="nav flex-column gap-2">
            {navItems.map((item) => {
              const isActive =
                location.pathname === item.to ||
                (item.to !== '/' && location.pathname.startsWith(item.to));

              return (
                <NavLink
                  key={item.to}
                  to={item.to}
                  onClick={isMobile ? onCloseMobile : undefined}
                  className={`nav-link sidebar-link ${isActive ? 'active' : ''}`}
                >
                  <span className="sidebar-link-icon">
                    <item.icon size={20} />
                  </span>
                  {(!collapsed || isMobile) && <span className="sidebar-link-label">{item.label}</span>}
                </NavLink>
              );
            })}
          </nav>
        </div>

        {!isMobile && (
          <div className="sidebar-footer border-top">
            <button type="button" className="btn btn-light w-100 d-flex align-items-center justify-content-center gap-2" onClick={onToggleCollapse}>
              {collapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
              {!collapsed && <span>Collapse</span>}
            </button>
          </div>
        )}
      </aside>
    </>
  );
};

export default AppSidebar;
