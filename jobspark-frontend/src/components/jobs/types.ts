export interface Job {
  id: number;
  title: string;
  company: string;
  logo: string;
  workStyle: string;
  location: string;
  salary: string;
  equity?: string;
  posted: string;
  category: string;
  type: 'full-time' | 'part-time' | 'contract' | 'remote';
  experience: string;
  description: string;
  requirements: string[];
  responsibilities: string[];
  benefits: string[];
  skills: string[];
  aboutCompany: string;
}
