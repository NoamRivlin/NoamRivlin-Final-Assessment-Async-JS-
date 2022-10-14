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

  const employeesTable = $('#employees').bootstrapTable({
    columns: [
      {
        title: 'last',
        field: 'lastN',
        sortable: true,
        //bootstrap sorts the strings on it's own just fine
        //even with the 2 Romans
        // sorter(firstNameA, firstNameB, rowA, rowB) {
        // console.log();
        // if (firstNameA === firstNameB) {
        //   console.log(firstNameA);
        //   firstNameA = rowA.lastN;
        //   firstNameB = rowB.lastN;
        //   console.log(firstNameA);
        // }
        // if (a < b) -1;
        // else if (a > b) 1;
        // else 0;
        // },
      },
      {
        title: 'first',
        field: 'firstN',
        sortable: true,
      },
      {
        title: 'Hire Date',
        field: 'hireDate',
        sortable: true,
        sorter(a, b) {
          if (Date.parse(a) > Date.parse(b)) return 1;
          if (Date.parse(a) < Date.parse(b)) return -1;
        },
        formatter: (value) => new Date(value).toDateString().slice(4),
      },
      {
        title: 'salary',
        field: 'salary',
        sortable: true,
        // sorter(a, b) {
        //changing the data to numbers makes the sorter unnecessary
        // if (
        //   parseInt(a.slice(1, -3).split(',').join('')) >
        //   parseInt(b.slice(1, -3).split(',').join(''))
        // )
        //   return 1;
        // if (
        //   parseInt(a.slice(1, -3).split(',').join('')) <
        //   parseInt(b.slice(1, -3).split(',').join(''))
        // )
        //   return -1;
        // },
        formatter: (value) =>
          Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
          }).format(value),
        // formatter(value) {
        //   return Intl.NumberFormat('en-US', {
        //     style: 'currency',
        //     currency: 'USD',
        //   }).format(value);
        // },
      },
    ],
    data: employees,
  });
};

const createEmployees = async () => {
  const responses = await fetchGoogleDatas();
  console.log(responses);
  let employees = [];
  //the for loop 10 magic number seemed bad
  //another way to loop 10 times
  responses[0].map((response, i) => {
    employees.push({
      lastN: responses[0][i].c[1].v,
      firstN: responses[0][i].c[0].v,
      hireDate: responses[1][i].c[0].f,
      salary: responses[2][i].c[0].v,
    });
  });
  // for (let i = 0; i < 10; i++) {
  //   employees.push({
  //     lastN: responses[0][i].c[1].v,
  //     firstN: responses[0][i].c[0].v,
  //     hireDate: responses[1][i].c[0].f,
  //     salary: responses[2][i].c[0].v,
  //   });
  // }
  renderTable(employees);
};
createEmployees();
