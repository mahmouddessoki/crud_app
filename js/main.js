

//CRUD --> Create, Read, Update, Delete

let productName = document.getElementById("product-name");
let productPrice = document.getElementById("product-price");
let productQuantity = document.getElementById("product-qty");
let productCategory = document.getElementById("product-cat");
let productDescription = document.getElementById("product-desc");
let productImage = document.getElementById("product-img");
let productsContainer = document.getElementById("products-container");
let productsList = document.getElementById("products-list");
let emptyList = document.getElementById("list-empty");
let addButton = document.getElementById("add")
let editButton = document.getElementById("edit")
let searchButton = document.getElementById("search-btn")
let searchInput = document.getElementById("searchWord")
let priceInput1 = document.getElementById("price-search-min")
let priceInput2 = document.getElementById("price-search-max")
let searchAlert = document.getElementById("search-alert")
let catsContainer = document.getElementById("cats");
let allInputs = document.querySelectorAll("#product-form input , textarea");
let valid = document.querySelectorAll(".fa-check")
let inValid = document.querySelectorAll(".fa-circle-exclamation")
let products = JSON.parse(localStorage.getItem("allProducts")) || [];
let currentIndex;
let filteredProducts;
let lastRandomId = null;
let selectedCat = "all"
let deletedProducts = JSON.parse(localStorage.getItem("deletedProducts")) || [];






let allRgex = [
    /^[a-zA-Z0-9 _-]{5,50}$/,
    /^(200|[2-9][0-9]{2}|1000)$/,
    /^[1-9][0-9]*$/,
    /^[a-zA-Z0-9 _-]{3,30}$/,
    /^[a-zA-Z0-9 _-]{2,200}$/,
]

let numOfDel = document.querySelectorAll(".numOfDel")
numOfDel[0].innerHTML = deletedProducts.length;
numOfDel[1].innerHTML = deletedProducts.length;



for (let i = 0; i < allInputs.length; i++) {
    allInputs[i].addEventListener("input", function (e) {
        if (allRgex[i].test(e.target.value)) {
            valid[i].classList.add("d-block")
            inValid[i].classList.remove("d-block")
            e.target.classList.add("border", "border-3", "border-success")
            e.target.classList.remove("border-danger")

        } else {
            valid[i].classList.remove("d-block")
            inValid[i].classList.add("d-block")
            e.target.classList.remove("border-success")
            e.target.classList.add("border", "border-3", "border-danger")
        }

    })

}















searchInput.oninput = search
catsContainer.oninput = function () {
    selectedCat = catsContainer.value.toLowerCase()
    search()
}







if (products.length != 0) {

    productsList.style.display = "block"
    emptyList.style.display = "none"
    displayProducts(products)
    priceInput1.value = getMinPrice()
    priceInput2.value = getMaxPrice()
    displayCats()

} else {
    productsList.style.display = "none"
    emptyList.style.display = "block"

}


function validateInputs() {
    let errors = 0;


    for (let i = 0; i < allInputs.length; i++) {
        if (allInputs[i].type == "file") {
            break;
        }
        if (allRgex[i].test(allInputs[i].value) == false) {
            errors++;
        }


    }

    return errors;









}




function addProduct() {

    if (validateInputs() == 0) {

        if (isExist()) {
            Swal.fire({
                title: 'Already Existed!',
                html: 'Your <span class="fw-bold">product</span> is already existed.',
                icon: 'warning', // Other options: 'error', 'warning', 'info', 'question'
                confirmButtonText: 'Try Another One',
            });
        } else {
            //create object for each added product
            let product = {
                id: generateId(),
                name: productName.value.trim(),
                price: productPrice.value.trim(),
                quantity: productQuantity.value.trim(),
                category: productCategory.value.trim(),
                description: productDescription.value.trim(),
                image: "./imgs/" + (productImage.files[0]?.name || "no.png")
            }



            //add product to array named products
            products.push(product)
            localStorage.setItem("allProducts", JSON.stringify(products))
            productsList.style.display = "block"
            emptyList.style.display = "none"
            displayProducts(products);
            displayCats()
            priceInput1.value = getMinPrice()
            priceInput2.value = getMaxPrice()
            Swal.fire({
                title: 'Success!',
                html: 'Your <span class="fw-bold">product</span> has been added successfully.',
                icon: 'success', // Other options: 'error', 'warning', 'info', 'question'
                confirmButtonText: 'OK'
            });
        }




    } else {
        Swal.fire({
            title: 'Error!',
            html: `

                <style>

                .swal2-error {
                    display: none !important;

                }
                .swal2-confirm.swal2-styled {
                    display: none !important;
                }
                .swal2-close {
                    display : block !important;
                }
                
                .swal2-title {
                     margin-top : 2rem !important;
                }
                
                </style>

                <p class="text-start text-capitalize">the products info is invalid , and must be filled with the following rules :</p>
                <ul class="list-unstyled text-start " >
                   <li class="d-flex column-gap-2">
                    <i class="fa-solid text-danger fa-pen-to-square"></i>
                        <p class =" fw-medium ">
                        <span class="fw-bold text-capitalize">Product name : </span> must be filled and must be between 5 and 50 characters
                        
                        </p>

                   </li> 
                   <li class="d-flex column-gap-2">
                    <i class="fa-solid text-danger fa-pen-to-square"></i>
                        <p class =" fw-medium ">
                        <span class="fw-bold text-capitalize">Product price : </span> must be filled and must be number only between 200 and 2000 L.E
                        
                        </p>

                   </li> 
                   <li class="d-flex column-gap-2">
                    <i class="fa-solid text-danger fa-pen-to-square"></i>
                        <p class =" fw-medium ">
                        <span class="fw-bold text-capitalize">Product quantity : </span> must be filled and must be number greater than 0
                        
                        </p>

                   </li> 
                   <li class="d-flex column-gap-2">
                    <i class="fa-solid text-danger fa-pen-to-square"></i>
                        <p class =" fw-medium ">
                        <span class="fw-bold text-capitalize">Product description : </span> must be filled and must be between 5 and 50 characters
                        
                        </p>

                   </li> 
                
                </ul>
            `,
            icon: 'error', // Other options: 'error', 'warning', 'info', 'question'
            confirmButtonText: 'Try Again'
        });
    }




}



function displayProducts(current) {
    let cartoona = ``;

    if (current == undefined) {
        current = products
    }

    if (current.length == 0) {
        cartoona = `<div class="alert alert-danger mt-5 fs-3 text-capitalize"  >
        No products found with the given criteria
        </div>`
    } else {

        for (let i = 0; i < current.length; i++) {
            cartoona += `
            
             <div class="col-xl-3 col-md-6 col-lg-4">
                        <div class="product-card h-100">
                            <div class="card shadow h-100">
                                <div class="card-header text-capitalize border-0  d-flex align-items-center justify-content-between">
                                    <p class="mb-0 fw-bold">Price: ${current[i].price} L.E</p>
                                    <p class="mb-0 fw-bold">Qty: ${current[i].quantity}</p>
                                </div>
                                <img src="${current[i].image}" class=" rounded-0 card-img-top" alt="...">
                                <div class="card-body overflow-hidden">
                                    <div class="d-flex  justify-content-between align-items-center">
                                        <h5 id="product-name-value" class="card-title"> ${searchInput.value ? `
                                            ${current[i].name.replaceAll(searchInput.value, `<span class="bg-warning">${searchInput.value.trim()}</span>`)}
                                            ` : current[i].name}
                                            </h5>
                                        <h6> ${current[i].category}</h6>
                                    </div>
                                    <p class="card-text">
                                    
                                    ${searchInput.value ? `
                                            ${current[i].description.replaceAll(searchInput.value, `<span class="bg-warning">${searchInput.value.trim()}</span>`)}
                                            ` : current[i].description}
                                    
                                    
                                    </p>
                                </div>
                                <div class="card-footer p-3">
                                    <div class="action-icons d-flex justify-content-center column-gap-3">
                                        <i onclick="editProduct(${current[i].id})" title="edit product" class="fa-solid fa-pen text-info fa-lg  "></i>
                                        <i onclick="deleteProduct(${current[i].id})" title="delete product" class=" fa-lg fa-solid fa-trash text-danger"></i>
    
                                    </div>
                                </div>
                            </div>
    
                        </div>
                    </div>
            
            
            
            `
        }


        clearInputs();
    }
    productsContainer.innerHTML = cartoona




}

function clearInputs() {
    productName.value = '';
    productPrice.value = '';
    productQuantity.value = '';
    productDescription.value = '';
    productCategory.value = '';
    productImage.value = '';
    for (let i = 0; i < allInputs.length; i++) {
        if (allInputs[i].type == "file") {
            break;
        }
        valid[i].classList.remove("d-block")
        allInputs[i].classList.remove("border-success")

    }


}



function deleteProduct(id) {
    let indexToDelete = products.findIndex(function (prod) {
        return prod.id == id
    });

    Swal.fire({
        title: 'Delete Item',
        text: 'Do you want to move it to the recycle bin or delete it permanently?',
        icon: 'question',
        showDenyButton: true,
        showCancelButton: true,
        confirmButtonText: 'Recycle Bin',
        denyButtonText: 'Delete',
        cancelButtonText: 'Cancel',
    }).then((result) => {
        if (result.isConfirmed) {
            // Option 1: Move to Recycle Bin
            Swal.fire('Moved!', 'The product has been moved to the recycle bin.', 'success');
            deletedProducts.push(products[indexToDelete])
            localStorage.setItem("deletedProducts", JSON.stringify(deletedProducts))
            products.splice(indexToDelete, 1);
            localStorage.setItem("allProducts", JSON.stringify(products))
            numOfDel[0].innerHTML = deletedProducts.length;
            if (products.length == 0) {
                productsList.style.display = "none";
                emptyList.style.display = "block";
                numOfDel[1].innerHTML = deletedProducts.length;
            } else {
                emptyList.style.display = "none"


            }

            displayCats()
            catsContainer.value = selectedCat;
            search()
            if (filteredProducts.length == 0) {
                displayProducts()
                catsContainer.value = "all"
            }
            priceInput1.value = getMinPrice()
            priceInput2.value = getMaxPrice()


            // Add logic here for moving the item to the recycle bin
        } else if (result.isDenied) {
            // Option 2: Delete Permanently
            Swal.fire('Deleted!', 'The product has been permanently deleted.', 'error');

            products.splice(indexToDelete, 1);
            localStorage.setItem("allProducts", JSON.stringify(products))
            if (products.length == 0) {
                productsList.style.display = "none";
                emptyList.style.display = "block";
                numOfDel[1].innerHTML = deletedProducts.length;
            } else {
                emptyList.style.display = "none"


            }

            displayCats()
            catsContainer.value = selectedCat;
            search()
            if (filteredProducts.length == 0) {
                displayProducts()
                catsContainer.value = "all"
            }
            priceInput1.value = getMinPrice()
            priceInput2.value = getMaxPrice()

            // Add logic here for permanently deleting the item
        } else {
            // Option 3: Cancel
            Swal.fire('Cancelled', 'No changes were made.', 'info');
        }
    });












}

function editProduct(id) {
    currentIndex = products.findIndex(function (prod) {
        return prod.id == id
    });
    editButton.style.display = "block"
    addButton.style.display = "none"
    fillInputs(currentIndex)

}

function editConfirm() {


    if (validateInputs() == 0) {

        let product = {
            id: products[currentIndex].id,
            name: productName.value.trim(),
            price: productPrice.value,
            quantity: productQuantity.value,
            category: productCategory.value.trim(),
            description: productDescription.value.trim(),
            image: (`./imgs/${productImage.files[0]?.name}`)

        }
        if (productImage.files[0]?.name == undefined) {
            product.image = products[currentIndex].image;
        }



        products[currentIndex] = product;
        localStorage.setItem("allProducts", JSON.stringify(products))
        editButton.style.display = "none"
        addButton.style.display = "block"
        displayCats()
        priceInput1.value = getMinPrice()
        priceInput2.value = getMaxPrice()
        catsContainer.value = selectedCat;
        search()

        Swal.fire({
            title: 'Success!',
            html: 'Your <span class="fw-bold">product</span> has been Edited successfully.',
            icon: 'success', // Other options: 'error', 'warning', 'info', 'question'
            confirmButtonText: 'OK'
        });



    } else {
        Swal.fire({
            title: 'Error!',
            html: `

                <style>

                .swal2-error {
                    display: none !important;

                }
                .swal2-confirm.swal2-styled {
                    display: none !important;
                }
                .swal2-close {
                    display : block !important;
                }
                
                .swal2-title {
                     margin-top : 2rem !important;
                }
                
                </style>

                <p class="text-start text-capitalize">the products info is invalid , and must be filled with the following rules :</p>
                <ul class="list-unstyled text-start " >
                   <li class="d-flex column-gap-2">
                    <i class="fa-solid text-danger fa-pen-to-square"></i>
                        <p class =" fw-medium ">
                        <span class="fw-bold text-capitalize">Product name : </span> must be filled and must be between 5 and 50 characters
                        
                        </p>

                   </li> 
                   <li class="d-flex column-gap-2">
                    <i class="fa-solid text-danger fa-pen-to-square"></i>
                        <p class =" fw-medium ">
                        <span class="fw-bold text-capitalize">Product price : </span> must be filled and must be number only between 200 and 2000 L.E
                        
                        </p>

                   </li> 
                   <li class="d-flex column-gap-2">
                    <i class="fa-solid text-danger fa-pen-to-square"></i>
                        <p class =" fw-medium ">
                        <span class="fw-bold text-capitalize">Product quantity : </span> must be filled and must be number greater than 0
                        
                        </p>

                   </li> 
                   <li class="d-flex column-gap-2">
                    <i class="fa-solid text-danger fa-pen-to-square"></i>
                        <p class =" fw-medium ">
                        <span class="fw-bold text-capitalize">Product description : </span> must be filled and must be between 5 and 50 characters
                        
                        </p>

                   </li> 
                
                </ul>
            `,
            icon: 'error', // Other options: 'error', 'warning', 'info', 'question'
            confirmButtonText: 'Try Again'
        });
    }



}

function fillInputs(index) {
    let product = products[index];
    productName.value = product.name
    productPrice.value = product.price
    productCategory.value = product.category
    productDescription.value = product.description
    productImage.files[0] = product.image.split("/")[2]
    productQuantity.value = product.quantity

    // console.log(productImage)
    // console.log(product.image.split("/")[2])

}

function search() {

    let min = Number(priceInput1.value) || getMinPrice();
    let max = Number(priceInput2.value) || getMaxPrice();
    let searchValue = searchInput.value.toLowerCase() || null;
    // console.log(selectedCat)
    filteredProducts = []
    if (selectedCat == 'all') {

        if (searchValue) {
            for (let i = 0; i < products.length; i++) {
                if (products[i].name.toLowerCase().includes(searchValue.toLowerCase())
                    || products[i].description.toLowerCase().includes(searchValue.toLowerCase())) {

                    if (Number(products[i].price) >= min && Number(products[i].price) <= max) {
                        filteredProducts.push(products[i])



                    }


                }


            }


        } else {
            for (let i = 0; i < products.length; i++) {
                if (Number(products[i].price) >= min && Number(products[i].price) <= max) {


                    filteredProducts.push(products[i])




                }
            }


            // console.log(filteredProducts)


        }
    } else {
        if (searchValue) {

            for (let i = 0; i < products.length; i++) {
                if (
                    (products[i].name.toLowerCase().includes(searchValue.toLowerCase())
                        || products[i].description.toLowerCase().includes(searchValue.toLowerCase()))

                    && (products[i].category.toLowerCase() == selectedCat.toLowerCase())) {

                    console.log(products[1].category.toLowerCase() == selectedCat.toLowerCase())

                    if (Number(products[i].price) >= min && Number(products[i].price) <= max) {
                        filteredProducts.push(products[i])


                    }

                }


            }


        } else {
            for (let i = 0; i < products.length; i++) {
                if (Number(products[i].price) >= min && Number(products[i].price) <= max
                    && (products[i].category.toLowerCase() == selectedCat.toLowerCase())) {


                    filteredProducts.push(products[i])




                }
            }




        }
    }
    displayProducts(filteredProducts)

}





function getMaxPrice() {
    let maxPrice = products[0].price;
    for (let i = 0; i < products.length; i++) {
        if (+products[i].price > +maxPrice) {
            maxPrice = products[i].price
        }
    }
    return maxPrice
}
function getMinPrice() {
    let minPrice = products[0].price;
    for (let i = 0; i < products.length; i++) {
        if (+products[i].price < +minPrice) {
            minPrice = products[i].price
        }
    }
    return minPrice;
}


function getProductsCats() {
    let cats = [];
    for (let i = 0; i < products.length; i++) {
        if (!cats.includes(products[i].category)) {

            cats.push(products[i].category)
        }
    }
    return cats;
}


function displayCats() {
    let availableCats = getProductsCats();
    let cartoona = ` <option value="all" selected >All</option>`;
    for (let i = 0; i < availableCats.length; i++) {
        cartoona += `<option value="${availableCats[i]}" class="text-capitalize">
        ${availableCats[i]}</option>`
    }
    catsContainer.innerHTML = cartoona;
}


function isExist() {
    let exist = false;
    let index = products.findIndex(function (prod) {
        return prod.name.toLowerCase().trim() === productName.value.toLowerCase().trim()
            && prod.category.toLowerCase().trim() === productCategory.value.toLowerCase().trim();
    })

    if (index !== -1) {
        exist = true
    }

    return exist
}


function clearAll() {
    deletedProducts = deletedProducts.concat(JSON.parse(localStorage.getItem("allProducts")))
    localStorage.setItem("deletedProducts", JSON.stringify(deletedProducts))
    localStorage.removeItem("allProducts")
    numOfDel[1].innerHTML = deletedProducts.length;
    productsList.style.display = "none"
    emptyList.style.display = "block"


}
function generateId() {
    let randomID = Math.floor(Math.random() * 10000);
    if (randomID == lastRandomId) {
        generateId()
    }
    lastRandomId = randomID
    return randomID;

}






