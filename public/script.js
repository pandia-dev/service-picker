function loadContent(contentFile) {
    fetch(`pages/${contentFile}`)
        .then(response => response.text())
        .then(data => {
            document.getElementById('main-content').innerHTML = data;
            loadScriptsByScreen(contentFile);
        })
        .catch(error => console.error('Error loading content:', error));
}

window.navigateTo = function (url, screenName) {
    loadContent(screenName);
    history.pushState(null, null, `/${url}`);
}

function loadScriptsByScreen(path) {
    switch (path) {
        case 'appointment.html': onAppointmentInit();
            break;
        case 'schedule.html': onScheduleInit();
            break;
        case 'booking.html': onBookingInit();
            break;
        case 'quotation.html': onQuotationInit();
            break;
        case 'gallery.html': onGalleryInit();
            break;
        // case 'home.html': loadContent('home.html');
        // break;
        default: break;
    }
}

// Handle back/forward navigation
window.addEventListener('popstate', function () {
    debugger
    const path = window.location.pathname.slice(1);
    navigateTo(path, path);
});

/** Load Home screen on landing page */
document.addEventListener('DOMContentLoaded', function () {
    debugger
    // Load initial content
    const path = window.location.pathname.substring(1); // remove leading '/'
    navigateTo(path || 'home.html', path || 'home.html');
});

/** "Appointment" Script Section */
onAppointmentInit = function () {
    fetch('menu.json')
        .then(response => response.json())
        .then(data => {
            const skinBeauty = data.skinService.skinBeauty;
            const bleach = data.skinService.bleach;
            const facial = data.skinService.facial;
            const waxing = data.skinService.waxing;
            const detan = data.skinService.detan;
            const basicCut = data.hairService.basicCut;
            const advanceHairCut = data.hairService.advanceHairCut;
            const hairCareServices = data.hairService.hairCareServices;
            const bodyDecor = data.bodyDecor;
            const skinArray = [skinBeauty, bleach, facial, waxing, detan];
            const hairArray = [basicCut, advanceHairCut, hairCareServices];
            const bodyDecorArray = [data.bodyDecor];
            generateMenu(skinArray, "skin");
            generateMenu(hairArray, "hair");
            generateMenu(bodyDecorArray, "body-decor");

            /**
            * * Generates a menu based on the provided array of categories.
            * 
            * This function takes an array of category names and a parent element ID.
            * It creates a menu item for each category and appends it to the parent element.
            *
            * @param {Array} arrayList - The array of category names.
            * @param {string} parentId - The ID of the parent element where the menu items will be appended.
            */
            function generateMenu(arrayList, id) {
                arrayList.forEach(oneCategory => {
                    const parent = document.getElementById(id);
                    const container = document.createElement("div");
                    container.className = "card";
                    const headingRow = document.createElement("div");
                    headingRow.className = "column-card-header";
                    const icon = document.createElement("i");
                    icon.className = oneCategory.icon;
                    const heading = document.createElement("h3");
                    heading.innerHTML = oneCategory.label;
                    parent.appendChild(container);
                    container.appendChild(headingRow);
                    headingRow.appendChild(icon);
                    headingRow.appendChild(heading);

                    oneCategory.list.forEach(el => {
                        const serviceCard = document.createElement("div");
                        serviceCard.className = "service-card";
                        serviceCard.onclick = function () {
                            navToForm(el.service);
                        };
                        const serviceName = document.createElement("span");
                        serviceName.innerHTML = el.service;
                        const price = document.createElement("span");
                        price.innerHTML = el.price;
                        container.appendChild(serviceCard);
                        serviceCard.appendChild(serviceName);
                        serviceCard.appendChild(price);
                    });
                });
            }
        });

    function navToForm(serviceName) {
        navigateTo(`schedule.html?serviceName=${serviceName}`, 'schedule.html');
    }
}

/** "Schedule" Script Section */
onScheduleInit = function () {
    var serviceName = "";
    fetch('shared/form.html')
        .then(response => response.text())
        .then(data => {
            document.getElementById('form-section').innerHTML = data;
            const queryString = window.location.search;
            const params = new URLSearchParams(queryString);
            serviceName = params.get('serviceName');
            document.getElementById("title").innerHTML = "Schedule your slot for " + serviceName;
        });

    window.onSubmit = function (event) {
        const params = {
            name: document.getElementById("name").value,
            serviceName: serviceName,
            mob: document.getElementById("phone").value,
            mail: document.getElementById("email").value,
            date: document.getElementById("date").value,
            time: document.getElementById("time").value
        };

        if (!params.name || params.name.length < 1) alert('Please enter valid name')
        else if (!params.mob || isNaN(params.mob) || params.mob.length !== 10) alert('Please enter valid mobile number')
        else if (!params.date || params.date.length !== 10) alert('Please enter valid date')
        else if (!params.time || params.time.length !== 5) alert('Please enter valid time')
        else {
            fetch('/schedule-appointment', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(params)
            })
                .then(response => response.text())
                .then(result => alert(result))
                .catch(error => console.error('Error:', error));
        }


    }
}

/** "Booking" Script Section */
onBookingInit = function () {
    let quotationArray = [];
    fetch('menu.json')
        .then(response => response.json())
        .then(data => {
            data.eventBooking.forEach((element) => {
                // Getting parent element
                const menuList = document.getElementById("card-container");

                // Creation of children
                const menuCard = document.createElement('div');
                const firstRow = document.createElement('div');
                const name = document.createElement('h3');
                const plusMinus = document.createElement('span');
                const count = document.createElement('span');
                const plusButton = document.createElement('button');
                const minusButton = document.createElement('button');
                const secondRow = document.createElement('div');
                const desc = document.createElement('span');
                const thirdRow = document.createElement('div');
                const price = document.createElement('small');

                // Assigning attributes to elements
                menuCard.className = "card";
                firstRow.className = "first-row";
                name.className = "service-name";
                name.innerText = element.service;
                plusMinus.className = "plus-minus";
                plusButton.className = "plus-button";
                minusButton.innerHTML = "-";
                minusButton.className = "minus-button";
                plusButton.innerHTML = "+";
                count.className = "count"
                count.innerText = "0"
                secondRow.className = "second-row";
                desc.className = "service-desc";
                desc.innerText = element.desc;
                thirdRow.className = "third-row";
                price.className = "service-price";
                price.innerText = "₹" + element.price;

                // Append children
                menuList.appendChild(menuCard);
                menuCard.appendChild(firstRow);
                menuCard.appendChild(secondRow);
                menuCard.appendChild(thirdRow);
                firstRow.appendChild(name);
                firstRow.appendChild(plusMinus);
                plusMinus.appendChild(minusButton);
                plusMinus.appendChild(plusButton);
                secondRow.appendChild(desc);
                thirdRow.appendChild(price);
                thirdRow.appendChild(count);

                // Add event listener to plusButton
                plusButton.addEventListener('click', () => {
                    const currentQuateObj = {
                        "id": element.id,
                        "service": element.service,
                        "price": element.price,
                        "count": 1,
                        "total": 0
                    };
                    let currentCount = parseInt(count.innerText);
                    count.innerText = (currentCount + 1).toString();
                    if (currentCount !== 1) {
                        minusButton.style.display = "inline-block";
                        count.style.display = "inline-block";
                    }
                    if (quotationArray.length == 0) {
                        quotationArray.push(currentQuateObj);
                    } else {
                        addItem(quotationArray, currentQuateObj);
                        console.log(quotationArray, 'plus');
                    }
                    isQuatationBtnDisable();
                });

                // Add event listener to minusButton
                minusButton.addEventListener('click', () => {
                    const currentQuateObj = {
                        "id": element.id,
                        "service": element.service,
                        "price": element.price,
                        "count": 1,
                        "total": 0
                    };
                    let currentCount = parseInt(count.innerText);
                    if (currentCount > 0) {
                        count.innerText = (currentCount - 1).toString();
                    }
                    // Hide the minus button when count becomes zero
                    if (currentCount === 1) {
                        minusButton.style.display = "none";
                        count.style.display = "none";
                    }
                    removeItem(quotationArray, currentQuateObj);
                    console.log(quotationArray, 'minus');
                    isQuatationBtnDisable();
                });

                function addItem(items, newItem) {
                    const existingItemIndex = items.findIndex((item) => item.id === newItem.id);

                    if (existingItemIndex !== -1) {
                        // If ID exists, update count in a copy of the object
                        const updatedItem = { ...items[existingItemIndex], count: items[existingItemIndex].count + 1 };
                        quotationArray = [
                            ...items.slice(0, existingItemIndex),
                            updatedItem,
                            ...items.slice(existingItemIndex + 1),
                        ];
                    } else {
                        // If ID doesn't exist, push the new item
                        quotationArray = [...items, newItem];
                    }
                }

                function removeItem(items, newItem) {
                    const existingItemIndex = items.findIndex((item) => item.id === newItem.id);

                    if (existingItemIndex !== -1) {
                        // If ID exists, handle decrease or removal
                        if (items[existingItemIndex].count > 1) {
                            // Decrement count in a copy of the object (avoid mutation)
                            const updatedItem = { ...items[existingItemIndex], count: items[existingItemIndex].count - 1 };
                            quotationArray = [
                                ...items.slice(0, existingItemIndex),
                                updatedItem,
                                ...items.slice(existingItemIndex + 1),
                            ];
                        } else {
                            // If count reaches 0, remove the item (optional)
                            quotationArray = items.filter((item) => item.id !== newItem.id);
                        }
                    } else {
                        // If ID doesn't exist, push the new item
                        quotationArray = [...items, newItem];
                    }
                }
            });
        })
        .catch(error => console.error('Error fetching JSON:', error));

    window.quotationClick = function () {
        const dataString = encodeURIComponent(JSON.stringify(quotationArray));
        navigateTo(`quotation.html?data=${dataString}`, 'quotation.html');
    }

    function isQuatationBtnDisable() {
        const quotationBtn = document.getElementById('quotationBtn');
        quotationBtn.disabled = quotationArray.length < 1;
    }
    isQuatationBtnDisable();
}

/** "Quotation" Script Section */
onQuotationInit = function () {

    let quotationArray = [];

    // Prepare the JSON from query params    
    const urlParam = new URLSearchParams(window.location.search);
    const quotationData = urlParam.get('data');
    if (quotationData) {
        this.quotationArray = JSON.parse(decodeURIComponent(quotationData));
        displayServices();
    }

    // Loading form component from shared module
    fetch('shared/form.html')
        .then(response => response.text())
        .then(data => {
            document.getElementById('form-section').innerHTML = data;
        });

    // Function to display services in the table
    function displayServices() {
        const tableBody = document.querySelector('#servicesTable tbody');
        const grandTotalElement = document.getElementById('grand-total');
        let slNo = 0;
        let grandTotal = 0;

        this.quotationArray.forEach((service, index) => {
            if (service.count != 0) {
                slNo++;
                const row = document.createElement('tr');
                let string = ((service.price).toString()).replace(/,/g, '');
                let priceNumber = +(string);
                let total = priceNumber * service.count;
                grandTotal += total;

                row.innerHTML = `
                    <td class="number-col">${slNo}</td>
                    <td class="text-col">${service.service}</td>
                    <td class="number-col">${service.price}</td>
                    <td class="number-col">${service.count}</td>
                    <td class="number-col">${total.toLocaleString('en-IN')}</td>
                `;
                tableBody.appendChild(row);
            }
        });

        grandTotalElement.textContent = grandTotal.toLocaleString('en-IN');
    }

    // function downloadPDF() {
    //     const { jsPDF } = window.jspdf;

    //     const doc = new jsPDF();

    //     doc.autoTable({
    //         html: '#servicesTable',
    //         startY: 10,
    //         theme: 'grid',
    //         styles: {
    //             fontSize: 10,
    //             cellPadding: 3,
    //             halign: 'center',
    //             valign: 'middle'
    //         },
    //         headStyles: {
    //             fillColor: '#eb84e5',
    //             textColor: '#000000'
    //         }
    //     });

    //     doc.save('Service Quotation.pdf');
    // }

    function downloadPDF() {
        const { jsPDF } = window.jspdf;

        const doc = new jsPDF();

        // Add header
        doc.setFontSize(18);
        doc.text('Service Quotation', 105, 15, { align: 'center' });

        doc.setLineWidth(0.5); // Set line thickness
        doc.setDrawColor(0, 0, 255); // Set line color (RGB: blue)
        // doc.setLineDash([2, 2], 0); // Set dash pattern (2 units dash, 2 units gap)
        doc.line(15, 20, 195, 20); // Draws a line from x: 15, y: 20 to x: 195, y: 20to x: 195, y: 20
        doc.setDrawColor(0, 0, 255); // Set line color (RGB: blue)

        // Add additional info
        doc.setFontSize(12);
        doc.text(`Date: ${new Date().toLocaleDateString()}`, 15, 25);
        doc.text('Customer Name: Vinoth', 15, 35);
        doc.text('Address: 123 Main St, Chennai, India', 15, 45);

        // Add table
        doc.autoTable({
            html: '#servicesTable',
            startY: 55,
            theme: 'grid',
            styles: {
                fontSize: 10,
                cellPadding: 3,
                halign: 'center',
                valign: 'middle'
            },
            headStyles: {
                fillColor: '#eb84e5',
                textColor: '#000000'
            }
        });

        // Add footer
        const pageCount = doc.internal.getNumberOfPages();
        for (let i = 1; i <= pageCount; i++) {
            doc.setPage(i);
            doc.setFontSize(10);
            doc.text(`Page ${i} of ${pageCount}`, 105, 285, { align: 'center' });
        }

        doc.save('Service Quotation.pdf');
    }

    window.downloadPDF = downloadPDF;
}

/** "Gallery" Script Section */
onGalleryInit = function () {
    var pswpElement = document.querySelectorAll('.pswp')[0];

    // Build items array with correct width and height
    const items = [];
    for (let i = 1; i < 17; i++) {
        items.push({
            src: `images/gallery (${i}).jpg`,
            w: 1200,
            h: 900
        });
    }

    // Define click event for each gallery item
    var galleryElements = document.querySelectorAll('#my-gallery a');
    galleryElements.forEach(function (el, index) {
        el.addEventListener('click', function (event) {
            event.preventDefault();

            var options = {
                index: index, // start at clicked item
                bgOpacity: 1,
                showHideOpacity: true,
                getThumbBoundsFn: function (index) {
                    // Define the thumbnail bounds
                    var thumbnail = galleryElements[index].querySelector('img'),
                        pageYScroll = window.pageYOffset || document.documentElement.scrollTop,
                        rect = thumbnail.getBoundingClientRect();

                    return { x: rect.left, y: rect.top + pageYScroll, w: rect.width };
                },
                maxSpreadZoom: 1, // Restrict zoom level to 1 to avoid stretching
                getDoubleTapZoom: function (isMouseClick, item) {
                    // Return the zoom level based on the image's original size
                    if (item.initialZoomLevel > 0.7) {
                        return 1.5; // Double tap to zoom in
                    } else {
                        return 1; // Double tap to zoom out
                    }
                }
            };

            // Initialize PhotoSwipe
            var gallery = new PhotoSwipe(pswpElement, PhotoSwipeUI_Default, items, options);
            gallery.init();
        });
    });
}