import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Report, ReportStatus } from '@/types/report';

interface ReportsContextType {
  reports: Report[];
  addReport: (report: Omit<Report, 'id' | 'createdAt' | 'updatedAt' | 'status'>) => void;
  updateReportStatus: (id: string, status: ReportStatus) => void;
  getReportById: (id: string) => Report | undefined;
}

const ReportsContext = createContext<ReportsContextType | undefined>(undefined);

const STORAGE_KEY = 'localfix_reports';

// Demo reports for initial state
const demoReports: Report[] = [
  {
    id: '1',
    title: 'Large pothole on Main Street',
    description: 'There is a dangerous pothole near the intersection that has been growing for weeks. Several cars have already been damaged.',
    category: 'pothole',
    location: '123 Main Street, Downtown',
    status: 'in_progress',
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
    updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
  },
  {
    id: '2',
    title: 'Streetlight out on Oak Avenue',
    description: 'The streetlight on the corner has been out for over a week making it dangerous to walk at night.',
    category: 'streetlight',
    location: '456 Oak Avenue',
    status: 'resolved',
    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
    updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
  },
  {
    id: '3',
    title: 'Overflowing garbage bins at park',
    description: 'The garbage bins at Central Park have not been emptied in days and are overflowing onto the ground.',
    category: 'garbage',
    location: 'Central Park, East Entrance',
    status: 'pending',
    createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
    updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
  },
];

export function ReportsProvider({ children }: { children: ReactNode }) {
  const [reports, setReports] = useState<Report[]>([]);

  // Load reports from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      // Convert date strings back to Date objects
      const reportsWithDates = parsed.map((r: any) => ({
        ...r,
        createdAt: new Date(r.createdAt),
        updatedAt: new Date(r.updatedAt),
      }));
      setReports(reportsWithDates);
    } else {
      // Initialize with demo reports
      setReports(demoReports);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(demoReports));
    }
  }, []);

  // Save to localStorage whenever reports change
  useEffect(() => {
    if (reports.length > 0) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(reports));
    }
  }, [reports]);

  const addReport = (reportData: Omit<Report, 'id' | 'createdAt' | 'updatedAt' | 'status'>) => {
    const newReport: Report = {
      ...reportData,
      id: Date.now().toString(),
      status: 'pending',
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    setReports(prev => [newReport, ...prev]);
  };

  const updateReportStatus = (id: string, status: ReportStatus) => {
    setReports(prev =>
      prev.map(report =>
        report.id === id
          ? { ...report, status, updatedAt: new Date() }
          : report
      )
    );
  };

  const getReportById = (id: string) => {
    return reports.find(r => r.id === id);
  };

  return (
    <ReportsContext.Provider value={{ reports, addReport, updateReportStatus, getReportById }}>
      {children}
    </ReportsContext.Provider>
  );
}

export function useReports() {
  const context = useContext(ReportsContext);
  if (context === undefined) {
    throw new Error('useReports must be used within a ReportsProvider');
  }
  return context;
}
