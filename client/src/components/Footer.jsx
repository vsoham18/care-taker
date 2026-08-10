const Footer = () => {
  return (
    <footer className="mt-24 border-t border-line bg-white">
      <div className="mx-auto max-w-6xl px-5 py-10">
        <div className="stitch-divider mb-8 mt-[-2.85rem]" />
        <div className="flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-center">
          <div>
            <span className="font-display text-xl italic text-teal-500">Aya</span>
            <p className="mt-1 max-w-sm text-sm text-muted">
              A quiet, careful way to find someone trustworthy for the people you
              love — and for caretakers to find families who need them.
            </p>
          </div>
          <p className="text-xs text-muted">
            © {new Date().getFullYear()} Aya. Every caretaker is reviewed by real
            families who booked their service.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
