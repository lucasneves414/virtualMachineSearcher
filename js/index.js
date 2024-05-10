let testBase = [];
init();

function init() {
  getTestBase();
  tablesLoadEmpty();
}

function getTestBase() {
  //Lets pretend BackEnd is providing this
  //var testBaseOriginal = returnValues();
  testBase = testBaseOriginal.map(m => ({
    meterName: m.meterName,
    memoryInMB: m.memoryInMB,
    numberOfCores: m.numberOfCores,
    unitPricePerUnit: m.unitPricePerUnit,
    os: m.os
  }))

}

function tablesLoadEmpty() {
  const tbody = document.getElementById("tBody");
  tbody.innerHTML = "";
  const row =
    `<tr>
      <td colspan="5">${`No Virtual Machines Found`}</td>
    </tr>`
  tbody.innerHTML += row;

  const tbody2 = document.getElementById("tBody2");
  tbody2.innerHTML = "";
  const row2 =
    `<tr>
      <td colspan="5">${`No Virtual Machines Found`}</td>
    </tr>`
  tbody2.innerHTML += row2;

  const tbody3 = document.getElementById("tBody3");
  tbody3.innerHTML = "";
  const row3 =
    `<tr>
      <td colspan="5">${`No Price Found`}</td>
    </tr>`
  tbody3.innerHTML += row3;
}

function tablesLoad(costEffectiveArray, mostExpensiveArray, mediumPrice) {
  const tbody = document.getElementById("tBody");
  tbody.innerHTML = "";
  if (!costEffectiveArray && !mostExpensiveArray && !mediumPrice) {
    tablesLoadEmpty();
  }
  if (costEffectiveArray.length > 0) {
    costEffectiveArray.map((m) => {
      const row =
        `<tr>
      <td>${m.meterName}</td>
      <td>${m.memoryInMB / 1024}</td>
      <td>${m.numberOfCores}</td>
      <td>${m.os}</td>
      <td>${m.unitPricePerUnit}</td>
    </tr>`

      tbody.innerHTML += row;

    })
  }

  const tbody2 = document.getElementById("tBody2");
  tbody2.innerHTML = "";
  if (mostExpensiveArray.length > 0) {
    mostExpensiveArray.map((m) => {
      const row =
        `<tr>
    <td>${m.meterName}</td>
    <td>${m.memoryInMB / 1024}</td>
    <td>${m.numberOfCores}</td>
    <td>${m.os}</td>
    <td>${m.unitPricePerUnit}</td>
  </tr>`

      tbody2.innerHTML += row;

    })
  }

  const tbody3 = document.getElementById("tBody3");
  tbody3.innerHTML = "";
  if (mediumPrice) {
    const row =
      `<tr>
    <td>${mediumPrice}</td>
  </tr>`

    tbody3.innerHTML += row;


  }
}


function displayResult() {
  //Prevent screen update
  const form = document.querySelector('form');
  form.addEventListener('submit', function (event) {
    event.preventDefault();
  });

  const ram = document.getElementById("ram").value;
  const cores = document.getElementById("cores").value;
  const os = document.getElementById("os").value &&
    document.getElementById("os").value === "Select" ? '' :
    document.getElementById("os").value;

  //Filter by the inputs
  const testBaseResult = testBase.filter(f => {
    const convertedGbToMB = parseInt(ram) * 1024;

    return (!convertedGbToMB || f.memoryInMB === convertedGbToMB) &&
      (!cores || f.numberOfCores === parseInt(cores)) &&
      (!os || f.os && f.os.toLowerCase() === os.toLowerCase());
  });

  if (testBaseResult.length <= 0) {
    tablesLoadEmpty();
    return;
  }
  const costEffectiveArray = testBaseResult.sort((a, b) => {
    // Comparing based on unitPricePerUnit
    const priceComparison = parseFloat(a.unitPricePerUnit.replace(',', '.')) - parseFloat(b.unitPricePerUnit.replace(',', '.'));
    if (priceComparison !== 0) {
      return priceComparison;
    }

    // If unitPricePerUnit is the same, i am comparing based on memoryInMB
    const memoryComparison = b.memoryInMB - a.memoryInMB;
    if (memoryComparison !== 0) {
      // If memoryInMB is different, i am sorting by both memoryInMB and numberOfCores
      const coreComparison = b.numberOfCores - a.numberOfCores;
      return coreComparison !== 0 ? coreComparison : memoryComparison;
    }

    // If memoryInMB is the same, i am comparing based on numberOfCores
    return b.numberOfCores - a.numberOfCores;
  }).slice(0, 3);

  // Most expensive array
  const mostExpensiveArray = testBaseResult
    .sort((a, b) => parseFloat(b.unitPricePerUnit.replace(',', '.')) - parseFloat(a.unitPricePerUnit.replace(',', '.')))
    .slice(0, 3);

  // Medium-priced array
  let mediumPrice = calculateAverageUnitPrice(testBaseResult)

  function calculateAverageUnitPrice(testBaseResult) {
    // Summing up all the unitPricePerUnit values
    const totalPrice = testBaseResult.reduce((total, item) => {
      // So, removing commas and converting to float for calculation
      const price = parseFloat(item.unitPricePerUnit.replace(',', '.'));
      return total + price;
    }, 0);

    // Calculating the average unit price
    const averagePrice = totalPrice / testBaseResult.length;

    return averagePrice.toFixed(5).toString().replace('.', ',')
  }



  tablesLoad(costEffectiveArray, mostExpensiveArray, mediumPrice);
}