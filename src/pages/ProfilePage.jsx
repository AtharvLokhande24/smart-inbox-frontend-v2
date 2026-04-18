import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "../components/DashboardLayout";
import { HiOutlineArrowLeft, HiOutlineSave } from "react-icons/hi";
import { useAuth } from "../context/AuthContext";
import { getProfile, updateProfile as updateProfileApi } from "../services/api";

function ProfilePage() {
  const navigate = useNavigate();
  const { user, updateProfile: updateAuthProfile } = useAuth();

  // Split the user's name into first and last
  const nameParts = (user?.name || "").trim().split(/\s+/);
  const defaultFirst = nameParts[0] || "";
  const defaultLast = nameParts.slice(1).join(" ") || "";

  const [formData, setFormData] = useState({
    firstName: defaultFirst,
    lastName: defaultLast,
  });

  const [isSaving, setIsSaving] = useState(false);
  const [isLoadingProfile, setIsLoadingProfile] = useState(false);
  const [saveError, setSaveError] = useState("");

  useEffect(() => {
    async function loadProfile() {
      if (!user?.id) return;

      setIsLoadingProfile(true);
      setSaveError("");

      try {
        const res = await getProfile(user.id);
        const profile = res.data?.data;

        if (profile) {
          const profileNameParts = String(profile.name || "").trim().split(/\s+/);
          const profileFirst = profileNameParts[0] || "";
          const profileLast = profileNameParts.slice(1).join(" ") || "";

          setFormData({
            firstName: profileFirst,
            lastName: profileLast,
          });
        }
      } catch (error) {
        const errorMsg = error.response?.data?.error || error.message || "Failed to load profile";
        setSaveError(errorMsg);
      } finally {
        setIsLoadingProfile(false);
      }
    }

    loadProfile();
  }, [user?.id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSave = async () => {
    if (!user?.id) return;

    setIsSaving(true);
    setSaveError("");

    try {
      const fullName = `${formData.firstName} ${formData.lastName}`.trim();
      const payload = {
        name: fullName,
      };

      console.log(`[ProfilePage] Saving profile for user ${user.id}:`, payload);
      const res = await updateProfileApi(user.id, payload);
      console.log(`[ProfilePage] Profile save response:`, res.data);
      const updated = res.data?.data;

      if (updated?.id) {
        updateAuthProfile({
          id: updated.id,
          name: updated.name,
          email: updated.email,
        });
      }

      navigate("/settings");
    } catch (error) {
      const errorMsg = error.response?.data?.error || error.message || "Failed to update profile";
      console.error(`[ProfilePage] Profile save error:`, error.response?.status, error.response?.data, error.message);
      setSaveError(errorMsg);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <DashboardLayout title="Edit Profile">
      <div className="max-w-3xl mx-auto">
        {/* Back Button */}
        <button
          onClick={() => navigate("/settings")}
          className="mb-6 flex items-center gap-2 text-indigo-600 hover:text-indigo-700 font-medium transition"
        >
          <HiOutlineArrowLeft className="text-lg" />
          Back to Settings
        </button>

        {/* Profile Card */}
        <div className="rounded-2xl bg-white p-8 shadow-sm">
          {/* Profile Avatar Section */}
          <div className="mb-8 flex items-center gap-6 pb-8 border-b border-slate-200">
            <div className="h-24 w-24 rounded-full bg-gradient-to-br from-indigo-600 to-purple-600 flex items-center justify-center text-4xl font-semibold text-white">
              {formData.firstName[0]}
              {formData.lastName[0]}
            </div>
            <div>
              <h2 className="text-2xl font-bold text-slate-900">
                {formData.firstName} {formData.lastName}
              </h2>
              <p className="mt-3 text-xs text-slate-500">
                Profile supports name updates.
              </p>
            </div>
          </div>

          {saveError ? (
            <div className="mb-6 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {saveError}
            </div>
          ) : null}

          {isLoadingProfile ? (
            <div className="mb-6 rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-600">
              Loading latest profile...
            </div>
          ) : null}

          {/* Form Fields */}
          <div className="space-y-6">
            {/* Name Fields */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  First Name
                </label>
                <input
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-lg border border-slate-200 bg-slate-50 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Last Name
                </label>
                <input
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-lg border border-slate-200 bg-slate-50 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
                />
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="mt-8 flex gap-4 border-t border-slate-200 pt-8">
            <button
              onClick={() => navigate("/settings")}
              className="flex-1 px-6 py-3 rounded-lg border border-slate-200 bg-white text-slate-700 font-semibold hover:bg-slate-50 transition"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={isSaving || isLoadingProfile}
              className="flex-1 flex items-center justify-center gap-2 px-6 py-3 rounded-lg bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold hover:shadow-lg transition disabled:opacity-70"
            >
              <HiOutlineSave className="text-lg" />
              {isSaving ? "Saving..." : isLoadingProfile ? "Loading..." : "Save Changes"}
            </button>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}

export default ProfilePage;
