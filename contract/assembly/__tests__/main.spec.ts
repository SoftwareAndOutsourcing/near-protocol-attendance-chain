import { addAttendance, getAttendances } from '..'

describe('Attendance', () => {
  it('should add an attendance and get it from the blockchain', () => {
    addAttendance(1, 'John', 'NEAR School', 2, 'Learning NEAR', 90);
    const attendances = getAttendances();
    expect(Array.isArray(attendances)).toBe(true);
    expect(attendances.length).toBe(1);
  })
})
