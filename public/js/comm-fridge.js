var xhttp;
var fridges = null;
var tempFridge = null;
var f_id = null;
var itemsPicked = [];
// var items = null;

window.onload = function(){
	let pageId = document.getElementsByTagName("body")[0].id;
	if(pageId != null && pageId == "view_items"){

		

		let urlParams = new URLSearchParams(window.location.search);
		let catID = "";
		for (const [key, value] of urlParams) {
			catID = value;
		}

		if (catID !== "") {
			requestData("http://localhost:8000/fridges/" + catID, pageId);
		}else{
			requestData("http://localhost:8000/fridges/", pageId);
		}
	}else if (pageId != null && pageId == "add_fridges"){
		loadItemTypes();
		

		let inputs = document.querySelectorAll("input");

		for (let i = 0; i < inputs.length; i++) {
			inputs[i].addEventListener("input", checkAddFridgeInputs);
		}
	}else if (pageId != null && pageId == "edit_fridges"){
		loadItemTypes();
		// console.log(f_id);
		let urlParams = new URLSearchParams(window.location.search);

		let catID = "";
		for (const [key, value] of urlParams) {
			catID = value;
		}
		// console.log(urlParams);

		if (catID !== "") {
			requestData("http://localhost:8000/fridges/editFridge/" + catID, pageId);
		}else{
			requestData("http://localhost:8000/fridges/editFridge/", pageId);
		}
		// requestData("http://localhost:8000/fridges/", pageId);
		
		let inputs = document.querySelectorAll("input");

		for (let i = 0; i < inputs.length; i++) {
			inputs[i].addEventListener("input", checkAddFridgeInputs);
		}
	}else{
		console.log("Hello from the community fridge web application.");
		requestData("http://localhost:8000/", pageId);
	}
};

function requestData(URL, page) {
	xhttp = new XMLHttpRequest();
	let processingFunction = processData;

	if (page === "edit_fridges") {
		processingFunction = processAdd;
	}
	xhttp.onreadystatechange = processingFunction;
	xhttp.open("GET", URL, true);
	xhttp.setRequestHeader("Accept", "application/json");
	xhttp.send();
}

function processData() {
	if (xhttp.readyState === XMLHttpRequest.DONE && xhttp.status === 200) {
		let data = xhttp.responseText;
		fridges = JSON.parse(data);
		console.log(fridges);

		displayFridges();
	} else if (xhttp.status === 500) {
		console.log(xhttp.responseText);
	} else {
		console.log("The server is not done processing the request...");
	}
}

function processUpdate() {
	if (xhttp.readyState === XMLHttpRequest.DONE && xhttp.status === 200) {
		console.log("in processUpdate()");
	}
}

function processAdd() {
	if (xhttp.readyState === XMLHttpRequest.DONE && xhttp.status === 200) {
		console.log("in processAdd()");
		let data = xhttp.responseText;
		tempFridge = JSON.parse(data);

		populateEditFridgeInputs();

	}else if(xhttp.status === 500){
		console.log(xhttp.responseText);

	}else{
		console.log("The server is not done processing the request.");

	}
}

function displayFridges(pageId){
	console.log("in displayFridges()");
	let fridgesSection = document.getElementById("fridges");
	let header = document.createElement("h1");
	header.textContent = "Available fridges";
	fridgesSection.appendChild(header);

	for(let i = 0; i < fridges.length; i++){
		let temp = document.createElement("span");
		let editButton = document.createElement("a");
		let fridgeData = document.createElement("div");
		// fridgeData.id = fridges[i].id;
		temp.className = "edit_btn";
		fridgeData.id = "fridge_" + i;
		editButton.id = fridges[i].id;
		editButton.href = "http://localhost:8000/fridges/editFridge?fID=" + fridges[i].id;
		editButton.textContent = "Edit " + fridges[i].name;

		let fridgeContent = "<img src='images/fridge.svg'></span>";
		fridgeContent += "<span><strong>" + fridges[i].name + "</strong></span>";
		fridgeContent	+= "<span>" + fridges[i].address.street + "</span>";
		fridgeContent += "<span>" + fridges[i].contact_phone + "</span>";
		// fridgeContent += "<span class = \"edit_btn\"><a id = \""+fridges[i].id+"\"href = \"#\">Edit this fridge</a></span>";
		// fridgeContent += "<span class = \"edit_btn\"><a id = \""+fridges[i].id+"\">Edit this fridge</a></span>";
		// fridgeContent += "<span class = \"edit_btn\"><a id = \""+fridges[i].id+"\"href = \"http://localhost:8000/fridges/editFridge\">Edit this fridge</a></span>";

		fridgeData.innerHTML = fridgeContent;
		fridgeData.addEventListener("click", function(event){
			let fridgeID = event.currentTarget.id.split("_")[1];
			displayFridgeContents(parseInt(fridgeID));
			// populateEditFridgeInputs(parseInt(fridgeID));
		});

		temp.addEventListener("click", function(event) {
			href = event.currentTarget.href;
			if (href == "" || href == " "){
				href = event.currentTarget.children[0].href;
			}
			// console.log(f_id);
			requestData(href, "edit_fridges");
		});

		temp.appendChild(editButton);

		fridgesSection.appendChild(temp);
		fridgesSection.appendChild(fridgeData);
	}
}

function displayFridgeContents(fridgeID){
	document.getElementById("frigeHeading").innerHTML = "Items in the " + fridges[fridgeID].name;
	let bioInformation = "<span id='fridge_name'>" + fridges[fridgeID].name + "</span><br />" + fridges[fridgeID].address.street + "<br />" + fridges[fridgeID].contact_phone;

	document.getElementById("left-column").firstElementChild.innerHTML = bioInformation;
	let capacity = ((fridges[fridgeID].items.length) / (parseInt(fridges[fridgeID].can_accept_items)));
	capacity = Math.round(capacity * 100);

	document.getElementById("meter").innerHTML = "<span style='width: " + (capacity + 14.2)  + "%'>" + capacity + "%</span>";

	populateLeftMenu(fridgeID);

  let middleColumn = document.getElementById("middle-column");
  let body = document.getElementById("right-column");
	// console.log(fridgeID);

	for(let element of fridges[fridgeID].items){
		let itemID = parseInt(element.id);
		let item = items[itemID];

		let mdItem = document.createElement("div");
		mdItem.className = "item " + item.type;
		mdItem.id = "item-" + itemID;
		mdItem.innerHTML = "<img src='" + item.img + "' width='100px' height='100px'; />";

		let itemDetails = document.createElement("div");
		itemDetails.id = "item_details";
		itemDetails.innerHTML = "<p id='nm-" + itemID + "'>" + item.name + "</p><p>Quantity: <span id='qt-" + itemID + "'>" + element.quantity + "</span></p><p>Pickup item:</p>";

		let buttonsArea = document.createElement("div");
		buttonsArea.className = "pick_button";
		buttonsArea.id = "pickbtn-" + itemID;

		let increaseButton = document.createElement("button");
		increaseButton.className = "button-plus";
		increaseButton.innerHTML = "<i class='fas fa-plus'></i>";
		increaseButton.addEventListener("click", processIncrease);

		let decreaseButton = document.createElement("button");
		decreaseButton.className = "button-minus";
		decreaseButton.innerHTML = "<i class='fas fa-minus'></i>";
		decreaseButton.addEventListener("click", processDecrease);

		let amount = document.createElement("span");
		amount.className = "amount";
		amount.id = "amount-" + itemID;
		amount.textContent = "0";

		buttonsArea.appendChild(increaseButton);
		buttonsArea.appendChild(amount);
		buttonsArea.appendChild(decreaseButton);

		itemDetails.appendChild(buttonsArea);
		mdItem.appendChild(itemDetails);
		middleColumn.appendChild(mdItem);
	}
	let deleteButton = document.createElement("a");
	deleteButton.id = findFridgeIDByName(fridges[fridgeID].name);
	deleteButton.className = "button-delete";
	deleteButton.innerHTML = "Delete Selected Items";
	deleteButton.addEventListener("click", sendDelete);
	body.appendChild(deleteButton);
	document.getElementById("fridges").classList.add("hidden");
	document.getElementById("fridge_details").classList.remove("hidden");
}

function processIncrease(event) {
	// itemsPicked = [];
	let elementId = event.currentTarget.parentElement.id;
	let numID = elementId.split("-")[1];
	let amount = parseInt(document.getElementById("amount-"+numID).textContent);
	let quantity = parseInt(document.getElementById("qt-" + numID).textContent);
	let name = document.getElementById("nm-" + numID).textContent;

	let elementExists = document.getElementById("pk-item-" + numID);

	// if (!itemsPicked.includes(elementId)){
	// 	itemsPicked.push(elementId);
	// }
	

	if(amount < quantity){
		document.getElementById("amount-"+numID).innerHTML = amount + 1;

		if(elementExists == null){
			let li = document.createElement("li");
			li.setAttribute("id", "pk-item-" + numID);
			li.innerHTML = "<span>" + (amount+1) + "</span> x " + name;
			document.getElementById("items_picked").appendChild(li);
		}
		else {
			document.getElementById("pk-item-"+numID).innerHTML = "<span>" + (amount+ 1) + "</span> x " + name;
		}
	}
}
function processDecrease(event) {
	let elementId = event.currentTarget.parentElement.id;
	let numID = elementId.split("-")[1];

	let amount = parseInt(document.getElementById("amount-"+numID).textContent);
	let quantity = parseInt(document.getElementById("qt-" + numID).textContent);
	let elementExists = document.getElementById("pk-item-" + numID);
	let name = document.getElementById("nm-" + numID).textContent;

	if(amount > 0){
		document.getElementById("amount-" + numID).innerHTML = parseInt(amount) - 1;
		if(elementExists == null){
				let li = document.createElement("li");
				li.setAttribute("id", "pk-item-" + numID);
				li.innerHTML = "<span>" + parseInt(amount) - 1 + "</span> x " + name;
				document.getElementById("items_picked").appendChild(li);
		}
		else{
			if(amount == 1){
				let item = document.getElementById("pk-item-"+numID);
				console.log("item-"+numID)
				item.remove();
			}
			else{
					document.getElementById("pk-item-"+numID).innerHTML = "<span>" + (amount- 1) + "</span> x " + name;
			}
		}
	}
}

function populateLeftMenu(fridgeID){
	let categories = {};

	for(let element of fridges[fridgeID].items){
		//console.log(element);
		let itemID = parseInt(element.id);
		let item = items[itemID];

		let type = item.type;
		if(type in categories == false){
			categories[type] = 1;
		}
		else {
			categories[type]++;
		}
	}

	let leftMenu = document.getElementById("categories");
	for(const[key, value] of Object.entries(categories)){
		let label = key.charAt(0).toUpperCase() + key.slice(1);
		let listItem = document.createElement("li");
		listItem.id = key;
		listItem.className = "category";
		listItem.textContent = label + " (" + value  + ")";

		listItem.addEventListener("click", filterMiddleView);
		leftMenu.appendChild(listItem);
	}
}

function filterMiddleView(event){
	let elements = document.getElementById("middle-column").children;
	let category = event.target.id;

	for(let i = 0; i < elements.length; i++){
		let item = elements[i];
		if(!item.classList.contains(category)){
			item.classList.add("hidden");
		}
		else{
			item.classList.remove("hidden");
		}
	}
}

function loadItemTypes(){
	let b = document.getElementById("acceptedTypes");
	let content = "";
	let itemsArr = [];
	let types = [];
	let index = 1;
	let temp = true;

	while(temp) {
		if (items[index] != undefined){
			itemsArr.push(items[index]);
		}else{
			temp = false;
		}
		index++;
	}

	// itemsArr.push(items);
	// console.log(itemsArr);
	for (let i = 0; i < itemsArr.length ; i++){
		// console.log(items[i].type);
		if (!types.includes(itemsArr[i].type)){
			types.push(itemsArr[i].type);
		}
	}

	for (let type of types) {
		content += "\n<option value = \""+ type +"\">" + type + "</option>";
	}

	console.log(types);

	b.innerHTML = content;
}

function checkAddFridgeInputs(event) {
	let element = event.target;
	let numFilled = 0;

	let fridgeName = document.getElementById("fridgeName");
	let numItemsAccepted = document.getElementById("numItemsAccepted");
	let acceptedTypes = document.getElementById("acceptedTypes");
	let contactPerson = document.getElementById("contactPerson");
	let contactPhone = document.getElementById("contactPhone");
	let streetName = document.getElementById("streetName");
	let postalCode = document.getElementById("postalCode");
	let city = document.getElementById("city");
	let province = document.getElementById("province");



	let inputs = document.querySelectorAll("input");

	if (element.id == "numItemsAccepted" || element.id == "contactPhone"){
		if(isNaN(element.value)){
		  element.classList.add("error");
		  element.classList.remove("valid");
		}
		else{
		  element.classList.add("valid");
		  element.classList.remove("error");
		}
	  }

	  if (element.id == "fridgeName" || element.id == "contactPerson" || element.id == "streetName" || element.id == "city" || element.id == "province") {
		if(!isNaN(element.value)) {
			element.classList.add("error");
		  	element.classList.remove("valid");
		} else {
			element.classList.add("valid");
			element.classList.remove("error");
		}
	  }
	
	for( let i = 0; i < inputs.length; i++) {
		if(inputs[i].value.length > 0 && !inputs[i].classList.contains("error")){
			numFilled++;
		}
	}


	if(numFilled == 8) {
		document.querySelector("#submit_btn").disabled = false;
	}else{
		document.querySelector("#submit_btn").disabled = true;
	}
	let pageId = document.getElementsByTagName("body")[0].id;

	if (pageId === "add_fridges"){
		document.querySelector("#submit_btn").addEventListener("click", sendNewFridge);
	} else if (pageId === "edit_fridges"){
		document.querySelector("#submit_btn").addEventListener("click", updateFridge);

	}

}

function populateEditFridgeInputs() {
	// console.log(event.target.id);
	// console.log("test");

	console.log(tempFridge);
	
	
	let fridgeName = document.getElementById("fridgeName");
	let numItemsAccepted = document.getElementById("numItemsAccepted");
	// let acceptedTypes = document.getElementById("acceptedTypes");
	let contactPerson = document.getElementById("contactPerson");
	let contactPhone = document.getElementById("contactPhone");
	let streetName = document.getElementById("streetName");
	let postalCode = document.getElementById("postalCode");
	let city = document.getElementById("city");
	let province = document.getElementById("province");

	fridgeName.value = tempFridge.name;
	numItemsAccepted.value = tempFridge.can_accept_items;
	contactPerson.value = tempFridge.contact_person;
	contactPhone.value = tempFridge.contact_phone;
	streetName.value = tempFridge.address.street;
	postalCode.value = tempFridge.address.postal_code;
	city.value = tempFridge.address.city;
	province.value = tempFridge.address.province;

	
}

function populateTest(event) {
	let inputs = document.querySelectorAll("input");
	let temp = event.currentTarget.children;

	for(let i = 0; i < temp.length; i++){
		console.log(temp[i].textContent);
	}
}

function updateFridge(event) {
	event.preventDefault();

	let fridgeName = document.getElementById("fridgeName").value;
	let numItemsAccepted = document.getElementById("numItemsAccepted").value;
	let acceptedTypes = $('#acceptedTypes').val();
	let contactPerson = document.getElementById("contactPerson").value;
	let contactPhone = document.getElementById("contactPhone").value;
	let streetName = document.getElementById("streetName").value;
	let postalCode = document.getElementById("postalCode").value;
	let city = document.getElementById("city").value;
	let province = document.getElementById("province").value;

	let requestBody = {
		"name": fridgeName, "can_accept_items": numItemsAccepted, "accepted_types": acceptedTypes, "contact_person" :contactPerson,
		"contact_phone": contactPhone, "address": {
			"street": streetName, "postal_code": postalCode, "city": city, "province": province
		}
	}
	console.log(requestBody);

	let id = tempFridge.id;
	xhttp = new XMLHttpRequest();

	xhttp.onreadystatechange = function() {
		if (xhttp.readyState === XMLHttpRequest.DONE && xhttp.status === 200) {
			console.log("The fridge was successfully added!");
			console.log(xhttp.responseText);
		  }
		  else if(xhttp.status === 400){
			console.log(xhttp.responseText);
		  }
		  else if(xhttp.status === 404){
			console.log(xhttp.responseText);
		  }
	};

	let url = "http://localhost:8000/fridges/" + id;
	xhttp.open("PUT", url, true);
	xhttp.setRequestHeader("Content-type", "application/json");
	xhttp.setRequestHeader("Accept", "application/json");
	xhttp.send(JSON.stringify(requestBody));
	alert("The fridge has been updated");
}

function sendNewFridge(event){
	event.preventDefault();

	let fridgeName = document.getElementById("fridgeName").value;
	let numItemsAccepted = document.getElementById("numItemsAccepted").value;
	let acceptedTypes = $('#acceptedTypes').val();
	let contactPerson = document.getElementById("contactPerson").value;
	let contactPhone = document.getElementById("contactPhone").value;
	let streetName = document.getElementById("streetName").value;
	let postalCode = document.getElementById("postalCode").value;
	let city = document.getElementById("city").value;
	let province = document.getElementById("province").value;

	let requestBody = {
		"name": fridgeName, "can_accept_items": numItemsAccepted, "accepted_types": acceptedTypes, "contact_person" :contactPerson,
		"contact_phone": contactPhone, "address": {
			"street": streetName, "postal_code": postalCode, "city": city, "province": province
		}
	}
	console.log(requestBody);

	xhttp = new XMLHttpRequest();

	xhttp.onreadystatechange = function() {
		if (xhttp.readyState === XMLHttpRequest.DONE && xhttp.status === 200) {
			console.log("The fridge was successfully added!");
			console.log(xhttp.responseText);
		  }
		  else if(xhttp.status === 400){
			console.log(xhttp.responseText);
		  }
		  else if(xhttp.status === 404){
			console.log(xhttp.responseText);
		  }
	};

	let url = "http://localhost:8000/fridges";
	xhttp.open("POST", url, true);
	xhttp.setRequestHeader("Content-type", "application/json");
	xhttp.setRequestHeader("Accept", "application/json");
	xhttp.send(JSON.stringify(requestBody));
	alert("The new fridge has been added");

}

function sendDelete(event) {
	event.preventDefault();

	itemsPicked = [];

	let cart = document.getElementById("items_picked").children;

	for (let i = 0; i < cart.length; i++){
		itemsPicked.push(cart[i].id);
	}

	let itemsPickedID = []
	if (itemsPicked.length > 0){
		for (let item of itemsPicked){
			let id = (item.match(/\d+\.\d+|\d+\b|\d+(?=\w)/g) || [] ).map(function (v) {return +v;}).pop();
			itemsPickedID.push(id);
		}
	}
	let url = "http://localhost:8000/fridges/" + event.target.id +"/items/?";
	for (let item of itemsPickedID) {
		url += item + "&";
	}
	console.log(url);
	xhttp.open("DELETE", url, true);
	xhttp.setRequestHeader("Content-type","application/json");
	xhttp.send();
	alert("Items have been deleted");

}

function findFridgeIDByName(n) {
	requestData("")
	for(let i = 0;i<fridges.length;i++){
		if (fridges[i].name === n){
			return fridges[i].id;
		}
	}
	return undefined;
}

