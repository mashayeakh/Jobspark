export interface IReview {
  authorId: string;
  rating: number;
  content: string;
  company?: string;
  type?: string;
}
