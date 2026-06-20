import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import * as z from "zod";

import { Button } from "@/components/ui/button";

import { Checkbox } from "@/components/ui/checkbox";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSet,
} from "@/components/ui/field";
import type { Category } from "@/types";

interface FilterProps {
  filterList: { categories: Category[]; types: Category[] };
}

const formSchema = z.object({
  categories: z
    .array(z.string())
    .refine((value) => value.some((item) => item), {
      message: "You have to select at least one categories.",
    }),
  types: z.array(z.string()).refine((value) => value.some((item) => item), {
    message: "You have to select at least one types.",
  }),
});

export default function ProductFilter({ filterList }: FilterProps) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      categories: [],
      types: [],
    },
  });

  function onSubmit(data: z.infer<typeof formSchema>) {
    console.log("Submit data...", data);
  }

  return (
    <div className="space-y-8">
      <form id="form-rhf-checkbox" onSubmit={form.handleSubmit(onSubmit)}>
        <FieldGroup>
          <Controller
            name="categories"
            control={form.control}
            render={({ field, fieldState }) => (
              <FieldSet data-invalid={fieldState.invalid}>
                <FieldLegend variant="label">Furniture Made By</FieldLegend>

                <FieldGroup data-slot="checkbox-group">
                  {filterList.categories.map((task) => (
                    <Field
                      key={task.id}
                      orientation="horizontal"
                      data-invalid={fieldState.invalid}
                    >
                      <Checkbox
                        id={`form-rhf-checkbox-${task.id}`}
                        name={field.name}
                        aria-invalid={fieldState.invalid}
                        checked={field.value.includes(task.id)}
                        onCheckedChange={(checked) => {
                          const newValue = checked
                            ? [...field.value, task.id]
                            : field.value.filter((value) => value !== task.id);
                          field.onChange(newValue);
                        }}
                      />
                      <FieldLabel
                        htmlFor={`form-rhf-checkbox-${task.id}`}
                        className="font-normal"
                      >
                        {task.label}
                      </FieldLabel>
                    </Field>
                  ))}
                </FieldGroup>
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </FieldSet>
            )}
          />
        </FieldGroup>

        <FieldGroup className="py-8">
          <Controller
            name="types"
            control={form.control}
            render={({ field, fieldState }) => (
              <FieldSet data-invalid={fieldState.invalid}>
                <FieldLegend variant="label">Furniture Types</FieldLegend>

                <FieldGroup data-slot="checkbox-group">
                  {filterList.types.map((task) => (
                    <Field
                      key={task.id}
                      orientation="horizontal"
                      data-invalid={fieldState.invalid}
                    >
                      <Checkbox
                        id={`form-rhf-checkbox-${task.id}`}
                        name={field.name}
                        aria-invalid={fieldState.invalid}
                        checked={field.value.includes(task.id)}
                        onCheckedChange={(checked) => {
                          const newValue = checked
                            ? [...field.value, task.id]
                            : field.value.filter((value) => value !== task.id);
                          field.onChange(newValue);
                        }}
                      />
                      <FieldLabel
                        htmlFor={`form-rhf-checkbox-${task.id}`}
                        className="font-normal"
                      >
                        {task.label}
                      </FieldLabel>
                    </Field>
                  ))}
                </FieldGroup>
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </FieldSet>
            )}
          />
        </FieldGroup>
        <Field orientation="horizontal">
          <Button type="submit" variant="outline">
            Filter
          </Button>
        </Field>
      </form>
    </div>
  );
}
