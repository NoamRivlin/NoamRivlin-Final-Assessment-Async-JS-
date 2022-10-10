const dataURLBase = 'https://docs.google.com/spreadsheets/d/';
const id = '1C1-em4w0yHmd2N7__9cCSFzxBEf_8r74hQJBsR6qWnE';
const dataURLEnd = '/gviz/tq?tqx=out:json&tq&gid=';
const gids = ['0', '1574569648', '1605451198'];
const employees = gids[0];
const hireDates = gids[1];
const salaries = gids[2];

//fetch all data
// combine all of it together (3 different sheets)
// from the fetch construct a object of employee that has propreties of: Fname, Lname, salary, HireDate
//render a table
// render arow for each entry (employee)
// Last Name | First Name | Hire Date(date without commas) | Salary(with comma and $ symbol)

const fetchGoogleData = (gid) => {
  const responses = fetch(dataURLBase + id + dataURLEnd + gid);
  const dataTableRow = responses
    .then((res) => res.text())
    .then((formatData) => {
      console.log(formatData);
      //   console.log(JSON.parse(formatData.match(/\{\S+\}/g))); doesnt work due to hire dates withespace...
      let dataTableRow = JSON.parse(formatData.slice(47, -2)).table.rows;
      if (dataTableRow.length === 11) dataTableRow.shift();
      return dataTableRow;
    });
  return dataTableRow;
};

const getAllGoogleJson = () => {
  const responses = Promise.all(
    gids.map((gid) => {
      //for some reason async await is not needed in the map
      //if the getAllGoogleJson func is called with an await before
      return fetchGoogleData(gid);
    })
  );
  return responses;
};

const renderEmployeeTable = () => {
  let sheets = getAllGoogleJson();
  sheets.then((res) =>
    res.map((sheet, sheetIndex) => {
      sheet.map((row, rowIndex) => {
        row.c.reverse().map((cell, cellIndex) => {
          let rowEl;
          if (sheetIndex === 0 && cellIndex === 0) {
            rowEl = document.createElement('tr');
            tBodyEL.appendChild(rowEl);
          } else rowEl = tBodyEL.children[rowIndex];
          let employeeTd = document.createElement('td');
          if (sheetIndex === 1)
            employeeTd.textContent = new Date(cell.f).toDateString().slice(4);
          else if (sheetIndex === 2) {
            employeeTd.textContent = Intl.NumberFormat('en-US', {
              style: 'currency',
              currency: 'USD',
            }).format(cell.v);
          } else employeeTd.textContent = cell.v;
          rowEl.appendChild(employeeTd);
        });
      });
    })
  );
};
renderEmployeeTable();

let tableEL = document.querySelector('#employees');
tableEL.classList.add('table');
let tBodyEL = document.createElement('tbody');
let tHeadEL = document.createElement('thead');
tableEL.append(tHeadEL, tBodyEL);

const creatingTable = () => {
  const tHeadTitles = ['Last', 'First', 'Hire date', 'Salary'];
  let tblHeadTr = document.createElement('tr');
  tHeadEL.appendChild(tblHeadTr);
  for (let tHeadTitle = 0; tHeadTitle < tHeadTitles.length; tHeadTitle++) {
    let th = document.createElement('th');
    th.textContent = tHeadTitles[tHeadTitle];
    tblHeadTr.appendChild(th);
  }
  tableEL.appendChild(tBodyEL);
};
creatingTable();
