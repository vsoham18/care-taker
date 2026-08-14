import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../api/axios.js"; 
import { useAuth } from "../context/AuthContext.jsx";

const CARE_TYPE_OPTIONS = [
  ["elderly-care", "Elderly care"],
  ["baby-care", "Baby care"],
  ["Both", "Both"],
];

const PostAdvertisement = () => {
  const { refresh } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    careType: [],
    about: "",
    experienceYears: "",
    address: "",
    city: "",
    state: "",
    pincode: "",
    isCurrentlyAvailable: true,
  });
  const [photo, setPhoto] = useState(null);
  const [photoPreview, setPhotoPreview] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  const update = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  const toggleCareType = (val) => {
    setForm((f) => ({
      ...f,
      careType: f.careType.includes(val)
        ? f.careType.filter((c) => c !== val)
        : [...f.careType, val],
    }));
  };

  const handlePhoto = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setPhoto(file);
    setPhotoPreview(URL.createObjectURL(file));
  };

  const submit = async (e) => {
    e.preventDefault();
    setError("");

    if (form.careType.length === 0) return setError("Select at least one care type.");
    if (!photo) return setError("A profile photo is required.");
    if (!/^\d{6}$/.test(form.pincode)) return setError("Pincode must be 6 digits.");

    setBusy(true);
    try {
      const fd = new FormData();
      // the server's parseFormData middleware expects this as a JSON string
      fd.append("careType", JSON.stringify(form.careType));
      fd.append("about", form.about);
      fd.append("experienceYears", form.experienceYears || 0);
      fd.append("address", form.address);
      fd.append("city", form.city);
      fd.append("state", form.state);
      fd.append("pincode", form.pincode);
      fd.append("isCurrentlyAvailable", form.isCurrentlyAvailable ? "true" : "");
      fd.append("profilePicture", photo); // field name expected by upload.single("profilePicture")

      await api.post("/caretakers/advertise", fd);
      await refresh();
      navigate("/");
    } catch (err) {
      setError(err.response?.data?.message || "Couldn't post your advertisement.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="mx-auto max-w-2xl px-5 py-12">
      <h1 className="font-display text-3xl">Advertise your care services</h1>
      <p className="mt-1 text-sm text-muted">
        This creates your public caretaker profile. Families will see your
        photo, city and rating right away — your phone number and full
        address once they log in and open your profile.
      </p>

      <form onSubmit={submit} className="mt-8 flex flex-col gap-6">
        <div>
          <label className="label">Profile photo (required)</label>
          <div className="flex items-center gap-4">
            <div className="h-20 w-20 overflow-hidden rounded-full border border-line bg-teal-50">
              {photoPreview && <img src={photoPreview} alt="" className="h-full w-full object-cover" />}
            </div>
            <input type="file" accept="image/*" onChange={handlePhoto} className="text-sm" />
          </div>
        </div>

        <div>
          <label className="label">Care type</label>
          <div className="flex gap-3">
            {CARE_TYPE_OPTIONS.map(([val, label]) => (
              <button
                type="button"
                key={val}
                onClick={() => toggleCareType(val)}
                className={`badge border ${
                  form.careType.includes(val)
                    ? "border-teal-500 bg-teal-50 text-teal-600"
                    : "border-line text-muted"
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="label">About you</label>
          <textarea className="input min-h-24" value={form.about} onChange={update("about")} />
        </div>

        <div>
          <label className="label">Years of experience</label>
          <input type="number" min="0" className="input w-32" value={form.experienceYears} onChange={update("experienceYears")} />
        </div>

        <div>
          <label className="label">Full address</label>
          <textarea className="input" value={form.address} onChange={update("address")} placeholder="House / street / landmark" />
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div>
            <label className="label">City</label>
            <input required className="input" value={form.city} onChange={update("city")} />
          </div>
          <div>
            <label className="label">State</label>
            <input required className="input" value={form.state} onChange={update("state")} />
          </div>
          <div>
            <label className="label">Pincode</label>
            <input required className="input" value={form.pincode} onChange={update("pincode")} placeholder="6 digits" />
          </div>
        </div>

        <label className="flex items-center gap-2 text-sm text-ink">
          <input
            type="checkbox"
            checked={form.isCurrentlyAvailable}
            onChange={(e) => setForm({ ...form, isCurrentlyAvailable: e.target.checked })}
          />
          Currently available to take new bookings
        </label>

        {error && <p className="text-sm text-rose-500">{error}</p>}

        <button type="submit" disabled={busy} className="btn btn-primary self-start">
          {busy ? "Posting…" : "Post advertisement"}
        </button>
      </form>
    </div>
  );
};

export default PostAdvertisement;
