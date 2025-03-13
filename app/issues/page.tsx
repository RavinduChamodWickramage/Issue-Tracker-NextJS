"use client";

import { Status } from "@prisma/client";
import { Button, Heading, Spinner, Table } from "@radix-ui/themes";
import axios from "axios";
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

const statusBadgeMap: Record<Status, { label: string; bgColor: string }> = {
  OPEN: { label: "Open", bgColor: "bg-red-500" },
  IN_PROGRESS: { label: "In Progress", bgColor: "bg-amber-500" },
  CLOSED: { label: "Closed", bgColor: "bg-green-500" },
};

const IssuesPage = () => {
  const [issues, setIssues] = useState<Issue[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchIssues = async () => {
      try {
        setIsLoading(true);
        const response = await axios.get("/api/issues");
        setIssues(response.data);
      } catch (err) {
        setError("An error occurred while fetching issues.");
        console.error("Error fetching issues:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchIssues();
  }, []);

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

      {issues.length === 0 ? (
        <p className="text-center text-gray-500 my-10">
          No issues found. Create your first issue to get started!
        </p>
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
                Created
              </Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell className="hidden md:table-cell text-green-900">
                Updated
              </Table.ColumnHeaderCell>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {issues.map((issue) => (
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
                  <span
                    className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium text-${
                      statusBadgeMap[issue.status].bgColor
                    }-700 bg-${statusBadgeMap[issue.status].bgColor}-100`}
                  >
                    {issue.description}
                  </span>
                </Table.Cell>
                <Table.Cell className="hidden md:table-cell">
                  <span
                    className={`inline-block px-2 py-1 rounded text-white font-bold ${
                      statusBadgeMap[issue.status].bgColor
                    }`}
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
