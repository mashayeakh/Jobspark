export interface Job {
  id: string | number;
  title: string;
  company: string;
  logo: string | null;
  workStyle: string;
  location: string;
  salary: string;
  equity?: string;
  posted: string;
  deadline?: string;
  category: string;

  type: string;
  experience: string;
  description: string;
  requirements: string[];
  responsibilities: string[];
  benefits: string[];
  vacancy?: number;
  skills: string[];
  aboutCompany: string;
}
