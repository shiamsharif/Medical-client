"use client";

import { useQuery, useQueryClient } from "@tanstack/react-query";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell as ChartCell,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import {
  CalendarCheck,
  CheckCircle2,
  CircleDollarSign,
  Clock3,
  FileHeart,
  Heart,
  Plus,
  Search,
  Star,
  Trash2,
  UserCheck,
  Users,
} from "lucide-react";
import { useFieldArray, useForm } from "react-hook-form";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Badge,
  Card,
  Input,
  Label,
  Select,
  Skeleton,
  Textarea,
} from "@/components/ui/core";
import { apiRequest } from "@/lib/api-client";
import { useSession } from "@/lib/auth-client";
import { useCurrentUser } from "@/lib/current-user";
import { formatCurrency, formatDate } from "@/lib/utils";
import type { Appointment, Doctor, Paginated, UserRole } from "@/types";

interface DashboardSummary {
  metrics: { label: string; value: number | string; trend?: string }[];
  recentActivity: {
    id: string;
    title: string;
    detail: string;
    createdAt: string;
  }[];
}
interface AnalyticsData {
  appointmentsOverTime: { label: string; value: number }[];
  appointmentsByStatus: { name: string; value: number }[];
  revenueTrend: { label: string; value: number }[];
}
interface Payment {
  id: string;
  transactionId: string;
  patientName: string;
  doctorName: string;
  amount: number;
  status: string;
  createdAt: string;
}
interface UserRecord {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  status: string;
}

export function DashboardContent({
  section = "overview",
}: {
  section?: string;
}) {
  const { data: session } = useSession();
  const { data: currentUser } = useCurrentUser(Boolean(session));
  const role = currentUser?.role ?? "patient";
  const titles: Record<string, [string, string]> = {
    overview: ["Welcome back", "Here’s what’s happening with your care today."],
    appointments: [
      role === "admin" ? "All appointments" : "My appointments",
      "Track visits, statuses, and payment progress.",
    ],
    requests: [
      "Appointment requests",
      "Review and manage your consultation queue.",
    ],
    payments: [
      "Payment history",
      "A clear record of transactions and their status.",
    ],
    favorites: [
      "Favorite doctors",
      "Professionals you saved for quick access.",
    ],
    reviews: [
      "My reviews",
      "Manage feedback you’ve shared after eligible visits.",
    ],
    prescriptions: [
      "Prescriptions",
      "Create or review medication and care instructions.",
    ],
    schedule: [
      "Schedule management",
      "Keep your weekly availability accurate.",
    ],
    profile: [
      role === "doctor" ? "Professional profile" : "My profile",
      "Keep account and care information up to date.",
    ],
    users: ["Manage users", "Search, filter, and manage platform access."],
    doctors: [
      "Doctor verification",
      "Review professional information before changing status.",
    ],
    analytics: [
      "Platform analytics",
      "Monitor appointments, status mix, and payment trends.",
    ],
    settings: ["Platform settings", "Manage administrative preferences."],
  };
  const [title, subtitle] = titles[section] ?? [
    "Dashboard",
    "Manage your MediCare Connect account.",
  ];
  return (
    <>
      <div className="mb-7">
        <h1 className="text-3xl font-extrabold tracking-tight">
          {title}
          {section === "overview" && session?.user.name
            ? `, ${session.user.name.split(" ")[0]}`
            : ""}
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">{subtitle}</p>
      </div>
      {section === "overview" ? (
        <Overview role={role} />
      ) : section === "appointments" || section === "requests" ? (
        <Appointments role={role} />
      ) : section === "payments" ? (
        <Payments />
      ) : section === "favorites" ? (
        <Favorites />
      ) : section === "reviews" ? (
        <Reviews />
      ) : section === "prescriptions" ? (
        <Prescriptions role={role} />
      ) : section === "schedule" ? (
        <Schedule />
      ) : section === "profile" ? (
        <Profile role={role} />
      ) : section === "users" ? (
        <UsersPanel />
      ) : section === "doctors" ? (
        <DoctorsPanel />
      ) : section === "analytics" ? (
        <Analytics />
      ) : (
        <Empty
          title="This workspace is ready"
          description="Connect the corresponding backend endpoint to manage this area."
        />
      )}
    </>
  );
}

function Overview({ role }: { role: UserRole }) {
  const q = useQuery({
    queryKey: ["dashboard-summary", role],
    queryFn: ({ signal }) =>
      apiRequest<DashboardSummary>(`/api/dashboard/${role}/summary`, {
        signal,
      }),
  });
  const icons = [CalendarCheck, Clock3, CircleDollarSign, Heart, Users, Star];
  if (q.isPending) return <GridSkeleton />;
  if (!q.data)
    return (
      <Empty
        title="Your overview is taking a breather"
        description="Dashboard metrics will appear when the backend is available."
      />
    );
  return (
    <>
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {q.data.metrics.map((metric, i) => {
          const Icon = icons[i % icons.length];
          return (
            <Card key={metric.label} className="p-5">
              <div className="flex items-start justify-between">
                <span className="grid size-11 place-items-center rounded-xl bg-primary-soft text-primary">
                  <Icon size={21} />
                </span>
                {metric.trend && <Badge>{metric.trend}</Badge>}
              </div>
              <p className="mt-5 text-3xl font-extrabold">{metric.value}</p>
              <p className="mt-1 text-sm text-muted-foreground">
                {metric.label}
              </p>
            </Card>
          );
        })}
      </div>
      <Card className="mt-6 p-6">
        <h2 className="text-lg font-extrabold">Recent activity</h2>
        <div className="mt-4 divide-y divide-border">
          {q.data.recentActivity.length ? (
            q.data.recentActivity.map((item) => (
              <div key={item.id} className="flex gap-4 py-4">
                <span className="mt-1 size-2 rounded-full bg-primary" />
                <div>
                  <p className="font-semibold">{item.title}</p>
                  <p className="text-sm text-muted-foreground">
                    {item.detail} · {formatDate(item.createdAt)}
                  </p>
                </div>
              </div>
            ))
          ) : (
            <p className="py-8 text-center text-sm text-muted-foreground">
              No recent activity yet.
            </p>
          )}
        </div>
      </Card>
    </>
  );
}

function Appointments({ role }: { role: UserRole }) {
  const client = useQueryClient();
  const q = useQuery({
    queryKey: ["appointments", role],
    queryFn: ({ signal }) =>
      apiRequest<Paginated<Appointment>>(
        role === "admin"
          ? "/api/admin/appointments"
          : role === "doctor"
            ? "/api/doctor/appointments"
            : "/api/appointments/me",
        { query: { page: 1, limit: 20 }, signal },
      ),
  });
  const action = async (id: string, status: string) => {
    if (!window.confirm(`Confirm changing this appointment to ${status}?`))
      return;
    try {
      await apiRequest(`/api/appointments/${id}/status`, {
        method: "PATCH",
        body: { status },
      });
      toast.success("Appointment updated");
      client.invalidateQueries({ queryKey: ["appointments"] });
    } catch (e) {
      toast.error(
        e instanceof Error ? e.message : "Could not update appointment",
      );
    }
  };
  if (q.isPending) return <TableSkeleton />;
  return (
    <DataTable
      headers={[
        role === "doctor" ? "Patient" : "Doctor",
        "Specialization",
        "Date & time",
        "Status",
        "Payment",
        "Actions",
      ]}
      empty="No appointments match this view."
    >
      {q.data?.data.map((item) => (
        <tr key={item.id} className="border-t border-border">
          <Cell strong>
            {role === "doctor" ? item.patientName : item.doctorName}
          </Cell>
          <Cell>{item.specialization}</Cell>
          <Cell>
            {formatDate(item.date)} · {item.time}
          </Cell>
          <Cell>
            <Status value={item.status} />
          </Cell>
          <Cell>
            <Status value={item.paymentStatus} />
          </Cell>
          <Cell>
            <div className="flex gap-2">
              {role === "doctor" && item.status === "pending" && (
                <>
                  <Button
                    size="sm"
                    onClick={() => action(item.id, "confirmed")}
                  >
                    Accept
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => action(item.id, "rejected")}
                  >
                    Reject
                  </Button>
                </>
              )}
              {role === "doctor" && item.status === "confirmed" && (
                <Button size="sm" onClick={() => action(item.id, "completed")}>
                  Complete
                </Button>
              )}
              {role === "patient" &&
                ["pending", "confirmed"].includes(item.status) && (
                  <Button
                    size="sm"
                    variant="danger"
                    onClick={() => action(item.id, "cancelled")}
                  >
                    Cancel
                  </Button>
                )}
            </div>
          </Cell>
        </tr>
      ))}
    </DataTable>
  );
}

function Payments() {
  const q = useQuery({
    queryKey: ["payments"],
    queryFn: ({ signal }) =>
      apiRequest<Paginated<Payment>>("/api/payments", {
        query: { page: 1, limit: 20 },
        signal,
      }),
  });
  if (q.isPending) return <TableSkeleton />;
  return (
    <DataTable
      headers={["Transaction", "Patient", "Doctor", "Amount", "Date", "Status"]}
      empty="No payment records found."
    >
      {q.data?.data.map((p) => (
        <tr key={p.id} className="border-t border-border">
          <Cell strong>{p.transactionId}</Cell>
          <Cell>{p.patientName}</Cell>
          <Cell>{p.doctorName}</Cell>
          <Cell>{formatCurrency(p.amount)}</Cell>
          <Cell>{formatDate(p.createdAt)}</Cell>
          <Cell>
            <Status value={p.status} />
          </Cell>
        </tr>
      ))}
    </DataTable>
  );
}

function Favorites() {
  const q = useQuery({
    queryKey: ["favorites"],
    queryFn: ({ signal }) => apiRequest<Doctor[]>("/api/favorites", { signal }),
  });
  return q.isPending ? (
    <GridSkeleton />
  ) : q.data?.length ? (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
      {q.data.map((d) => (
        <Card className="p-5" key={d.id}>
          <div className="flex items-center gap-4">
            <span className="grid size-12 place-items-center rounded-xl bg-primary-soft font-bold text-primary">
              {d.name[0]}
            </span>
            <div>
              <p className="font-bold">{d.name}</p>
              <p className="text-sm text-secondary">{d.specialization}</p>
            </div>
          </div>
          <div className="mt-5 flex gap-2">
            <Button size="sm" className="flex-1">
              View profile
            </Button>
            <Button size="icon" variant="outline" aria-label="Remove favorite">
              <Trash2 size={16} />
            </Button>
          </div>
        </Card>
      ))}
    </div>
  ) : (
    <Empty
      title="No favorite doctors yet"
      description="Save a doctor from the directory to find them quickly here."
    />
  );
}

function Reviews() {
  return (
    <Card className="p-6">
      <div className="flex flex-col justify-between gap-4 sm:flex-row">
        <div>
          <h2 className="font-extrabold">Your published reviews</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Review eligibility and edits are validated by the backend.
          </p>
        </div>
        <Button>
          <Plus size={17} />
          Add review
        </Button>
      </div>
      <Empty
        bare
        title="No reviews yet"
        description="After a completed consultation, eligible visits will appear here."
      />
    </Card>
  );
}

type MedicationForm = {
  diagnosis: string;
  notes: string;
  medications: {
    name: string;
    dosage: string;
    frequency: string;
    duration: string;
    instructions: string;
  }[];
};
function Prescriptions({ role }: { role: UserRole }) {
  const {
    register,
    control,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm<MedicationForm>({
    defaultValues: {
      medications: [
        { name: "", dosage: "", frequency: "", duration: "", instructions: "" },
      ],
    },
  });
  const fields = useFieldArray({ control, name: "medications" });
  if (role !== "doctor")
    return (
      <Empty
        title="No prescriptions available"
        description="Prescriptions from completed consultations will appear here."
      />
    );
  return (
    <form
      onSubmit={handleSubmit(async (values) => {
        try {
          await apiRequest("/api/prescriptions", {
            method: "POST",
            body: values,
          });
          toast.success("Prescription saved");
        } catch (e) {
          toast.error(
            e instanceof Error ? e.message : "Could not save prescription",
          );
        }
      })}
      className="grid gap-6 xl:grid-cols-[1fr_320px]"
    >
      <Card className="p-6">
        <div>
          <Label>Diagnosis</Label>
          <Input {...register("diagnosis", { required: true })} />
        </div>
        <div className="mt-5">
          <Label>Medications</Label>
          <div className="space-y-4">
            {fields.fields.map((field, i) => (
              <div
                className="rounded-2xl border border-border p-4"
                key={field.id}
              >
                <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
                  <Input
                    placeholder="Medicine name"
                    {...register(`medications.${i}.name`, { required: true })}
                  />
                  <Input
                    placeholder="Dosage"
                    {...register(`medications.${i}.dosage`)}
                  />
                  <Input
                    placeholder="Frequency"
                    {...register(`medications.${i}.frequency`)}
                  />
                  <Input
                    placeholder="Duration"
                    {...register(`medications.${i}.duration`)}
                  />
                </div>
                <div className="mt-3 flex gap-3">
                  <Input
                    placeholder="Instructions"
                    {...register(`medications.${i}.instructions`)}
                  />
                  <Button
                    type="button"
                    size="icon"
                    variant="ghost"
                    disabled={fields.fields.length === 1}
                    onClick={() => fields.remove(i)}
                  >
                    <Trash2 size={17} />
                  </Button>
                </div>
              </div>
            ))}
          </div>
          <Button
            type="button"
            className="mt-3"
            variant="outline"
            onClick={() =>
              fields.append({
                name: "",
                dosage: "",
                frequency: "",
                duration: "",
                instructions: "",
              })
            }
          >
            <Plus size={17} />
            Add medication
          </Button>
        </div>
        <div className="mt-5">
          <Label>Clinical notes</Label>
          <Textarea {...register("notes")} />
        </div>
      </Card>
      <Card className="h-fit p-6">
        <h2 className="font-extrabold">Prescription actions</h2>
        <p className="mt-2 text-sm leading-6 text-muted-foreground">
          Confirm medication details carefully. The server retains the
          authoritative clinical record.
        </p>
        <Button className="mt-6 w-full" disabled={isSubmitting}>
          {isSubmitting ? "Saving…" : "Save prescription"}
        </Button>
      </Card>
    </form>
  );
}

function Schedule() {
  const {
    register,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm({
    defaultValues: {
      day: "Monday",
      start: "09:00",
      end: "17:00",
      duration: "30",
    },
  });
  return (
    <div className="grid gap-6 lg:grid-cols-[380px_1fr]">
      <Card className="p-6">
        <h2 className="font-extrabold">Add availability</h2>
        <form
          className="mt-5 space-y-4"
          onSubmit={handleSubmit(async (values) => {
            if (values.start >= values.end) {
              toast.error("End time must be after start time");
              return;
            }
            try {
              await apiRequest("/api/doctor/schedules", {
                method: "POST",
                body: values,
              });
              toast.success("Schedule updated");
            } catch (e) {
              toast.error(
                e instanceof Error ? e.message : "Could not update schedule",
              );
            }
          })}
        >
          <div>
            <Label>Day</Label>
            <Select {...register("day")}>
              {[
                "Monday",
                "Tuesday",
                "Wednesday",
                "Thursday",
                "Friday",
                "Saturday",
                "Sunday",
              ].map((d) => (
                <option key={d}>{d}</option>
              ))}
            </Select>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label>Start</Label>
              <Input type="time" {...register("start")} />
            </div>
            <div>
              <Label>End</Label>
              <Input type="time" {...register("end")} />
            </div>
          </div>
          <div>
            <Label>Slot duration</Label>
            <Select {...register("duration")}>
              <option value="15">15 minutes</option>
              <option value="30">30 minutes</option>
              <option value="45">45 minutes</option>
              <option value="60">60 minutes</option>
            </Select>
          </div>
          <Button className="w-full" disabled={isSubmitting}>
            Add schedule
          </Button>
        </form>
      </Card>
      <Card className="p-6">
        <h2 className="font-extrabold">Weekly schedule</h2>
        <Empty
          bare
          title="No availability added"
          description="Add your first recurring schedule from the form."
        />
      </Card>
    </div>
  );
}

function Profile({ role }: { role: UserRole }) {
  const {
    register,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm();
  return (
    <form
      onSubmit={handleSubmit(async (values) => {
        try {
          await apiRequest("/api/users/me", { method: "PATCH", body: values });
          toast.success("Profile updated");
        } catch (e) {
          toast.error(
            e instanceof Error ? e.message : "Could not update profile",
          );
        }
      })}
    >
      <Card className="max-w-3xl p-6 sm:p-8">
        <div className="flex items-center gap-5 border-b border-border pb-6">
          <span className="grid size-20 place-items-center rounded-2xl bg-primary-soft text-2xl font-extrabold text-primary">
            MC
          </span>
          <div>
            <h2 className="font-extrabold">Profile photo</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Use a clear image smaller than 5 MB.
            </p>
            <Button className="mt-3" size="sm" type="button" variant="outline">
              Upload photo
            </Button>
          </div>
        </div>
        <div className="mt-6 grid gap-5 sm:grid-cols-2">
          <div>
            <Label>Full name</Label>
            <Input {...register("name")} />
          </div>
          <div>
            <Label>Phone</Label>
            <Input type="tel" {...register("phone")} />
          </div>
          <div>
            <Label>Gender</Label>
            <Select {...register("gender")}>
              <option value="">Prefer not to say</option>
              <option>Female</option>
              <option>Male</option>
              <option>Other</option>
            </Select>
          </div>
          {role === "doctor" && (
            <>
              <div>
                <Label>Hospital</Label>
                <Input {...register("hospital")} />
              </div>
              <div>
                <Label>Experience (years)</Label>
                <Input type="number" min="0" {...register("experience")} />
              </div>
              <div>
                <Label>Consultation fee</Label>
                <Input type="number" min="0" {...register("consultationFee")} />
              </div>
              <div className="sm:col-span-2">
                <Label>Qualifications</Label>
                <Input {...register("qualifications")} />
              </div>
              <div className="sm:col-span-2">
                <Label>Biography</Label>
                <Textarea {...register("biography")} />
              </div>
            </>
          )}
        </div>
        <p className="mt-5 text-xs text-muted-foreground">
          Email changes require the secure Better Auth verification flow and are
          not handled by this form.
        </p>
        <Button className="mt-6" disabled={isSubmitting}>
          {isSubmitting ? "Saving…" : "Save changes"}
        </Button>
      </Card>
    </form>
  );
}

function UsersPanel() {
  const q = useQuery({
    queryKey: ["admin-users"],
    queryFn: ({ signal }) =>
      apiRequest<Paginated<UserRecord>>("/api/admin/users", {
        query: { page: 1, limit: 20 },
        signal,
      }),
  });
  return (
    <>
      <div className="mb-5 flex gap-3">
        <div className="relative flex-1">
          <Search
            size={17}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
          />
          <Input className="pl-10" placeholder="Search users" />
        </div>
        <Select className="max-w-44">
          <option>All roles</option>
          <option>Patient</option>
          <option>Doctor</option>
          <option>Admin</option>
        </Select>
      </div>
      {q.isPending ? (
        <TableSkeleton />
      ) : (
        <DataTable
          headers={["User", "Email", "Role", "Status", "Action"]}
          empty="No users found."
        >
          {q.data?.data.map((u) => (
            <tr className="border-t border-border" key={u.id}>
              <Cell strong>{u.name}</Cell>
              <Cell>{u.email}</Cell>
              <Cell>
                <Badge>{u.role}</Badge>
              </Cell>
              <Cell>
                <Status value={u.status} />
              </Cell>
              <Cell>
                <Button size="sm" variant="outline">
                  {u.status === "suspended" ? "Reactivate" : "Suspend"}
                </Button>
              </Cell>
            </tr>
          ))}
        </DataTable>
      )}
    </>
  );
}

function DoctorsPanel() {
  const q = useQuery({
    queryKey: ["admin-doctors"],
    queryFn: ({ signal }) =>
      apiRequest<Paginated<Doctor>>("/api/admin/doctors", {
        query: { page: 1, limit: 20 },
        signal,
      }),
  });
  return q.isPending ? (
    <TableSkeleton />
  ) : (
    <DataTable
      headers={[
        "Doctor",
        "Specialization",
        "Hospital",
        "Experience",
        "Status",
        "Actions",
      ]}
      empty="No doctor profiles found."
    >
      {q.data?.data.map((d) => (
        <tr className="border-t border-border" key={d.id}>
          <Cell strong>{d.name}</Cell>
          <Cell>{d.specialization}</Cell>
          <Cell>{d.hospital}</Cell>
          <Cell>{d.experience} years</Cell>
          <Cell>
            <Status value={d.verified ? "verified" : "pending"} />
          </Cell>
          <Cell>
            <div className="flex gap-2">
              <Button size="sm">Verify</Button>
              <Button size="sm" variant="outline">
                Reject
              </Button>
            </div>
          </Cell>
        </tr>
      ))}
    </DataTable>
  );
}

function Analytics() {
  const q = useQuery({
    queryKey: ["admin-analytics"],
    queryFn: ({ signal }) =>
      apiRequest<AnalyticsData>("/api/admin/analytics", { signal }),
  });
  if (q.isPending) return <GridSkeleton />;
  if (!q.data)
    return (
      <Empty
        title="Analytics are unavailable"
        description="Aggregated backend data will be charted here when available."
      />
    );
  const colors = ["#0f766e", "#0284c7", "#4f46e5", "#d97706", "#e11d48"];
  return (
    <div className="grid gap-6 xl:grid-cols-2">
      <ChartCard title="Appointments over time">
        <ResponsiveContainer width="100%" height={280}>
          <LineChart data={q.data.appointmentsOverTime}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis dataKey="label" />
            <YAxis />
            <Tooltip />
            <Line
              type="monotone"
              dataKey="value"
              stroke="#0f766e"
              strokeWidth={3}
            />
          </LineChart>
        </ResponsiveContainer>
      </ChartCard>
      <ChartCard title="Appointments by status">
        <ResponsiveContainer width="100%" height={280}>
          <PieChart>
            <Pie
              data={q.data.appointmentsByStatus}
              dataKey="value"
              nameKey="name"
              innerRadius={62}
              outerRadius={98}
            >
              {q.data.appointmentsByStatus.map((_, i) => (
                <ChartCell key={i} fill={colors[i % colors.length]} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </ChartCard>
      <ChartCard title="Payment trend" wide>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={q.data.revenueTrend}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis dataKey="label" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="value" fill="#0284c7" radius={[8, 8, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </ChartCard>
    </div>
  );
}

function ChartCard({
  title,
  children,
  wide,
}: {
  title: string;
  children: React.ReactNode;
  wide?: boolean;
}) {
  return (
    <Card className={`p-5 ${wide ? "xl:col-span-2" : ""}`}>
      <h2 className="mb-6 font-extrabold">{title}</h2>
      {children}
    </Card>
  );
}
function DataTable({
  headers,
  children,
  empty,
}: {
  headers: string[];
  children?: React.ReactNode;
  empty: string;
}) {
  const hasChildren = Array.isArray(children)
    ? children.length > 0
    : Boolean(children);
  return (
    <Card className="overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[850px] text-left text-sm">
          <thead className="bg-muted text-xs uppercase tracking-wider text-muted-foreground">
            <tr>
              {headers.map((h) => (
                <th className="px-5 py-4" key={h}>
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {hasChildren ? (
              children
            ) : (
              <tr>
                <td
                  className="px-5 py-16 text-center text-muted-foreground"
                  colSpan={headers.length}
                >
                  {empty}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </Card>
  );
}
function Cell({
  children,
  strong,
}: {
  children: React.ReactNode;
  strong?: boolean;
}) {
  return (
    <td
      className={`px-5 py-4 ${strong ? "font-bold" : "text-muted-foreground"}`}
    >
      {children}
    </td>
  );
}
function Status({ value }: { value: string }) {
  const positive = [
    "paid",
    "completed",
    "confirmed",
    "verified",
    "active",
  ].includes(value);
  const negative = ["failed", "cancelled", "rejected", "suspended"].includes(
    value,
  );
  return (
    <Badge
      className={
        positive
          ? "bg-emerald-50 text-success dark:bg-emerald-950/30"
          : negative
            ? "bg-red-50 text-danger dark:bg-red-950/30"
            : "bg-amber-50 text-warning dark:bg-amber-950/30"
      }
    >
      {value}
    </Badge>
  );
}
function Empty({
  title,
  description,
  bare = false,
}: {
  title: string;
  description: string;
  bare?: boolean;
}) {
  const body = (
    <div className="py-12 text-center">
      <CheckCircle2 className="mx-auto text-primary" />
      <h2 className="mt-4 text-lg font-extrabold">{title}</h2>
      <p className="mx-auto mt-2 max-w-md text-sm text-muted-foreground">
        {description}
      </p>
    </div>
  );
  return bare ? body : <Card className="p-6">{body}</Card>;
}
function GridSkeleton() {
  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {Array.from({ length: 4 }).map((_, i) => (
        <Skeleton className="h-40" key={i} />
      ))}
    </div>
  );
}
function TableSkeleton() {
  return (
    <Card className="p-5">
      <Skeleton className="h-12" />
      {Array.from({ length: 5 }).map((_, i) => (
        <Skeleton className="mt-3 h-14" key={i} />
      ))}
    </Card>
  );
}
