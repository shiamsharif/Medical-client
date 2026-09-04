"use client";

/* eslint-disable @next/next/no-img-element -- Profile media comes from the separately deployed API at runtime, so Next cannot safely predeclare its host. */

import { Award, BriefcaseMedical, Heart, MapPin, Star } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { toast } from "sonner";
import { Badge, Card } from "@/components/ui/core";
import { Button } from "@/components/ui/button";
import { formatCurrency } from "@/lib/utils";
import { apiRequest } from "@/lib/api-client";
import type { Doctor } from "@/types";

export function DoctorCard({ doctor }: { doctor: Doctor }) {
  const [favorite, setFavorite] = useState(false);
  const [savingFavorite, setSavingFavorite] = useState(false);
  const toggleFavorite = async () => {
    setSavingFavorite(true);
    try {
      await apiRequest(`/api/favorites/${doctor.id}`, {
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
  return <Card className="group flex h-full flex-col overflow-hidden transition duration-300 hover:-translate-y-1 hover:shadow-xl"><div className="relative h-48 overflow-hidden bg-gradient-to-br from-primary-soft to-blue-50 dark:to-slate-800"><div className="absolute inset-0 grid place-items-center text-6xl font-extrabold text-primary/20">{doctor.name.slice(0, 2).toUpperCase()}</div>{doctor.image && <img src={doctor.image} alt={`Portrait of ${doctor.name}`} className="h-full w-full object-cover transition duration-500 group-hover:scale-105" />}<button disabled={savingFavorite} className="absolute right-3 top-3 grid size-10 place-items-center rounded-full bg-surface/90 shadow-sm disabled:opacity-60" aria-label={favorite ? "Remove from favorites" : "Add to favorites"} onClick={() => void toggleFavorite()}><Heart size={18} className={favorite ? "fill-danger text-danger" : "text-muted-foreground"} /></button>{doctor.verified && <Badge className="absolute bottom-3 left-3 gap-1 bg-surface/95"><Award size={13} /> Verified</Badge>}</div><div className="flex flex-1 flex-col p-5"><p className="text-xs font-bold uppercase tracking-wider text-secondary">{doctor.specialization}</p><h3 className="mt-1 text-lg font-extrabold">{doctor.name}</h3><div className="mt-3 space-y-2 text-sm text-muted-foreground"><p className="flex items-center gap-2"><BriefcaseMedical size={15} />{doctor.experience} years experience</p><p className="flex items-center gap-2"><MapPin size={15} />{doctor.hospital}</p></div><div className="mt-5 flex items-end justify-between border-t border-border pt-4"><div><p className="text-xs text-muted-foreground">Consultation</p><p className="font-extrabold text-primary">{formatCurrency(doctor.consultationFee)}</p></div><p className="flex items-center gap-1 text-sm font-bold"><Star className="fill-amber-400 text-amber-400" size={16} />{doctor.averageRating.toFixed(1)} <span className="font-normal text-muted-foreground">({doctor.reviewCount})</span></p></div><Button className="mt-5 w-full" variant="outline" asChild><Link href={`/doctors/${doctor.id}`}>View profile</Link></Button></div></Card>;
}
