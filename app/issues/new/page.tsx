"use client";

import { TextField, Button, Callout } from "@radix-ui/themes";
import React, { useState } from "react";
// import SimpleMDE from "react-simplemde-editor";
import "easymde/dist/easymde.min.css";
import { useForm, Controller } from "react-hook-form";
import axios, { AxiosError } from "axios";
import { useRouter } from "next/navigation";
import { CiCircleInfo } from "react-icons/ci";

// Dynamically import SimpleMDE with SSR disabled
import dynamic from "next/dynamic";
const SimpleMDE = dynamic(() => import("react-simplemde-editor"), {
  ssr: false,
});

interface IssueForm {
  title: string;
  description: string;
}

interface ErrorResponse {
  errors?: {
    title?: { _errors: string[] };
    description?: { _errors: string[] };
  };
  error?: string;
}

const IssueFormPage = () => {
  const router = useRouter();
  const { register, control, handleSubmit } = useForm<IssueForm>();
  const [error, setError] = useState("");
  const [fieldErrors, setFieldErrors] = useState<{
    title?: string;
    description?: string;
  }>({});

  const onSubmit = async (data: IssueForm) => {
    try {
      setError("");
      setFieldErrors({});
      await axios.post(`/api/issues`, data);
      router.push(`/issues`);
    } catch (err) {
      const error = err as AxiosError<ErrorResponse>;

      if (error.response) {
        if (error.response.status === 400 && error.response.data.errors) {
          const responseErrors = error.response.data.errors;
          const newFieldErrors: { title?: string; description?: string } = {};

          if (responseErrors.title?._errors?.length) {
            newFieldErrors.title = responseErrors.title._errors[0];
          }

          if (responseErrors.description?._errors?.length) {
            newFieldErrors.description = responseErrors.description._errors[0];
          }

          setFieldErrors(newFieldErrors);
          setError("Please fix the validation errors below.");
        } else if (error.response.status === 500 && error.response.data.error) {
          setError(error.response.data.error);
        } else {
          setError(`An error occurred: ${error.response.statusText}`);
        }
      } else if (error.request) {
        setError("Network error. Please check your connection and try again.");
      } else {
        setError("An unexpected error occurred. Please try again later.");
      }
    }
  };

  return (
    <div className="max-w-xl ">
      {error && (
        <Callout.Root color="red" className="mb-5">
          <Callout.Icon>
            <CiCircleInfo />
          </Callout.Icon>
          <Callout.Text>{error}</Callout.Text>
        </Callout.Root>
      )}

      <form className="space-y-3" onSubmit={handleSubmit(onSubmit)}>
        <div>
          <TextField.Root placeholder="Enter Title" {...register("title")} />
          {fieldErrors.title && (
            <p className="text-red-500 text-sm mt-1">{fieldErrors.title}</p>
          )}
        </div>

        <div>
          <Controller
            name="description"
            control={control}
            render={({ field }) => (
              <SimpleMDE placeholder="Description" {...field} />
            )}
          />
          {fieldErrors.description && (
            <p className="text-red-500 text-sm mt-1">
              {fieldErrors.description}
            </p>
          )}
        </div>

        <Button>Submit New Issue</Button>
      </form>
    </div>
  );
};

export default IssueFormPage;
