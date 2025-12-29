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

export function ReportsProvider({ children }: { children: ReactNode }) {
  const [reports, setReports] = useState<Report[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load reports from localStorage on mount - start with empty array
  // Clear any old demo/sample data on fresh load
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        // Only load if valid array with real user-submitted reports
        if (Array.isArray(parsed) && parsed.length > 0) {
          // Convert date strings back to Date objects
          const reportsWithDates = parsed.map((r: any) => ({
            ...r,
            createdAt: new Date(r.createdAt),
            updatedAt: new Date(r.updatedAt),
          }));
          setReports(reportsWithDates);
        } else {
          setReports([]);
        }
      } catch {
        // If parsing fails, start with empty array
        localStorage.removeItem(STORAGE_KEY);
        setReports([]);
      }
    }
    setIsLoaded(true);
  }, []);

  // Save to localStorage whenever reports change (only after initial load)
  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(reports));
    }
  }, [reports, isLoaded]);

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
