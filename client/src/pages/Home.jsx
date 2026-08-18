import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { api } from "../api/axios.js";
import CaretakerCard from "../components/careTakerCard.jsx";
import FilterBar from "../components/FilterBar.jsx";
import { useAuth } from "../context/AuthContext.jsx";

const CARE_TYPES = [
  ["", "All"],
  ["elderly-care", "Elderly care"],
  ["baby-care", "Baby care"],
  ["Both", "Both"],
];

const Home = () => {
  const { user, refreshUser } = useAuth();
  const [profiles, setProfiles] = useState([]);
  
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
    

  const [careType, setCareType] = useState("");

  //  state for manage filter value 
  const [filters, setFilters] = useState({ city: "", state: "", pincode: "" });

  //  State for showing error and smooth user experience(loader)
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // State management for location --->
  const [locationStatus, setLocationStatus] = useState("idle");
  const [coords, setCoords] = useState(null);
   
   //  location permisson----->
        useEffect(() => {
           
          if (!("geolocation" in navigator)) {
            setLocationStatus("unsupported");
            return;
          }

          setLocationStatus("asking");
          
          navigator.geolocation.getCurrentPosition(

            (pos) => {
              setCoords({ lat: pos.coords.latitude, lng: pos.coords.longitude });
              setLocationStatus("granted");
            },

            () => setLocationStatus("denied"),

            { enableHighAccuracy: false, timeout: 8000, maximumAge: 5 * 60 * 1000 }

          );

        }, []);
  
  //  fetch user data---->
    useEffect(() => {
    
      if (locationStatus === "idle" || locationStatus === "asking") return;

      const load = async () => {
      
        setLoading(true);
        setError("");
        try {
          const { data } = await api.get("/caretakers", {
            params: { 
              page, 
              limit: 12,
              lat: coords?.lat,
              lng: coords?.lng,
              city: filters.city,
              state: filters.state,
              pincode: filters.pincode,
              careType: careType || undefined,
            },
          });
          setProfiles(data?.data?.profiles || []);
         
          setPages(data?.data?.totalPages || 1);
        }
        catch (err) {
          setProfiles([]);

          setError(
            err.response?.data?.message ||
            "Couldn't load caretakers."
          );
        } 
        finally {
          setLoading(false);
        }
      };

      load();
    }, [locationStatus, coords, page, filters, careType]);

  return (
    <div>
      {/* Hero */}
    <section className="texture-grain overflow-hidden border-b border-line bg-teal-500">

      <div className="mx-auto grid max-w-6xl gap-10 px-5 py-16 md:grid-cols-2 md:items-center md:py-24">
          <div>

              <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-honey-100">
                Elderly care · Baby care
              </p>
              <h1 className="font-display text-4xl leading-tight text-white sm:text-5xl">
                Someone <span className="font-display-italic">dependable</span>,
                a call away.
              </h1>

              <p className="mt-4 max-w-md text-teal-50">
                Aya connects your family with caretakers who've already earned
                the trust of people nearby — reviewed only by families who
                actually booked them.
              </p>

              <div className="mt-7 flex flex-wrap gap-3">

                    <a href="#browse" className="btn bg-honey-400 text-teal-700 hover:bg-honey-500">
                      Find a caretaker
                    </a>

                    {!user?.isCaretaker && (
                      <Link to={user ? "/advertise" : "/register"} className="btn border border-white/40 text-white hover:bg-white/10">
                        Offer your care services
                      </Link>
                    )}
                    
              </div>

          </div>

          <div className="relative hidden md:block">
              <div className="ml-auto aspect-square w-72 rounded-full border-4 border-honey-400/60" />
          </div>

        </div>
    </section>

      <div className="stitch-divider" />

      {/* Browse */}
      <section id="browse" className="mx-auto max-w-6xl px-5 py-12">
        <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
          <div>
            <h2 className="font-display text-2xl">Browse caretakers</h2>
            {locationStatus === "granted" && (
              <p className="flex items-center gap-1.5 text-sm text-teal-600">
                <svg viewBox="0 0 20 20" className="h-4 w-4 fill-teal-500">
                  <path d="M10 1c-3.3 0-6 2.7-6 6 0 4.5 6 11 6 11s6-6.5 6-11c0-3.3-2.7-6-6-6zm0 8.3A2.3 2.3 0 1 1 10 4.7a2.3 2.3 0 0 1 0 4.6z" />
                </svg>
                Sorted by distance from where you are
              </p>
            )}
            {locationStatus === "denied" && (
              <p className="text-sm text-muted">
                Location access was declined — showing top-rated caretakers
                instead. You can enable location in your browser settings any
                time to see who's closest.
              </p>
            )}
            {locationStatus === "unsupported" && (
              <p className="text-sm text-muted">
                Your browser doesn't support location — showing top-rated
                caretakers instead.
              </p>
            )}
          </div>
        </div>
      
      {/* Filter section--->*/}
        <div className="mb-6">
          <FilterBar
            onFilter={(f) => {
              setPage(1);
              setFilters(f);
            }}
          />
        </div>
       
       {/* caretype section */}
      <div className="mb-8 flex flex-wrap gap-2">

         {CARE_TYPES.map(([val, label]) => (
            <button
              key={val}
              onClick={() =>{
                 setPage(1)
                setCareType(val)
              }}
              className={`badge border ${
                careType === val ? "border-teal-500 bg-teal-50 text-teal-600" : "border-line text-muted"
              }`}
            >
              {label}
            </button>
          ))}
      </div>
      
      {/* loading and error showing section ----> */}
        {
        loading ? (
          <p className="text-sm text-muted">Loading caretakers…</p>
        ) : error ? (
          <p className="text-sm text-rose-500">{error}</p>
        ) : profiles.length === 0 ? (
          <p className="text-sm text-muted">
            No caretakers match that search yet. Try a different city, state,
            pincode, or care type.
          </p>
        ) : (
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {profiles.map((p) => (
              <CaretakerCard key={p._id} profile={p} />
            ))}
          </div>
        )
        }


        {pages > 1 && (
          <div className="mt-8 flex justify-center gap-2">
            {Array.from({ length: pages }, (_, i) => i + 1).map((n) => (
              <button
                key={n}
                onClick={() => setPage(n)}
                className={`h-8 w-8 rounded-full text-sm ${
                  n === page ? "bg-teal-500 text-white" : "bg-white text-ink hover:bg-teal-50"
                }`}
              >
                {n}
              </button>
            ))}
          </div>
        )}

      </section>
    </div>
  );
};

export default Home;
