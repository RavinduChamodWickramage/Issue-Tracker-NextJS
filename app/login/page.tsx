"use client";

import { z } from "zod";
import { loginSchema } from "../schemas/loginSchema";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { signIn } from "next-auth/react";
import { IoIosEyeOff, IoMdHome } from "react-icons/io";
import {
  Button,
  Card,
  Checkbox,
  Flex,
  Heading,
  Text,
  TextField,
} from "@radix-ui/themes";
import { CiLogin } from "react-icons/ci";
import ErrorMessage from "../components/ErrorMessage";
import { FaEye } from "react-icons/fa";
import Link from "next/link";
import { IoCreateOutline } from "react-icons/io5";

type LoginFormData = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [generalError, setGeneralError] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormData) => {
    setIsLoading(true);
    setGeneralError("");

    try {
      const result = await signIn("credentials", {
        redirect: false,
        email: data.email,
        password: data.password,
      });

      if (result?.error) {
        setGeneralError(
          result.error === "CredentialsSignin"
            ? "Invalid email or password. Please try again."
            : "Login failed. Please check your connection and try again."
        );
      } else {
        router.push("/issues");
      }
    } catch (error) {
      console.error("Login error:", error);
      setGeneralError(
        "Login failed. Please check your connection and try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-gray-50 flex items-center justify-center px-6 py-8">
      <div className="w-full max-w-md">
        <Link href="/" className="flex items-center justify-center mb-6">
          <IoMdHome className="mr-2" />
          <Text size="5" weight="bold">
            Issues Tracker
          </Text>
        </Link>

        <Card className="p-6">
          <Flex direction="column" gap="4">
            <Flex align="center" justify="center" gap="2">
              <CiLogin size={24} />
              <Heading align="center" size="5">
                Login to Account
              </Heading>
            </Flex>

            {generalError && (
              <Text color="red" align="center" size="2">
                {generalError}
              </Text>
            )}

            <form onSubmit={handleSubmit(onSubmit)}>
              <Flex direction="column" gap="4">
                <Flex direction="column" gap="1">
                  <Text as="label" size="2" weight="medium">
                    Email
                  </Text>
                  <TextField.Root
                    type="email"
                    placeholder="Enter email"
                    {...register("email")}
                    color={errors.email ? "red" : undefined}
                  />
                  <ErrorMessage>{errors.email?.message}</ErrorMessage>
                </Flex>

                <Flex direction="column" gap="1">
                  <Text as="label" size="2" weight="medium">
                    Password
                  </Text>
                  <Flex align="center" className="w-full">
                    <TextField.Root
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter password"
                      {...register("password")}
                      color={errors.password ? "red" : undefined}
                      className="w-full mr-1"
                    />
                    <Button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="flex justify-center items-center !bg-blue-500"
                    >
                      {showPassword ? (
                        <FaEye size={20} />
                      ) : (
                        <IoIosEyeOff size={20} />
                      )}
                    </Button>
                  </Flex>
                  <ErrorMessage>{errors.password?.message}</ErrorMessage>
                </Flex>

                <Flex justify="between" align="center">
                  <Flex gap="2" align="end">
                    <Checkbox id="remember" />
                    <Text as="label" htmlFor="remember" size="2" color="gray">
                      Remember me
                    </Text>
                  </Flex>
                  <Link
                    href="/forgot-password"
                    className="text-green-500 hover:underline text-sm"
                  >
                    Forgot password?
                  </Link>
                </Flex>

                <Button
                  type="submit"
                  disabled={isLoading}
                  color="green"
                  size="3"
                  style={{ width: "100%" }}
                >
                  {isLoading ? "Logging in..." : "Login"}
                </Button>

                <Flex justify="center" align="center" gap="1">
                  <Text size="2" color="gray">
                    Don&apos;t have an account?
                  </Text>
                  <Link
                    className="flex items-center gap-1 text-green-500 hover:underline"
                    href="/register"
                    passHref
                  >
                    <IoCreateOutline />
                    <Text weight="medium">Register here</Text>
                  </Link>
                </Flex>
              </Flex>
            </form>
          </Flex>
        </Card>
      </div>
    </div>
  );
}
