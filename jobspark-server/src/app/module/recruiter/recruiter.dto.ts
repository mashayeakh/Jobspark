export interface UpdateRecruiterProfileDto {
  name?: string;
  position?: string;
  bio?: string;
  phoneNumber?: string;
  image?: string;
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
    foundedYear?: string;
    headquarters?: string;
    socialLinks?: any;
  };
}
