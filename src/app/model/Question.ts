export interface Question {
  _id: string,
  question: string,
  type: 'multiple choice' | 'yes or no',
  options : any[],
  points: number,
  goodOption: string | null,
  picture: string | null,
}
