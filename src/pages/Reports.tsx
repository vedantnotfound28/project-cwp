import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Header } from '@/components/Header';
import { ReportCard } from '@/components/ReportCard';
import { useReports } from '@/context/ReportsContext';
import { ReportStatus, CATEGORIES, ProblemCategory } from '@/types/report';
import { Plus, Filter, Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

type FilterStatus = 'all' | ReportStatus;

export default function Reports() {
  const { reports } = useReports();
  const [statusFilter, setStatusFilter] = useState<FilterStatus>('all');
  const [categoryFilter, setCategoryFilter] = useState<ProblemCategory | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredReports = useMemo(() => {
    return reports.filter(report => {
      // Status filter
      if (statusFilter !== 'all' && report.status !== statusFilter) {
        return false;
      }
      
      // Category filter
      if (categoryFilter !== 'all' && report.category !== categoryFilter) {
        return false;
      }
      
      // Search filter
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        return (
          report.title.toLowerCase().includes(query) ||
          report.description.toLowerCase().includes(query) ||
          report.location.toLowerCase().includes(query)
        );
      }
      
      return true;
    });
  }, [reports, statusFilter, categoryFilter, searchQuery]);

  const statusCounts = useMemo(() => {
    return {
      all: reports.length,
      pending: reports.filter(r => r.status === 'pending').length,
      in_progress: reports.filter(r => r.status === 'in_progress').length,
      resolved: reports.filter(r => r.status === 'resolved').length,
    };
  }, [reports]);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container py-8 md:py-12">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-foreground mb-2">
              Community Reports
            </h1>
            <p className="text-muted-foreground">
              {filteredReports.length} {filteredReports.length === 1 ? 'report' : 'reports'} found
            </p>
          </div>
          <Link to="/submit">
            <Button variant="hero">
              <Plus className="h-5 w-5" />
              New Report
            </Button>
          </Link>
        </div>

        {/* Filters */}
        <div className="bg-card border border-border rounded-xl p-4 mb-8">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search */}
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search reports..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            {/* Status Filter */}
            <div className="flex flex-col sm:flex-row gap-3">
              <Select value={statusFilter} onValueChange={(v) => setStatusFilter(v as FilterStatus)}>
                <SelectTrigger className="w-full sm:w-[180px]">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status ({statusCounts.all})</SelectItem>
                  <SelectItem value="pending">
                    <span className="flex items-center gap-2">
                      <span className="h-2 w-2 rounded-full bg-status-pending" />
                      Pending ({statusCounts.pending})
                    </span>
                  </SelectItem>
                  <SelectItem value="in_progress">
                    <span className="flex items-center gap-2">
                      <span className="h-2 w-2 rounded-full bg-status-progress" />
                      In Progress ({statusCounts.in_progress})
                    </span>
                  </SelectItem>
                  <SelectItem value="resolved">
                    <span className="flex items-center gap-2">
                      <span className="h-2 w-2 rounded-full bg-status-resolved" />
                      Resolved ({statusCounts.resolved})
                    </span>
                  </SelectItem>
                </SelectContent>
              </Select>

              {/* Category Filter */}
              <Select value={categoryFilter} onValueChange={(v) => setCategoryFilter(v as ProblemCategory | 'all')}>
                <SelectTrigger className="w-full sm:w-[200px]">
                  <SelectValue placeholder="Filter by category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  {CATEGORIES.map((cat) => (
                    <SelectItem key={cat.id} value={cat.id}>
                      <span className="flex items-center gap-2">
                        <span>{cat.icon}</span>
                        {cat.label}
                      </span>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* Reports Grid */}
        {filteredReports.length > 0 ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredReports.map((report) => (
              <ReportCard key={report.id} report={report} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="h-16 w-16 rounded-full bg-accent flex items-center justify-center mx-auto mb-4">
              <Filter className="h-8 w-8 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-semibold text-foreground mb-2">
              No reports found
            </h3>
            <p className="text-muted-foreground mb-6">
              {searchQuery || statusFilter !== 'all' || categoryFilter !== 'all'
                ? "Try adjusting your filters or search query."
                : "Be the first to report an issue in your community!"}
            </p>
            {!(searchQuery || statusFilter !== 'all' || categoryFilter !== 'all') && (
              <Link to="/submit">
                <Button variant="hero">
                  <Plus className="h-5 w-5" />
                  Submit First Report
                </Button>
              </Link>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
