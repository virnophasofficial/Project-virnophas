// ========================================
// File: auth.js
// Tema: Logika Otentikasi Pengguna (Login/Daftar) dengan Supabase
// ========================================

import { supabase } from './supabaseClient.js';

export const handleSignIn = async (email, password) => {
    return await supabase.auth.signInWithPassword({ email, password });
};

export const handleSignUp = async (email, password, userData) => {
    return await supabase.auth.signUp({ 
        email, 
        password, 
        options: { data: userData } 
    });
};

export const handleSignOut = async () => {
    return await supabase.auth.signOut();
};

export const handlePasswordReset = async (email, redirectToUrl) => {
    return await supabase.auth.resetPasswordForEmail(email, { redirectTo: redirectToUrl });
};

export const handleUpdatePassword = async (newPassword) => {
    return await supabase.auth.updateUser({ password: newPassword });
};

export const getUserSession = async () => {
    return await supabase.auth.getSession();
};

export const onAuthStateChange = (callback) => {
    supabase.auth.onAuthStateChange(callback);
};

export const getCurrentUser = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    return user;
};
