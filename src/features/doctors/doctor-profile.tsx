"use client";

/* eslint-disable @next/next/no-img-element -- Profile media comes from the separately deployed API at runtime, so Next cannot safely predeclare its host. */

import { useQuery } from "@tanstack/react-query";
import { Award, BriefcaseMedical, CalendarDays, GraduationCap, Heart, MapPin, Star } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Badge, Card, Skeleton } from "@/components/ui/core";
import { formatCurrency } from "@/lib/utils";
import { apiRequest } from "@/lib/api-client";
import { healthcareService } from "@/services/healthcare-service";

export function DoctorProfile({ id }: { id: string }) {
  const doctor = useQuery({ queryKey: ["doctor", id], queryFn: ({ signal }) => healthcareService.doctor(id, signal) });
  const [favorite, setFavorite] = useState(false);
  const [savingFavorite, setSavingFavorite] = useState(false);
  if (doctor.isPending) return <div className="container-shell section-space"><Skeleton className="h-[640px]" /></div>;
  if (!doctor.data) return <div className="container-shell section-space text-center"><h1 className="text-3xl font-extrabold">Doctor profile unavailable</h1><p className="mt-3 text-muted-foreground">This profile may have moved or is temporarily unavailable.</p><Button className="mt-6" asChild><Link href="/doctors">Browse doctors</Link></Button></div>;
  const d = doctor.data;
  const toggleFavorite = async () => {
    setSavingFavorite(true);
    try {
      await apiRequest(`/api/favorites/${d.id}`, {
        method: favorite ? "DELETE" : "POST",
      });
      setFavorite(!favorite);
      toast.success(favorite ? "Removed from favorites" : "Saved to favorites");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Could not update favorites");
    } finally {
      setSavingFavorite(false);
    }
  };
  return <div className="container-shell section-space"><div className="grid gap-8 lg:grid-cols-[1fr_360px]"><div><Card className="overflow-hidden"><div className="grid sm:grid-cols-[240px_1fr]"><div className="relative min-h-64 bg-primary-soft"><div className="absolute inset-0 grid place-items-center text-7xl font-extrabold text-primary/20">{d.name.slice(0, 2).toUpperCase()}</div>{d.image && <img className="h-full w-full object-cover" src={d.image} alt={`Portrait of ${d.name}`} />}</div><div className="p-7"><div className="flex flex-wrap items-start justify-between gap-4"><div><p className="text-sm font-bold uppercase tracking-wider text-secondary">{d.specialization}</p><h1 className="mt-2 text-3xl font-extrabold">{d.name}</h1></div>{d.verified && <Badge className="gap-1"><Award size={14} /> Verified doctor</Badge>}</div><p className="mt-4 flex items-center gap-2 font-bold"><Star className="fill-amber-400 text-amber-400" size={18} />{d.averageRating.toFixed(1)} <span className="font-normal text-muted-foreground">({d.reviewCount} reviews)</span></p><div className="mt-6 grid gap-4 text-sm sm:grid-cols-2"><p className="flex gap-2"><BriefcaseMedical className="text-primary" size={18} />{d.experience} years experience</p><p className="flex gap-2"><MapPin className="text-primary" size={18} />{d.hospital}</p><p className="flex gap-2"><GraduationCap className="text-primary" size={18} />{d.qualifications.join(", ")}</p><p className="flex gap-2"><CalendarDays className="text-primary" size={18} />{d.availableDays?.join(", ") || "Schedule varies"}</p></div></div></div></Card><section className="mt-8"><h2 className="text-2xl font-extrabold">About {d.name}</h2><p className="mt-4 leading-8 text-muted-foreground">{d.biography}</p></section><ReviewList doctorId={id} /></div><aside><Card className="sticky top-24 p-6"><p className="text-sm text-muted-foreground">Consultation fee</p><p className="mt-1 text-3xl font-extrabold text-primary">{formatCurrency(d.consultationFee)}</p><p className="mt-3 text-xs leading-5 text-muted-foreground">The displayed fee is informational. The backend confirms the current fee before payment.</p><Button className="mt-6 w-full" size="lg" asChild><Link href={`/book/${d.id}`}>Check availability</Link></Button><Button className="mt-3 w-full" variant="outline" disabled={savingFavorite} onClick={() => void toggleFavorite()}><Heart className={favorite ? "fill-danger text-danger" : ""} size={18} />{favorite ? "Saved" : "Save doctor"}</Button><div className="mt-6 border-t border-border pt-5"><p className="text-sm font-bold">Need help booking?</p><p className="mt-1 text-sm text-muted-foreground">Call +880 9600 123 456</p></div></Card></aside></div></div>;
}

function ReviewList({ doctorId }: { doctorId: string }) { const query = useQuery({ queryKey: ["reviews", doctorId], queryFn: ({ signal }) => healthcareService.reviews({ doctorId }, signal) }); return <section className="mt-10"><h2 className="text-2xl font-extrabold">Patient reviews</h2>{query.data?.length ? <div className="mt-5 space-y-4">{query.data.map((r) => <Card className="p-6" key={r.id}><p className="font-bold">{r.patientName} · <span className="text-amber-500">{r.rating}/5</span></p><p className="mt-2 leading-7 text-muted-foreground">{r.comment}</p></Card>)}</div> : <Card className="mt-5 p-8 text-center text-muted-foreground">No published reviews yet.</Card>}</section>; }
