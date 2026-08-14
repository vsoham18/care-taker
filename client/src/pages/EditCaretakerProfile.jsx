import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../api/axios";

const CARE_TYPE_OPTIONS = [
  ["elderly-care", "Elderly care"],
  ["baby-care", "Baby care"],
  ["Both", "Both"],
];

const EditCaretakerProfile = () => {
  const navigate = useNavigate();

  const [loaded, setLoaded] = useState(false);
  const [loadError, setLoadError] = useState("");
  const [form, setForm] = useState({
    careType: [],
    about: "",
    experienceYears: "",
    address: "",
    city: "",
    state: "",
    pincode: "",
    isCurrentlyAvailable: true,
    status: "active",
  });
  const [currentPhotoUrl, setCurrentPhotoUrl] = useState("");
  const [photo, setPhoto] = useState(null);
  const [photoPreview, setPhotoPreview] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    const load = async () => {
      try {
        const { data } = await api.get("/caretakers/me/profile");
        const p = data.data;
        setForm({
          careType: p.careType || [],
          about: p.about || "",
          experienceYears: p.experienceYears ?? "",
          address: p.address || "",
          city: p.city || "",
          state: p.state || "",
          pincode: p.pincode || "",
          isCurrentlyAvailable: p.isCurrentlyAvailable ?? true,
          status: p.status || "active",
        });
        setCurrentPhotoUrl(p.photo?.url || "");
      } catch (err) {
        setLoadError(err.response?.data?.message || "Couldn't load your profile.");
      } finally {
        setLoaded(true);
      }
    };
    load();
  }, []);

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
    setSuccess("");

    if (form.careType.length === 0) return setError("Select at least one care type.");
    if (!/^\d{6}$/.test(form.pincode)) return setError("Pincode must be 6 digits.");

    setBusy(true);
    try {
      const fd = new FormData();
      fd.append("careType", JSON.stringify(form.careType));
      fd.append("about", form.about);
      fd.append("experienceYears", form.experienceYears || 0);
      fd.append("address", form.address);
      fd.append("city", form.city);
      fd.append("state", form.state);
      fd.append("pincode", form.pincode);
      fd.append("isCurrentlyAvailable", form.isCurrentlyAvailable ? "true" : "");
      fd.append("status", form.status);
      if (photo) fd.append("profilePicture", photo);

      await api.patch("/caretakers/me/profile", fd);
      setSuccess("Your profile has been updated.");
    } catch (err) {
      setError(err.response?.data?.message || "Couldn't update your profile.");
    } finally {
      setBusy(false);
    }
  };

  if (!loaded) {
    return <p className="mx-auto max-w-2xl px-5 py-16 text-sm text-muted">Loading your profile…</p>;
  }

  if (loadError) {
    return <p className="mx-auto max-w-2xl px-5 py-16 text-sm text-rose-500">{loadError}</p>;
  }

  return (
    <div className="mx-auto max-w-2xl px-5 py-12">
      <h1 className="font-display text-3xl">Edit your profile</h1>

      <form onSubmit={submit} className="mt-8 flex flex-col gap-6">
        <div>
          <label className="label">Profile photo</label>
          <div className="flex items-center gap-4">
            <div className="h-20 w-20 overflow-hidden rounded-full border border-line bg-teal-50">
              <img
                src={photoPreview || currentPhotoUrl}
                alt=""
                className="h-full w-full object-cover"
              />
            </div>
            <div>
              <input type="file" accept="image/*" onChange={handlePhoto} className="text-sm" />
              <p className="mt-1 text-xs text-muted">Leave blank to keep your current photo.</p>
            </div>
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
          <textarea className="input" value={form.address} onChange={update("address")} />
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

        <div className="flex flex-wrap items-center gap-6">
          <label className="flex items-center gap-2 text-sm text-ink">
            <input
              type="checkbox"
              checked={form.isCurrentlyAvailable}
              onChange={(e) => setForm({ ...form, isCurrentlyAvailable: e.target.checked })}
            />
            Currently available to take new bookings
          </label>

          <label className="flex items-center gap-2 text-sm text-ink">
            <span>Listing status</span>
            <select
              className="input w-36"
              value={form.status}
              onChange={(e) => setForm({ ...form, status: e.target.value })}
            >
              <option value="active">Active (visible)</option>
              <option value="paused">Paused (hidden)</option>
            </select>
          </label>
        </div>

        {error && <p className="text-sm text-rose-500">{error}</p>}
        {success && <p className="text-sm text-teal-600">{success}</p>}

        <button type="submit" disabled={busy} className="btn btn-primary self-start">
          {busy ? "Saving…" : "Save changes"}
        </button>
      </form>
    </div>
  );
};

export default EditCaretakerProfile;
