import { useState, useCallback } from 'react';
import { getProfile, updateProfile } from '../services/api';

/**
 * Hook for managing user profile operations
 * @param {string} userId - User ID
 * @returns {Object} Profile state and methods
 */
export const useProfile = (userId) => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isDirty, setIsDirty] = useState(false);

  const fetchProfile = useCallback(async () => {
    if (!userId) {
      setError("No userId provided");
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const response = await getProfile(userId);
      setProfile(response.data?.data || response.data);
      setIsDirty(false);
    } catch (err) {
      const errorMessage = err.response?.data?.error || 
                          err.message || 
                          'Failed to fetch profile';
      setError(errorMessage);
      console.error('[useProfile] Failed to fetch profile:', errorMessage);
    } finally {
      setLoading(false);
    }
  }, [userId]);

  const saveProfile = useCallback(async (updatedData) => {
    if (!userId) {
      setError("No userId provided");
      return false;
    }

    try {
      setLoading(true);
      setError(null);
      const response = await updateProfile(userId, updatedData);
      const updatedProfile = response.data?.data || response.data;
      setProfile(updatedProfile);
      setIsDirty(false);
      return true;
    } catch (err) {
      const errorMessage = err.response?.data?.error || 
                          err.message || 
                          'Failed to update profile';
      setError(errorMessage);
      console.error('[useProfile] Failed to update profile:', errorMessage);
      return false;
    } finally {
      setLoading(false);
    }
  }, [userId]);

  const updateField = (field, value) => {
    setProfile(prev => ({
      ...prev,
      [field]: value
    }));
    setIsDirty(true);
  };

  const reset = useCallback(() => {
    setProfile(null);
    setError(null);
    setIsDirty(false);
  }, []);

  return {
    profile,
    loading,
    error,
    isDirty,
    fetchProfile,
    saveProfile,
    updateField,
    reset
  };
};

export default useProfile;
