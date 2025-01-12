export interface Question {
  question: string,
  type: 'multiple choice' | 'yes or no',
  options : any[],
  points: number,
  goodOption: string | null,
  picture: File | null,
}
