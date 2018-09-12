import fs from 'fs';
import XLSX from 'xlsx';
// import excel from 'node-excel-export';

export const saveToExcel = (path, data, scale) => {
  const conditions = [];
  const positions = [];
  data.forEach(condition => {
    conditions.push(condition.name);
    condition.children.forEach(position => {
      positions.push(position.name);
      conditions.push('');
    });
    conditions.pop();
  });
  console.log(conditions);
  console.log(positions);

  let maxNumberCircles = 0;
  data.forEach(condition =>
    condition.children.forEach(position => {
      if (position.diameters.length >= maxNumberCircles) {
        maxNumberCircles = position.diameters.length;
      }
    })
  );

  const dataset = [];
  let entry = {};
  for (let i = 0; i < maxNumberCircles; i += 1) {
    entry = {};
    for (let j = 0; j < data.length; j += 1) {
      for (let k = 0; k < data[j].children.length; k += 1) {
        const key = `condition${data[j].children[k].condition}${
          data[j].children[k].position
        }`;
        let value = data[j].children[k].diameters[i];
        if (i >= data[j].children[k].diameters.length) {
          value = '';
        } else {
          value = data[j].children[k].diameters[i] / scale;
        }
        entry[key] = value;
      }
    }
    dataset.push(entry);
  }

  const asdf = [conditions, positions];
  dataset.forEach(entry => {
    const zxcv = [];
    Object.keys(entry).forEach(key => zxcv.push(entry[key]));
    asdf.push(zxcv);
  });

  // /// COUNT
  const headingCount = [];
  data.forEach(condition => {
    let numberOfVesicles = 0;
    condition.children.forEach(
      position => (numberOfVesicles += position.diameters.length)
    );
    headingCount.push([condition.name, numberOfVesicles]);
  });
  console.log(headingCount);

  const worksheet = XLSX.utils.aoa_to_sheet(asdf);
  const count = XLSX.utils.aoa_to_sheet(headingCount);
  const new_workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(new_workbook, worksheet, 'Diameters');
  XLSX.utils.book_append_sheet(new_workbook, count, 'Count');

  XLSX.writeFile(new_workbook, path);
};

export const saveToExcel2 = (path, data, scale) => {
  const styles = {
    headerDark: {
      fill: {
        fgColor: {
          rgb: 'FF000000'
        }
      },
      font: {
        color: {
          rgb: 'FFFFFFFF'
        },
        sz: 14,
        bold: true,
        underline: true
      }
    },
    cellPink: {
      fill: {
        fgColor: {
          rgb: 'FFFFCCFF'
        }
      }
    },
    cellGreen: {
      fill: {
        fgColor: {
          rgb: 'FF00FF00'
        }
      }
    }
  };

  // Array of objects representing heading rows (very top)
  const heading = [
    [
      { value: 'a1', style: styles.headerDark },
      { value: 'b1', style: styles.headerDark },
      { value: 'c1', style: styles.headerDark }
    ],
    ['a4', 'b2', 'c2'] // <-- It can be only values
  ];

  // Here you specify the export structure
  /*   const specification = {
    customer_name: {
      // <- the key should match the actual data key
      displayName: 'Customer', // <- Here you specify the column header
      headerStyle: styles.headerDark, // <- Header style
      cellStyle(value, row) {
        // <- style renderer function
        // if the status is 1 then color in green else color in red
        // Notice how we use another cell value to style the current one
        return row.status_id == 1
          ? styles.cellGreen
          : { fill: { fgColor: { rgb: 'FFFF0000' } } }; // <- Inline cell style is possible
      },
      width: 120 // <- width in pixels
    },
    status_id: {
      displayName: 'Status',
      headerStyle: styles.headerDark,
      cellFormat(value, row) {
        // <- Renderer function, you can access also any row.property
        return value == 1 ? 'Active' : 'Inactive';
      },
      width: '10' // <- width in chars (when the number is passed as string)
    },
    note: {
      displayName: 'Description',
      headerStyle: styles.headerDark,
      cellStyle: styles.cellPink, // <- Cell style
      width: 220 // <- width in pixels
    }
  }; */

  const specification = {};
  data.forEach(condition =>
    condition.children.forEach(
      position =>
        (specification[`condition${position.condition}${position.position}`] = {
          displayName: `condition ${position.condition}`,
          headerStyle: styles.headerDark,
          cellStyle: styles.cellPink, // <- Cell style
          width: 220 // <- width in pixels
        })
    )
  );

  // The data set should have the following shape (Array of Objects)
  // The order of the keys is irrelevant, it is also irrelevant if the
  // dataset contains more fields as the report is build based on the
  // specification provided above. But you should have all the fields
  // that are listed in the report specification

  let maxNumberCircles = 0;
  data.forEach(condition =>
    condition.children.forEach(position => {
      if (position.diameters.length >= maxNumberCircles) {
        maxNumberCircles = position.diameters.length;
      }
    })
  );

  const dataset = [];
  let entry = {};
  for (let i = 0; i < maxNumberCircles; i += 1) {
    entry = {};
    for (let j = 0; j < data.length; j += 1) {
      for (let k = 0; k < data[j].children.length; k += 1) {
        const key = `condition${data[j].children[k].condition}${
          data[j].children[k].position
        }`;
        let value = data[j].children[k].diameters[i];
        if (i >= data[j].children[k].diameters.length) {
          value = '';
        } else {
          value = data[j].children[k].diameters[i] / scale;
        }
        entry[key] = value;
      }
    }
    dataset.push(entry);
  }

  // Define an array of merges. 1-1 = A:1
  // The merges are independent of the data.
  // A merge will overwrite all data _not_ in the top-left cell.
  const merges = [];
  data.forEach((condition, idx) => {
    merges.push({
      start: { row: 3, column: idx * condition.children.length + 1 },
      end: { row: 3, column: (idx + 1) * condition.children.length }
    });
  });

  // /// COUNT
  const headingCount = [];
  data.forEach(condition => {
    let numberOfVesicles = 0;
    condition.children.forEach(
      position => (numberOfVesicles += position.diameters.length)
    );
    headingCount.push([condition.name, numberOfVesicles]);
  });
  console.log(headingCount);

  // Create the excel report.
  // This function will return Buffer
  const report = excel.buildExport([
    // <- Notice that this is an array. Pass multiple sheets to create multi sheet report
    {
      name: 'Diameters', // <- Specify sheet name (optional)
      heading, // <- Raw heading array (optional)
      merges, // <- Merge cell ranges
      specification, // <- Report specification
      data: dataset // <-- Report data
    },
    {
      name: 'Count', // <- Specify sheet name (optional)
      heading: headingCount, // <- Raw heading array (optional)
      specification: [], // <- Report specification
      data: [] // <--
    }
  ]);

  // You can then return this straight
  /*     res.attachment('report.xlsx'); // This is sails.js specific (in general you need to set headers)
    return res.send(report); */
  try {
    fs.writeFileSync(path, report, 'utf-8');
  } catch (e) {
    alert('Failed to save the file !');
  }
};

export default saveToExcel;
