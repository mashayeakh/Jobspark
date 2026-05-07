export interface UpdateRecruiterProfileDto {
  position?: string;
  // Optional company updates could go here or in a separate module
  company?: {
    name?: string;
    website?: string;
    description?: string;
    industry?: string;
    location?: string;
  };
}
