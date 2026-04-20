import { createContext, useContext, ReactNode } from 'react';
import { Candidate, Client, Task, Activity, CandidateStatus } from '../types';
import useLocalStorage from '../hooks/useLocalStorage';
import { seedCandidates, seedClients, seedTasks, seedActivities } from '../data/seedData';
import type { AuthUser } from '../types/auth';
import { canManageCandidates, canManageClients, canManageTasks } from '../config/rbac';

interface AppContextType {
  isLoggedIn: boolean;
  token: string | null;
  user: AuthUser | null;
  canEditCandidates: boolean;
  canEditClients: boolean;
  canEditTasks: boolean;
  login: (authToken: string, authUser: AuthUser) => void;
  logout: () => void;
  candidates: Candidate[];
  addCandidate: (candidate: Omit<Candidate, 'id' | 'createdAt'>) => void;
  updateCandidateStatus: (id: string, status: CandidateStatus) => void;
  deleteCandidate: (id: string) => void;
  clients: Client[];
  addClient: (client: Omit<Client, 'id' | 'createdAt'>) => void;
  deleteClient: (id: string) => void;
  tasks: Task[];
  addTask: (task: Omit<Task, 'id' | 'createdAt'>) => void;
  toggleTask: (id: string) => void;
  deleteTask: (id: string) => void;
  activities: Activity[];
  addActivity: (activity: Omit<Activity, 'id'>) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useLocalStorage<string | null>('tf_token', null);
  const [user, setUser] = useLocalStorage<AuthUser | null>('tf_user', null);
  const [candidates, setCandidates] = useLocalStorage<Candidate[]>('tf_candidates', seedCandidates);
  const [clients, setClients] = useLocalStorage<Client[]>('tf_clients', seedClients);
  const [tasks, setTasks] = useLocalStorage<Task[]>('tf_tasks', seedTasks);
  const [activities, setActivities] = useLocalStorage<Activity[]>('tf_activities', seedActivities);
  const isLoggedIn = Boolean(token);
  const role = user?.role;
  const canEditCandidates = canManageCandidates(role);
  const canEditClients = canManageClients(role);
  const canEditTasks = canManageTasks(role);

  const login = (authToken: string, authUser: AuthUser) => {
    setToken(authToken);
    setUser(authUser);
  };

  const logout = () => {
    setToken(null);
    setUser(null);
  };

  const addCandidate = (candidate: Omit<Candidate, 'id' | 'createdAt'>) => {
    if (!canEditCandidates) return;
    const newCandidate: Candidate = {
      ...candidate,
      id: `c${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
    setCandidates(prev => [newCandidate, ...prev]);
    addActivity({ action: 'New candidate added', subject: candidate.name, timestamp: new Date().toISOString(), type: 'candidate' });
  };

  const updateCandidateStatus = (id: string, status: CandidateStatus) => {
    if (!canEditCandidates) return;
    const candidate = candidates.find(c => c.id === id);
    setCandidates(prev => prev.map(c => c.id === id ? { ...c, status } : c));
    if (candidate) {
      addActivity({ action: `Candidate moved to ${status}`, subject: candidate.name, timestamp: new Date().toISOString(), type: 'pipeline' });
    }
  };

  const deleteCandidate = (id: string) => {
    if (!canEditCandidates) return;
    setCandidates(prev => prev.filter(c => c.id !== id));
  };

  const addClient = (client: Omit<Client, 'id' | 'createdAt'>) => {
    if (!canEditClients) return;
    const newClient: Client = {
      ...client,
      id: `cl${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
    setClients(prev => [newClient, ...prev]);
    addActivity({ action: 'New client onboarded', subject: client.company, timestamp: new Date().toISOString(), type: 'client' });
  };

  const deleteClient = (id: string) => {
    if (!canEditClients) return;
    setClients(prev => prev.filter(c => c.id !== id));
  };

  const addTask = (task: Omit<Task, 'id' | 'createdAt'>) => {
    if (!canEditTasks) return;
    const newTask: Task = {
      ...task,
      id: `t${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
    setTasks(prev => [newTask, ...prev]);
    addActivity({ action: 'New task created', subject: task.title, timestamp: new Date().toISOString(), type: 'task' });
  };

  const toggleTask = (id: string) => {
    if (!canEditTasks) return;
    setTasks(prev => prev.map(t => t.id === id ? { ...t, completed: !t.completed } : t));
  };

  const deleteTask = (id: string) => {
    if (!canEditTasks) return;
    setTasks(prev => prev.filter(t => t.id !== id));
  };

  const addActivity = (activity: Omit<Activity, 'id'>) => {
    const newActivity: Activity = { ...activity, id: `a${Date.now()}` };
    setActivities(prev => [newActivity, ...prev].slice(0, 20));
  };

  return (
    <AppContext.Provider value={{
      isLoggedIn, token, user, canEditCandidates, canEditClients, canEditTasks, login, logout,
      candidates, addCandidate, updateCandidateStatus, deleteCandidate,
      clients, addClient, deleteClient,
      tasks, addTask, toggleTask, deleteTask,
      activities, addActivity,
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within AppProvider');
  return context;
}
