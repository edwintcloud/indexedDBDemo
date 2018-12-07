let db;

const request = indexedDB.open("demo");
request.onerror = () => {
  alert("Unable to load database");
};
request.onsuccess = event => {
  db = event.target.result;
  read();
};
request.onupgradeneeded = event => {
  db = event.target.result;

  // create our object store
  db.createObjectStore("todos", { keyPath: "name" });
};

function create() {
  const test = {
    name: document.getElementById("name").value,
    data: document.getElementById("data").value
  };
  const transaction = db
    .transaction(["todos"], "readwrite")
    .objectStore("todos");
  const data = transaction.put(test);
  data.onsuccess = function(event) {
    read();
  };
}

function read() {
  document.querySelector(".table").innerHTML = `
  <table id="table">
            <tr>
              <th>Name</th>
              <th>Description</th>
              <th></th>
            </tr>
          </table>
  `;
  const transaction = db
    .transaction(["todos"], "readwrite")
    .objectStore("todos");
  const data = transaction.getAll();
  data.onsuccess = function(event) {
    var table = document.getElementById("table");
    event.target.result.forEach(i => {
      // Create an empty <tr> element and add it to the 1st position of the table:
      var row = table.insertRow(1);

      // Insert new cells (<td> elements) at the 1st and 2nd position of the "new" <tr> element:
      var cell1 = row.insertCell(0);
      var cell2 = row.insertCell(1);
      var cell3 = row.insertCell(2);

      // Add some text to the new cells:
      cell1.innerHTML = i.name;
      cell2.innerHTML = i.data;
      cell3.innerHTML = `<button onclick="update('${i.name}', '${
        i.data
      }')">Update</button><button onclick="remove('${
        i.name
      }')">Delete</button>`;
    });
  };
}

function update(name, data) {
  document.getElementById("name").value = name;
  document.getElementById("data").value = data;
}

function remove(name) {
  const transaction = db
    .transaction(["todos"], "readwrite")
    .objectStore("todos");
  const data = transaction.delete(name);
  data.onsuccess = function(event) {
    read();
  };
}
