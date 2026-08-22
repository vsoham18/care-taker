import { useState } from "react";

const FilterBar = ({ onFilter }) => {
  
  const [address, setAddress] = useState({
    city: "",
    state: "",
    pincode: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    const nextAddress = {
      ...address,
      [name]: value,
    };

    setAddress(nextAddress);

    onFilter({
      city: nextAddress.city.trim(),
      state: nextAddress.state.trim(),
      pincode: nextAddress.pincode.trim(),
    });
  };

  const submit = (e) => {
    e.preventDefault();

    onFilter({
      city: address.city.trim(),
      state: address.state.trim(),
      pincode: address.pincode.trim(),
    });
  };

  const clear = () => {
    const emptyAddress = {
      city: "",
      state: "",
      pincode: "",
    };

    setAddress(emptyAddress);
    onFilter(emptyAddress);
  };

  return (
    <form
      onSubmit={submit}
      className="card flex flex-col gap-3 p-4 sm:flex-row sm:items-end sm:gap-4"
    >
      <div className="flex-1">
        <label className="label">City</label>

        <input
          name="city"
          className="input"
          placeholder="e.g. Kolkata"
          value={address.city}
          onChange={handleChange}
        />
      </div>

      <div className="flex-1">
        <label className="label">State</label>

        <input
          name="state"
          className="input"
          placeholder="e.g. West Bengal"
          value={address.state}
          onChange={handleChange}
        />
      </div>

      <div className="flex-1">
        <label className="label">Pincode</label>

        <input
          name="pincode"
          className="input"
          placeholder="e.g. 700001"
          value={address.pincode}
          onChange={handleChange}
        />
      </div>

      <div className="flex gap-2">

        <button type="submit" className="btn btn-primary">
          Search
        </button>

        <button
          type="button"
          onClick={clear}
          className="btn btn-ghost"
        >
          Clear
        </button>

      </div>
    </form>
  );
};

export default FilterBar;