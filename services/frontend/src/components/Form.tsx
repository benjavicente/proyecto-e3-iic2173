import { useState, createContext, type ReactNode, useCallback } from "react";
import { Formik, Form as FormikForm, type FormikConfig } from "formik";

export type ClassTypes = {
  labelClassName?: string;
  inputClassName?: string;
  errorClassName?: string;
};

export type FormProps = ClassTypes & Parameters<typeof FormikForm>[0];

export const FormDefaultStyleContext = createContext<ClassTypes>({});

export default function Form({ inputClassName, errorClassName, labelClassName, children, ...props }: FormProps) {
  return (
    <FormDefaultStyleContext.Provider value={{ inputClassName, errorClassName, labelClassName }}>
      <FormikForm {...props}>{children}</FormikForm>
    </FormDefaultStyleContext.Provider>
  );
}
