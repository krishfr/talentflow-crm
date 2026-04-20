export type CandidateStatus = 'Applied' | 'Interview' | 'Offer' | 'Hired' | 'Rejected';
export type TaskPriority = 'Low' | 'Medium' | 'High';
export type ActivityType = 'candidate' | 'client' | 'pipeline' | 'task';

export interface Candidate {
  id: string;
  name: string;
  role: string;
  experience: string;
  status: CandidateStatus;
  email: string;
  phone: string;
  createdAt: string;
}

export interface Client {
  id: string;
  company: string;
  contactPerson: string;
  email: string;
  phone: string;
  openPositions: number;
  industry: string;
  createdAt: string;
}

export interface Task {
  id: string;
  title: string;
  dueDate: string;
  priority: TaskPriority;
  completed: boolean;
  createdAt: string;
}

export interface Activity {
  id: string;
  action: string;
  subject: string;
  timestamp: string;
  type: ActivityType;
}
