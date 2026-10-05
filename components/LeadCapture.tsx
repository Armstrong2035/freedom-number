"use client";

import * as React from "react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { leadSchema, type LeadInput } from "@/lib/validation";
import { saveLead } from "@/lib/storage";
import { track } from "@/lib/analytics";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";

interface LeadCaptureProps {
  resultId: string;
}

export function LeadCapture({ resultId }: LeadCaptureProps) {
  const [submitted, setSubmitted] = React.useState(false);

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<LeadInput>({
    resolver: zodResolver(leadSchema),
    defaultValues: {
      firstName: "",
      email: "",
      phone: "",
      country: "",
      consent: false,
    },
  });

  React.useEffect(() => {
    track("lead_capture_started", { resultId });
  }, [resultId]);

  function onSubmit(data: LeadInput) {
    saveLead({ ...data, assessmentId: resultId, createdAt: new Date().toISOString() });
    track("lead_captured", { resultId });
    setSubmitted(true);
  }

  if (submitted) {
    return (
      <div className="rounded-xl border border-border bg-card p-8 text-center">
        <p className="text-lg font-semibold">Thank you.</p>
        <p className="mt-2 text-sm text-muted-foreground">
          Your details have been saved. We will be in touch.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      <div className="grid gap-5 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="firstName">First name</Label>
          <Input
            id="firstName"
            autoComplete="given-name"
            {...register("firstName")}
          />
          {errors.firstName ? (
            <p className="text-sm text-destructive">{errors.firstName.message}</p>
          ) : null}
        </div>

        <div className="space-y-2">
          <Label htmlFor="email">Email address</Label>
          <Input id="email" type="email" autoComplete="email" {...register("email")} />
          {errors.email ? (
            <p className="text-sm text-destructive">{errors.email.message}</p>
          ) : null}
        </div>

        <div className="space-y-2">
          <Label htmlFor="phone">
            Phone number <span className="text-muted-foreground">(optional)</span>
          </Label>
          <Input id="phone" type="tel" autoComplete="tel" {...register("phone")} />
        </div>

        <div className="space-y-2">
          <Label htmlFor="country">
            Country <span className="text-muted-foreground">(optional)</span>
          </Label>
          <Input id="country" autoComplete="country-name" {...register("country")} />
        </div>
      </div>

      <div className="space-y-2">
        <Controller
          name="consent"
          control={control}
          render={({ field }) => (
            <label className="flex cursor-pointer items-start gap-3 text-sm">
              <Checkbox
                ref={field.ref}
                checked={field.value === true}
                onCheckedChange={(checked) => field.onChange(checked === true)}
                onBlur={field.onBlur}
              />
              <span className="text-muted-foreground">
                I agree to receive communications from Okunbo Capital.
              </span>
            </label>
          )}
        />
        {errors.consent ? (
          <p className="text-sm text-destructive">{errors.consent.message}</p>
        ) : null}
      </div>

      <Button type="submit" size="lg" className="w-full">
        Email Me My Results
      </Button>
    </form>
  );
}
