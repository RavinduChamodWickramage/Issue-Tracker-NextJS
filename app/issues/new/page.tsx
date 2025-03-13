"use client";

import { TextField, Button, Callout, Heading } from "@radix-ui/themes";
import React, { useState } from "react";
// import SimpleMDE from "react-simplemde-editor";
import "easymde/dist/easymde.min.css";
import { useForm, Controller, FieldErrors } from "react-hook-form";
import axios from "axios";
import { useRouter } from "next/navigation";
import { CiCircleInfo } from "react-icons/ci";
import { zodResolver } from "@hookform/resolvers/zod";
import { createIssueSchema } from "@/app/schemas/createIssueSchema";
import { z } from "zod";
import ErrorMessage from "@/app/components/ErrorMessage";
import Spinner from "@/app/components/Spinner";

// Dynamically import SimpleMDE with SSR disabled
import dynamic from "next/dynamic";
const SimpleMDE = dynamic(() => import("react-simplemde-editor"), {
  ssr: false,
});

type IssueForm = z.infer<typeof createIssueSchema>;

const IssueFormPage = () => {
  const router = useRouter();
  const [error, setError] = useState("");

  const {
    register,
    control,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm<IssueForm>({
    resolver: zodResolver(createIssueSchema),
  });

  const onSubmit = async (data: IssueForm) => {
    try {
      setError("");
      await axios.post(`/api/issues`, data);
      router.push(`/issues`);
    } catch (err) {
      console.error("Error submitting form:", err);
      setError("An unexpected error occurred. Please try again.");
    }
  };

  const handleFormErrors = (errors: FieldErrors<IssueForm>) => {
    if (errors.title && errors.description) {
      setError("Title & Description are required.");
    } else if (errors.title) {
      setError("Title is required.");
    } else if (errors.description) {
      setError("Description is required.");
    }
  };

  return (
    <section className="bg-gray-50 px-6 py-8">
      <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto lg:py-0">
        <div className="max-w-xl">
          <Heading className="text-green-700 pb-5">Submit Issue</Heading>
          {error && (
            <Callout.Root color="red" className="mb-5">
              <Callout.Icon>
                <CiCircleInfo />
              </Callout.Icon>
              <Callout.Text>{error}</Callout.Text>
            </Callout.Root>
          )}

          <form
            className="space-y-3"
            onSubmit={handleSubmit(onSubmit, handleFormErrors)}
          >
            <div>
              <TextField.Root
                placeholder="Enter Title"
                {...register("title")}
              />
              <ErrorMessage>
                {error.includes("Title") ? "Title is required." : ""}
              </ErrorMessage>
            </div>

            <div>
              <Controller
                name="description"
                control={control}
                render={({ field }) => (
                  <SimpleMDE placeholder="Description" {...field} />
                )}
              />
              <ErrorMessage>
                {error.includes("Description")
                  ? "Description is required."
                  : ""}
              </ErrorMessage>
            </div>

            <div className="flex justify-end">
              <Button
                className="hover:!bg-sky-200 hover:!text-sky-600 !bg-sky-500 !text-sky-100 group flex items-center rounded-md text-sm font-medium px-4 py-2"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <Spinner /> Submitting...
                  </>
                ) : (
                  "Submit New Issue"
                )}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
};

export default IssueFormPage;
