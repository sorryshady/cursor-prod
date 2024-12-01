"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  identifierSchema,
  setPasswordSchema,
  passwordSchema,
} from "@/lib/validations/auth";
import type {
  IdentifierInput,
  SetPasswordInput,
  PasswordInput,
} from "@/lib/validations/auth";
import { Wrapper } from "@/components/layout/wrapper";
import { PageBackground } from "@/components/layout/page-background";
import { PageHeader } from "@/components/layout/page-header";
import { Card, CardContent } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { FormMessage as CustomFormMessage } from "@/components/ui/form-message";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader2, ArrowLeft, Eye, EyeOff } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { SecurityQuestionType } from "@prisma/client";
import { PasswordStrength } from "@/components/auth/password-strength";

interface UserDetails {
  id: string;
  name: string;
  photoUrl: string | null;
  verificationStatus: "PENDING" | "VERIFIED" | "REJECTED";
  hasPassword: boolean;
}

export default function LoginPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [formError, setFormError] = useState("");
  const [step, setStep] = useState<"identifier" | "password" | "setup">(
    "identifier",
  );
  const [userDetails, setUserDetails] = useState<UserDetails | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const identifierForm = useForm<IdentifierInput>({
    resolver: zodResolver(identifierSchema),
    defaultValues: { identifier: "" },
  });

  const passwordForm = useForm<PasswordInput>({
    resolver: zodResolver(passwordSchema),
    defaultValues: { password: "" },
  });

  const setupPasswordForm = useForm<SetPasswordInput>({
    resolver: zodResolver(setPasswordSchema),
    defaultValues: {
      securityQuestion: SecurityQuestionType.MOTHERS_MAIDEN_NAME,
      securityAnswer: "",
      password: "",
      confirmPassword: "",
    },
  });

  const onIdentifierSubmit = async (data: IdentifierInput) => {
    setIsLoading(true);
    setFormError("");
    try {
      const response = await fetch("/api/auth/check-user", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error);
      }

      if (result.user.verificationStatus === "REJECTED") {
        throw new Error("Your account has been rejected");
      }

      if (result.user.verificationStatus === "PENDING") {
        throw new Error("Your account is pending verification");
      }

      setUserDetails(result.user);
      setStep(result.user.hasPassword ? "password" : "setup");
    } catch (error) {
      setFormError(
        error instanceof Error ? error.message : "Something went wrong",
      );
    } finally {
      setIsLoading(false);
    }
  };

  const onPasswordSubmit = async (data: PasswordInput) => {
    setIsLoading(true);
    setFormError("");
    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          identifier: identifierForm.getValues("identifier"),
          password: data.password,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error);
      }

      router.push("/dashboard");
    } catch (error) {
      setFormError(
        error instanceof Error ? error.message : "Invalid credentials",
      );
    } finally {
      setIsLoading(false);
    }
  };

  const onSetupPasswordSubmit = async (data: SetPasswordInput) => {
    setIsLoading(true);
    setFormError("");
    try {
      const response = await fetch("/api/auth/setup-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          identifier: identifierForm.getValues("identifier"),
          password: data.password,
          securityQuestion: data.securityQuestion,
          securityAnswer: data.securityAnswer,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error);
      }

      router.push("/dashboard");
    } catch (error) {
      setFormError(
        error instanceof Error ? error.message : "Something went wrong",
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <PageBackground className="opacity-10" imageType="body" />
      <Wrapper className="relative z-10 py-8">
        <div className="mx-auto max-w-md space-y-6">
          <PageHeader
            title="Login"
            description="Welcome back! Please enter your credentials."
          />

          <Card>
            <CardContent className="pt-6">
              {step === "identifier" ? (
                <Form {...identifierForm}>
                  <form
                    onSubmit={identifierForm.handleSubmit(onIdentifierSubmit)}
                    className="space-y-4"
                  >
                    <FormField
                      control={identifierForm.control}
                      name="identifier"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email or Membership ID</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Enter your email or membership ID"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    {formError && (
                      <CustomFormMessage type="error" message={formError} />
                    )}
                    <Button
                      type="submit"
                      className="w-full bg-[#20333C] hover:bg-[#20333C]/90"
                      size="lg"
                      disabled={isLoading}
                    >
                      {isLoading ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Checking...
                        </>
                      ) : (
                        "Continue"
                      )}
                    </Button>

                    <div className="text-center text-sm">
                      Don't have an account?{" "}
                      <Link href="/register" className="text-primary underline">
                        Sign up
                      </Link>
                    </div>
                  </form>
                </Form>
              ) : (
                <div className="space-y-6">
                  <Button
                    variant="ghost"
                    className="p-0 h-auto"
                    onClick={() => setStep("identifier")}
                  >
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Back
                  </Button>

                  {userDetails && (
                    <div className="text-center space-y-4">
                      <div className="relative h-20 w-20 mx-auto rounded-full overflow-hidden bg-muted">
                        {userDetails.photoUrl ? (
                          <Image
                            src={userDetails.photoUrl}
                            alt={userDetails.name}
                            width={80}
                            height={80}
                            className="object-cover"
                            priority
                          />
                        ) : (
                          <div className="absolute inset-0 flex items-center justify-center text-2xl font-semibold">
                            {userDetails.name[0].toUpperCase()}
                          </div>
                        )}
                      </div>
                      <div className="font-medium text-lg">{userDetails.name}</div>
                    </div>
                  )}

                  {step === "password" ? (
                    <Form {...passwordForm}>
                      <form
                        onSubmit={passwordForm.handleSubmit(onPasswordSubmit)}
                        className="space-y-4"
                      >
                        <FormField
                          control={passwordForm.control}
                          name="password"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Password</FormLabel>
                              <FormControl>
                                <div className="relative">
                                  <Input
                                    type={showPassword ? "text" : "password"}
                                    placeholder="Enter your password"
                                    {...field}
                                  />
                                  <Button
                                    type="button"
                                    variant="ghost"
                                    size="sm"
                                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                                    onClick={() => setShowPassword(!showPassword)}
                                  >
                                    {showPassword ? (
                                      <EyeOff className="h-4 w-4" />
                                    ) : (
                                      <Eye className="h-4 w-4" />
                                    )}
                                  </Button>
                                </div>
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        {formError && (
                          <CustomFormMessage type="error" message={formError} />
                        )}
                        <Button
                          type="submit"
                          className="w-full bg-[#20333C] hover:bg-[#20333C]/90"
                          size="lg"
                          disabled={isLoading}
                        >
                          {isLoading ? (
                            <>
                              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                              Logging in...
                            </>
                          ) : (
                            "Login"
                          )}
                        </Button>

                        <div className="text-center text-sm">
                          <Link
                            href="/forgot-password"
                            className="text-primary underline"
                          >
                            Forgot password?
                          </Link>
                        </div>
                      </form>
                    </Form>
                  ) : (
                    <Form {...setupPasswordForm}>
                      <form
                        onSubmit={setupPasswordForm.handleSubmit(
                          onSetupPasswordSubmit,
                        )}
                        className="space-y-4"
                      >
                        <FormField
                          control={setupPasswordForm.control}
                          name="securityQuestion"
                          render={({ field }) => {
                            return (
                              <FormItem>
                                <FormLabel>Security Question</FormLabel>
                                <Select
                                  onValueChange={field.onChange}
                                  defaultValue={field.value}
                                >
                                  <FormControl>
                                    <SelectTrigger>
                                      <SelectValue placeholder="Select a security question" />
                                    </SelectTrigger>
                                  </FormControl>
                                  <SelectContent>
                                    <SelectItem
                                      value={
                                        SecurityQuestionType.MOTHERS_MAIDEN_NAME
                                      }
                                    >
                                      Your mother&apos;s maiden name.
                                    </SelectItem>
                                    <SelectItem
                                      value={SecurityQuestionType.FAVOURITE_BOOK}
                                    >
                                      Your favourite book.
                                    </SelectItem>
                                    <SelectItem
                                      value={SecurityQuestionType.FAVOURITE_CAR}
                                    >
                                      Your favorite car.
                                    </SelectItem>
                                    <SelectItem
                                      value={SecurityQuestionType.FIRST_PET}
                                    >
                                      Your first pet.
                                    </SelectItem>
                                    <SelectItem
                                      value={SecurityQuestionType.FIRST_SCHOOL}
                                    >
                                      Your first school.
                                    </SelectItem>
                                  </SelectContent>
                                </Select>
                                <FormMessage />
                              </FormItem>
                            );
                          }}
                        />
                        <FormField
                          control={setupPasswordForm.control}
                          name="securityAnswer"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Security Answer</FormLabel>
                              <FormControl>
                                <Input
                                  placeholder="Enter your security answer"
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={setupPasswordForm.control}
                          name="password"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>New Password</FormLabel>
                              <FormControl>
                                <div className="relative">
                                  <Input
                                    type={showPassword ? "text" : "password"}
                                    placeholder="Create a password"
                                    {...field}
                                  />
                                  <Button
                                    type="button"
                                    variant="ghost"
                                    size="sm"
                                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                                    onClick={() => setShowPassword(!showPassword)}
                                  >
                                    {showPassword ? (
                                      <EyeOff className="h-4 w-4" />
                                    ) : (
                                      <Eye className="h-4 w-4" />
                                    )}
                                  </Button>
                                </div>
                              </FormControl>
                              <FormMessage />
                              <PasswordStrength password={field.value} />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={setupPasswordForm.control}
                          name="confirmPassword"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Confirm Password</FormLabel>
                              <FormControl>
                                <div className="relative">
                                  <Input
                                    type={showConfirmPassword ? "text" : "password"}
                                    placeholder="Confirm your password"
                                    {...field}
                                  />
                                  <Button
                                    type="button"
                                    variant="ghost"
                                    size="sm"
                                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                                    onClick={() =>
                                      setShowConfirmPassword(!showConfirmPassword)
                                    }
                                  >
                                    {showConfirmPassword ? (
                                      <EyeOff className="h-4 w-4" />
                                    ) : (
                                      <Eye className="h-4 w-4" />
                                    )}
                                  </Button>
                                </div>
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        {formError && (
                          <CustomFormMessage type="error" message={formError} />
                        )}
                        <Button
                          type="submit"
                          className="w-full bg-[#20333C] hover:bg-[#20333C]/90"
                          size="lg"
                          disabled={isLoading}
                        >
                          {isLoading ? (
                            <>
                              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                              Setting up password...
                            </>
                          ) : (
                            "Set Up Password"
                          )}
                        </Button>
                      </form>
                    </Form>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </Wrapper>
    </>
  );
}
