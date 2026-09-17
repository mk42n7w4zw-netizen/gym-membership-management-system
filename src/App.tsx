import { useEffect, useMemo, useState } from 'react';
import {
  BarChart3,
  Bell,
  CalendarDays,
  CheckCircle2,
  ChevronRight,
  Clock3,
  CreditCard,
  Dumbbell,
  LayoutDashboard,
  Menu,
  Plus,
  Search,
  ShieldCheck,
  TrendingUp,
  UserRound,
  Users,
  Wallet,
  X,
} from 'lucide-react';

type Page = 'Overview' | 'Members' | 'Classes' | 'Attendance' | 'Billing' | 'Reports';
type MemberStatus = 'Active' | 'Pending' | 'Expired';
type Member = {
  id: string;
  name: string;
  email: string;
  phone: string;
  plan: string;
  status: MemberStatus;
  renewal: string;
  trainer: string;
  joined: string;
};

type DashboardStats = { label: string; value: string; change: string; trend: 'up' | 'down'; detail: string };
type RevenuePoint = { month: string; value: number };
type ClassItem = { id?: number; name: string; time: string; coach: string; seats: number; intensity: string };
type AttendanceItem = { id?: number; member_name: string; time: string; type: string };
type PaymentItem = { id?: number; member_name: string; amount: string; due: string };

const navItems = [
  { label: 'Overview', icon: LayoutDashboard },
  { label: 'Members', icon: Users },
  { label: 'Classes', icon: Dumbbell },
  { label: 'Attendance', icon: CheckCircle2 },
  { label: 'Billing', icon: CreditCard },
  { label: 'Reports', icon: BarChart3 },
] as const;

const statusColors: Record<MemberStatus, string> = {
  Active: 'bg-emerald-500/15 text-emerald-300 border border-emerald-400/30',
  Pending: 'bg-amber-500/15 text-amber-300 border border-amber-400/30',
  Expired: 'bg-rose-500/15 text-rose-300 border border-rose-400/30',
};

const card = 'rounded-2xl border border-slate-800 bg-slate-900/80 p-5 shadow-glow';

export default function App() {
  const [page, setPage] = useState<Page>('Overview');
  const [members, setMembers] = useState<Member[]>([]);
  const [stats, setStats] = useState<DashboardStats[]>([]);
  const [revenueData, setRevenueData] = useState<RevenuePoint[]>([]);
  const [classes, setClasses] = useState<ClassItem[]>([]);
  const [attendance, setAttendance] = useState<AttendanceItem[]>([]);
  const [payments, setPayments] = useState<PaymentItem[]>([]);
  const [query, setQuery] = useState('');
  const [showAdd, setShowAdd] = useState(false);
  const [notice, setNotice] = useState('');

  useEffect(() => {
    const fetchDashboard = async () => {
      const res = await fetch('/api/dashboard');
      const data = await res.json();
      setStats(data.stats || []);
      setRevenueData(data.revenueData || []);
      setMembers(data.members || []);
      setClasses(data.classes || []);
      setAttendance(data.attendance || []);
      setPayments(data.payments || []);
    };
    fetchDashboard();
  }, []);

  const filteredMembers = useMemo(
    () => members.filter((m) => `${m.name} ${m.email} ${m.id}`.toLowerCase().includes(query.toLowerCase())),
    [members, query],
  );

  const notify = (message: string) => {
    setNotice(message);
    setTimeout(() => setNotice(''), 2600);
  };

  const addMember = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const payload = {
      name: String(form.get('name') || ''),
      email: String(form.get('email') || ''),
      phone: String(form.get('phone') || ''),
      plan: String(form.get('plan') || 'Gold'),
    };

    const res = await fetch('/api/members', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    if (!res.ok) return notify('Failed to add member');
    const member = await res.json();
    setMembers((current) => [member, ...current]);
    setShowAdd(false);
    setPage('Members');
    notify(`${member.name} was added successfully`);
  };

  const removeMember = async (id: string) => {
    const res = await fetch(`/api/members/${id}`, { method: 'DELETE' });
    if (!res.ok) return notify('Failed to remove member');
    setMembers((current) => current.filter((member) => member.id !== id));
    notify('Member removed');
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <div className="mx-auto flex max-w-[1600px]">
        <aside className="hidden min-h-screen w-[260px] border-r border-slate-800/80 bg-slate-950/80 p-6 lg:block">
          <Brand />
          <Navigation page={page} setPage={setPage} />
        </aside>

        <main className="flex-1">
          <header className="border-b border-slate-800 bg-slate-950/80 px-5 py-4 backdrop-blur-sm md:px-8">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div className="flex items-center gap-3">
                <button className="lg:hidden" onClick={() => setPage('Overview')}><Menu /></button>
                <div>
                  <p className="text-sm uppercase tracking-[0.18em] text-slate-400">PulseFit / {page}</p>
                  <h2 className="mt-1 text-2xl font-semibold text-white md:text-3xl">Good morning, Alex</h2>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="flex items-center gap-3 rounded-xl border border-slate-700 bg-slate-900 px-3 py-2 text-slate-300">
                  <Search className="h-4 w-4 text-slate-400" />
                  <input
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    className="w-40 bg-transparent text-sm outline-none placeholder:text-slate-500 md:w-56"
                    placeholder="Search members"
                  />
                </div>
                <button onClick={() => notify('You are all caught up')} className="flex h-11 w-11 items-center justify-center rounded-xl border border-slate-700 bg-slate-900 text-slate-200">
                  <Bell className="h-4 w-4" />
                </button>
                <button onClick={() => setShowAdd(true)} className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-emerald-500 to-cyan-500 px-4 py-2.5 text-sm font-semibold text-slate-950">
                  <Plus className="h-4 w-4" />
                  New member
                </button>
              </div>
            </div>
          </header>

          <div className="space-y-6 p-5 md:p-8">
            {page === 'Overview' && <Overview stats={stats} revenueData={revenueData} classes={classes} members={members.slice(0, 4)} attendance={attendance} payments={payments.slice(0, 3)} />} 
            {page === 'Members' && <MembersPage members={filteredMembers} onAdd={() => setShowAdd(true)} onDelete={removeMember} />} 
            {page === 'Classes' && <ClassesPage classes={classes} />} 
            {page === 'Attendance' && <AttendancePage attendance={attendance} />} 
            {page === 'Billing' && <BillingPage payments={payments} />} 
            {page === 'Reports' && <ReportsPage />} 
          </div>
        </main>
      </div>

      {showAdd && <AddMember onClose={() => setShowAdd(false)} onSubmit={addMember} />}
      {notice && <div className="fixed bottom-6 right-6 z-50 rounded-xl border border-emerald-400/30 bg-emerald-500 px-4 py-3 font-medium text-slate-950 shadow-xl">{notice}</div>}
    </div>
  );
}

function Brand() {
  return (
    <div className="flex items-center gap-3">
      <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-400 to-cyan-500 shadow-lg shadow-emerald-500/25">
        <Dumbbell className="h-6 w-6 text-slate-950" />
      </div>
      <div>
        <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Gym Ops</p>
        <h1 className="text-xl font-semibold text-white">PulseFit</h1>
      </div>
    </div>
  );
}

function Navigation({ page, setPage }: { page: Page; setPage: (p: Page) => void }) {
  return (
    <>
      <nav className="mt-10 space-y-2">
        {navItems.map(({ label, icon: Icon }) => (
          <button
            key={label}
            onClick={() => setPage(label as Page)}
            className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left transition ${page === label ? 'bg-slate-800 text-white' : 'text-slate-400 hover:bg-slate-900 hover:text-slate-200'}`}
          >
            <Icon className="h-5 w-5" />
            <span className="font-medium">{label}</span>
          </button>
        ))}
      </nav>
      <div className="mt-10 rounded-2xl border border-emerald-500/25 bg-emerald-500/10 p-4">
        <div className="mb-2 flex items-center gap-2 text-emerald-300">
          <ShieldCheck className="h-4 w-4" />
          <span className="text-sm font-medium">Membership health</span>
        </div>
        <p className="text-3xl font-bold text-white">94.2%</p>
        <p className="mt-1 text-sm text-emerald-200">Strong retention this quarter.</p>
      </div>
    </>
  );
}

function Overview({ stats, revenueData, classes, members, attendance, payments }: { stats: DashboardStats[]; revenueData: RevenuePoint[]; classes: ClassItem[]; members: Member[]; attendance: AttendanceItem[]; payments: PaymentItem[] }) {
  return (
    <>
      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {stats.map(({ label, value, change, trend, detail }) => (
          <div key={label} className={card}>
            <div className="flex items-center justify-between text-slate-400">
              <span className="text-sm">{label}</span>
              <span className={`rounded-full px-2 py-1 text-xs ${trend === 'up' ? 'bg-emerald-500/15 text-emerald-300' : 'bg-rose-500/15 text-rose-300'}`}>
                <TrendingUp className="mr-1 inline h-3.5 w-3.5" />
                {change}
              </span>
            </div>
            <div className="mt-5 flex items-end justify-between">
              <p className="text-3xl font-bold text-white">{value}</p>
              <p className="text-xs text-slate-400">{detail}</p>
            </div>
          </div>
        ))}
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.6fr_1fr]">
        <div className={card}>
          <div className="mb-6 flex items-center justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.18em] text-slate-400">Revenue</p>
              <h3 className="mt-2 text-xl font-semibold text-white">Monthly performance</h3>
            </div>
            <span className="rounded-full border border-slate-700 px-3 py-1.5 text-sm text-slate-300">
              <Wallet className="mr-2 inline h-4 w-4 text-emerald-400" />
              $84.8k this month
            </span>
          </div>
          <div className="flex h-52 items-end gap-3">
            {revenueData.map(({ month, value }) => (
              <div key={month} className="flex flex-1 flex-col items-center gap-3">
                <div className="w-full rounded-t-2xl bg-gradient-to-t from-cyan-500 via-sky-500 to-emerald-400/80" style={{ height: `${value}%` }} />
                <span className="text-xs text-slate-400">{month}</span>
              </div>
            ))}
          </div>
        </div>

        <div className={card}>
          <SectionTitle eyebrow="Schedule" title="Today's classes" />
          <div className="space-y-3">
            {classes.slice(0, 3).map((item) => (
              <ClassRow key={item.name} item={item} />
            ))}
          </div>
        </div>
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.3fr_0.9fr]">
        <div className={card}>
          <SectionTitle eyebrow="Members" title="Member directory" />
          <MembersTable members={members} />
        </div>

        <div className="space-y-6">
          <div className={card}>
            <SectionTitle eyebrow="Check-ins" title="Attendance" />
            <div className="space-y-3">
              {attendance.map((person) => (
                <div key={`${person.member_name}-${person.time}`} className="flex items-center justify-between rounded-xl border border-slate-800 bg-slate-950/80 p-3">
                  <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-emerald-500/15 text-emerald-300">
                      <UserRound className="h-4 w-4" />
                    </div>
                    <div>
                      <p className="font-medium text-white">{person.member_name}</p>
                      <p className="text-xs text-slate-400">{person.type}</p>
                    </div>
                  </div>
                  <span className="text-sm text-slate-300"><Clock3 className="mr-2 inline h-3.5 w-3.5 text-slate-500" />{person.time}</span>
                </div>
              ))}
            </div>
          </div>

          <div className={card}>
            <SectionTitle eyebrow="Payments" title="Due this week" />
            <div className="space-y-3">
              {payments.map((payment) => (
                <div key={`${payment.member_name}-${payment.due}`} className="flex items-center justify-between rounded-xl border border-slate-800 bg-slate-950/80 p-3">
                  <div>
                    <p className="font-medium text-white">{payment.member_name}</p>
                    <p className="text-xs text-slate-400">Due {payment.due}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-white">{payment.amount}</p>
                    <button className="mt-1 inline-flex items-center gap-1 text-xs text-cyan-300">
                      Send reminder
                      <ChevronRight className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

function MembersPage({ members, onAdd, onDelete }: { members: Member[]; onAdd: () => void; onDelete: (id: string) => void }) {
  return (
    <div className={card}>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <p className="text-sm uppercase tracking-[0.18em] text-slate-400">CRM</p>
          <h3 className="mt-2 text-2xl font-semibold text-white">All members <span className="text-base text-slate-500">({members.length})</span></h3>
        </div>
        <button onClick={onAdd} className="rounded-xl bg-emerald-500 px-4 py-2 font-semibold text-slate-950">
          <Plus className="mr-2 inline h-4 w-4" />Add member
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full text-left text-sm">
          <thead>
            <tr className="border-b border-slate-800 text-slate-400">
              <th className="pb-3">Member</th>
              <th className="pb-3">Email</th>
              <th className="pb-3">Plan</th>
              <th className="pb-3">Status</th>
              <th className="pb-3">Trainer</th>
              <th className="pb-3">Action</th>
            </tr>
          </thead>
          <tbody>
            {members.map((member) => (
              <tr key={member.id} className="border-b border-slate-800/80 text-slate-200">
                <td className="py-4 pr-4">
                  <p className="font-medium text-white">{member.name}</p>
                  <p className="text-xs text-slate-400">{member.id}</p>
                </td>
                <td className="py-4 pr-4 text-slate-300">{member.email}</td>
                <td className="py-4 pr-4">{member.plan}</td>
                <td className="py-4 pr-4">
                  <span className={`rounded-full px-2.5 py-1 text-xs ${statusColors[member.status]}`}>{member.status}</span>
                </td>
                <td className="py-4 pr-4">{member.trainer}</td>
                <td className="py-4">
                  <button onClick={() => onDelete(member.id)} className="text-rose-300 hover:text-rose-200">Remove</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function ClassesPage({ classes }: { classes: ClassItem[] }) {
  return (
    <div className={card}>
      <SectionTitle eyebrow="Programming" title="Class schedule" />
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {classes.map((item) => (
          <div key={`${item.name}-${item.time}`} className="rounded-2xl border border-slate-800 bg-slate-950 p-5">
            <div className="mb-8 flex items-center justify-between">
              <Dumbbell className="h-8 w-8 text-emerald-400" />
              <span className="text-xs uppercase text-slate-500">Today</span>
            </div>
            <h4 className="text-lg font-semibold text-white">{item.name}</h4>
            <p className="mt-1 text-slate-400">with {item.coach}</p>
            <div className="mt-5 flex items-center justify-between text-sm">
              <span className="text-cyan-300">{item.time}</span>
              <span className="text-slate-400">{item.seats} seats open</span>
            </div>
            <button className="mt-5 w-full rounded-xl border border-slate-700 py-2 text-sm text-slate-200">View roster</button>
          </div>
        ))}
      </div>
    </div>
  );
}

function AttendancePage({ attendance }: { attendance: AttendanceItem[] }) {
  return (
    <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
      <div className={card}>
        <SectionTitle eyebrow="Live log" title="Today's attendance" />
        <div className="space-y-3">
          {attendance.map((person) => (
            <div key={`${person.member_name}-${person.time}`} className="flex items-center justify-between rounded-xl border border-slate-800 bg-slate-950/80 p-3">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-emerald-500/15 text-emerald-300">
                  <UserRound className="h-4 w-4" />
                </div>
                <div>
                  <p className="font-medium text-white">{person.member_name}</p>
                  <p className="text-xs text-slate-400">{person.type}</p>
                </div>
              </div>
              <span className="text-sm text-slate-300"><Clock3 className="mr-2 inline h-3.5 w-3.5 text-slate-500" />{person.time}</span>
            </div>
          ))}
        </div>
      </div>

      <div className={card}>
        <p className="text-sm uppercase tracking-[0.18em] text-slate-400">Daily capacity</p>
        <h3 className="mt-2 text-2xl font-semibold text-white">76%</h3>
        <div className="mt-6 h-3 overflow-hidden rounded-full bg-slate-800">
          <div className="h-full w-[76%] rounded-full bg-gradient-to-r from-emerald-400 to-cyan-400" />
        </div>
        <div className="mt-5 grid grid-cols-2 gap-4 text-sm">
          <div>
            <p className="text-2xl font-semibold text-white">342</p>
            <p className="text-slate-400">Check-ins</p>
          </div>
          <div>
            <p className="text-2xl font-semibold text-white">118</p>
            <p className="text-slate-400">Peak hour</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function BillingPage({ payments }: { payments: PaymentItem[] }) {
  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_1fr]">
      <div className={card}>
        <p className="text-sm uppercase tracking-[0.18em] text-slate-400">Collections</p>
        <h3 className="mt-2 text-2xl font-semibold text-white">Billing overview</h3>
        <div className="mt-6 grid grid-cols-2 gap-4">
          {[['$84.8K', 'Collected'], ['$6.2K', 'Outstanding'], ['98.1%', 'Success rate'], ['48', 'Renewals due']].map(([value, label]) => (
            <div key={label} className="rounded-xl bg-slate-950 p-4">
              <p className="text-2xl font-bold text-white">{value}</p>
              <p className="mt-1 text-sm text-slate-400">{label}</p>
            </div>
          ))}
        </div>
      </div>

      <div className={card}>
        <div className="mb-5 flex items-center justify-between">
          <h3 className="text-xl font-semibold text-white">Payment reminders</h3>
          <CreditCard className="text-emerald-400" />
        </div>
        <div className="space-y-3">
          {payments.map((payment) => (
            <div key={`${payment.member_name}-${payment.due}`} className="flex items-center justify-between rounded-xl border border-slate-800 bg-slate-950/80 p-3">
              <div>
                <p className="font-medium text-white">{payment.member_name}</p>
                <p className="text-xs text-slate-400">Due {payment.due}</p>
              </div>
              <div className="text-right">
                <p className="font-semibold text-white">{payment.amount}</p>
                <button className="mt-1 text-xs text-cyan-300">Send reminder <ChevronRight className="inline h-3.5 w-3.5" /></button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function ReportsPage() {
  return (
    <div className={card}>
      <SectionTitle eyebrow="Analytics" title="Business reports" />
      <div className="grid gap-4 md:grid-cols-3">
        {[['Member retention', '94.2%', '+4.8%'], ['Average revenue/member', '$66.04', '+8.7%'], ['Class utilization', '78%', '+5.2%']].map(([label, value, change]) => (
          <div key={label} className="rounded-xl border border-slate-800 bg-slate-950/70 p-5">
            <p className="text-sm text-slate-400">{label}</p>
            <p className="mt-3 text-3xl font-bold text-white">{value}</p>
            <p className="mt-2 text-sm text-emerald-300">{change} this month</p>
          </div>
        ))}
      </div>
    </div>
  );
}

function ClassRow({ item }: { item: ClassItem }) {
  return (
    <div className="rounded-xl border border-slate-800 bg-slate-950/70 p-3">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="font-medium text-white">{item.name}</p>
          <p className="mt-1 text-sm text-slate-400">{item.coach}</p>
        </div>
        <span className="rounded-full border border-slate-700 bg-slate-900 px-2 py-1 text-[11px] uppercase tracking-[0.12em] text-slate-300">
          {item.intensity}
        </span>
      </div>
      <div className="mt-3 flex items-center justify-between text-sm text-slate-300">
        <span className="flex items-center gap-2"><CalendarDays className="h-3.5 w-3.5 text-cyan-400" />{item.time}</span>
        <span className="flex items-center gap-2"><Users className="h-3.5 w-3.5 text-emerald-400" />{item.seats} spots left</span>
      </div>
    </div>
  );
}

function MembersTable({ members }: { members: Member[] }) {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full text-left text-sm">
        <thead>
          <tr className="border-b border-slate-800 text-slate-400">
            <th className="pb-3">Member</th>
            <th className="pb-3">Plan</th>
            <th className="pb-3">Status</th>
            <th className="pb-3">Renewal</th>
          </tr>
        </thead>
        <tbody>
          {members.map((member) => (
            <tr key={member.id} className="border-b border-slate-800/80 text-slate-200">
              <td className="py-3 pr-4">
                <div>
                  <p className="font-medium text-white">{member.name}</p>
                  <p className="text-xs text-slate-400">{member.id}</p>
                </div>
              </td>
              <td className="py-3 pr-4">{member.plan}</td>
              <td className="py-3 pr-4"><span className={`rounded-full px-2.5 py-1 text-xs ${statusColors[member.status]}`}>{member.status}</span></td>
              <td className="py-3 pr-4">{member.renewal}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function SectionTitle({ eyebrow, title }: { eyebrow: string; title: string }) {
  return (
    <div className="mb-5 flex items-center justify-between">
      <div>
        <p className="text-sm uppercase tracking-[0.18em] text-slate-400">{eyebrow}</p>
        <h3 className="mt-2 text-xl font-semibold text-white">{title}</h3>
      </div>
    </div>
  );
}

function AddMember({ onClose, onSubmit }: { onClose: () => void; onSubmit: (event: React.FormEvent<HTMLFormElement>) => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 p-4">
      <form onSubmit={onSubmit} className="w-full max-w-lg rounded-2xl border border-slate-700 bg-slate-900 p-6 shadow-2xl">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.18em] text-slate-400">Members</p>
            <h3 className="mt-1 text-2xl font-semibold text-white">Add new member</h3>
          </div>
          <button type="button" onClick={onClose}><X /></button>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <label className="text-sm text-slate-300">
            Full name
            <input name="name" required className="mt-1 w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 outline-none focus:border-emerald-400" />
          </label>
          <label className="text-sm text-slate-300">
            Email
            <input name="email" type="email" className="mt-1 w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 outline-none focus:border-emerald-400" />
          </label>
          <label className="text-sm text-slate-300">
            Phone
            <input name="phone" className="mt-1 w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 outline-none focus:border-emerald-400" />
          </label>
          <label className="text-sm text-slate-300">
            Plan
            <select name="plan" defaultValue="Gold" className="mt-1 w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 outline-none focus:border-emerald-400">
              <option>Basic</option>
              <option>Gold</option>
              <option>Premium</option>
              <option>Platinum</option>
              <option>Elite</option>
            </select>
          </label>
        </div>

        <div className="mt-6 flex justify-end gap-3">
          <button type="button" onClick={onClose} className="rounded-xl border border-slate-700 px-4 py-2.5 text-slate-300">Cancel</button>
          <button type="submit" className="rounded-xl bg-emerald-500 px-4 py-2.5 font-semibold text-slate-950">Create member</button>
        </div>
      </form>
    </div>
  );
}
