import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router';
import { AuthProvider } from './contexts/AuthContext';
import { AppShell } from './components/layout/AppShell';
import { ProtectedRoute } from './components/layout/ProtectedRoute';
import { LoginPage } from './features/auth/LoginPage';
import { RegisterPage } from './features/auth/RegisterPage';
import { WorkoutsPage } from './features/workouts/WorkoutsPage';
import { ExercisesPage } from './features/exercises/ExercisesPage';

import { ProfilePage } from './features/profile/ProfilePage';

const App: React.FC = () => {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          
          <Route element={<ProtectedRoute><AppShell /></ProtectedRoute>}>
            <Route path="/treinos" element={<WorkoutsPage />} />
            <Route path="/exercicios" element={<ExercisesPage />} />
            <Route path="/perfil" element={<ProfilePage />} />
          </Route>
          
          <Route path="*" element={<Navigate to="/treinos" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
};

export default App;
