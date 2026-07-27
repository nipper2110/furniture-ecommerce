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
  categories: Category[];
  types: Category[];
}

interface ProductFilterProps {
  filterList: FilterProps;
  selectedCategory: string[];
  selectedType: string[];
  onFilterChange: (category: string[], type: string[]) => void;
}

const formSchema = z.object({
  categories: z.array(z.string()),
  // .refine((value) => value.some((item) => item), {
  //   message: "You have to select at least one categories.",
  // }),
  types: z.array(z.string()),
  // .refine((value) => value.some((item) => item), {
  //   message: "You have to select at least one types.",
  // }),
});

export default function ProductFilter({
  filterList,
  selectedCategory,
  selectedType,
  onFilterChange,
}: ProductFilterProps) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      categories: selectedCategory,
      types: selectedType,
    },
  });

  function onSubmit(data: z.infer<typeof formSchema>) {
    // console.log("Submit data...", data);
    onFilterChange(data.categories, data.types);
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
                  {filterList.categories.map((item) => (
                    <Field
                      key={item.id}
                      orientation="horizontal"
                      data-invalid={fieldState.invalid}
                    >
                      <Checkbox
                        id={`form-rhf-checkbox-${item.id}`}
                        name={field.name}
                        aria-invalid={fieldState.invalid}
                        checked={field.value.includes(item.id.toString())}
                        onCheckedChange={(checked) => {
                          const newValue = checked
                            ? [...field.value, item.id.toString()]
                            : field.value.filter(
                                (value) => value !== item.id.toString(),
                              );
                          field.onChange(newValue);
                        }}
                      />
                      <FieldLabel
                        htmlFor={`form-rhf-checkbox-${item.id}`}
                        className="font-normal"
                      >
                        {item.name}
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
                  {filterList.types.map((item) => (
                    <Field
                      key={item.id}
                      orientation="horizontal"
                      data-invalid={fieldState.invalid}
                    >
                      <Checkbox
                        id={`form-rhf-checkbox-${item.id.toString()}`}
                        name={field.name}
                        aria-invalid={fieldState.invalid}
                        checked={field.value.includes(item.id.toString())}
                        onCheckedChange={(checked) => {
                          const newValue = checked
                            ? [...field.value, item.id.toString()]
                            : field.value.filter(
                                (value) => value !== item.id.toString(),
                              );
                          field.onChange(newValue);
                        }}
                      />
                      <FieldLabel
                        htmlFor={`form-rhf-checkbox-${item.id}`}
                        className="font-normal"
                      >
                        {item.name}
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
