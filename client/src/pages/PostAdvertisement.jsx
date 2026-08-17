import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../api/axios.js"; 
import { useAuth } from "../context/AuthContext.jsx";
import { toast } from "react-toastify";

const CARE_TYPE_OPTIONS = [
  ["elderly-care", "Elderly care"],
  ["baby-care", "Baby care"],
  ["Both", "Both"],
];

const PostAdvertisement = () => {
  const { refreshUser } = useAuth();
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

  const [busy, setBusy] = useState(false);

  // for change value in form --->
 const update = (key) => (e) => {
  setForm((prev) => ({
    ...prev,
    [key]: e.target.value,
  }));
};

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
  };
  
  useEffect(() => {

    if (!photo) {
      setPhotoPreview("");
      return;
    }

  const url = URL.createObjectURL(photo);
  setPhotoPreview(url);

  return () => {
    URL.revokeObjectURL(url);
  }

}, [photo]);

  const submit = async (e) => {
    e.preventDefault();
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
      fd.append("isCurrentlyAvailable", form.isCurrentlyAvailable ? "true" : "false");
      fd.append("profilePicture", photo); 

      await api.post("/caretakers/advertise", fd);
      
      toast.success("Your caretaker profile was created successfully.");
      await refreshUser();

      navigate("/");
    } 
     catch (err) {
         
       toast.error(
         err.response?.data?.message ||
         "Couldn't create your caretaker profile."
      );

    } 
    finally {
      setBusy(false);
    }

  };

  return (
    <div className="mx-auto max-w-2xl px-5 py-12">
      <h1 className="font-display text-3xl">Advertise your care services</h1>

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
         
         {/* care type selection */}
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
          <label    className="label">About you</label>
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
            <input className="input" value={form.city}  onChange={update("city")} />
          </div>
          <div>
            <label className="label">State</label>
            <input className="input" value={form.state} onChange={update("state")} />
          </div>
          <div>
            <label className="label">Pincode</label>
            <input className="input" value={form.pincode} onChange={update("pincode")} placeholder="6 digits" />
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

        <button type="submit" disabled={busy} className="btn btn-primary self-start">
          {busy ? "Posting…" : "Post advertisement"}
        </button>
      </form>
    </div>
  );
};

export default PostAdvertisement;
