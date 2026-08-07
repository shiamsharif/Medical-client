"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Mail, MapPin, Phone } from "lucide-react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Card, Input, Label, Textarea } from "@/components/ui/core";
import { apiRequest } from "@/lib/api-client";

const schema = z.object({
  name: z.string().min(2, "Enter your name"),
  email: z.email(),
  message: z.string().min(10, "Tell us a little more"),
});
type Values = z.infer<typeof schema>;

export default function Page() {
  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm<Values>({ resolver: zodResolver(schema) });
  const submit = handleSubmit(async (values) => {
    try {
      await apiRequest("/api/contact", { method: "POST", body: values });
      toast.success("Message sent to our support team");
      reset();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Could not send your message");
    }
  });

  return <div className="container-shell section-space"><div className="grid gap-10 lg:grid-cols-[.8fr_1.2fr]"><div><p className="eyebrow">Contact us</p><h1 className="mt-3 text-4xl font-extrabold">We’re here to help.</h1><p className="mt-4 leading-7 text-muted-foreground">Questions about appointments, accounts, or the platform? Our care support team will point you in the right direction.</p><div className="mt-8 space-y-4">{[[Phone, "+880 9600 123 456", "24/7 emergency hotline"], [Mail, "care@medicareconnect.com", "Replies within one business day"], [MapPin, "Dhaka, Bangladesh", "Care support centre"]].map(([Icon, value, note]) => <Card key={value as string} className="flex gap-4 p-5"><span className="grid size-11 place-items-center rounded-xl bg-primary-soft text-primary"><Icon /></span><div><p className="font-bold">{value as string}</p><p className="text-sm text-muted-foreground">{note as string}</p></div></Card>)}</div></div><Card className="p-6 sm:p-8"><h2 className="text-xl font-extrabold">Send a message</h2><form className="mt-6 space-y-5" onSubmit={submit}><div><Label>Name</Label><Input {...register("name")} />{errors.name && <p className="mt-1 text-sm text-danger">{errors.name.message}</p>}</div><div><Label>Email</Label><Input type="email" {...register("email")} />{errors.email && <p className="mt-1 text-sm text-danger">Enter a valid email</p>}</div><div><Label>How can we help?</Label><Textarea {...register("message")} />{errors.message && <p className="mt-1 text-sm text-danger">{errors.message.message}</p>}</div><Button disabled={isSubmitting}>{isSubmitting ? "Sending…" : "Send message"}</Button></form></Card></div></div>;
}
