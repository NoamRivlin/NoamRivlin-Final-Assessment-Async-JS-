// DON'T EDIT THOSE LINES
const dataURLBase = 'https://docs.google.com/spreadsheets/d/';
const id = '1C1-em4w0yHmd2N7__9cCSFzxBEf_8r74hQJBsR6qWnE';
const dataURLEnd = '/gviz/tq?tqx=out:json&tq&gid=';
const gids = ['0', '1574569648', '1605451198'];
const employees = gids[0];
const hireDates = gids[1];
const salaries = gids[2];
// END OF DATA SETUP
// below is the employee address taken from the browser for comparison
// 'https://docs.google.com/spreadsheets/d/1C1-em4w0yHmd2N7__9cCSFzxBEf_8r74hQJBsR6qWnE0'
// TODO your code here
const getEmployeeDate = async () => {
  console.log(dataURLBase + id + dataURLEnd + employees);
  let response = await fetch(dataURLBase + id + dataURLEnd + hireDates);
  let data = await response.text();

  console.log(
    JSON.parse(
      data
        .toString()
        .replace(
          `/*O_o*/
google.visualization.Query.setResponse(`,
          ''
        )
        .replace(';', '')
        .slice(0, -1)
    )
  );
};
getEmployeeDate();
