import { Link } from "react-router-dom";

const NotFound = () => (
  <div className="mx-auto flex min-h-[60vh] max-w-md flex-col items-center justify-center px-5 text-center">
    <h1 className="font-display text-4xl">Page not found</h1>
    <p className="mt-2 text-sm text-muted">
      The page you're looking for doesn't exist, or may have moved.
    </p>
    <Link to="/" className="btn btn-primary mt-6">
      Back to home
    </Link>
  </div>
);

export default NotFound;
