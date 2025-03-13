"use client";

import "easymde/dist/easymde.min.css";
import ErrorMessage from "@/app/components/ErrorMessage";
import { updateIssueSchema } from "@/app/schemas/updateIssueSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { Status } from "@prisma/client";
import {
  Button,
  Callout,
  Heading,
  Select,
  Spinner,
  TextField,
} from "@radix-ui/themes";
import axios from "axios";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { CiCircleInfo } from "react-icons/ci";
import { z } from "zod";

// Dynamically import SimpleMDE with SSR disabled
import dynamic from "next/dynamic";
const SimpleMDE = dynamic(() => import("react-simplemde-editor"), {
  ssr: false,
});

type UpdateIssueForm = z.infer<typeof updateIssueSchema>;

interface Issue {
  id: number;
  title: string;
  description: string;
  status: Status;
  createdAt: string;
  updatedAt: string;
}

const IssueDetailPage = ({ params }: { params: Promise<{ id: string }> }) => {
  // Unwrap the params Promise using React.use()
  const resolvedParams = React.use(params);
  const issueId = resolvedParams.id;

  const router = useRouter();
  const [issue, setIssue] = useState<Issue | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [updateSuccess, setUpdateSuccess] = useState(false);

  const {
    register,
    control,
    handleSubmit,
    setValue,
    formState: { isSubmitting, errors },
  } = useForm<UpdateIssueForm>({ resolver: zodResolver(updateIssueSchema) });

  useEffect(() => {
    const fetchIssue = async () => {
      try {
        setIsLoading(true);
        const response = await axios.get(`/api/issues/${issueId}`);
        const issueData = response.data;
        setIssue(issueData);

        setValue("title", issueData.title);
        setValue("description", issueData.description);
        setValue("status", issueData.status);
      } catch (err) {
        setError("An error occurred while fetching the issue details.");
        console.error("Error fetching issue: ", err);
      } finally {
        setIsLoading(false);
      }
    };

    if (issueId) {
      fetchIssue();
    }
  }, [issueId, setValue]);

  const onSubmit = async (data: UpdateIssueForm) => {
    try {
      setError("");
      setUpdateSuccess(false);

      await axios.patch(`/api/issues/${issueId}`, data);

      setUpdateSuccess(true);
      setIssue({
        ...issue!,
        ...data,
        updatedAt: new Date().toISOString(),
      });

      setTimeout(() => setUpdateSuccess(false), 3000);
      router.push(`/issues`);
    } catch (err) {
      console.error("Error updating issue:", err);
      setError("An unexpected error occurred while updating the issue.");
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-96">
        <Spinner />
        <span className="ml-2">Loading issue details...</span>
      </div>
    );
  }

  if (error) {
    return <div className="text-red-500 p-4 text-center">{error}</div>;
  }

  if (!issue) {
    return <div className="text-center p-4">Issue not found.</div>;
  }

  return (
    <div className="max-w-xl">
      <div className="mb-5 flex justify-between items-center">
        <Heading>Update Issue</Heading>
        <div className="text-sm text-gray-500">
          <div>Created: {new Date(issue.createdAt).toLocaleString()}</div>
          <div>Last Updated: {new Date(issue.updatedAt).toLocaleString()}</div>
        </div>
      </div>

      {error && (
        <Callout.Root color="red" className="mb-5">
          <Callout.Icon>
            <CiCircleInfo />
          </Callout.Icon>
          <Callout.Text>{error}</Callout.Text>
        </Callout.Root>
      )}

      {updateSuccess && (
        <Callout.Root color="green" className="mb-5">
          <Callout.Text>Issue updated successfully!</Callout.Text>
        </Callout.Root>
      )}

      <form className="space-y-3" onSubmit={handleSubmit(onSubmit)}>
        <div>
          <TextField.Root placeholder="Enter Title" {...register("title")} />
          {errors.title && <ErrorMessage>{errors.title.message}</ErrorMessage>}
        </div>

        <div>
          <Controller
            name="description"
            control={control}
            render={({ field }) => (
              <SimpleMDE placeholder="Description" {...field} />
            )}
          />
          {errors.description && (
            <ErrorMessage>{errors.description.message}</ErrorMessage>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Status
          </label>
          <Controller
            name="status"
            control={control}
            render={({ field }) => (
              <Select.Root
                defaultValue={field.value}
                onValueChange={field.onChange}
              >
                <Select.Trigger />
                <Select.Content>
                  <Select.Item value="OPEN">Open</Select.Item>
                  <Select.Item value="IN_PROGRESS">In Progress</Select.Item>
                  <Select.Item value="CLOSED">Closed</Select.Item>
                </Select.Content>
              </Select.Root>
            )}
          />
          {errors.status && (
            <ErrorMessage>{errors.status.message}</ErrorMessage>
          )}
        </div>

        <div className="flex gap-3">
          <Button disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <Spinner /> Updating...
              </>
            ) : (
              "Update Issue"
            )}
          </Button>
          <Button
            type="button"
            variant="soft"
            color="gray"
            onClick={() => router.push("/issues")}
          >
            Cancel
          </Button>
        </div>
      </form>
    </div>
  );
};

export default IssueDetailPage;
