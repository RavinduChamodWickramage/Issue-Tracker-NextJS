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

const statusBadgeMap: Record<
  string,
  { label: string; bgColor: string; textColor: string }
> = {
  OPEN: { label: "Open", bgColor: "!bg-red-200", textColor: "!text-red-800" },
  IN_PROGRESS: {
    label: "In Progress",
    bgColor: "!bg-amber-200",
    textColor: "!text-amber-800",
  },
  CLOSED: {
    label: "Closed",
    bgColor: "!bg-green-200",
    textColor: "!text-green-800",
  },
};

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
    <section className="bg-gray-50 px-6 py-8">
      <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto lg:py-0">
        <div className="max-w-xl">
          <div className="mb-6 flex justify-between items-center">
            <Heading className="text-green-700">Update Issue</Heading>

            <div className="grid grid-cols-2 gap-1 text-sm font-small pl-10">
              <span className="text-gray-600">Created:</span>
              <span className="text-right">
                {new Date(issue.createdAt).toLocaleString()}
              </span>
              <span className="text-gray-600">Last Updated:</span>
              <span className="text-right">
                {new Date(issue.updatedAt).toLocaleString()}
              </span>
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
              <TextField.Root
                placeholder="Enter Title"
                {...register("title")}
              />
              {errors.title && (
                <ErrorMessage>{errors.title.message}</ErrorMessage>
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
                    value={field.value}
                    onValueChange={field.onChange}
                  >
                    <Select.Trigger
                      className={`w-full py-2 px-4 rounded !font-semibold ${
                        statusBadgeMap[
                          field.value as keyof typeof statusBadgeMap
                        ]?.bgColor || "bg-gray-500"
                      } ${
                        statusBadgeMap[
                          field.value as keyof typeof statusBadgeMap
                        ]?.textColor || "text-gray-800"
                      }`}
                    >
                      {statusBadgeMap[
                        field.value as keyof typeof statusBadgeMap
                      ]?.label || "Select Status"}
                    </Select.Trigger>

                    <Select.Content>
                      <Select.Item
                        className="hover:!bg-red-800 hover:!text-red-200 bg-red-200 text-red-800 m-1 font-semibold"
                        value="OPEN"
                      >
                        Open
                      </Select.Item>
                      <Select.Item
                        className="hover:!bg-amber-800 hover:!text-amber-200 bg-amber-200 text-amber-800 m-1 font-semibold"
                        value="IN_PROGRESS"
                      >
                        In Progress
                      </Select.Item>
                      <Select.Item
                        className="hover:!bg-green-800 hover:!text-green-200bg-green-200 text-green-800 m-1 font-semibold"
                        value="CLOSED"
                      >
                        Closed
                      </Select.Item>
                    </Select.Content>
                  </Select.Root>
                )}
              />

              {errors.status && (
                <ErrorMessage>{errors.status.message}</ErrorMessage>
              )}
            </div>

            <div className="flex gap-3 justify-end">
              <Button
                className="hover:!bg-sky-500 hover:!text-sky-100 !bg-sky-200 !text-sky-600 group flex items-center rounded-md text-sm font-medium px-4 py-2"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <Spinner /> Updating...
                  </>
                ) : (
                  "Update Issue"
                )}
              </Button>
              <Button
                className="hover:!bg-red-500 hover:!text-red-100 !bg-red-200 !text-red-600 group flex items-center rounded-md text-sm font-medium px-4 py-2"
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
      </div>
    </section>
  );
};

export default IssueDetailPage;
