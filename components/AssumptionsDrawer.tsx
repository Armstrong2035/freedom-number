"use client";

import { ASSUMPTION_ITEMS } from "@/lib/content";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

export function AssumptionsDrawer() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          className="text-sm text-muted-foreground underline-offset-4 hover:text-foreground hover:underline"
        >
          View calculation assumptions
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Calculation assumptions</DialogTitle>
          <DialogDescription>
            These assumptions can materially affect the result.
          </DialogDescription>
        </DialogHeader>
        <ul className="space-y-2.5">
          {ASSUMPTION_ITEMS.map((item) => (
            <li
              key={item}
              className="flex items-start gap-2.5 text-sm text-foreground"
            >
              <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
              {item}
            </li>
          ))}
        </ul>
      </DialogContent>
    </Dialog>
  );
}
