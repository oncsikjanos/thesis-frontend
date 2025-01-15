import { Question } from "./Question";

export interface Test {
  subject: string,
  startableFrom: Date,
  startableTill: Date,
  duration: number,
  poinDeduction: number | null,
  videocall : boolean,
  questions: Question[],
  students: string[],
  teachers: string[]
}
