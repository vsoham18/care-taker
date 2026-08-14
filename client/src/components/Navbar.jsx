import { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

const navLinkClass = ({ isActive }) =>
  `text-sm font-medium transition-colors ${
    isActive
      ? "text-teal-500"
      : "text-ink/70 hover:text-ink"
  }`;

const mobileNavLinkClass = ({ isActive }) =>
  `block rounded-lg px-3 py-2 text-sm font-medium ${
    isActive
      ? "bg-teal-50 text-teal-600"
      : "text-ink/70 hover:bg-teal-50 hover:text-ink"
  }`;

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    setMenuOpen(false);
    navigate("/");
  };

  const closeMenu = () => {
    setMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-30 border-b border-line bg-paper/90 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-4">

        {/* Logo */}
        <Link
          to="/"
          className="flex items-baseline gap-1"
          onClick={closeMenu}
        >
          <span className="font-display text-2xl italic text-teal-500">
            Aya
          </span>

          <span className="hidden font-body text-xs uppercase tracking-widest text-muted sm:inline">
            care, close to home
          </span>
        </Link>

        {/* Desktop navigation */}
        <nav className="hidden items-center gap-7 md:flex">

          {user?.isCaretaker && (
            <NavLink
              to="/requests"
              className={navLinkClass}
            >
              Requests
            </NavLink>
          )}

          {user && (
            <NavLink
              to="/my-bookings"
              className={navLinkClass}
            >
              My bookings
            </NavLink>
          )}

        </nav>

        {/* Desktop right side */}
        <div className="hidden items-center gap-3 md:flex">

          {user ? (
            <>
              {!user.isCaretaker && (
                <Link
                  to="/advertise"
                  className="btn btn-accent"
                >
                  Advertise your service
                </Link>
              )}

              <Link
                to="/account"
                className="flex items-center gap-2 rounded-full border border-line bg-white px-2 py-1.5 pr-3 text-sm font-medium text-ink"
              >
                <span className="flex h-7 w-7 items-center justify-center rounded-full bg-teal-50 text-xs font-semibold text-teal-600">
                  {user.name?.[0]}
                </span>

                {user.name?.split(" ")[0]}
              </Link>

              <button
                onClick={handleLogout}
                className="btn btn-ghost"
              >
                Log out
              </button>
              
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="btn btn-ghost"
              >
                Log in
              </Link>

              <Link
                to="/register"
                className="btn btn-primary"
              >
                Join Aya
              </Link>
            </>
          )}

        </div>

        {/* Mobile menu button */}
        <button
          type="button"
          onClick={() => setMenuOpen((prev) => !prev)}
          className="flex h-10 w-10 items-center justify-center rounded-lg border border-line bg-white text-ink md:hidden"
          aria-label="Toggle menu"
          aria-expanded={menuOpen}
        >
          {menuOpen ? (
            <svg
              viewBox="0 0 24 24"
              className="h-5 w-5"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path
                d="M6 6l12 12M18 6L6 18"
                strokeLinecap="round"
              />
            </svg>
          ) : (
            <svg
              viewBox="0 0 24 24"
              className="h-5 w-5"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path
                d="M4 6h16M4 12h16M4 18h16"
                strokeLinecap="round"
              />
            </svg>
          )}
        </button>

      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="border-t border-line bg-paper md:hidden">
          <div className="mx-auto max-w-6xl px-5 py-4">

            {user ? (
              <div className="flex flex-col gap-2">

                {/* User */}
                <Link
                  to="/account"
                  onClick={closeMenu}
                  className="mb-2 flex items-center gap-3 rounded-lg bg-white p-3"
                >
                  <span className="flex h-9 w-9 items-center justify-center rounded-full bg-teal-50 text-sm font-semibold text-teal-600">
                    {user.name?.[0]}
                  </span>

                  <div>
                    <p className="text-sm font-semibold text-ink">
                      {user.name}
                    </p>
                    <p className="text-xs text-muted">
                      View account
                    </p>
                  </div>
                </Link>

                {/* Caretaker requests */}
                {user.isCaretaker && (
                  <NavLink
                    to="/requests"
                    className={mobileNavLinkClass}
                    onClick={closeMenu}
                  >
                    Requests
                  </NavLink>
                )}

                {/* Bookings */}
                <NavLink
                  to="/my-bookings"
                  className={mobileNavLinkClass}
                  onClick={closeMenu}
                >
                  My bookings
                </NavLink>

                {/* Advertise */}
                {!user.isCaretaker && (
                  <Link
                    to="/advertise"
                    onClick={closeMenu}
                    className="btn btn-accent mt-2 w-full"
                  >
                    Advertise your service
                  </Link>
                )}

                {/* Logout */}
                <button
                  onClick={handleLogout}
                  className="btn btn-ghost mt-1 w-full"
                >
                  Log out
                </button>

              </div>
            ) : (
              <div className="flex flex-col gap-2">

                <Link
                  to="/login"
                  onClick={closeMenu}
                  className="btn btn-ghost w-full"
                >
                  Log in
                </Link>

                <Link
                  to="/register"
                  onClick={closeMenu}
                  className="btn btn-primary w-full"
                >
                  Join Aya
                </Link>

              </div>
            )}

          </div>
        </div>
      )}

    </header>
  );
};

export default Navbar;