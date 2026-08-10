import { Link, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

const navLinkClass = ({ isActive }) =>
  `text-sm font-medium transition-colors ${
    isActive ? "text-teal-500" : "text-ink/70 hover:text-ink"
  }`;

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  return (
    <header className="sticky top-0 z-30 border-b border-line bg-paper/90 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-4">
        
        <Link to="/" className="flex items-baseline gap-1">
          <span className="font-display text-2xl italic text-teal-500">Aya</span>
          <span className="hidden font-body text-xs uppercase tracking-widest text-muted sm:inline">
            care, close to home
          </span>
        </Link>

      <nav className="hidden items-center gap-7 md:flex">
          {user?.isCaretaker && (
            <NavLink to="/requests" className={navLinkClass}>
              Requests
            </NavLink>
          )}
          {user && (
            <NavLink to="/my-bookings" className={navLinkClass}>
              My bookings
            </NavLink>
          )}
      </nav>

        <div className="flex items-center gap-3">
          {user ? (
            <>
              {!user.isCaretaker && (
                <Link to="/advertise" className="btn btn-accent hidden sm:inline-flex">
                  Advertise your service
                </Link>
              )}
              
              <Link
                to="/account"
                className="hidden items-center gap-2 rounded-full border border-line bg-white px-2 py-1.5 pr-3 text-sm font-medium text-ink sm:flex"
              >
                <span className="flex h-7 w-7 items-center justify-center rounded-full bg-teal-50 text-xs font-semibold text-teal-600">
                  {user.name?.[0]}
                </span>
                {user.name?.split(" ")[0]}
              </Link>

              <button onClick={handleLogout} className="btn btn-ghost">
                Log out
              </button>
            </>
          ) : (
            <>

              <Link to="/login" className="btn btn-ghost">
                Log in
              </Link>
              <Link to="/register" className="btn btn-primary">
                Join Aya
              </Link>

            </>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
