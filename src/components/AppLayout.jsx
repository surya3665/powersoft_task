import { useEffect, useMemo, useState } from 'react';
import { Menu } from 'lucide-react';
import { Outlet, useLocation } from 'react-router-dom';
import AppSidebar, { COLLAPSED_SIDEBAR_WIDTH, SIDEBAR_WIDTH } from './AppSidebar';

const DESKTOP_BREAKPOINT = 992;

const AppLayout = () => {
  const location = useLocation();
  const [isMobile, setIsMobile] = useState(
    typeof window !== 'undefined' ? window.innerWidth < DESKTOP_BREAKPOINT : false,
  );
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const sidebarWidth = collapsed ? COLLAPSED_SIDEBAR_WIDTH : SIDEBAR_WIDTH;
  const pageTitle = useMemo(() => {
    if (location.pathname.startsWith('/projects/')) return 'Project Details';
    if (location.pathname.startsWith('/projects')) return 'Projects';
    if (location.pathname.startsWith('/employees')) return 'Employees';
    if (location.pathname.startsWith('/tasks')) return 'Tasks';
    return 'Dashboard';
  }, [location.pathname]);

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < DESKTOP_BREAKPOINT;
      setIsMobile(mobile);

      if (!mobile) {
        setMobileOpen(false);
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname]);

  return (
    <div className="app-shell">
      <AppSidebar
        collapsed={collapsed}
        isMobile={isMobile}
        mobileOpen={mobileOpen}
        onCloseMobile={() => setMobileOpen(false)}
        onToggleCollapse={() => setCollapsed((prev) => !prev)}
      />

      <div className="app-main" style={{ marginLeft: isMobile ? 0 : sidebarWidth }}>
        <header className="page-topbar border-bottom">
          <div className="container-fluid px-3 px-md-4">
            <div className="d-flex align-items-center gap-2 gap-md-3 min-vh-0 page-topbar-inner">
              {isMobile && (
                <button type="button" className="btn btn-outline-secondary btn-sm d-lg-none" onClick={() => setMobileOpen(true)} aria-label="Open navigation">
                  <Menu size={20} />
                </button>
              )}
              <div className="min-w-0">
                <h1 className="page-title mb-0">{pageTitle}</h1>
                <p className="page-subtitle text-secondary mb-0">Bootstrap workspace</p>
              </div>
            </div>
          </div>
        </header>
        <main className="container-fluid px-3 px-md-4 py-3 py-md-4">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AppLayout;
