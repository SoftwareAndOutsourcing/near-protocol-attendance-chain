beforeAll(async function () {
  // NOTE: nearlib and nearConfig are made available by near-cli/test_environment
  const near = await nearlib.connect(nearConfig)
  window.accountId = nearConfig.contractName
  window.contract = await near.loadContract(nearConfig.contractName, {
    viewMethods: ['getAttendances'],
    changeMethods: ['addAttendance'],
    sender: window.accountId
  })
})


test('add attendance', async () => {
  await window.contract.addAttendance({
    args: {
      studentId: 1,
      studentName: 'John',
      schoolName: 'NEAR School',
      lessonId: 2,
      subject: 'Learning NEAR',
      loggedMinutes: 90
    }
  });

  const attendances = await window.contract.getAttendances();
  expect(Array.isArray(attendances)).toBe(true);
  expect(attendances.length).toBe(1);
})
