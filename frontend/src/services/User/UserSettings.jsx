// src/services/User/UserSettings.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { changePassword, deleteUser } from '../userService';

const UserSettings = () => {
    const [oldPassword, setOldPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const navigate = useNavigate();

    const handlePasswordChange = async (e) => {
        e.preventDefault();
        try {
            const response = await changePassword(oldPassword, newPassword);
            setSuccess(response.msg);
            setError('');
            // Clear form
            setOldPassword('');
            setNewPassword('');
        } catch (err) {
            setError(err.detail || 'Failed to change password');
            setSuccess('');
        }
    };

    const handleDeleteAccount = async () => {
        try {
            await deleteUser();
            localStorage.removeItem('user');
            navigate('/login');
        } catch (err) {
            setError(err.detail || 'Failed to delete account');
            setShowDeleteConfirm(false);
        }
    };

    return (
        <div className="max-w-2xl mx-auto mt-10 p-6 bg-white rounded-lg shadow">
            <h2 className="text-2xl font-bold mb-6">User Settings</h2>

            {error && (
                <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
                    {error}
                </div>
            )}

            {success && (
                <div className="mb-4 p-4 bg-green-100 border border-green-400 text-green-700 rounded">
                    {success}
                </div>
            )}

            {/* Change Password Form */}
            <div className="mb-8">
                <h3 className="text-lg font-semibold mb-4">Change Password</h3>
                <form onSubmit={handlePasswordChange} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Old Password</label>
                        <input
                            type="password"
                            value={oldPassword}
                            onChange={(e) => setOldPassword(e.target.value)}
                            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">New Password</label>
                        <input
                            type="password"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
                            required
                        />
                    </div>
                    <button
                        type="submit"
                        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                    >
                        Update Password
                    </button>
                </form>
            </div>

            {/* Delete Account Section */}
            <div>
                <h3 className="text-lg font-semibold mb-4">Delete Account</h3>
                {!showDeleteConfirm ? (
                    <button
                        onClick={() => setShowDeleteConfirm(true)}
                        className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                    >
                        Delete Account
                    </button>
                ) : (
                    <div className="bg-red-50 border border-red-200 p-4 rounded">
                        <p className="text-red-700 mb-4">Are you sure you want to delete your account? This action cannot be undone.</p>
                        <div className="flex space-x-4">
                            <button
                                onClick={handleDeleteAccount}
                                className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                            >
                                Yes, Delete Account
                            </button>
                            <button
                                onClick={() => setShowDeleteConfirm(false)}
                                className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default UserSettings;