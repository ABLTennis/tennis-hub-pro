import { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { 
  LogOut,
  Menu,
  Calendar,
  Clock,
  Users,
  Settings,
  Trophy,
  CheckCircle2,
  XCircle,
  Plus,
  Save,
  Search,
  Filter,
  Edit,
  Trash2,
  Phone,
  Mail,
  Shield,
  CalendarDays,
  User,
  Star
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Calendar as DateCalendar } from '@/components/ui/calendar';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { AIAssistant } from '@/components/chat/AIAssistant';
import { useUserRole } from '@/hooks/useUserRole';

const navigation = [
  { name: 'My Availability', href: '#availability', icon: Calendar },
  { name: 'My Sessions', href: '#sessions', icon: Users },
  { name: 'Profile', href: '#profile', icon: Settings },
];

// Mock data (UI-only; wire to Supabase next)
type AvailabilitySlot = {
  id: number;
  date: string; // YYYY-MM-DD
  start: string; // HH:mm
  end: string; // HH:mm
  status: 'available' | 'unavailable';
  recurring?: 'none' | 'weekly';
};

type CoachSession = {
  id: number;
  student: string;
  date: string; // YYYY-MM-DD
  time: string; // HH:mm
  court: 'Court 1' | 'Court 2';
  sessionType: 'Private' | 'Academy';
  status: 'pending' | 'confirmed' | 'rejected' | 'completed' | 'cancelled';
};

const mockAvailability: AvailabilitySlot[] = [
  { id: 1, date: '2026-01-21', start: '09:00', end: '12:00', status: 'available', recurring: 'weekly' },
  { id: 2, date: '2026-01-22', start: '15:00', end: '18:00', status: 'available', recurring: 'none' },
  { id: 3, date: '2026-01-23', start: '10:00', end: '11:00', status: 'unavailable', recurring: 'none' },
];

const mockSessions: CoachSession[] = [
  { id: 1, student: 'John Doe', date: '2026-01-20', time: '09:00', court: 'Court 1', sessionType: 'Private', status: 'confirmed' },
  { id: 2, student: 'Jane Smith', date: '2026-01-21', time: '15:00', court: 'Court 2', sessionType: 'Academy', status: 'pending' },
  { id: 3, student: 'Mike Johnson', date: '2026-01-22', time: '10:00', court: 'Court 1', sessionType: 'Private', status: 'confirmed' },
  { id: 4, student: 'Guest Player', date: '2026-01-15', time: '11:00', court: 'Court 2', sessionType: 'Private', status: 'completed' },
];

export default function CoachDashboard() {
  const { user, role, loading } = useUserRole();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeSection, setActiveSection] = useState<'availability' | 'sessions' | 'profile'>('availability');

  // Availability UI state
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [availabilityDialogOpen, setAvailabilityDialogOpen] = useState(false);
  const [availabilityStatus, setAvailabilityStatus] = useState<'available' | 'unavailable'>('available');
  const [availabilityStart, setAvailabilityStart] = useState('09:00');
  const [availabilityEnd, setAvailabilityEnd] = useState('10:00');
  const [availabilityRecurring, setAvailabilityRecurring] = useState<'none' | 'weekly'>('none');

  // Sessions UI state
  const [sessionFilter, setSessionFilter] = useState<'all' | 'pending' | 'confirmed' | 'completed'>('all');
  const [sessionSearch, setSessionSearch] = useState('');
  const [confirmSessionId, setConfirmSessionId] = useState<number | null>(null);
  const [rejectSessionId, setRejectSessionId] = useState<number | null>(null);

  useEffect(() => {
    if (!loading) {
      if (!user) {
        navigate('/auth');
      } else if (role && role !== 'coach') {
        // Redirect to appropriate dashboard based on role
        if (role === 'member') {
          navigate('/member/dashboard');
        } else if (role === 'admin') {
          navigate('/admin/dashboard');
        }
      }
    }
  }, [user, role, loading, navigate]);

  // Hash-based navigation
  useEffect(() => {
    const handleHashChange = () => {
      const hash = (window.location.hash.slice(1) || 'availability') as 'availability' | 'sessions' | 'profile';
      if (hash === 'availability' || hash === 'sessions' || hash === 'profile') {
        setActiveSection(hash);
      } else {
        setActiveSection('availability');
      }
      window.scrollTo({ top: 0, behavior: 'smooth' });
    };
    handleHashChange();
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    toast.success('Signed out successfully');
    navigate('/');
  };

  const sessionsFiltered = useMemo(() => {
    return mockSessions
      .filter((s) => (sessionFilter === 'all' ? true : s.status === sessionFilter))
      .filter((s) => {
        if (!sessionSearch) return true;
        const q = sessionSearch.toLowerCase();
        return s.student.toLowerCase().includes(q) || s.court.toLowerCase().includes(q) || s.date.includes(q) || s.time.includes(q);
      });
  }, [sessionFilter, sessionSearch]);

  const upcomingCount = mockSessions.filter((s) => s.status === 'confirmed' || s.status === 'pending').length;
  const monthHours = 24; // mock
  const totalStudents = 15; // mock

  const selectedDateKey = selectedDate ? selectedDate.toISOString().slice(0, 10) : '';
  const slotsForSelectedDate = mockAvailability.filter((s) => s.date === selectedDateKey);

  const handleSaveAvailability = async () => {
    toast.success('Availability saved (mock)');
    setAvailabilityDialogOpen(false);
  };

  const handleConfirmSession = async (id: number) => {
    toast.success('Session accepted (mock)');
    setConfirmSessionId(null);
  };

  const handleRejectSession = async (id: number) => {
    toast.success('Session rejected (mock)');
    setRejectSessionId(null);
  };

  if (loading || !user || role !== 'coach') {
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
                <Trophy className="w-7 h-7 text-gold-dark" />
              </div>
              <div>
                <span className="font-display font-bold text-sidebar-foreground text-lg block">BTC</span>
                <span className="text-xs text-sidebar-foreground/70 font-medium uppercase tracking-wider">Coach Portal</span>
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
                    setActiveSection(item.href.slice(1) as any);
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
                  {user.user_metadata?.full_name || 'Coach'}
                </p>
                <p className="text-xs text-sidebar-foreground/60 truncate mt-0.5">
                  Professional Coach
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
                <h1 className="text-lg sm:text-xl font-display font-bold text-foreground truncate">Coach Dashboard</h1>
                <p className="text-xs text-muted-foreground hidden sm:block">Manage your sessions & availability</p>
              </div>
            </div>
            {activeSection === 'availability' && (
              <Button variant="hero" size="sm" className="shadow-lg" onClick={() => setAvailabilityDialogOpen(true)}>
                <Plus className="w-4 h-4 mr-2" />
                Add Slot
              </Button>
            )}
          </div>
        </header>

        <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
          {/* Header (shared) */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45 }}
            className="mb-6 sm:mb-8"
          >
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-display font-bold mb-2">
              Welcome, {user.user_metadata?.full_name?.split(' ')[0] || 'Coach'}! 🎾
            </h2>
            <p className="text-muted-foreground text-base sm:text-lg">
              Manage your availability and coaching sessions from your personalized dashboard
            </p>
          </motion.div>

          {/* Stats (shared) */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-5 mb-6 sm:mb-10">
            {[
              { label: 'Upcoming Sessions', value: `${upcomingCount}`, icon: Calendar, color: 'text-court', bg: 'bg-court/10', border: 'border-court/20' },
              { label: 'Hours This Month', value: `${monthHours}`, icon: Clock, color: 'text-gold-dark', bg: 'bg-gold/10', border: 'border-gold/20' },
              { label: 'Total Students', value: `${totalStudents}`, icon: Users, color: 'text-court', bg: 'bg-court/10', border: 'border-court/20' },
            ].map((stat, idx) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20, scale: 0.97 }}
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

          {/* AVAILABILITY */}
          {activeSection === 'availability' && (
            <div id="availability" className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <div>
                  <h3 className="text-xl sm:text-2xl font-display font-bold">My Availability</h3>
                  <p className="text-sm text-muted-foreground">Set available/unavailable windows and recurring patterns.</p>
                </div>
                <Dialog open={availabilityDialogOpen} onOpenChange={setAvailabilityDialogOpen}>
                  <DialogTrigger asChild>
                    <Button variant="hero" className="shadow-lg">
                      <Plus className="w-4 h-4 mr-2" />
                      Add Availability
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-lg">
                    <DialogHeader>
                      <DialogTitle>Add Availability Slot (UI Only)</DialogTitle>
                      <DialogDescription>Mock form now; connect to Supabase later.</DialogDescription>
                    </DialogHeader>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="sm:col-span-2">
                        <Label>Date</Label>
                        <Input
                          className="mt-2"
                          type="date"
                          value={selectedDateKey}
                          onChange={(e) => setSelectedDate(new Date(e.target.value))}
                        />
                      </div>
                      <div>
                        <Label>Start</Label>
                        <Input className="mt-2" type="time" value={availabilityStart} onChange={(e) => setAvailabilityStart(e.target.value)} />
                      </div>
                      <div>
                        <Label>End</Label>
                        <Input className="mt-2" type="time" value={availabilityEnd} onChange={(e) => setAvailabilityEnd(e.target.value)} />
                      </div>
                      <div>
                        <Label>Status</Label>
                        <Select value={availabilityStatus} onValueChange={(v: any) => setAvailabilityStatus(v)}>
                          <SelectTrigger className="mt-2">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="available">Available</SelectItem>
                            <SelectItem value="unavailable">Unavailable</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label>Recurring</Label>
                        <Select value={availabilityRecurring} onValueChange={(v: any) => setAvailabilityRecurring(v)}>
                          <SelectTrigger className="mt-2">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="none">None</SelectItem>
                            <SelectItem value="weekly">Weekly</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="sm:col-span-2">
                        <Label>Notes (optional)</Label>
                        <Textarea className="mt-2" placeholder="e.g., Available for academy sessions only" />
                      </div>
                    </div>
                    <DialogFooter className="mt-4">
                      <Button variant="outline" onClick={() => setAvailabilityDialogOpen(false)}>Cancel</Button>
                      <Button variant="hero" onClick={handleSaveAvailability}>
                        <Save className="w-4 h-4 mr-2" />
                        Save
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <Card className="border-2 shadow-lg lg:col-span-1">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <CalendarDays className="w-5 h-5" />
                      Calendar
                    </CardTitle>
                    <CardDescription>Select a day to view slots</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <DateCalendar mode="single" selected={selectedDate} onSelect={setSelectedDate} />
                  </CardContent>
                </Card>

                <Card className="border-2 shadow-lg lg:col-span-2">
                  <CardHeader>
                    <CardTitle>Slots for {selectedDateKey || '—'}</CardTitle>
                    <CardDescription>Availability windows for the selected day</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {slotsForSelectedDate.length === 0 ? (
                      <div className="text-center py-10 text-muted-foreground">
                        <Calendar className="w-12 h-12 mx-auto mb-3 opacity-50" />
                        <p className="font-medium">No slots set for this date</p>
                        <p className="text-sm mt-1">Use “Add Availability” to create one.</p>
                      </div>
                    ) : (
                      slotsForSelectedDate.map((s) => (
                        <div key={s.id} className="p-4 rounded-xl border bg-card flex items-center justify-between">
                          <div>
                            <div className="flex items-center gap-2">
                              <Badge className={s.status === 'available' ? 'bg-green/20 text-green-700 border-green/30' : 'bg-red/20 text-red-700 border-red/30'}>
                                {s.status}
                              </Badge>
                              {s.recurring && s.recurring !== 'none' && (
                                <Badge variant="outline">Recurring: {s.recurring}</Badge>
                              )}
                            </div>
                            <p className="font-semibold mt-2">{s.start} - {s.end}</p>
                          </div>
                          <div className="flex gap-2">
                            <Button variant="ghost" size="sm" onClick={() => toast.message('Edit slot (mock)')}>
                              <Edit className="w-4 h-4" />
                            </Button>
                            <Button variant="ghost" size="sm" onClick={() => toast.message('Remove slot (mock)')}>
                              <Trash2 className="w-4 h-4 text-destructive" />
                            </Button>
                          </div>
                        </div>
                      ))
                    )}
                  </CardContent>
                </Card>
              </div>
            </div>
          )}

          {/* SESSIONS */}
          {activeSection === 'sessions' && (
            <div id="sessions" className="space-y-6">
              <div>
                <h3 className="text-xl sm:text-2xl font-display font-bold">My Sessions</h3>
                <p className="text-sm text-muted-foreground">Accept/reject pending sessions and review history.</p>
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
                      <Input className="pl-10" value={sessionSearch} onChange={(e) => setSessionSearch(e.target.value)} placeholder="Search student, date, court..." />
                    </div>
                  </div>
                  <div className="w-full md:w-56">
                    <Label>Status</Label>
                    <Select value={sessionFilter} onValueChange={(v: any) => setSessionFilter(v)}>
                      <SelectTrigger className="mt-2">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All</SelectItem>
                        <SelectItem value="pending">Pending</SelectItem>
                        <SelectItem value="confirmed">Confirmed</SelectItem>
                        <SelectItem value="completed">Completed</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-2 shadow-lg">
                <CardHeader>
                  <CardTitle>Sessions</CardTitle>
                  <CardDescription>{sessionsFiltered.length} results</CardDescription>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Date & Time</TableHead>
                        <TableHead>Student</TableHead>
                        <TableHead>Court</TableHead>
                        <TableHead>Type</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {sessionsFiltered.map((s) => (
                        <TableRow key={s.id}>
                          <TableCell className="font-medium">{s.date} {s.time}</TableCell>
                          <TableCell>{s.student}</TableCell>
                          <TableCell>{s.court}</TableCell>
                          <TableCell>{s.sessionType}</TableCell>
                          <TableCell>
                            <Badge className={
                              s.status === 'confirmed'
                                ? 'bg-green/20 text-green-700 border-green/30'
                                : s.status === 'pending'
                                  ? 'bg-yellow/20 text-yellow-700 border-yellow/30'
                                  : s.status === 'completed'
                                    ? 'bg-muted text-muted-foreground border-border'
                                    : 'bg-red/20 text-red-700 border-red/30'
                            }>
                              {s.status}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end gap-1">
                              {s.status === 'pending' && (
                                <>
                                  <Dialog open={confirmSessionId === s.id} onOpenChange={(o) => setConfirmSessionId(o ? s.id : null)}>
                                    <DialogTrigger asChild>
                                      <Button variant="ghost" size="sm">
                                        <CheckCircle2 className="w-4 h-4 text-green-600" />
                                      </Button>
                                    </DialogTrigger>
                                    <DialogContent>
                                      <DialogHeader>
                                        <DialogTitle>Accept Session</DialogTitle>
                                        <DialogDescription>Confirm you want to accept this session.</DialogDescription>
                                      </DialogHeader>
                                      <div className="rounded-lg border p-4 bg-muted/30">
                                        <p><strong>Student:</strong> {s.student}</p>
                                        <p><strong>Date:</strong> {s.date} {s.time}</p>
                                        <p><strong>Court:</strong> {s.court}</p>
                                        <p><strong>Type:</strong> {s.sessionType}</p>
                                      </div>
                                      <DialogFooter>
                                        <Button variant="outline" onClick={() => setConfirmSessionId(null)}>Cancel</Button>
                                        <Button variant="hero" onClick={() => handleConfirmSession(s.id)}>Accept</Button>
                                      </DialogFooter>
                                    </DialogContent>
                                  </Dialog>

                                  <Dialog open={rejectSessionId === s.id} onOpenChange={(o) => setRejectSessionId(o ? s.id : null)}>
                                    <DialogTrigger asChild>
                                      <Button variant="ghost" size="sm">
                                        <XCircle className="w-4 h-4 text-destructive" />
                                      </Button>
                                    </DialogTrigger>
                                    <DialogContent>
                                      <DialogHeader>
                                        <DialogTitle>Reject Session</DialogTitle>
                                        <DialogDescription>Provide a reason (optional) and reject.</DialogDescription>
                                      </DialogHeader>
                                      <Textarea placeholder="Reason..." />
                                      <DialogFooter>
                                        <Button variant="outline" onClick={() => setRejectSessionId(null)}>Cancel</Button>
                                        <Button variant="destructive" onClick={() => handleRejectSession(s.id)}>Reject</Button>
                                      </DialogFooter>
                                    </DialogContent>
                                  </Dialog>
                                </>
                              )}
                              <Button variant="ghost" size="sm" onClick={() => toast.message('View details (mock)')}>
                                <User className="w-4 h-4" />
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

          {/* PROFILE */}
          {activeSection === 'profile' && (
            <div id="profile" className="space-y-6">
              <div>
                <h3 className="text-xl sm:text-2xl font-display font-bold">Profile</h3>
                <p className="text-sm text-muted-foreground">Update your coach profile and preferences (UI only).</p>
              </div>

              <Card className="border-2 shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Shield className="w-5 h-5" />
                    Coach Information
                  </CardTitle>
                  <CardDescription>Public profile shown to members when booking coaching.</CardDescription>
                </CardHeader>
                <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="sm:col-span-2">
                    <Label>Full Name</Label>
                    <Input className="mt-2" defaultValue={user.user_metadata?.full_name || ''} />
                  </div>
                  <div>
                    <Label>Phone</Label>
                    <Input className="mt-2" placeholder="+256 ..." />
                  </div>
                  <div>
                    <Label>Email</Label>
                    <Input className="mt-2 bg-muted" value={user.email || ''} disabled />
                  </div>
                  <div className="sm:col-span-2">
                    <Label>Bio</Label>
                    <Textarea className="mt-2" placeholder="Short coach bio..." />
                  </div>
                  <div className="sm:col-span-2">
                    <Label>Specializations</Label>
                    <Input className="mt-2" placeholder="e.g., Beginner coaching, Footwork, Serve" />
                  </div>
                  <div className="sm:col-span-2 flex gap-2">
                    <Button variant="hero" className="shadow-lg" onClick={() => toast.success('Profile saved (mock)')}>
                      <Save className="w-4 h-4 mr-2" />
                      Save Profile
                    </Button>
                    <Button variant="outline" className="border-2" onClick={() => toast.message('Change password (mock)')}>
                      <Edit className="w-4 h-4 mr-2" />
                      Change Password
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-2 shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Star className="w-5 h-5" />
                    Preferences
                  </CardTitle>
                  <CardDescription>Notifications and session defaults.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center justify-between p-4 rounded-xl border bg-card">
                    <div>
                      <p className="font-semibold">Session reminders</p>
                      <p className="text-sm text-muted-foreground">Get notified before sessions</p>
                    </div>
                    <Button variant="outline" size="sm">Enabled</Button>
                  </div>
                  <div className="flex items-center justify-between p-4 rounded-xl border bg-card">
                    <div>
                      <p className="font-semibold">Auto-accept sessions</p>
                      <p className="text-sm text-muted-foreground">Automatically confirm new requests</p>
                    </div>
                    <Button variant="outline" size="sm">Disabled</Button>
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
