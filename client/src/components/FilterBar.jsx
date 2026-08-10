import { useState } from "react";

const FilterBar = ({ onFilter, initial = {} }) => {
  
  const [city, setCity] = useState(initial.city || "");
  const [state, setState] = useState(initial.state || "");
  const [pincode, setPincode] = useState(initial.pincode || "");

  const submit = (e) => {
    e.preventDefault();
    onFilter({ city: city.trim(), state: state.trim(), pincode: pincode.trim() });
  };

  const clear = () => {
    setCity("");
    setState("");
    setPincode("");
    onFilter({ city: "", state: "", pincode: "" });
  };

  return (
    <form
      onSubmit={submit}
      className="card flex flex-col gap-3 p-4 sm:flex-row sm:items-end sm:gap-4"
    >
      <div className="flex-1">
        <label className="label">City</label>
        <input
          className="input"
          placeholder="e.g. Kolkata"
          value={city}
          onChange={(e) => setCity(e.target.value)}
        />
      </div>

      <div className="flex-1">
        <label className="label">State</label>
        <input
          className="input"
          placeholder="e.g. West Bengal"
          value={state}
          onChange={(e) => setState(e.target.value)}
        />
      </div>

      <div className="flex-1">
        <label className="label">Pincode</label>
        <input
          className="input"
          placeholder="e.g. 700001"
          value={pincode}
          onChange={(e) => setPincode(e.target.value)}
        />
      </div>

      <div className="flex gap-2">

        <button type="submit" className="btn btn-primary">
          Search
        </button>

        <button type="button" onClick={clear} className="btn btn-ghost">
          Clear
        </button>

      </div>

    </form>
  );
};

export default FilterBar;
