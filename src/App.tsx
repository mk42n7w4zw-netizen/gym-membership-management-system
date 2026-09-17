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
  Plus,
  Search,
  ShieldCheck,
  TrendingUp,
  UserRound,
  Users,
  Wallet,
} from 'lucide-react';
import { attendance, classes, members, paymentDue, revenueData, stats } from './data/mockData';

const navItems = [
  { label: 'Overview', icon: LayoutDashboard, active: true },
  { label: 'Members', icon: Users },
  { label: 'Classes', icon: Dumbbell },
  { label: 'Attendance', icon: CheckCircle2 },
  { label: 'Billing', icon: CreditCard },
  { label: 'Reports', icon: BarChart3 },
];

const statusColors: Record<string, string> = {
  Active: 'bg-emerald-500/15 text-emerald-300 border border-emerald-400/30',
  Pending: 'bg-amber-500/15 text-amber-300 border border-amber-400/30',
  Expired: 'bg-rose-500/15 text-rose-300 border border-rose-400/30',
};

export default function App() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <div className="mx-auto flex max-w-[1600px]">
        <aside className="hidden min-h-screen w-[260px] border-r border-slate-800/80 bg-slate-950/80 p-6 lg:block">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-400 to-cyan-500 shadow-lg shadow-emerald-500/25">
              <Dumbbell className="h-6 w-6 text-slate-950" />
            </div>
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Gym Ops</p>
              <h1 className="text-xl font-semibold text-white">PulseFit</h1>
            </div>
          </div>

          <nav className="mt-10 space-y-2">
            {navItems.map(({ label, icon: Icon, active }) => (
              <button
                key={label}
                className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left transition ${
                  active
                    ? 'bg-slate-800 text-white shadow-lg shadow-slate-900/60'
                    : 'text-slate-400 hover:bg-slate-900 hover:text-slate-200'
                }`}
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
        </aside>

        <main className="flex-1">
          <header className="border-b border-slate-800 bg-slate-950/80 px-5 py-4 backdrop-blur-sm md:px-8">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div>
                <p className="text-sm uppercase tracking-[0.18em] text-slate-400">Managing dashboard</p>
                <h2 className="mt-1 text-2xl font-semibold text-white md:text-3xl">Good morning, Alex</h2>
              </div>

              <div className="flex items-center gap-3">
                <div className="flex items-center gap-3 rounded-xl border border-slate-700 bg-slate-900 px-3 py-2 text-slate-300">
                  <Search className="h-4 w-4 text-slate-400" />
                  <input
                    className="w-40 bg-transparent text-sm outline-none placeholder:text-slate-500 md:w-56"
                    placeholder="Search members"
                  />
                </div>
                <button className="flex h-11 w-11 items-center justify-center rounded-xl border border-slate-700 bg-slate-900 text-slate-200 transition hover:border-slate-500">
                  <Bell className="h-4 w-4" />
                </button>
                <button className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-emerald-500 to-cyan-500 px-4 py-2.5 text-sm font-semibold text-slate-950 shadow-lg shadow-emerald-500/20 transition hover:brightness-110">
                  <Plus className="h-4 w-4" />
                  New member
                </button>
              </div>
            </div>
          </header>

          <div className="space-y-6 p-5 md:p-8">
            <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
              {stats.map(({ label, value, change, trend, detail }) => (
                <div key={label} className="rounded-2xl border border-slate-800 bg-slate-900/80 p-4 shadow-glow">
                  <div className="flex items-center justify-between text-slate-400">
                    <span className="text-sm">{label}</span>
                    <span
                      className={`inline-flex items-center gap-1 rounded-full px-2 py-1 text-xs font-medium ${
                        trend === 'up'
                          ? 'bg-emerald-500/15 text-emerald-300'
                          : 'bg-rose-500/15 text-rose-300'
                      }`}
                    >
                      <TrendingUp className="h-3.5 w-3.5" />
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
              <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-5 shadow-glow">
                <div className="mb-6 flex items-center justify-between">
                  <div>
                    <p className="text-sm uppercase tracking-[0.18em] text-slate-400">Revenue</p>
                    <h3 className="mt-2 text-xl font-semibold text-white">Monthly performance</h3>
                  </div>
                  <div className="flex items-center gap-2 rounded-full border border-slate-700 bg-slate-950/80 px-3 py-1.5 text-sm text-slate-300">
                    <Wallet className="h-4 w-4 text-emerald-400" />
                    $84.8k this month
                  </div>
                </div>

                <div className="flex h-52 items-end gap-3">
                  {revenueData.map(({ month, value }) => (
                    <div key={month} className="flex flex-1 flex-col items-center gap-3">
                      <div className="flex w-full items-end justify-center rounded-t-2xl bg-gradient-to-t from-cyan-500 via-sky-500 to-emerald-400/80" style={{ height: `${value}%` }} />
                      <span className="text-xs text-slate-400">{month}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-5 shadow-glow">
                <div className="mb-5 flex items-center justify-between">
                  <div>
                    <p className="text-sm uppercase tracking-[0.18em] text-slate-400">Schedule</p>
                    <h3 className="mt-2 text-xl font-semibold text-white">Today’s classes</h3>
                  </div>
                  <button className="text-sm font-medium text-cyan-300">View all</button>
                </div>

                <div className="space-y-3">
                  {classes.map(({ name, time, coach, seats, intensity }) => (
                    <div key={name} className="rounded-xl border border-slate-800 bg-slate-950/70 p-3">
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <p className="font-medium text-white">{name}</p>
                          <p className="mt-1 text-sm text-slate-400">{coach}</p>
                        </div>
                        <span className="rounded-full border border-slate-700 bg-slate-900 px-2 py-1 text-[11px] uppercase tracking-[0.12em] text-slate-300">
                          {intensity}
                        </span>
                      </div>
                      <div className="mt-3 flex items-center justify-between text-sm text-slate-300">
                        <span className="flex items-center gap-2">
                          <CalendarDays className="h-3.5 w-3.5 text-cyan-400" />
                          {time}
                        </span>
                        <span className="flex items-center gap-2">
                          <Users className="h-3.5 w-3.5 text-emerald-400" />
                          {seats} spots left
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            <section className="grid gap-6 xl:grid-cols-[1.3fr_0.9fr]">
              <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-5 shadow-glow">
                <div className="mb-5 flex items-center justify-between">
                  <div>
                    <p className="text-sm uppercase tracking-[0.18em] text-slate-400">Members</p>
                    <h3 className="mt-2 text-xl font-semibold text-white">Member directory</h3>
                  </div>
                  <button className="text-sm font-medium text-cyan-300">Manage all</button>
                </div>

                <div className="overflow-x-auto">
                  <table className="min-w-full text-left text-sm">
                    <thead>
                      <tr className="border-b border-slate-800 text-slate-400">
                        <th className="pb-3 font-medium">Member</th>
                        <th className="pb-3 font-medium">Plan</th>
                        <th className="pb-3 font-medium">Status</th>
                        <th className="pb-3 font-medium">Renewal</th>
                        <th className="pb-3 font-medium">Trainer</th>
                      </tr>
                    </thead>
                    <tbody>
                      {members.map(({ id, name, plan, status, renewal, trainer }) => (
                        <tr key={id} className="border-b border-slate-800/80 text-slate-200">
                          <td className="py-3 pr-4">
                            <div>
                              <p className="font-medium text-white">{name}</p>
                              <p className="text-xs text-slate-400">{id}</p>
                            </div>
                          </td>
                          <td className="py-3 pr-4">{plan}</td>
                          <td className="py-3 pr-4">
                            <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${statusColors[status]}`}>
                              {status}
                            </span>
                          </td>
                          <td className="py-3 pr-4">{renewal}</td>
                          <td className="py-3 pr-4">{trainer}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="space-y-6">
                <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-5 shadow-glow">
                  <div className="mb-5 flex items-center justify-between">
                    <div>
                      <p className="text-sm uppercase tracking-[0.18em] text-slate-400">Check-ins</p>
                      <h3 className="mt-2 text-xl font-semibold text-white">Attendance</h3>
                    </div>
                    <button className="text-sm font-medium text-cyan-300">Today</button>
                  </div>

                  <div className="space-y-3">
                    {attendance.map(({ name, time, type }) => (
                      <div key={name} className="flex items-center justify-between rounded-xl border border-slate-800 bg-slate-950/80 p-3">
                        <div className="flex items-center gap-3">
                          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-emerald-500/15 text-emerald-300">
                            <UserRound className="h-4 w-4" />
                          </div>
                          <div>
                            <p className="font-medium text-white">{name}</p>
                            <p className="text-xs text-slate-400">{type}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-slate-300">
                          <Clock3 className="h-3.5 w-3.5 text-slate-500" />
                          {time}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-5 shadow-glow">
                  <div className="mb-5 flex items-center justify-between">
                    <div>
                      <p className="text-sm uppercase tracking-[0.18em] text-slate-400">Payments</p>
                      <h3 className="mt-2 text-xl font-semibold text-white">Due this week</h3>
                    </div>
                    <button className="text-sm font-medium text-cyan-300">Review</button>
                  </div>

                  <div className="space-y-3">
                    {paymentDue.map(({ name, amount, due }) => (
                      <div key={name} className="flex items-center justify-between rounded-xl border border-slate-800 bg-slate-950/80 p-3">
                        <div>
                          <p className="font-medium text-white">{name}</p>
                          <p className="text-xs text-slate-400">Due {due}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold text-white">{amount}</p>
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
          </div>
        </main>
      </div>
    </div>
  );
}
