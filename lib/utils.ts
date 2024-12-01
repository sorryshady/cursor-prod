import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDate(date: string) {
  return new Date(date).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });
}

export function formatDepartment(department: string) {
  return department.replace(/_/g, " ").toLowerCase().replace(/\b\w/g, l => l.toUpperCase());
}

export function formatDesignation(designation: string) {
  return designation.replace(/_/g, " ").toLowerCase().replace(/\b\w/g, l => l.toUpperCase());
}
