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

const statusBadgeMap: Record<Status, { label: string; color: string }> = {
  OPEN: { label: "Open", color: "red" },
  IN_PROGRESS: { label: "In Progress", color: "amber" },
  CLOSED: { label: "Closed", color: "green" },
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
        <Heading>Issues</Heading>
        <Button>
          <Link href="/issues/new">New Issue</Link>
        </Button>
      </div>

      {issues.length === 0 ? (
        <p className="text-center text-gray-500 my-10">
          No issues found. Create your first issue to get started!
        </p>
      ) : (
        <Table.Root variant="surface">
          <Table.Header>
            <Table.Row>
              <Table.ColumnHeaderCell>Issue</Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell className="hidden md:table-cell">
                Description
              </Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell className="hidden md:table-cell">
                Status
              </Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell className="hidden md:table-cell">
                Created
              </Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell className="hidden md:table-cell">
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
                      className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium text-${
                        statusBadgeMap[issue.status].color
                      }-700 bg-${statusBadgeMap[issue.status].color}-100`}
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
                      statusBadgeMap[issue.status].color
                    }-700 bg-${statusBadgeMap[issue.status].color}-100`}
                  >
                    {issue.description}
                  </span>
                </Table.Cell>
                <Table.Cell className="hidden md:table-cell">
                  <span
                    className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium text-${
                      statusBadgeMap[issue.status].color
                    }-700 bg-${statusBadgeMap[issue.status].color}-100`}
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
