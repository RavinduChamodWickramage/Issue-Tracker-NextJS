"use client";

import { TextField, Button, Callout } from "@radix-ui/themes";
import React, { useState } from "react";
// import SimpleMDE from "react-simplemde-editor";
import "easymde/dist/easymde.min.css";
import { useForm, Controller } from "react-hook-form";
import axios from "axios";
import { useRouter } from "next/navigation";
import { CiCircleInfo } from "react-icons/ci";
import { zodResolver } from "@hookform/resolvers/zod";
import { createIssueSchema } from "@/app/createIssueSchema";
import { z } from "zod";

// Dynamically import SimpleMDE with SSR disabled
import dynamic from "next/dynamic";
import ErrorMessage from "@/app/components/ErrorMessage";
const SimpleMDE = dynamic(() => import("react-simplemde-editor"), {
  ssr: false,
});

type IssueForm = z.infer<typeof createIssueSchema>;

const IssueFormPage = () => {
  const router = useRouter();
  const {
    register,
    control,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm<IssueForm>({
    resolver: zodResolver(createIssueSchema),
  });
  const [error, setError] = useState("");

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

  return (
    <div className="max-w-xl">
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
        onSubmit={handleSubmit(onSubmit, (errors) => {
          if (errors.title && errors.description) {
            setError("Title & Description are required.");
          } else if (errors.title) {
            setError("Title is required.");
          } else if (errors.description) {
            setError("Description is required.");
          }
        })}
      >
        <div>
          <TextField.Root placeholder="Enter Title" {...register("title")} />
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
            {error.includes("Description") ? "Description is required." : ""}
          </ErrorMessage>
        </div>

        <Button disabled={isSubmitting}>
          {isSubmitting ? "Submitting..." : "Submit New Issue"}
        </Button>
      </form>
    </div>
  );
};

export default IssueFormPage;
