import { Context } from 'near-sdk-as'

import { Attendance, attendances } from './models';

export function addAttendance(
  studentId: i32,
  studentName: string,
  schoolName: string,
  lessonId: i32,
  subject: string,
  loggedMinutes: i16
): void {
  attendances.push({
    sender: Context.sender,
    studentId: studentId,
    studentName: studentName,
    schoolName: schoolName,
    lessonId: lessonId,
    subject: subject,
    loggedMinutes: loggedMinutes
  });
}

export function getAttendances(): Attendance[] {
  const attendanceArray: Attendance[] = [];
  for (let i: i32 = 0; i < attendances.length; i++) {
    attendanceArray.push(attendances[i]);
  }
  return attendanceArray;
}
