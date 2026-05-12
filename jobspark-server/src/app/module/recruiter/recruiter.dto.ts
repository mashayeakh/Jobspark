export interface UpdateRecruiterProfileDto {
  position?: string;
  // Optional company updates could go here or in a separate module
  company?: {
    name?: string;
    tagline?: string;
    website?: string;
    email?: string;
    phone?: string;
    description?: string;
    mission?: string;
    values?: string;
    benefits?: string;
    industry?: string;
    location?: string;
    size?: string;
    socialLinks?: any;
  };

}
