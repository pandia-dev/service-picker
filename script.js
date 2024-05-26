fetch('menu.json')
    .then(response => response.json())
    .then(data => {
        debugger
        data.menuList.forEach((element) => {
            // Getting parent element
            const menuList = document.getElementById("menu-list");

            // Creation of children
            const menuCard = document.createElement('div');
            const firstRow = document.createElement('div');
            const name = document.createElement('span');
            const addButton = document.createElement('button');
            const secondRow = document.createElement('div');
            const desc = document.createElement('span');
            const price = document.createElement('small');

            // Assigning attributes to elements
            menuCard.className = "menu-card";
            firstRow.className = "item-name";
            name.className = "service-name";
            name.innerText = element.service;
            addButton.innerText = "+";
            secondRow.className = "item-detail";
            desc.className = "service-desc";
            desc.innerText = element.desc;
            price.className = "service-price";
            price.innerText = "₹" + element.price;

            // Append children
            menuList.appendChild(menuCard);
            menuCard.appendChild(firstRow);
            menuCard.appendChild(secondRow);
            firstRow.appendChild(name);
            firstRow.appendChild(addButton);
            secondRow.appendChild(desc);
            secondRow.appendChild(price);
        });
    })
    .catch(error => console.error('Error fetching JSON:', error));