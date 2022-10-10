// DON'T EDIT THOSE LINES
const dataURLBase = 'https://docs.google.com/spreadsheets/d/';
const id = '1C1-em4w0yHmd2N7__9cCSFzxBEf_8r74hQJBsR6qWnE';
const dataURLEnd = '/gviz/tq?tqx=out:json&tq&gid=';
const gids = ['0', '1574569648', '1605451198'];
const employees = gids[0];
const hireDates = gids[1];
const salaries = gids[2];
// END OF DATA SETUP
// below is the employee address takens from the browser for comparison
// 'https://docs.google.com/spreadsheets/d/1C1-em4w0yHmd2N7__9cCSFzxBEf_8r74hQJBsR6qWnE'
// TODO your code here

// const regexExp = /[0-9a-zA-Z]+/

const fetchGoogleDatas = async () => {
  const responses = await Promise.all(
    gids.map(async (gid) => {
      let response = await fetch(dataURLBase + id + dataURLEnd + gid);
      let data = await response.text();
      // JSON.parse(data.match(/(?<=.*\().*(?=\))/))
      const FormData = JSON.parse(data.slice(47, -2));
      const rows = FormData.table.rows;
      if (rows.length === 11) {
        rows.shift();
      }
      return rows;
    })
  );
  return responses;
};
const renderTable = (employees) => {
  const tableEL = document.querySelector('#employees');
  tableEL.classList.add('table');
  tableEL.classList.add('table-dark');
  // tableEL.setAttribute('data-sortable', 'true ');
  const tBodyEL = document.createElement('tbody');
  //start creating the headers for each column
  // const tHeaderRow = tableEL.insertRow(); has created unnecessary tbody
  const tHeader = document.createElement('thead');
  const tHeaderRow = document.createElement('tr');
  const tHeadTitles = ['Last', 'First', 'Hire date', 'Salary'];
  for (
    let tHeadTitleIndex = 0;
    tHeadTitleIndex < tHeadTitles.length;
    tHeadTitleIndex++
  ) {
    let th = document.createElement('th');
    th.textContent = tHeadTitles[tHeadTitleIndex];

    //start trying to add bootstrap functions
    // th.setAttribute('scope', 'col');
    // th.setAttribute('data-field', 'name');
    // th.setAttribute('data-sortable', 'true');
    //end trying to add bootstrap functions. not sure how the sort works and the scope, col doesnt change anything....

    tHeaderRow.appendChild(th);
  }
  tHeader.appendChild(tHeaderRow);
  tableEL.appendChild(tHeader);
  //end creating the headers for each column
  //start creating the tds of the table body
  employees.map((employee) => {
    const rowEL = tBodyEL.insertRow();
    for (const key in employee) {
      const employeeTdEL = document.createElement('td');
      employeeTdEL.textContent = employee[key];
      rowEL.append(employeeTdEL);
    }
  });
  //end creating the td of the table body
  tableEL.appendChild(tBodyEL);
};

const createEmployees = async () => {
  const responses = await fetchGoogleDatas();
  let employees = [];
  for (let i = 0; i < 10; i++) {
    employees.push({
      lastN: responses[0][i].c[1].v,
      firstN: responses[0][i].c[0].v,
      hireDate: new Date(responses[1][i].c[0].f).toDateString().slice(4),
      salarie: Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
      }).format(responses[2][i].c[0].v),
    });
  }
  renderTable(employees);
};
createEmployees();
