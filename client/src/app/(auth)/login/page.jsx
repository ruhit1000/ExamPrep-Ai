"use client";

import { Suspense, useState } from "react";
import { Input, Button, Card } from "@heroui/react";
import { useAuth } from "../../../context/AuthContext";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Mail, Lock } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

const loginSchema = z.object({
  email: z.string().email("Please enter a valid academic email address"),
  password: z.string().min(1, "Password is required"),
});

function LoginContent() {
  const { login } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/dashboard";
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data) => {
    setIsLoading(true);
    try {
      const res = await login(data.email, data.password);
      if (res?.data) {
        router.push(callbackUrl);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleDemoLogin = () => {
    setValue("email", "student@demo.com");
    setValue("password", "Password123");
    handleSubmit(onSubmit)();
  };

  return (
    <div className="flex min-h-[calc(100vh-64px)] items-center justify-center p-4">
      <Card className="w-full max-w-md p-2 sm:p-4 shadow-xl border border-slate-100">
        <Card.Header className="flex flex-col gap-1 pb-0 pt-4 px-4 text-center">
          <h1 className="text-2xl font-bold text-navy-900">Welcome Back</h1>
          <p className="text-sm text-slate-500">Sign in to continue your learning journey</p>
        </Card.Header>
        <Card.Content className="px-4 py-6">
          <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
            <Input
              {...register("email")}
              type="email"
              label="Email Address"
              placeholder="student@university.edu"
              variant="bordered"
              isInvalid={!!errors.email}
              errorMessage={errors.email?.message}
              startContent={<Mail className="w-4 h-4 text-slate-400" />}
              classNames={{
                inputWrapper: errors.email ? "border-red-500" : "",
              }}
            />

            <Input
              {...register("password")}
              type="password"
              label="Password"
              placeholder="Enter your password"
              variant="bordered"
              isInvalid={!!errors.password}
              errorMessage={errors.password?.message}
              startContent={<Lock className="w-4 h-4 text-slate-400" />}
              classNames={{
                inputWrapper: errors.password ? "border-red-500" : "",
              }}
            />

            <Button
              type="submit"
              color="primary"
              className="mt-2 w-full font-semibold bg-brand-indigo"
              isLoading={isLoading}
            >
              Sign In
            </Button>

            <div className="relative my-4">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-slate-200"></span>
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-white px-2 text-slate-400">Or</span>
              </div>
            </div>

            <Button
              type="button"
              variant="flat"
              className="w-full font-semibold bg-brand-emerald text-white hover:bg-emerald-600 shadow-sm"
              onClick={handleDemoLogin}
              isLoading={isLoading}
            >
              Login as Demo Student
            </Button>
          </form>

          <p className="mt-6 text-center text-sm text-slate-600">
            Don't have an account?{" "}
            <Link href="/register" className="font-semibold text-brand-indigo hover:underline">
              Create one
            </Link>
          </p>
        </Card.Content>
      </Card>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="flex min-h-[calc(100vh-64px)] items-center justify-center p-4">Loading...</div>}>
      <LoginContent />
    </Suspense>
  );
}
