var file = require("fs");
const fridgePath = "data/comm-fridge-data.json";
const itemPath = "data/comm-fridge-items.json";
var fridgesArr = [];
var itemsArr = [];

exports.initialize = function() {
    fridgesArr = readFridges();
    itemsArr = readItems();

    if (fridgesArr === undefined){
        console.log("ERROR: there was an error in reading the file: " + fridgePath);
    } else if (itemsArr === undefined){
        console.log("ERROR: there was an error in reading the file: " + itemPath);
    }
}

function readFridges() {
    if (file.existsSync(fridgePath)) {
        return JSON.parse(file.readFileSync(fridgePath));
    }
    return undefined;
}

function readItems() {
    if (file.existsSync(itemPath)) {
        return JSON.parse(file.readFileSync(itemPath));
    }
    return undefined;
}

exports.getFridges = function() {
    return fridgesArr;
}

exports.getItems = function() {
    return itemsArr;
}

exports.findFridges = function(ID) {
    console.log("Returning all the fridges with ID: " + ID);
    if (fridgesArr) {
        for (let fridge of fridgesArr) {
            if (fridge.id === ID) {
                return fridge;
            }
        }
    }
    return undefined;
}

exports.createFridge = function(data) {
    console.log("Creating a new fridge...");
    let duplicate = fridgesArr.find(
        function findDuplicateFridge(f) {
            return f.name === data.name;
        }
    );

    if (duplicate !== undefined) {
        console.log("The fridge is a duplicate...");
        return undefined;
    }else{
        let nextID = ((fridgesArr[fridgesArr.length - 1].id).match(/\d+\.\d+|\d+\b|\d+(?=\w)/g) || [] ).map(function (v) {return +v;}).pop() + 1;
        let newID = "fg-" + nextID;
        // console.log(newID);

        let newFridge = {
            "id": newID,
            "name": data.name,
            "num_items_accepted": 0,
            "can_accept_items": data.can_accept_items,
            "accepted_types": data.accepted_types,
            "contact_person": data.contact_person,
            "contact_phone": data.contact_phone,
            "address": data.address,
            "items":[]
        }
        console.log("New Fridge is created...");
        // console.log(newFridge);
        fridgesArr.push(newFridge);
        let result = writeFridge(fridgesArr);
        return newFridge;

    }
}

exports.updateFridge = function(id, data) {
    console.log("Updating a fridge...");

    let fridge = fridgesArr.find(
        function findDuplicateFridge(f) {
            return f.id === id;
        }
    );

    if (fridge === undefined) {
        console.log("The fridge cannot be found...");
        return undefined;
    }else{
        fridge.name = data.name;
        fridge.num_items_accepted = data.num_items_accepted;
        fridge.can_accept_items = data.can_accept_items;
        fridge.accepted_types = data.accepted_types;
        fridge.contact_person = data.contact_person;
        fridge.contact_phone = data.contact_phone;
        fridge.address = data.address;

        console.log("Fridge updated...");
        let result = writeFridge(fridgesArr);
        return fridge;
    }
}

exports.addItem = function(fridgeID, itemData) {
    console.log("Adding an item...");

    let fridge = fridgesArr.find(
        function findDuplicateFridge(f) {
            return f.id === fridgeID;
        }
    );
    // console.log(items);
    let item = itemsArr[itemData.id];
    if (fridge === undefined || item === undefined) {
        console.log("Either the fridge or the item cannot be found...");
        return undefined;
    }else{
        let itemDoesExist = findItemInFridge(fridgeID, itemData.id);
        if (itemDoesExist !== undefined) {
            for (let i = 0; i < fridge.items.length ; i++) {
                if (fridge.items[i].id === itemData.id) {
                    fridge.items[i].quantity += itemData.quantity;  
                }   
            }
        }else{
            fridge.items.push(itemData);
        }

        console.log("Item added...");
        let result = writeFridge(fridgesArr);
        return fridge;
    }

}

exports.deleteItem = function(fridgeID, itemID) {
    console.log("Deleting item with ID: " + itemID +" from fridge ID: " + fridgeID );

    let fridge = fridgesArr.find(
        function findDuplicateFridge(f) {
            return f.id === fridgeID;
        }
    );

    let item = itemsArr[itemID];
    let itemInFridge = findItemInFridge(fridgeID, itemID);
    
    if (fridge === undefined || item === undefined) {
        console.log("Either the fridge or the item cannot be found...");
        return undefined;
    }else if (fridge !== undefined && item !== undefined) {
        let fridgeItems = fridge.items;
        let itemIndex = fridgeItems.indexOf(itemInFridge);
        // console.log(itemInFridge);
        // console.log(itemIndex);

        if (itemIndex !== -1) {
            fridgeItems.splice(itemIndex, 1);
        }
        console.log(fridgeItems);
        fridge.items = fridgeItems;

        console.log("Item deleted...");
        let result = writeFridge(fridgesArr);
        return fridge;
    }
    return undefined;
}

// exports.deleteAllItem = function(fridgeID) {
//     console.log("Deleting all the items in fridge: " + fridgeID);
//     let fridge = fridges.find(
//         function findDuplicateFridge(f) {
//             return f.id === fridgeID;
//         }
//     );

//     let fridgeItems = fridge.items;

//     for (let item of fridgeItems) {

//     }
// }

function findItemInFridge(fridgeID, itemID) {
    for (let fridge of fridgesArr) {
        if (fridge.id === fridgeID) {
            for (let item of fridge.items) {
                if (item.id === itemID) {
                    return item;
                }
            }
        }
    }
    return undefined;
}

// function findItem(id) {
//     console.log(items[1]);
//     for (let item of items) {
//         if (item.id === id) {
//             return item;
//         }
//     }
//     return undefined;
// }

function writeFridge(fridges) {
    let filePath = "data/comm-fridge-data.json";
    let result = undefined;

    if (file.existsSync(filePath)) {
        result = file.writeFileSync(filePath, JSON.stringify(fridges));
    }
    return result;
}