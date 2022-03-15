import { PersistentVector } from "near-sdk-as";

@nearBindgen
export class Attendance {
  sender: string;
  studentId: i32;
  studentName: string;
  schoolName: string;
  lessonId: i32;
  subject: string;
  loggedMinutes: i16;
}

export const attendances: PersistentVector<Attendance>
  = new PersistentVector<Attendance>('a');
