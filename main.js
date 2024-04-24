//! если не работает, то нужно запустить json server
//! npx json-server -w bd.json -p 8000
const API = "http://localhost:8000/products";

let productsList = document.getElementById("products");
let image = document.getElementById("image");
let description = document.getElementById("description");
let firstPrice = document.getElementById("");

let openAddFormBtn = document.getElementById("open-add-form");
let addModal = document.getElementById("add-modal");
let addModalInner = document.getElementById("add-modal-inner");
let closeAddFormBtn = document.getElementById("close-add-modal");

//? достаем форму добавления
let inpImage = document.getElementById("add-img");
let inpDescription = document.getElementById("add-description");
let inpFirstPrice = document.getElementById("add-price-1");
let inpSecondPrice = document.getElementById("add-price-2");
let addProductBtn = document.getElementById("add-btn");

//? На кнопку навесили события чтобы открыть модалку
openAddFormBtn.addEventListener("click", () => {
  addModal.style.display = "flex";
});

//?начало details
let closeDetailsBtn = document.getElementById("close-details");
let detailsParent = document.getElementById("details");
let detailsInner = document.getElementById("details-inner");
closeDetailsBtn.addEventListener("click", () => {
  detailsParent.style.display = "none";
});

//? Закрытие модалки при клике на крестик внутри нее
closeAddFormBtn.addEventListener("click", () => {
  addModal.style.display = "none";
});

//! edit
let editModal = document.getElementById("edit-modal");
let editModalInner = document.getElementById("edit-modal-inner");
let closeEditModalBtn = document.getElementById("close-edit-modal");

//? достаем форму добавления
let inpImageEdit = document.getElementById("edit-img");
let inpDescriptionEdit = document.getElementById("edit-description");
let inpFirstPriceEdit = document.getElementById("edit-price-1");
let inpSecondPriceEdit = document.getElementById("edit-price-2");
let editProductBtn = document.getElementById("edit-btn");

closeEditModalBtn.addEventListener("click", () => {
  editModal.style.display = "none";
});

//? // ? При клике на кнопку внутри модалки, собираем данные с инпута в объект и делаем запрос на добавление продукта, после скрываем модалку
addProductBtn.addEventListener("click", async () => {
  let product = {
    image: inpImage.value,
    description: inpDescription.value,
    first_price: inpFirstPrice.value,
    second_price: inpSecondPrice.value,
  };
  //? отправляем данные
  if (
    inpImage.value.trim() &&
    inpDescription.value.trim() &&
    inpFirstPrice.value.trim() &&
    inpSecondPrice.value.trim()
  ) {
    await fetch(API, {
      method: "POST",
      body: JSON.stringify(product),
      headers: {
        "Content-type": "application/json; charset=utf-8",
      },
    });
  } else {
    alert("Заполните поля!");
  }
  addModal.style.display = "none";
});

//? создаем асинхронную функцию для того чтобы достать данные с бэкенда и затем отобразить
async function showProducts() {
  let products = await fetch(API).then((res) => res.json());

  productsList.innerHTML = "";
  //? перебираем массив для того чтобы создать div для карточки и поместить его в product list т.е в родителя карточек

  products.forEach((product, id) => {
    let div = document.createElement("div");
    div.classList.add("card");

    div.innerHTML = `
    <img src = "${product.image}" />
    <p>${product.description} </p>
    <div class = "card-price">
       <p>${product.first_price}</p>
       <p> ${product.second_price}</p>
    </div>
    `;

    //! details
    div.addEventListener("click", () => {
      detailsInner.innerHTML = "";
      detailsParent.style.display = "flex";

      detailsInner.innerHTML = `
     <img src="${product.image}"/>
     <div class="details-text" id="details-text">
      <p>${product.description}</p>
       <div class="card-price">
         <p>${product.first_price} сом</p>
         <p>${product.second_price} сом</p>
       </div>
     </div>`;
      let detailsText = document.getElementById("details-text");
      let btnDelete = document.createElement("button");
      btnDelete.innerHTML = "Удалить продукт";

      btnDelete.addEventListener("click", (e) => deleteProduct(product.id, e));

      //! Создаем кнопку для редактирования внутри details
      let editBtn = document.createElement("button");
      editBtn.innerHTML = "Редактировать продукт";
      editBtn.addEventListener("click", () => {
        editModal.style.display = "flex";
        editModal.style.zIndex = "2";
        editProduct(product);
      });
      detailsText.append(btnDelete, editBtn);
    });

    //! edit

    productsList.append(div);
  });
}
//? Вызываем эту функцию 1 раз в глобальной области видимости для того чтобы при загрузке страницы сразу отобразились данные
showProducts();

async function deleteProduct(id, event) {
  event.stopPropagation();
  await fetch(`${API}/${id}`, {
    method: "DELETE",
    headers: {
      "Content-type": "application/json; charset=utf-8",
    },
  });
  detailsParent.style.display = "none";
}

async function editProduct(product) {
  console.log("product: ", product);
  inpImageEdit.value = product.image;
  inpDescriptionEdit.value = product.description;
  inpFirstPriceEdit.value = product.first_price;
  inpSecondPriceEdit.value = product.second_price;

  editProductBtn.addEventListener("click", async () => {
    let newProduct = {
      image: inpImageEdit.value,
      description: inpDescriptionEdit.value,
      first_price: inpFirstPriceEdit.value,
      second_price: inpSecondPriceEdit.value,
    };
    await fetch(`${API}/${product.id}`, {
      method: "PATCH",
      body: JSON.stringify(newProduct),
      headers: {
        "Content-type": "application/json; charset=utf-8",
      },
    });
  });
}
