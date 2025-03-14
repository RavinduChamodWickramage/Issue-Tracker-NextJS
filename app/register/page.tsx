"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { useRouter } from "next/navigation";
import ErrorMessage from "@/app/components/ErrorMessage";
import { Button, TextField, Heading, Flex, Text, Card } from "@radix-ui/themes";
import { registerSchema } from "../schemas/registerSchema";
import { z } from "zod";
import { FaEye } from "react-icons/fa";
import { IoIosEyeOff, IoMdHome } from "react-icons/io";
import Link from "next/link";
import { useState } from "react";

type RegisterFormData = z.infer<typeof registerSchema>;

export default function RegisterPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data: RegisterFormData) => {
    try {
      await axios.post("/api/auth/register", data);
      router.push("/login");
    } catch (error) {
      console.error("Registration failed:", error);
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
              <Heading align="center" size="5">
                Register a New Account
              </Heading>
            </Flex>

            <form onSubmit={handleSubmit(onSubmit)}>
              <Flex direction="column" gap="4">
                <Flex direction="column" gap="1">
                  <Text as="label" size="2" weight="medium">
                    Name
                  </Text>
                  <TextField.Root
                    placeholder="Enter your name"
                    {...register("name")}
                    color={errors.name ? "red" : undefined}
                  />
                  <ErrorMessage>{errors.name?.message}</ErrorMessage>
                </Flex>

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

                <Button
                  type="submit"
                  color="green"
                  size="3"
                  style={{ width: "100%" }}
                >
                  Register
                </Button>

                <Flex justify="center" align="center" gap="1">
                  <Text size="2" color="gray">
                    Already have an account?
                  </Text>
                  <Link
                    className="flex items-center gap-1 text-green-500 hover:underline"
                    href="/login"
                    passHref
                  >
                    <Text weight="medium">Login here</Text>
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
