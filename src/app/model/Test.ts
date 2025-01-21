import { Question } from "./Question";

export interface Test {
  _id : string;
  subject: string,
  status: "creation" | "finished" | "filling" | "filled",
  startableFrom: Date,
  startableTill: Date,
  duration: number,
  pointDeduction: number | null,
  videocall : boolean,
  questions: string[],
  students: string[],
  teacher: string,
  limit: number,
}
