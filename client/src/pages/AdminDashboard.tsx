import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { 
  LogOut,
  Menu,
  Home,
  Users,
  Calendar,
  Receipt,
  Settings,
  TrendingUp,
  Shield,
  Trophy,
  Building,
  Search,
  Filter,
  Plus,
  Edit,
  Eye,
  XCircle,
  CheckCircle2,
  AlertCircle,
  Download,
  Save,
  DollarSign,
  Clock,
  CalendarDays,
  CreditCard,
  Phone,
  Mail,
  MapPin,
  FileText,
  BarChart3,
  TrendingDown,
  Activity,
  UserPlus,
  Ban,
  CheckCircle,
  X
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { AIAssistant } from '@/components/chat/AIAssistant';
import { useUserRole } from '@/hooks/useUserRole';

const navigation = [
  { name: 'Dashboard', href: '#overview', icon: Home },
  { name: 'Members', href: '#members', icon: Users },
  { name: 'Bookings', href: '#bookings', icon: Calendar },
  { name: 'Payments & Accounting', href: '#payments', icon: Receipt },
  { name: 'Coaches', href: '#coaches', icon: Trophy },
  { name: 'Courts', href: '#courts', icon: Building },
  { name: 'P&L Reports', href: '#reports', icon: TrendingUp },
  { name: 'Settings', href: '#settings', icon: Settings },
];

// Mock data (UI-only; wire to Supabase next)
const mockMembers = [
  { id: 1, name: 'John Doe', email: 'john@example.com', phone: '+256 772 000 111', type: 'Monthly', since: 'Jan 2025', bookings: 12, outstanding: 0, status: 'active' as const },
  { id: 2, name: 'Jane Smith', email: 'jane@example.com', phone: '+256 772 000 222', type: 'Annual', since: 'Mar 2025', bookings: 7, outstanding: 20000, status: 'active' as const },
  { id: 3, name: 'Mike Johnson', email: 'mike@example.com', phone: '+256 772 000 333', type: 'Pay-as-you-play', since: 'Dec 2025', bookings: 2, outstanding: 10000, status: 'inactive' as const },
  { id: 4, name: 'Sarah Lee', email: 'sarah@example.com', phone: '+256 772 000 444', type: 'Monthly', since: 'Feb 2025', bookings: 19, outstanding: 0, status: 'suspended' as const },
];

const mockAdminBookings = [
  { id: 1, date: '2026-01-20', time: '09:00', court: 'Court 1', member: 'John Doe', bookingType: 'Member', amount: 10000, status: 'upcoming' as const, paymentStatus: 'paid' as const },
  { id: 2, date: '2026-01-20', time: '10:00', court: 'Court 2', member: 'Jane Smith', bookingType: 'Member', amount: 10000, status: 'upcoming' as const, paymentStatus: 'pending' as const },
  { id: 3, date: '2026-01-18', time: '15:00', court: 'Court 1', member: 'Guest Player', bookingType: 'Non-member', amount: 20000, status: 'completed' as const, paymentStatus: 'paid' as const },
  { id: 4, date: '2026-01-22', time: '11:00', court: 'Court 2', member: 'John Doe', bookingType: 'Coaching', amount: 30000, status: 'upcoming' as const, paymentStatus: 'pending' as const },
];

const mockPaymentsQueue = [
  { id: 1, member: 'Jane Smith', amount: 10000, description: 'Court booking - Court 2, Jan 20, 10AM', reference: 'MOMO-001', submitted: 'Jan 19, 2026', status: 'pending' as const },
  { id: 2, member: 'John Doe', amount: 30000, description: 'Coaching - Court 2, Jan 22, 11AM', reference: 'MOMO-002', submitted: 'Jan 19, 2026', status: 'pending' as const },
];

const mockCoaches = [
  { id: 1, name: 'Coach Mike', phone: '+256 772 123 456', email: 'coachmike@btc.ug', status: 'active' as const, sessions: 18 },
  { id: 2, name: 'Coach Anne', phone: '+256 772 987 654', email: 'coachanne@btc.ug', status: 'inactive' as const, sessions: 7 },
];

const mockCourts = [
  { id: 1, name: 'Court 1', surface: 'Clay', status: 'active' as const, notes: 'Primary court' },
  { id: 2, name: 'Court 2', surface: 'Clay', status: 'maintenance' as const, notes: 'Line marking scheduled' },
];

const revenueLines = [
  'Pledges',
  'Membership Fees',
  'Member Playing Fees',
  'Non Member Playing Fees',
  'Coaching Academy Playing Fees (Member Children)',
  'Coaching Academy Playing Fees (Non-Member Children)',
  'Private Session Playing Fees',
  'Tournament Fees',
];

const expenseLines = [
  'Court Attendant Salary',
  'Security',
  'Maintenance Works',
  'Resurfacing Works',
  'Facility Lease',
  'Water',
  'Electricity',
  'Tournament Costs',
  'Line Marking',
  'Development Costs',
  'Playing Equipment Costs',
  'Tools and Machinery',
];

export default function AdminDashboard() {
  const { user, role, loading } = useUserRole();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('overview');
  const [searchQuery, setSearchQuery] = useState('');
  const [memberFilter, setMemberFilter] = useState<'all' | 'active' | 'inactive' | 'suspended'>('all');
  const [bookingFilter, setBookingFilter] = useState<'all' | 'today' | 'upcoming' | 'past'>('all');
  const [paymentFilter, setPaymentFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('all');
  const [createMemberOpen, setCreateMemberOpen] = useState(false);
  const [recordExpenseOpen, setRecordExpenseOpen] = useState(false);
  const [approvePaymentId, setApprovePaymentId] = useState<number | null>(null);
  const [rejectPaymentId, setRejectPaymentId] = useState<number | null>(null);

  // Hash-based navigation
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.slice(1) || 'overview';
      setActiveSection(hash);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    };
    handleHashChange();
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  useEffect(() => {
    if (!loading) {
      if (!user) {
        navigate('/auth');
      } else if (role && role !== 'admin') {
        if (role === 'member') {
          navigate('/member/dashboard');
        } else if (role === 'coach') {
          navigate('/coach/dashboard');
        }
      }
    }
  }, [user, role, loading, navigate]);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    toast.success('Signed out successfully');
    navigate('/');
  };

  const filteredMembers = mockMembers
    .filter((m) => (memberFilter === 'all' ? true : m.status === memberFilter))
    .filter((m) => {
      if (!searchQuery) return true;
      const q = searchQuery.toLowerCase();
      return m.name.toLowerCase().includes(q) || m.email.toLowerCase().includes(q) || m.phone.toLowerCase().includes(q);
    });

  const filteredBookings = mockAdminBookings
    .filter((b) => {
      if (bookingFilter === 'all') return true;
      if (bookingFilter === 'today') return b.date === '2026-01-20';
      if (bookingFilter === 'upcoming') return b.status === 'upcoming';
      if (bookingFilter === 'past') return b.status === 'completed';
      return true;
    })
    .filter((b) => {
      if (!searchQuery) return true;
      const q = searchQuery.toLowerCase();
      return b.member.toLowerCase().includes(q) || b.court.toLowerCase().includes(q) || b.date.includes(q) || b.time.includes(q);
    });

  const filteredPayments = mockPaymentsQueue.filter((p) => (paymentFilter === 'all' ? true : p.status === paymentFilter));

  const handleApprovePayment = async (id: number) => {
    toast.success('Payment approved (mock)');
    setApprovePaymentId(null);
  };

  const handleRejectPayment = async (id: number) => {
    toast.success('Payment rejected (mock)');
    setRejectPaymentId(null);
  };

  if (loading || !user || role !== 'admin') {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-court mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20 flex">
      {/* Sidebar */}
      <aside className={`fixed inset-y-0 left-0 z-50 w-[85vw] max-w-[280px] sm:max-w-[320px] lg:w-72 bg-sidebar border-r border-sidebar-border shadow-xl transform transition-transform duration-300 lg:translate-x-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="p-6 border-b border-sidebar-border bg-gradient-to-br from-sidebar to-sidebar-accent/50">
            <div className="flex items-center gap-4">
              <div className="relative w-12 h-12 rounded-xl bg-gradient-to-br from-gold/30 to-gold/50 flex items-center justify-center shadow-lg border-2 border-gold/30">
                <Shield className="w-7 h-7 text-gold-dark" />
              </div>
              <div>
                <span className="font-display font-bold text-sidebar-foreground text-lg block">BTC</span>
                <span className="text-xs text-sidebar-foreground/70 font-medium uppercase tracking-wider">Admin Portal</span>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
            {navigation.map((item) => {
              const isActive = activeSection === item.href.slice(1);
              return (
                <a
                  key={item.name}
                  href={item.href}
                  onClick={(e) => {
                    e.preventDefault();
                    window.location.hash = item.href.slice(1);
                    setActiveSection(item.href.slice(1));
                    if (window.innerWidth < 1024) setSidebarOpen(false);
                  }}
                  className={`group flex items-center gap-3 px-4 py-3 rounded-xl text-sidebar-foreground/80 hover:bg-sidebar-accent hover:text-sidebar-foreground transition-all duration-200 hover:shadow-md border ${
                    isActive 
                      ? 'bg-sidebar-accent text-sidebar-foreground border-sidebar-border/50 shadow-md' 
                      : 'border-transparent hover:border-sidebar-border/50'
                  }`}
                >
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center transition-colors ${
                    isActive ? 'bg-gold/10' : 'bg-sidebar-accent/50 group-hover:bg-gold/10'
                  }`}>
                    <item.icon className={`w-5 h-5 transition-colors ${
                      isActive ? 'text-gold-dark' : 'text-sidebar-foreground/60 group-hover:text-gold-dark'
                    }`} />
                  </div>
                  <span className="font-semibold text-sm">{item.name}</span>
                </a>
              );
            })}
          </nav>

          {/* User section */}
          <div className="p-4 border-t border-sidebar-border bg-sidebar-accent/30">
            <div className="flex items-center gap-3 mb-4 p-3 rounded-xl bg-sidebar-accent/50 border border-sidebar-border/50">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-gold/20 to-gold/10 flex items-center justify-center border-2 border-gold/20 shadow-sm">
                <span className="text-base font-bold text-sidebar-foreground">
                  {user.user_metadata?.full_name?.[0] || user.email?.[0]?.toUpperCase()}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-sidebar-foreground truncate">
                  {user.user_metadata?.full_name || 'Admin'}
                </p>
                <p className="text-xs text-sidebar-foreground/60 truncate mt-0.5">
                  Administrator
                </p>
              </div>
            </div>
            <Button
              variant="ghost"
              className="w-full justify-start text-sidebar-foreground/80 hover:text-sidebar-foreground hover:bg-sidebar-accent hover:border-sidebar-border border border-transparent rounded-xl py-6 font-medium transition-all"
              onClick={handleSignOut}
            >
              <LogOut className="w-5 h-5 mr-2" />
              Sign Out
            </Button>
          </div>
        </div>
      </aside>

      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main content */}
      <main className="flex-1 lg:ml-72">
        {/* Top bar */}
        <header className="sticky top-0 z-30 bg-background/95 backdrop-blur-xl border-b border-border/50 shadow-sm">
          <div className="flex items-center justify-between px-4 sm:px-6 lg:px-8 py-3 sm:py-4 gap-3">
            <div className="flex items-center gap-3 sm:gap-4 flex-1 min-w-0">
              <button
                className="lg:hidden p-2 rounded-xl hover:bg-muted active:scale-95 transition-all touch-manipulation flex-shrink-0"
                onClick={() => setSidebarOpen(true)}
                aria-label="Open menu"
              >
                <Menu className="w-5 h-5 sm:w-6 sm:h-6" />
              </button>
              <div className="min-w-0">
                <h1 className="text-lg sm:text-xl font-display font-bold text-foreground truncate">Admin Dashboard</h1>
                <p className="text-xs text-muted-foreground hidden sm:block">Club management & operations</p>
              </div>
            </div>
          </div>
        </header>

        <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
          {/* OVERVIEW */}
          {activeSection === 'overview' && (
            <div id="overview" className="space-y-6 sm:space-y-8">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <h2 className="text-2xl sm:text-3xl lg:text-4xl font-display font-bold mb-2 sm:mb-3">
                  Welcome, Administrator! 👋
                </h2>
                <p className="text-muted-foreground text-base sm:text-lg">
                  Manage the club operations, members, bookings, and finances from one central dashboard
                </p>
              </motion.div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
                {[
                  { label: 'Total Members', value: `${mockMembers.length}`, icon: Users, color: 'text-court', bg: 'bg-court/10', border: 'border-court/20' },
                  { label: 'Bookings Today', value: `${mockAdminBookings.filter((b) => b.date === '2026-01-20').length}`, icon: Calendar, color: 'text-gold-dark', bg: 'bg-gold/10', border: 'border-gold/20' },
                  { label: 'Pending Payments', value: `${mockPaymentsQueue.length}`, icon: Receipt, color: 'text-court', bg: 'bg-court/10', border: 'border-court/20' },
                  { label: 'Courts', value: `${mockCourts.length}`, icon: Building, color: 'text-gold-dark', bg: 'bg-gold/10', border: 'border-gold/20' },
                ].map((stat, idx) => (
                  <motion.div
                    key={stat.label}
                    initial={{ opacity: 0, y: 20, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    transition={{ delay: idx * 0.08, duration: 0.45 }}
                    whileHover={{ y: -5, transition: { duration: 0.2 } }}
                    className="stat-card p-5 sm:p-6 rounded-xl sm:rounded-2xl bg-card border-2 hover:shadow-xl transition-all cursor-default group"
                  >
                    <div className="flex items-center justify-between mb-4 sm:mb-5">
                      <div className={`w-12 h-12 sm:w-14 sm:h-14 rounded-xl ${stat.bg} border-2 ${stat.border} flex items-center justify-center group-hover:scale-110 transition-transform shadow-sm`}>
                        <stat.icon className={`w-6 h-6 sm:w-7 sm:h-7 ${stat.color}`} />
                      </div>
                    </div>
                    <p className="text-2xl sm:text-3xl font-bold mb-1 sm:mb-2 text-foreground">{stat.value}</p>
                    <p className="text-xs sm:text-sm font-medium text-muted-foreground">{stat.label}</p>
                  </motion.div>
                ))}
              </div>

              <Card className="border-2 shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Activity className="w-5 h-5" />
                    Quick Actions
                  </CardTitle>
                  <CardDescription>Common administrative tasks</CardDescription>
                </CardHeader>
                <CardContent className="grid grid-cols-1 md:grid-cols-4 gap-3">
                  <Dialog open={createMemberOpen} onOpenChange={setCreateMemberOpen}>
                    <DialogTrigger asChild>
                      <Button variant="outline" className="justify-start h-auto py-4 border-2">
                        <UserPlus className="w-5 h-5 mr-3" />
                        <div className="text-left">
                          <div className="font-semibold">Add Member</div>
                          <div className="text-xs text-muted-foreground">Create a new member</div>
                        </div>
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-lg">
                      <DialogHeader>
                        <DialogTitle>Add Member (UI Only)</DialogTitle>
                        <DialogDescription>Mock form for now. Will be connected to Supabase.</DialogDescription>
                      </DialogHeader>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <Label>Full Name</Label>
                          <Input className="mt-2" placeholder="Member name" />
                        </div>
                        <div>
                          <Label>Phone</Label>
                          <Input className="mt-2" placeholder="+256 ..." />
                        </div>
                        <div className="sm:col-span-2">
                          <Label>Email</Label>
                          <Input className="mt-2" placeholder="email@example.com" />
                        </div>
                        <div>
                          <Label>Membership Type</Label>
                          <Select>
                            <SelectTrigger className="mt-2">
                              <SelectValue placeholder="Select type" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="monthly">Monthly</SelectItem>
                              <SelectItem value="annual">Annual</SelectItem>
                              <SelectItem value="payg">Pay-as-you-play</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <Label>Status</Label>
                          <Select>
                            <SelectTrigger className="mt-2">
                              <SelectValue placeholder="Select status" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="active">Active</SelectItem>
                              <SelectItem value="inactive">Inactive</SelectItem>
                              <SelectItem value="suspended">Suspended</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                      <DialogFooter className="mt-4">
                        <Button variant="outline" onClick={() => setCreateMemberOpen(false)}>Cancel</Button>
                        <Button variant="hero" onClick={() => { toast.success('Member created (mock)'); setCreateMemberOpen(false); }}>
                          <Save className="w-4 h-4 mr-2" />
                          Save
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>

                  <Button
                    variant="outline"
                    className="justify-start h-auto py-4 border-2"
                    onClick={() => {
                      window.location.hash = 'payments';
                      setActiveSection('payments');
                    }}
                  >
                    <Receipt className="w-5 h-5 mr-3" />
                    <div className="text-left">
                      <div className="font-semibold">Approve Payments</div>
                      <div className="text-xs text-muted-foreground">Review pending items</div>
                    </div>
                  </Button>

                  <Button
                    variant="outline"
                    className="justify-start h-auto py-4 border-2"
                    onClick={() => {
                      window.location.hash = 'bookings';
                      setActiveSection('bookings');
                    }}
                  >
                    <CalendarDays className="w-5 h-5 mr-3" />
                    <div className="text-left">
                      <div className="font-semibold">Today’s Schedule</div>
                      <div className="text-xs text-muted-foreground">Bookings for today</div>
                    </div>
                  </Button>

                  <Dialog open={recordExpenseOpen} onOpenChange={setRecordExpenseOpen}>
                    <DialogTrigger asChild>
                      <Button variant="outline" className="justify-start h-auto py-4 border-2">
                        <TrendingDown className="w-5 h-5 mr-3" />
                        <div className="text-left">
                          <div className="font-semibold">Record Expense</div>
                          <div className="text-xs text-muted-foreground">Add expense line</div>
                        </div>
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-lg">
                      <DialogHeader>
                        <DialogTitle>Record Expense (UI Only)</DialogTitle>
                        <DialogDescription>Mock entry for now. Will feed P&L later.</DialogDescription>
                      </DialogHeader>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="sm:col-span-2">
                          <Label>Expense Line</Label>
                          <Select>
                            <SelectTrigger className="mt-2">
                              <SelectValue placeholder="Select expense line" />
                            </SelectTrigger>
                            <SelectContent>
                              {expenseLines.map((l) => (
                                <SelectItem key={l} value={l}>{l}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <Label>Amount (UGX)</Label>
                          <Input className="mt-2" type="number" placeholder="0" />
                        </div>
                        <div>
                          <Label>Accounting</Label>
                          <Select>
                            <SelectTrigger className="mt-2">
                              <SelectValue placeholder="Cash / Accrual" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="cash">Cash</SelectItem>
                              <SelectItem value="accrual">Accrual</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="sm:col-span-2">
                          <Label>Notes</Label>
                          <Textarea className="mt-2" placeholder="Optional description" />
                        </div>
                      </div>
                      <DialogFooter className="mt-4">
                        <Button variant="outline" onClick={() => setRecordExpenseOpen(false)}>Cancel</Button>
                        <Button variant="hero" onClick={() => { toast.success('Expense recorded (mock)'); setRecordExpenseOpen(false); }}>
                          <Save className="w-4 h-4 mr-2" />
                          Save
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </CardContent>
              </Card>

              <Card className="border-2 shadow-lg">
                <CardHeader>
                  <CardTitle>Recent Activity</CardTitle>
                  <CardDescription>Latest bookings & payments (mock)</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  {mockAdminBookings.slice(0, 3).map((b) => (
                    <div key={b.id} className="flex items-center justify-between p-4 rounded-xl border border-border bg-card hover:bg-muted/50 transition-colors">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-court/10 flex items-center justify-center">
                          <Calendar className="w-5 h-5 text-court" />
                        </div>
                        <div>
                          <p className="font-semibold">{b.member} • {b.court}</p>
                          <p className="text-sm text-muted-foreground">{b.date} at {b.time} • {b.bookingType}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline">{b.paymentStatus}</Badge>
                        <Badge className={b.status === 'upcoming' ? 'bg-gold/20 text-gold-dark border-gold/30' : 'bg-muted text-muted-foreground border-border'}>
                          {b.status}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
          )}

          {/* MEMBERS */}
          {activeSection === 'members' && (
            <div id="members" className="space-y-6">
              <div>
                <h2 className="text-2xl sm:text-3xl font-display font-bold mb-2">Members Management</h2>
                <p className="text-muted-foreground">Search, filter, and manage members (mock data)</p>
              </div>

              <Card className="border-2 shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Filter className="w-5 h-5" />
                    Filters
                  </CardTitle>
                </CardHeader>
                <CardContent className="flex flex-col md:flex-row gap-4">
                  <div className="flex-1">
                    <Label>Search</Label>
                    <div className="relative mt-2">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                      <Input className="pl-10" placeholder="Search name, email, phone..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
                    </div>
                  </div>
                  <div className="w-full md:w-56">
                    <Label>Status</Label>
                    <Select value={memberFilter} onValueChange={(v: any) => setMemberFilter(v)}>
                      <SelectTrigger className="mt-2">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All</SelectItem>
                        <SelectItem value="active">Active</SelectItem>
                        <SelectItem value="inactive">Inactive</SelectItem>
                        <SelectItem value="suspended">Suspended</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex items-end gap-2">
                    <Button variant="outline" className="border-2" onClick={() => toast.success('Export (mock)')}>
                      <Download className="w-4 h-4 mr-2" />
                      Export
                    </Button>
                    <Button variant="hero" className="shadow-lg" onClick={() => setCreateMemberOpen(true)}>
                      <Plus className="w-4 h-4 mr-2" />
                      Add Member
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-2 shadow-lg">
                <CardHeader>
                  <CardTitle>Member List</CardTitle>
                  <CardDescription>{filteredMembers.length} results</CardDescription>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Phone</TableHead>
                        <TableHead>Membership</TableHead>
                        <TableHead>Since</TableHead>
                        <TableHead className="text-right">Bookings</TableHead>
                        <TableHead className="text-right">Outstanding</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredMembers.map((m) => (
                        <TableRow key={m.id}>
                          <TableCell className="font-semibold">{m.name}</TableCell>
                          <TableCell className="text-sm text-muted-foreground">{m.email}</TableCell>
                          <TableCell className="text-sm">{m.phone}</TableCell>
                          <TableCell>{m.type}</TableCell>
                          <TableCell>{m.since}</TableCell>
                          <TableCell className="text-right">{m.bookings}</TableCell>
                          <TableCell className="text-right">UGX {m.outstanding.toLocaleString()}</TableCell>
                          <TableCell>
                            <Badge className={
                              m.status === 'active'
                                ? 'bg-green/20 text-green-700 border-green/30'
                                : m.status === 'inactive'
                                  ? 'bg-muted text-muted-foreground border-border'
                                  : 'bg-red/20 text-red-700 border-red/30'
                            }>
                              {m.status}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end gap-1">
                              <Button variant="ghost" size="sm" onClick={() => toast.message('View profile (mock)')}>
                                <Eye className="w-4 h-4" />
                              </Button>
                              <Button variant="ghost" size="sm" onClick={() => toast.message('Edit member (mock)')}>
                                <Edit className="w-4 h-4" />
                              </Button>
                              <Button variant="ghost" size="sm" onClick={() => toast.message('Suspend/Activate (mock)')}>
                                <Ban className="w-4 h-4 text-destructive" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </div>
          )}

          {/* BOOKINGS */}
          {activeSection === 'bookings' && (
            <div id="bookings" className="space-y-6">
              <div>
                <h2 className="text-2xl sm:text-3xl font-display font-bold mb-2">Bookings Management</h2>
                <p className="text-muted-foreground">Calendar/list view, filters, and actions (mock)</p>
              </div>

              <Card className="border-2 shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Filter className="w-5 h-5" />
                    Filters
                  </CardTitle>
                </CardHeader>
                <CardContent className="flex flex-col md:flex-row gap-4">
                  <div className="flex-1">
                    <Label>Search</Label>
                    <div className="relative mt-2">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                      <Input className="pl-10" placeholder="Search member, court, date, time..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
                    </div>
                  </div>
                  <div className="w-full md:w-56">
                    <Label>Scope</Label>
                    <Select value={bookingFilter} onValueChange={(v: any) => setBookingFilter(v)}>
                      <SelectTrigger className="mt-2">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All</SelectItem>
                        <SelectItem value="today">Today</SelectItem>
                        <SelectItem value="upcoming">Upcoming</SelectItem>
                        <SelectItem value="past">Past</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-2 shadow-lg">
                <CardHeader>
                  <CardTitle>Bookings List</CardTitle>
                  <CardDescription>{filteredBookings.length} results</CardDescription>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Date & Time</TableHead>
                        <TableHead>Court</TableHead>
                        <TableHead>Member</TableHead>
                        <TableHead>Type</TableHead>
                        <TableHead className="text-right">Amount</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Payment</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredBookings.map((b) => (
                        <TableRow key={b.id}>
                          <TableCell className="font-medium">{b.date} {b.time}</TableCell>
                          <TableCell>{b.court}</TableCell>
                          <TableCell>{b.member}</TableCell>
                          <TableCell>{b.bookingType}</TableCell>
                          <TableCell className="text-right">UGX {b.amount.toLocaleString()}</TableCell>
                          <TableCell>
                            <Badge className={b.status === 'upcoming' ? 'bg-gold/20 text-gold-dark border-gold/30' : 'bg-muted text-muted-foreground border-border'}>
                              {b.status}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline">{b.paymentStatus}</Badge>
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end gap-1">
                              <Button variant="ghost" size="sm" onClick={() => toast.message('Edit booking (mock)')}>
                                <Edit className="w-4 h-4" />
                              </Button>
                              <Button variant="ghost" size="sm" onClick={() => toast.message('Cancel booking (mock)')}>
                                <XCircle className="w-4 h-4 text-destructive" />
                              </Button>
                              {b.paymentStatus === 'pending' && (
                                <Button variant="ghost" size="sm" onClick={() => toast.message('Mark paid (mock)')}>
                                  <CheckCircle2 className="w-4 h-4 text-green-600" />
                                </Button>
                              )}
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </div>
          )}

          {/* PAYMENTS */}
          {activeSection === 'payments' && (
            <div id="payments" className="space-y-6">
              <div>
                <h2 className="text-2xl sm:text-3xl font-display font-bold mb-2">Payments & Accounting</h2>
                <p className="text-muted-foreground">Approval queue + history + manual entry (mock)</p>
              </div>

              <Card className="border-2 shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Filter className="w-5 h-5" />
                    Queue Filters
                  </CardTitle>
                </CardHeader>
                <CardContent className="flex flex-col md:flex-row gap-4">
                  <div className="w-full md:w-56">
                    <Label>Status</Label>
                    <Select value={paymentFilter} onValueChange={(v: any) => setPaymentFilter(v)}>
                      <SelectTrigger className="mt-2">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All</SelectItem>
                        <SelectItem value="pending">Pending</SelectItem>
                        <SelectItem value="approved">Approved</SelectItem>
                        <SelectItem value="rejected">Rejected</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex items-end gap-2">
                    <Button variant="outline" className="border-2" onClick={() => toast.success('Export (mock)')}>
                      <Download className="w-4 h-4 mr-2" />
                      Export
                    </Button>
                    <Button variant="hero" className="shadow-lg" onClick={() => toast.message('Manual payment entry (mock)')}>
                      <Plus className="w-4 h-4 mr-2" />
                      Manual Entry
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-2 shadow-lg">
                <CardHeader>
                  <CardTitle>Payment Approval Queue</CardTitle>
                  <CardDescription>{filteredPayments.length} items</CardDescription>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Member</TableHead>
                        <TableHead>Description</TableHead>
                        <TableHead className="text-right">Amount</TableHead>
                        <TableHead>Reference</TableHead>
                        <TableHead>Submitted</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredPayments.map((p) => (
                        <TableRow key={p.id}>
                          <TableCell className="font-semibold">{p.member}</TableCell>
                          <TableCell className="text-sm text-muted-foreground">{p.description}</TableCell>
                          <TableCell className="text-right font-semibold">UGX {p.amount.toLocaleString()}</TableCell>
                          <TableCell className="font-mono text-xs">{p.reference}</TableCell>
                          <TableCell>{p.submitted}</TableCell>
                          <TableCell>
                            <Badge className="bg-yellow/20 text-yellow-700 border-yellow/30">pending</Badge>
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end gap-1">
                              <Button variant="ghost" size="sm" onClick={() => toast.message('View receipt (mock)')}>
                                <Eye className="w-4 h-4" />
                              </Button>
                              <Dialog open={approvePaymentId === p.id} onOpenChange={(o) => setApprovePaymentId(o ? p.id : null)}>
                                <DialogTrigger asChild>
                                  <Button variant="ghost" size="sm">
                                    <CheckCircle2 className="w-4 h-4 text-green-600" />
                                  </Button>
                                </DialogTrigger>
                                <DialogContent>
                                  <DialogHeader>
                                    <DialogTitle>Approve Payment</DialogTitle>
                                    <DialogDescription>Confirm approval for this payment.</DialogDescription>
                                  </DialogHeader>
                                  <div className="rounded-lg border p-4 bg-muted/30">
                                    <p><strong>Member:</strong> {p.member}</p>
                                    <p><strong>Amount:</strong> UGX {p.amount.toLocaleString()}</p>
                                    <p><strong>Reference:</strong> {p.reference}</p>
                                  </div>
                                  <DialogFooter>
                                    <Button variant="outline" onClick={() => setApprovePaymentId(null)}>Cancel</Button>
                                    <Button variant="hero" onClick={() => handleApprovePayment(p.id)}>Approve</Button>
                                  </DialogFooter>
                                </DialogContent>
                              </Dialog>

                              <Dialog open={rejectPaymentId === p.id} onOpenChange={(o) => setRejectPaymentId(o ? p.id : null)}>
                                <DialogTrigger asChild>
                                  <Button variant="ghost" size="sm">
                                    <XCircle className="w-4 h-4 text-destructive" />
                                  </Button>
                                </DialogTrigger>
                                <DialogContent>
                                  <DialogHeader>
                                    <DialogTitle>Reject Payment</DialogTitle>
                                    <DialogDescription>Provide a reason (optional) and reject.</DialogDescription>
                                  </DialogHeader>
                                  <Textarea placeholder="Reason..." />
                                  <DialogFooter>
                                    <Button variant="outline" onClick={() => setRejectPaymentId(null)}>Cancel</Button>
                                    <Button variant="destructive" onClick={() => handleRejectPayment(p.id)}>Reject</Button>
                                  </DialogFooter>
                                </DialogContent>
                              </Dialog>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </div>
          )}

          {/* COACHES */}
          {activeSection === 'coaches' && (
            <div id="coaches" className="space-y-6">
              <div>
                <h2 className="text-2xl sm:text-3xl font-display font-bold mb-2">Coaches Management</h2>
                <p className="text-muted-foreground">Manage coach profiles, status, and sessions (mock)</p>
              </div>

              <Card className="border-2 shadow-lg">
                <CardHeader className="flex flex-row items-center justify-between">
                  <div>
                    <CardTitle>Coach List</CardTitle>
                    <CardDescription>{mockCoaches.length} coaches</CardDescription>
                  </div>
                  <Button variant="hero" className="shadow-lg" onClick={() => toast.message('Add coach (mock)')}>
                    <Plus className="w-4 h-4 mr-2" />
                    Add Coach
                  </Button>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Phone</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead className="text-right">Sessions</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {mockCoaches.map((c) => (
                        <TableRow key={c.id}>
                          <TableCell className="font-semibold">{c.name}</TableCell>
                          <TableCell>{c.phone}</TableCell>
                          <TableCell className="text-sm text-muted-foreground">{c.email}</TableCell>
                          <TableCell className="text-right">{c.sessions}</TableCell>
                          <TableCell>
                            <Badge className={c.status === 'active' ? 'bg-green/20 text-green-700 border-green/30' : 'bg-muted text-muted-foreground border-border'}>
                              {c.status}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end gap-1">
                              <Button variant="ghost" size="sm" onClick={() => toast.message('Edit coach (mock)')}>
                                <Edit className="w-4 h-4" />
                              </Button>
                              <Button variant="ghost" size="sm" onClick={() => toast.message('Toggle status (mock)')}>
                                <Ban className="w-4 h-4 text-destructive" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </div>
          )}

          {/* COURTS */}
          {activeSection === 'courts' && (
            <div id="courts" className="space-y-6">
              <div>
                <h2 className="text-2xl sm:text-3xl font-display font-bold mb-2">Courts Management</h2>
                <p className="text-muted-foreground">Court status, maintenance, and rules (mock)</p>
              </div>

              <Card className="border-2 shadow-lg">
                <CardHeader>
                  <CardTitle>Courts</CardTitle>
                  <CardDescription>Manage court availability & maintenance windows</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {mockCourts.map((c) => (
                      <div key={c.id} className="p-5 rounded-2xl border-2 bg-card shadow-sm">
                        <div className="flex items-start justify-between">
                          <div>
                            <p className="text-xl font-bold">{c.name}</p>
                            <p className="text-sm text-muted-foreground">{c.surface}</p>
                          </div>
                          <Badge className={
                            c.status === 'active'
                              ? 'bg-green/20 text-green-700 border-green/30'
                              : c.status === 'maintenance'
                                ? 'bg-yellow/20 text-yellow-700 border-yellow/30'
                                : 'bg-red/20 text-red-700 border-red/30'
                          }>
                            {c.status}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground mt-3">{c.notes}</p>
                        <div className="flex gap-2 mt-4">
                          <Button variant="outline" className="border-2" size="sm" onClick={() => toast.message('Set status (mock)')}>
                            <Edit className="w-4 h-4 mr-2" />
                            Update
                          </Button>
                          <Button variant="outline" className="border-2" size="sm" onClick={() => toast.message('Block maintenance slot (mock)')}>
                            <CalendarDays className="w-4 h-4 mr-2" />
                            Maintenance
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* REPORTS */}
          {activeSection === 'reports' && (
            <div id="reports" className="space-y-6">
              <div>
                <h2 className="text-2xl sm:text-3xl font-display font-bold mb-2">P&L Reports</h2>
                <p className="text-muted-foreground">Cash vs accrual view per line (mock totals)</p>
              </div>

              <Card className="border-2 shadow-lg">
                <CardHeader className="flex flex-row items-center justify-between">
                  <div>
                    <CardTitle>Revenue Lines</CardTitle>
                    <CardDescription>Cash vs accrual by category</CardDescription>
                  </div>
                  <Button variant="outline" className="border-2" onClick={() => toast.success('Export P&L (mock)')}>
                    <Download className="w-4 h-4 mr-2" />
                    Export
                  </Button>
                </CardHeader>
                <CardContent className="space-y-2">
                  {revenueLines.map((l) => (
                    <div key={l} className="p-4 rounded-xl border bg-card flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <BarChart3 className="w-5 h-5 text-court" />
                        <span className="font-medium">{l}</span>
                      </div>
                      <div className="flex items-center gap-3 text-sm">
                        <Badge variant="outline">Cash: UGX 0</Badge>
                        <Badge variant="outline">Accrual: UGX 0</Badge>
                        <Badge variant="outline">Δ: UGX 0</Badge>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>

              <Card className="border-2 shadow-lg">
                <CardHeader>
                  <CardTitle>Expense Lines</CardTitle>
                  <CardDescription>Cash vs accrual by category</CardDescription>
                </CardHeader>
                <CardContent className="space-y-2">
                  {expenseLines.map((l) => (
                    <div key={l} className="p-4 rounded-xl border bg-card flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <TrendingDown className="w-5 h-5 text-destructive" />
                        <span className="font-medium">{l}</span>
                      </div>
                      <div className="flex items-center gap-3 text-sm">
                        <Badge variant="outline">Cash: UGX 0</Badge>
                        <Badge variant="outline">Accrual: UGX 0</Badge>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
          )}

          {/* SETTINGS */}
          {activeSection === 'settings' && (
            <div id="settings" className="space-y-6">
              <div>
                <h2 className="text-2xl sm:text-3xl font-display font-bold mb-2">Club Settings</h2>
                <p className="text-muted-foreground">Club info, pricing rules, and booking rules (mock)</p>
              </div>

              <Card className="border-2 shadow-lg">
                <CardHeader>
                  <CardTitle>Club Information</CardTitle>
                  <CardDescription>Basic club details</CardDescription>
                </CardHeader>
                <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="sm:col-span-2">
                    <Label>Club Name</Label>
                    <Input className="mt-2" defaultValue="Buwate Tennis Club" />
                  </div>
                  <div>
                    <Label>Support Email</Label>
                    <Input className="mt-2" defaultValue="tennis.abl.ug@gmail.com" />
                  </div>
                  <div>
                    <Label>Phone</Label>
                    <Input className="mt-2" defaultValue="+256 772 675 050" />
                  </div>
                  <div className="sm:col-span-2">
                    <Label>Address</Label>
                    <Input className="mt-2" defaultValue="Buwate, Kampala, Uganda" />
                  </div>
                  <div className="sm:col-span-2">
                    <Button variant="hero" className="shadow-lg" onClick={() => toast.success('Saved (mock)')}>
                      <Save className="w-4 h-4 mr-2" />
                      Save Settings
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-2 shadow-lg">
                <CardHeader>
                  <CardTitle>Booking Rules</CardTitle>
                  <CardDescription>Advance booking & cancellation windows</CardDescription>
                </CardHeader>
                <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <Label>Advance booking (hours)</Label>
                    <Input className="mt-2" type="number" defaultValue={24} />
                  </div>
                  <div>
                    <Label>Cancellation window (hours)</Label>
                    <Input className="mt-2" type="number" defaultValue={2} />
                  </div>
                  <div>
                    <Label>Max duration (hours)</Label>
                    <Input className="mt-2" type="number" defaultValue={1} />
                  </div>
                  <div>
                    <Label>MoMo Number</Label>
                    <Input className="mt-2" defaultValue="0790229161" />
                  </div>
                  <div className="sm:col-span-2">
                    <Button variant="hero" className="shadow-lg" onClick={() => toast.success('Saved (mock)')}>
                      <Save className="w-4 h-4 mr-2" />
                      Save Rules
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </main>

      <AIAssistant />
    </div>
  );
}
