const classificationList = document.querySelector("#classificationList")

classificationList.addEventListener("change", async function () {
  const classification_id = classificationList.value

  const response = await fetch(`/inv/getInventory/${classification_id}`)
  const data = await response.json()

  buildTable(data)
})

function buildTable(data) {
  const table = document.querySelector("#inventoryDisplay")

  let html = "<tr><th>Name</th><th>Price</th></tr>"

  data.forEach(item => {
    html += `<tr>
      <td>${item.inv_make} ${item.inv_model}</td>
      <td>${item.inv_price}</td>
    </tr>`
  })

  table.innerHTML = html
}