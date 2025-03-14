import { Text } from "@radix-ui/themes";
import React from "react";
import { FieldError } from "react-hook-form";

type ErrorMessageProps = {
  children?: string | FieldError | null;
};

const ErrorMessage = ({ children }: ErrorMessageProps) => {
  if (!children) return null;

  const message = typeof children === "string" ? children : children.message;

  return (
    <Text color="red" as="p">
      {message}
    </Text>
  );
};

export default ErrorMessage;
