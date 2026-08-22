import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

const Account = () => {
  const { user } = useAuth();
  if (!user) return null;
 
  return (
    <div className="mx-auto max-w-lg px-5 py-12">
      <h1 className="font-display text-3xl">Your account</h1>

      <div className="card mt-6 flex items-center gap-4 p-5">
        <span className="flex h-16 w-16 items-center justify-center rounded-full bg-teal-50 text-xl font-semibold text-teal-600">
          {user.name?.[0]}
        </span>
        <div>
          <p className="font-semibold text-ink">{user.name}</p>
          <p className="text-sm text-muted">{user.email}</p>
          <p className="text-sm text-muted">{user.phone}</p>
        </div>
      </div>

      <div className="mt-6 flex flex-wrap gap-3">
        {user.isCaretaker && user.caretakerProfile ? (
          <>
            <Link to="/requests" className="btn btn-primary inline-flex">
              Manage your booking requests
            </Link>

            <Link to="/edit-profile" className="btn btn-secondary inline-flex">
              Edit your caretaker profile
            </Link>

             <Link
              to={`/caretaker/${user.caretakerProfile}`}
              className="btn btn-accent inline-flex"
            >
              Visit your caretaker profile
            </Link>
          </>
        ) : (
          <Link to="/advertise" className="btn btn-accent inline-flex">
            Advertise your care services
          </Link>
        )}
      </div>
    </div>
  );
};

export default Account;
