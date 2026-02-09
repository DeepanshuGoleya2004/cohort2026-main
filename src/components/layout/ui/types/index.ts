export interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  role: 'student' | 'teacher' | 'admin';
  createdAt: string;
  updatedAt: string;
}

export interface Course {
  id: string;
  title: string;
  description: string;
  instructor: string;
  instructorId: string;
  progress: number;
  totalClasses: number;
  completedClasses: number;
  color: string;
  icon: string;
  isLab?: boolean;
  credits: number;
  category: string;
  enrollmentDate: string;
}

export interface Schedule {
  id: string;
  courseId: string;
  course: Course;
  dayOfWeek: number; // 0 = Sunday, 1 = Monday, etc.
  startTime: string;
  endTime: string;
  room: string;
  status: 'upcoming' | 'live' | 'completed';
  isLive?: boolean;
  duration: number;
}

export interface Assignment {
  id: string;
  title: string;
  description: string;
  courseId: string;
  course: Course;
  dueDate: string;
  submissionDate?: string;
  status: 'pending' | 'submitted' | 'overdue';
  grade?: number;
  maxGrade: number;
}

export interface Resource {
  id: string;
  title: string;
  description: string;
  type: 'pdf' | 'video' | 'link' | 'document';
  url: string;
  courseId: string;
  course: Course;
  uploadDate: string;
  size?: string;
}

export interface Conflict {
  id: string;
  type: 'instructor' | 'room' | 'student';
  description: string;
  severity: 'low' | 'medium' | 'high';
  affectedSchedules: string[];
  suggestions: string[];
  resolved: boolean;
  createdAt: string;
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'warning' | 'success' | 'error';
  read: boolean;
  createdAt: string;
  actionUrl?: string;
}