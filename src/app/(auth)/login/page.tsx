"use client";

import { useState } from "react";
import { AuthBranding } from "@/components/auth/AuthBranding";
import { LoginForm } from "@/components/auth/LoginForm";
// PERBAIKAN BARIS 6: Hapus kurung kurawal agar membaca export default dari file asli
import SignupForm from "@/components/auth/SignupForm";

export default function AuthPage() {
  const [activeTab, setActiveTab] = useState<'masuk' | 'daftar'>('masuk');

  return (
    <AuthBranding activeTab={activeTab}>
      <LoginForm activeTab={activeTab} setActiveTab={setActiveTab} />
      <SignupForm activeTab={activeTab} setActiveTab={setActiveTab} />
    </AuthBranding>
  );
}
