import { useLocation } from "react-router-dom";
import { useEffect } from "react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <div className="min-vh-100 d-flex align-items-center justify-content-center px-3 app-surface">
      <div className="card border-0 shadow-lg rounded-4 w-100" style={{ maxWidth: 520 }}>
        <div className="card-body text-center p-4 p-md-5">
          <h1 className="display-2 fw-bold mb-2">404</h1>
          <h2 className="h3 fw-bold mb-3">Oops! Page not found</h2>
          <p className="text-secondary mb-4">
          The route <strong>{location.pathname}</strong> does not exist.
          </p>
          <a href="/" className="btn btn-primary">
            Return to Home
          </a>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
