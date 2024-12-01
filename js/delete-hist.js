let deleteContainer = document.getElementById("deleted-products")
let backBtn = document.getElementById("back")
let deletedProducts = JSON.parse(localStorage.getItem("deletedProducts"))
    || [];

let allProducts = JSON.parse(localStorage.getItem("allProducts"))
    || [];




if (deletedProducts.length == 0) {
    emptyAlert()
    backBtn.classList.replace("d-block", "d-none")
} else {
    displayProducts()
    backBtn.classList.replace("d-none","d-block")


}




function displayProducts() {
    let cartoona = ``;
    if (deletedProducts.length != 0) {

        for (let i = 0; i < deletedProducts.length; i++) {
            cartoona += `
            
             <div class="col-xl-3 col-md-6 col-lg-4">
                        <div class="product-card h-100">
                            <div class="card shadow h-100">
                                <div class="card-header text-capitalize border-0  d-flex align-items-center justify-content-between">
                                    <p class="mb-0 fw-bold">Price: ${deletedProducts[i].price} L.E</p>
                                    <p class="mb-0 fw-bold">Qty: ${deletedProducts[i].quantity}</p>
                                </div>
                                <img src="${deletedProducts[i].image}" class=" rounded-0 card-img-top" alt="...">
                                <div class="card-body overflow-hidden">
                                    <div class="d-flex  justify-content-between align-items-center">
                                        <h5 class="card-title"> ${deletedProducts[i].name}</h5>
                                        <h6> ${deletedProducts[i].category}</h6>
                                    </div>
                                    <p class="card-text">${deletedProducts[i].description}</p>
                                    <div class="restore-delete">
                                        <button onclick="restore(${i})" class="btn fs-5 btn-outline-success d-block w-100 text-capitalize">
                                            restore
                                        </button>
                                        <button onclick="deletePermanently(${i})" class="btn fs-5 btn-outline-danger my-3 d-block w-100 text-capitalize">
                                            delete confirm
                                        </button>
                                    </div>
                                </div>
                                
                            </div>
    
                        </div>
                    </div>
            
            
            
            `
        }
        deleteContainer.innerHTML = cartoona
    } else {
        emptyAlert()
        backBtn.classList.replace("d-block", "d-none")

    }






}






function restore(index) {

    allProducts.push(deletedProducts[index])
    deletedProducts.splice(index, 1)
    localStorage.setItem("deletedProducts", JSON.stringify(deletedProducts))
    localStorage.setItem("allProducts", JSON.stringify(allProducts))

   
    if (deletedProducts.length == 0) {
        displayProducts()
        Swal.fire({
            title: 'Recycle Bin Empty',
            text: 'Your product is restored and no products are in the recycle bin. Would you like to visit the store?',
            icon: 'info',
            showCancelButton: true,
            confirmButtonText: 'Go to Store',
            cancelButtonText: 'Cancel',
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
        }).then((result) => {
            if (result.isConfirmed) {
                // Redirect to the store page
                window.location.href = './index.html'; // Replace with your store URL
            } else {
                Swal.fire('Cancelled', 'You stayed on the current page.', 'info');
            }
        });
    }else {
        displayProducts()

        Swal.fire({
            title: 'Success!',
            text: 'Your Product restored successfully.',
            icon: 'success',
            confirmButtonText: 'OK'
        });
    }


}


function deletePermanently(index) {

    Swal.fire({
        title: 'Are you sure?',
        text: "This action cannot be undone. Do you want to continue?",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#d33',
        cancelButtonColor: '#3085d6',
        confirmButtonText: 'Yes, delete it!',
        cancelButtonText: 'Cancel',
    }).then((result) => {
        if (result.isConfirmed) {
            // If the user confirms, display a success message
            Swal.fire(
                'Deleted!',
                'Your product has been deleted.',
                'success'
            );
            // Add logic here to delete the item
            deletedProducts.splice(index, 1)
            localStorage.setItem("deletedProducts", JSON.stringify(deletedProducts))
            if(deletedProducts.length == 0) {
                displayProducts()
                Swal.fire({
                    title: 'Recycle Bin Empty',
                    text: 'No items are in the recycle bin. Would you like to visit the store?',
                    icon: 'info',
                    showCancelButton: true,
                    confirmButtonText: 'Go to Store',
                    cancelButtonText: 'Cancel',
                    confirmButtonColor: '#3085d6',
                    cancelButtonColor: '#d33',
                }).then((result) => {
                    if (result.isConfirmed) {
                        // Redirect to the store page
                        window.location.href = './index.html'; // Replace with your store URL
                    } else {
                        Swal.fire('Cancelled', 'You stayed on the current page.', 'info');
                    }
                });
            }else {
                displayProducts()
            }
        } else if (result.dismiss === Swal.DismissReason.cancel) {
            // If the user cancels, display a cancellation message
            Swal.fire(
                'Cancelled',
                'Your product is safe :)',
                'info'
            );
        }
    });

    
}

function emptyAlert() {
    deleteContainer.innerHTML = `
                <h2 class="h1 text-capitalize text-center mt-5 " >
                    No deleted products yet.....
                </h2>

                <a href="./index.html" class="btn col-6 m-auto mt-5 back-btn px-3 py-3 fs-2 fw-bold btn-light text-capitalize">
                    <i class="fa-solid fa-arrow-left"></i>
                     Go Back
                </a>`;
}