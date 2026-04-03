"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { registerUser } from "../actions/auth";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select";
import { toast } from "sonner";
import { User, Lock, Mail } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);

  // Form States
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("Intern");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    if (isLogin) {
      // --- LOGIN FLOW ---
      const result = await signIn("credentials", {
        redirect: false,
        email,
        password,
      });

      if (result?.error) {
        toast.error("Invalid email or password");
        setLoading(false);
      } else {
        toast.success("Welcome back!");
        router.push("/"); // Redirect to dashboard
        router.refresh(); // Refresh to update NextAuth session state
      }
    } else {
      // --- REGISTRATION FLOW ---
      const result = await registerUser({ name, email, password, role });

      if (result.success) {
        toast.success("Account created! Logging you in...");
        // Automatically log them in after creating the account
        await signIn("credentials", { redirect: false, email, password });
        router.push("/");
        router.refresh();
      } else {
        toast.error(result.error || "Something went wrong");
        setLoading(false);
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F4F7FB] p-6">
      <div className="w-full max-w-md bg-white rounded-2xl border border-[#E5EAF2] shadow-sm p-8">
        
        {/* Branding/Logo Placeholder */}
        <div className="flex justify-center mb-8">
          <img src="/dashlabs-logo.png" alt="Dashlabs" className="h-8" />
        </div>

        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-[#1E293B]">
            {isLogin ? "Welcome Back" : "Create an Account"}
          </h1>
          <p className="text-[#64748B] text-sm mt-2">
            {isLogin 
              ? "Sign in to access the Intern Endorsement System" 
              : "Register to start managing laboratory tickets"}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          
          {/* Name & Role (Only show if registering) */}
          {!isLogin && (
            <>
              <div className="space-y-2">
                <Label className="text-[#1E293B]">Full Name</Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#94A3B8]" />
                  <Input 
                    required 
                    value={name} 
                    onChange={(e) => setName(e.target.value)} 
                    placeholder="e.g. Dr. Sarah Chen" 
                    className="pl-10 bg-[#F8FAFC] border-[#E2E8F0] focus:ring-[#2F6FED]"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-[#1E293B]">Role</Label>
                <Select value={role} onValueChange={setRole}>
                  <SelectTrigger className="bg-[#F8FAFC] border-[#E2E8F0]">
                    <SelectValue placeholder="Select a role" />
                  </SelectTrigger>
                  <SelectContent className="bg-white z-50">
                    <SelectItem value="Intern">Intern</SelectItem>
                    <SelectItem value="QA Laboratory">QA Laboratory Supervisor</SelectItem>
                    <SelectItem value="Admin">System Admin</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </>
          )}

          {/* Email */}
          <div className="space-y-2">
            <Label className="text-[#1E293B]">Email Address</Label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#94A3B8]" />
              <Input 
                required 
                type="email"
                value={email} 
                onChange={(e) => setEmail(e.target.value)} 
                placeholder="intern@dashlabs.ai" 
                className="pl-10 bg-[#F8FAFC] border-[#E2E8F0] focus:ring-[#2F6FED]"
              />
            </div>
          </div>

          {/* Password */}
          <div className="space-y-2">
            <Label className="text-[#1E293B]">Password</Label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#94A3B8]" />
              <Input 
                required 
                type="password"
                value={password} 
                onChange={(e) => setPassword(e.target.value)} 
                placeholder="••••••••" 
                className="pl-10 bg-[#F8FAFC] border-[#E2E8F0] focus:ring-[#2F6FED]"
              />
            </div>
          </div>

          <Button 
            type="submit" 
            disabled={loading} 
            className="w-full bg-[#2F6FED] hover:bg-[#1D4ED8] text-white py-2.5 mt-2"
          >
            {loading ? "Please wait..." : (isLogin ? "Sign In" : "Create Account")}
          </Button>
        </form>

        {/* Toggle between Login and Register */}
        <div className="mt-8 text-center text-sm">
          <span className="text-[#64748B]">
            {isLogin ? "Don't have an account? " : "Already have an account? "}
          </span>
          <button 
            type="button"
            onClick={() => {
              setIsLogin(!isLogin);
              setLoading(false);
            }} 
            className="text-[#2F6FED] font-medium hover:underline"
          >
            {isLogin ? "Sign up" : "Sign in"}
          </button>
        </div>

      </div>
    </div>
  );
}