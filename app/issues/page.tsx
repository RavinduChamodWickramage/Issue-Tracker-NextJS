"use client";

import { Status } from "@prisma/client";
import {
  Button,
  Heading,
  Select,
  Spinner,
  Table,
  TextField,
} from "@radix-ui/themes";
import { Label } from "@radix-ui/themes/components/context-menu";
import axios, { AxiosError } from "axios";
import Link from "next/link";
import React, { useEffect, useState } from "react";

interface Issue {
  id: number;
  title: string;
  description: string;
  status: Status;
  createdAt: string;
  updatedAt: string;
}

const statusBadgeMap: Record<
  Status,
  { label: string; bgColor: string; textColor: string }
> = {
  OPEN: { label: "Open", bgColor: "bg-red-200", textColor: "text-red-800" },
  IN_PROGRESS: {
    label: "In Progress",
    bgColor: "bg-amber-200",
    textColor: "text-amber-800",
  },
  CLOSED: {
    label: "Closed",
    bgColor: "bg-green-200",
    textColor: "text-green-800",
  },
};

const IssuesPage = () => {
  const [issues, setIssues] = useState<Issue[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [filteredIssues, setFilteredIssues] = useState<Issue[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<Status | "ALL">("ALL");
  const [createdDateFilter, setCreatedDateFilter] = useState<string>("");
  const [updatedDateFilter, setUpdatedDateFilter] = useState<string>("");

  useEffect(() => {
    const fetchIssues = async () => {
      try {
        setIsLoading(true);
        const response = await axios.get("/api/issues");
        setIssues(response.data);
        setFilteredIssues(response.data);
      } catch (err) {
        if (err instanceof AxiosError) {
          setError(
            err.response?.data?.message ||
              "An error occurred while fetching issues."
          );
        } else if (err instanceof Error) {
          setError(err.message);
        } else {
          setError("An unexpected error occurred.");
        }
        console.error("Error fetching issues:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchIssues();
  }, []);

  useEffect(() => {
    const filtered = issues.filter((issue) => {
      const matchesSearch = issue.title
        .toLowerCase()
        .includes(searchQuery.toLowerCase());
      const matchesStatus =
        statusFilter === "ALL" || !statusFilter
          ? true
          : issue.status === statusFilter;
      const matchesCreatedDate = createdDateFilter
        ? new Date(issue.createdAt).toDateString() ===
          new Date(createdDateFilter).toDateString()
        : true;
      const matchesUpdatedDate = updatedDateFilter
        ? new Date(issue.updatedAt).toDateString() ===
          new Date(updatedDateFilter).toDateString()
        : true;

      return (
        matchesSearch &&
        matchesStatus &&
        matchesCreatedDate &&
        matchesUpdatedDate
      );
    });

    setFilteredIssues(filtered);
  }, [searchQuery, statusFilter, createdDateFilter, updatedDateFilter]);

  const clearFilters = () => {
    setSearchQuery("");
    setStatusFilter("ALL");
    setCreatedDateFilter("");
    setUpdatedDateFilter("");
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-96">
        <Spinner />
        <span className="ml-2">Loading issues...</span>
      </div>
    );
  }

  if (error) {
    return <div className="text-red-500 p-4 text-center">{error}</div>;
  }

  return (
    <div className="space-y-5">
      <div className="flex justify-between items-center">
        <Heading className="text-green-700">Issues</Heading>
        <Link href="/issues/new">
          <Button
            aria-label="Create new issue"
            data-accent-color="none"
            className="hover:!bg-sky-100 hover:!text-sky-600 !bg-sky-500 !text-sky-100 group flex items-center rounded-md text-sm font-medium px-4 py-2"
          >
            <svg
              className="group-hover:!text-sky-600 !text-sky-100 mr-2"
              width="12"
              height="20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M6 5a1 1 0 011 1v3h3a1 1 0 110 2H7v3a1 1 0 11-2 0v-3H2a1 1 0 110-2h3V6a1 1 0 011-1z"
              />
            </svg>
            New Issue
          </Button>
        </Link>
      </div>

      <div className="mb-4 flex gap-6 items-center justify-between w-full">
        <TextField.Root
          className="w-1/2"
          placeholder="Search by title"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <Select.Root
          value={statusFilter}
          onValueChange={(value) => setStatusFilter(value as Status | "ALL")}
        >
          <Select.Trigger className="w-full py-2 px-4 rounded">
            {statusFilter === "ALL" || !statusFilter
              ? "Filter by Status"
              : statusFilter}
          </Select.Trigger>
          <Select.Content>
            <Select.Item value="ALL">All</Select.Item>
            <Select.Item value="OPEN">Open</Select.Item>
            <Select.Item value="IN_PROGRESS">In Progress</Select.Item>
            <Select.Item value="CLOSED">Closed</Select.Item>
          </Select.Content>
        </Select.Root>
        <Label>Created At:</Label>
        <TextField.Root
          type="date"
          className="w-1/12"
          value={createdDateFilter}
          onChange={(e) => setCreatedDateFilter(e.target.value)}
        />
        <Label>Updated At:</Label>
        <TextField.Root
          type="date"
          className="w-1/12"
          value={updatedDateFilter}
          onChange={(e) => setUpdatedDateFilter(e.target.value)}
        />
        <Button onClick={clearFilters} variant="soft">
          Clear Filters
        </Button>
      </div>

      {filteredIssues.length === 0 ? (
        <p className="text-center text-gray-500 my-10">No issues found.</p>
      ) : (
        <Table.Root variant="surface">
          <Table.Header>
            <Table.Row>
              <Table.ColumnHeaderCell className="text-green-900">
                Issue
              </Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell className="hidden md:table-cell text-green-900">
                Description
              </Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell className="hidden md:table-cell text-green-900">
                Status
              </Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell className="hidden md:table-cell text-green-900">
                Created At
              </Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell className="hidden md:table-cell text-green-900">
                Updated At
              </Table.ColumnHeaderCell>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {filteredIssues.map((issue) => (
              <Table.Row key={issue.id}>
                <Table.Cell>
                  <Link
                    href={`/issues/${issue.id}`}
                    className="text-blue-600 hover:underline font-medium"
                  >
                    {issue.title}
                  </Link>
                  <div className="block md:hidden mt-1 text-sm text-gray-500">
                    <div className="mb-1 text-gray-700 line-clamp-2">
                      {issue.description.length > 100
                        ? `${issue.description.substring(0, 100)}...`
                        : issue.description}
                    </div>
                    <span
                      className={`inline-block px-2 py-1 rounded text-white font-bold ${
                        statusBadgeMap[issue.status].bgColor
                      }`}
                    >
                      {statusBadgeMap[issue.status].label}
                    </span>
                    <span className="ml-2">
                      {new Date(issue.createdAt).toLocaleDateString()}
                    </span>
                    <span className="ml-2">
                      {new Date(issue.updatedAt).toLocaleDateString()}
                    </span>
                  </div>
                </Table.Cell>
                <Table.Cell className="hidden md:table-cell">
                  {issue.description}
                </Table.Cell>
                <Table.Cell className="hidden md:table-cell">
                  <span
                    className={`inline-block px-2 py-1 rounded font-bold ${
                      statusBadgeMap[issue.status].bgColor
                    } ${statusBadgeMap[issue.status].textColor}`}
                  >
                    {statusBadgeMap[issue.status].label}
                  </span>
                </Table.Cell>
                <Table.Cell className="hidden md:table-cell">
                  {new Date(issue.createdAt).toLocaleDateString()}
                </Table.Cell>
                <Table.Cell className="hidden md:table-cell">
                  {new Date(issue.updatedAt).toLocaleDateString()}
                </Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table.Root>
      )}
    </div>
  );
};

export default IssuesPage;
