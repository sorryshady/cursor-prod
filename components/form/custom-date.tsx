import React from "react";
import { useController } from "react-hook-form";
import { Input } from "../ui/input";
import { Control } from "react-hook-form";

type CustomDateProps = {
  name: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  control: Control<any>;
  placeholder?: string;
};

const CustomDate: React.FC<CustomDateProps> = ({
  name,
  control,
  placeholder = "DD/MM/YYYY",
}) => {
  const { field } = useController({
    name,
    control,
    defaultValue: "", // Ensure initial value is an empty string
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    let formattedValue = value.replace(/[^\d/]/g, "");

    // Handle deletion and insertion logic
    if (formattedValue.length > 2 && !formattedValue.includes("/")) {
      formattedValue = `${formattedValue.slice(0, 2)}/${formattedValue.slice(2)}`;
    }

    if (formattedValue.length > 5 && formattedValue.split("/").length < 3) {
      formattedValue = `${formattedValue.slice(0, 5)}/${formattedValue.slice(5)}`;
    }

    formattedValue = formattedValue.slice(0, 10);
    field.onChange(formattedValue);
  };

  return (
    <Input
      type="text"
      {...field}
      placeholder={placeholder}
      onChange={handleChange}
      maxLength={10}
    />
  );
};

export default CustomDate;
