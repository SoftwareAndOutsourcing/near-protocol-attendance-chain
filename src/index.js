import 'regenerator-runtime/runtime';

import { initContract, login, logout } from './utils';

import getConfig from './config';
const { networkId } = getConfig(process.env.NODE_ENV || 'development');

// global variable used throughout
let currentAttendances;

const submitButton = document.querySelector('form button')

document.querySelector('form').onsubmit = async (event) => {
  event.preventDefault();

  // get elements from the form using their id attribute
  const {
    fieldset,
    studentId,
    studentName,
    schoolName,
    lessonId,
    subject,
    loggedMinutes
  } = event.target.elements;

  // disable the form while the value gets updated on-chain
  fieldset.disabled = true;

  try {
    // make an update call to the smart contract
    await window.contract.addAttendance({
      studentId: +studentId.value,
      studentName: studentName.value,
      schoolName: schoolName.value,
      lessonId: +lessonId.value,
      subject: subject.value,
      loggedMinutes: +loggedMinutes.value
    });
  } catch (e) {
    alert(
      'Something went wrong! ' +
      'Maybe you need to sign out and back in? ' +
      'Check your browser console for more info.'
    )
    throw e
  } finally {
    // re-enable the form, whether the call succeeded or failed
    fieldset.disabled = false;
  }

  // reset form
  document.querySelector('form').reset();

  // update the attendances in the UI
  await fetchAttendances();

  // show notification
  document.querySelector('[data-behavior=notification]').style.display =
    'block';

  // remove notification again after css animation completes
  // this allows it to be shown again next time the form is submitted
  setTimeout(() => {
    document.querySelector('[data-behavior=notification]').style.display
      = 'none'
  }, 11000);
}

document.querySelector('form').oninput = (event) => {
  if (document.querySelector('form').checkValidity()) {
    submitButton.disabled = false;
  } else {
    submitButton.disabled = true;
  }
}

document.querySelector('#sign-in-button').onclick = login;
document.querySelector('#sign-out-button').onclick = logout;

// Display the signed-out-flow container
function signedOutFlow() {
  document.querySelector('#signed-out-flow').style.display = 'block';
}

// Displaying the signed in flow container and fill in account-specific data
function signedInFlow() {
  document.querySelector('#signed-in-flow').style.display = 'block';

  document.querySelectorAll('[data-behavior=account-id]').forEach(el => {
    el.innerText = window.accountId;
  })

  // populate links in the notification box
  const accountLink = document.querySelector('[data-behavior=notification] a:nth-of-type(1)');
  accountLink.href = accountLink.href + window.accountId;
  accountLink.innerText = '@' + window.accountId;
  const contractLink = document.querySelector('[data-behavior=notification] a:nth-of-type(2)');
  contractLink.href = contractLink.href + window.contract.contractId;
  contractLink.innerText = '@' + window.contract.contractId;

  // update with selected networkId
  accountLink.href = accountLink.href.replace('testnet', networkId);
  contractLink.href = contractLink.href.replace('testnet', networkId);

  fetchAttendances();
}

// update global currentAttendances variable; update DOM with it
async function fetchAttendances() {
  currentAttendances = await contract.getAttendances({});
  document.getElementById('currentAttendances').innerHTML
    = getAttendancesTable(currentAttendances);
}

const getAttendancesTable = (attendances) => {
  let table = /*html*/`<table>
    <thead>
      <tr>
        <th>Sender</th>
        <th>Student Id</th>
        <th>Student Name</th>
        <th>School Name</th>
        <th>Lesson Id</th>
        <th>Subject</th>
        <th>Logged Minutes</th>
      </tr>      
    </thead>
    <tbody>`
  if (!attendances.length) {
    table += /*html*/`<tr>
      <td colspan="7" style="text-align: center">No attendances yet</td>
    </tr>`;
  } else {
    for (const attendance of attendances) {
      table += /*html*/`<tr>
        <td style="max-width: 7em; word-wrap: break-word">
          ${attendance.sender}
        </td>
        <td>${attendance.studentId}</td>
        <td>${attendance.studentName}</td>
        <td>${attendance.schoolName}</td>
        <td>${attendance.lessonId}</td>
        <td>${attendance.subject}</td>
        <td>${attendance.loggedMinutes}</td>
      </tr>`;
    }
  }
  table += /*html*/`</tbody>
  </table>`;
  return table;
}

// `nearInitPromise` gets called on page load
window.nearInitPromise = initContract()
  .then(() => {
    if (window.walletConnection.isSignedIn()) {
      signedInFlow();
    } else {
      signedOutFlow();
    }
  })
  .catch(console.error);
