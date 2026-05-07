export interface UpdateJobSeekerProfileDto {
  headline?: string;
  bio?: string;
  resumeUrl?: string;
  preferredSalaryMin?: number;
  preferredSalaryMax?: number;
  workExperience?: {
    companyName: string;
    title: string;
    startDate: string;
    endDate?: string;
    description?: string;
  }[];
  education?: {
    school: string;
    degree: string;
    field: string;
    startDate: string;
    endDate?: string;
  }[];
  skills?: {
    name: string;
    level?: number;
    yearsExp?: number;
  }[];
}
