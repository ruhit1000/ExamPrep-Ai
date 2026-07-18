"use client";

import { useState } from "react";
import { Input, Button, Card } from "@heroui/react";
import { useAuth } from "../../../context/AuthContext";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Mail, Lock, User } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

const registerSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid academic email address"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters long and contain both numbers and letters.")
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, "Password must be at least 8 characters long and contain both numbers and letters."),
});

export default function RegisterPage() {
  const { register: registerUser } = useAuth();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data) => {
    setIsLoading(true);
    try {
      const res = await registerUser(data.name, data.email, data.password);
      if (res?.data) {
        router.push("/dashboard");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-[calc(100vh-64px)] items-center justify-center p-4">
      <Card className="w-full max-w-md p-2 sm:p-4 shadow-xl border border-slate-100">
        <Card.Header className="flex flex-col gap-1 pb-0 pt-4 px-4 text-center">
          <h1 className="text-2xl font-bold text-navy-900">Create an Account</h1>
          <p className="text-sm text-slate-500">Join ExamPrep AI and defeat academic burnout</p>
        </Card.Header>
        <Card.Content className="px-4 py-6">
          <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
            <Input
              {...register("name")}
              type="text"
              label="Full Name"
              placeholder="John Doe"
              variant="bordered"
              isInvalid={!!errors.name}
              errorMessage={errors.name?.message}
              startContent={<User className="w-4 h-4 text-slate-400" />}
              classNames={{
                inputWrapper: errors.name ? "border-red-500" : "",
              }}
            />

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
              placeholder="Create a strong password"
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
              className="mt-4 w-full font-semibold bg-brand-indigo"
              isLoading={isLoading}
            >
              Sign Up
            </Button>
          </form>

          <p className="mt-6 text-center text-sm text-slate-600">
            Already have an account?{" "}
            <Link href="/login" className="font-semibold text-brand-indigo hover:underline">
              Sign in
            </Link>
          </p>
        </Card.Content>
      </Card>
    </div>
  );
}
