// This module is cached as it has already been loaded
const express = require('express');
const path = require('path');
let router = express.Router();
const app = express();

app.use(express.json()); // body-parser middleware

const fridgesMod = require("./a3-fridges.js");

router.get("/", function(req, res, next) {
    console.log("In GET /");
    // console.log(req.url);
    if (req.accepts('html')) {
        res.status(200);
        res.sendFile(path.join(__dirname, 'public/index.html'));
    }
	
});

router.get("/fridges", function(req, res, next) {
    console.log("In GET /fridges");

    if(req.accepts('html')) {
        res.status(200);
		res.sendFile(path.join(__dirname, 'public/view_pickup.html'));
	}else if (req.accepts('json')){
        let fridges = fridgesMod.getFridges();
        if (fridges !== undefined) {
            console.log(fridges);
            res.status(200).set("Content-Type", "application/json").json(fridges);
        }else if(fridges === undefined) {
			res.status(404).send();
		}
		else {
			res.status(500).send();
		}
    }
});

router.get("/fridges/addFridge", function(req, res, next) {
    console.log("In GET /fridges/addFridge");

    if(req.accepts('html')) {
        res.status(200);
		res.sendFile(path.join(__dirname, 'public/addFridges.html'));
	}else{
        res.status(500).send();
    }
});

router.post("/fridges", express.json(), function(req, res, next) {
    console.log("In POST /fridges");
    console.log(req.body);
    let fridgeName = req.body.name;
    let numItemsAccepted = req.body.can_accept_items;
    let acceptedTypes = req.body.accepted_types;
    let contactPerson = req.body.contact_person;
    let contactPhone = req.body.contact_phone;
    let fridgeAddress = req.body.address;

    if (fridgeName === undefined || numItemsAccepted === undefined || acceptedTypes === undefined || contactPerson === undefined ||
        contactPhone === undefined || fridgeAddress === undefined) {
        res.status(400).send("The body is poorly formatted");
    } else {
        let result = fridgesMod.createFridge(req.body);
        if (result !== undefined) {
            res.status(200).set("Content-Type", "application/json").json(result);
        }else{
            res.status(500).send();
        }
    }

});

// router.get("/fridges/addFridge", function(req, res, next) {
//     console.log("In GET /fridges/addFridge");
//     if (req.accepts('html')) {
//         res.status(200);
//         res.sendFile(path.join(__dirname, 'public/addFridges.html'));
//     }
// });

router.get("/fridges/editFridge", function(req, res, next) {
    console.log("In GET /fridges/editFridge");
    if (req.accepts('html')) {
        res.status(200);
        res.sendFile(path.join(__dirname, 'public/editFridges.html'));
    }
});

router.get("/fridges/editFridge/:fridgeID", function(req, res, next) {
    console.log("In GET /fridges/editFridge/:fridgeID");
    if (req.accepts('html')) {
        res.status(200);
        res.sendFile(path.join(__dirname, 'public/editFridges.html'));
    } else if (req.accepts('json')) {
        let id = req.params.fridgeID;
        let fridges = fridgesMod.findFridges(id);

        if (fridges !== undefined) {
            console.log(fridges);
            res.status(200).set("Content-Type", "application/json").json(fridges);
        } else if(fridges === undefined) {
			res.status(404).send("Fridge does not exist...");
		} else {
			res.status(500).send();
		}
    }
});


router.get("/fridges/:fridgeID", function(req, res, next) {
    console.log("In GET /fridges/:fridgeID");
    if (req.accepts('html')) {
        // res.status(200);
        // res.sendFile(path.join(__dirname, 'public/addFridge.html'));
    }else if (req.accepts('json')) {
        let id = req.params.fridgeID;
        let fridges = fridgesMod.findFridges(id);

        if (fridges !== undefined) {
            console.log(fridges);
            res.status(200).set("Content-Type", "application/json").json(fridges);
        } else if(fridges === undefined) {
			res.status(404).send("Fridge does not exist...");
		} else {
			res.status(500).send();
		}
    }
});

router.get("/fridges/editFridge", function(req, res, next) {
    console.log("In GET /fridges/editFridge");
    if (req.accepts('html')) {
        res.status(200);
        res.sendFile(path.join(__dirname, 'public/editFridge.html'));
    }
});

router.put("/fridges/:fridgeID", express.json(), function(req, res, next) {
    console.log("In PUT /fridges/:fridgeID");
    console.log(req.body);
    
    let fridgeName = req.body.name;
    let numItemsAccepted = req.body.can_accept_items;
    let acceptedTypes = req.body.accepted_types;
    let contactPerson = req.body.contact_person;
    let contactPhone = req.body.contact_phone;
    let fridgeAddress = req.body.address;

    if (fridgeName === undefined || numItemsAccepted === undefined || acceptedTypes === undefined || contactPerson === undefined ||
        contactPhone === undefined || fridgeAddress === undefined) {
        res.status(400).send("The body is poorly formatted");
    } else {
        let id = req.params.fridgeID;
        let result = fridgesMod.updateFridge(id,req.body);
        if (result !== undefined) {
            res.status(200).set("Content-Type", "application/json").json(result);
        }else if (result === undefined) {
            res.status(404).send("Fridge does not exist...");
        }
        else{
            res.status(500).send();
        }
    }
});

router.post("/fridges/:fridgeID/items", express.json(), function(req, res, next) {
    console.log("In POST /fridges/:fridgeID/items");
    console.log(req.body);
    let itemID = req.body.id;
    let itemQuantity = req.body.quantity;

    if (itemID === undefined || itemQuantity === undefined) {
        res.status(400).send("The body is poorly formatted");
    } else {
        let id = req.params.fridgeID;
        let result = fridgesMod.addItem(id, req.body);
        if (result !== undefined) {
            res.status(200).set("Content-Type", "application/json").json(result);
        } else if (result === undefined) {
            res.status(404).send("Fridge or item does not exist...");
        }
        else{
            res.status(500).send();
        }
    }

});



router.delete("/fridges/:fridgeID/items", express.json(), function(req, res, next) {
    console.log("In DELETE /fridges/:fridgeID/items");

    let f_ID = req.params.fridgeID;
    let query = req.query;

    console.log(query);

    if(Object.keys(query).length === 0) {
        let result = "";
        let fridge = fridgesMod.findFridges(f_ID);

        if (fridge !== undefined) {
            let i_ID = []
            for( let i = 0; i < fridge.items.length; i++) {
                i_ID.push(fridge.items[i].id);
            }
            if (i_ID.length !== 0) {
                for (let id of i_ID) {
                    result = fridgesMod.deleteItem(f_ID, id);
                    if (result === undefined) {break;}
                }
                if (result === undefined) {
                    res.status(404).send("The fridge does not have any items...");
                }else if (result !== undefined) {
                    res.status(200).send("The items were deleted...");
                }else{
                    res.status(500).send();
                }
            }else{
                res.status(404).send("The fridge does not have any items...");
            }
        }else{
            res.status(404).send("The fridge does not exist...");
        }
    }else{
        let i_ID = Object.keys(query);
        let result = "";
        let fridge = fridgesMod.findFridges(f_ID);

        if (fridge !== undefined) {
            for (let id of i_ID) {
                result = fridgesMod.deleteItem(f_ID, id);
                if (result === undefined) {break;}
            }
            if (result === undefined) {
                res.status(404).send("The fridge does not have any items...");
            }else if (result !== undefined) {
                res.status(200).send("The items were deleted...");
            }else{
                res.status(500).send();
            }
        }else{
            res.status(404).send("The fridge does not exist...");
        }
    }
});


router.delete("/fridges/:fridgeID/:itemID", express.json(), function(req, res, next) {
    console.log("In DELETE /fridges/:fridgeID/:itemID");

    let f_ID = req.params.fridgeID;
    let i_ID = req.params.itemID;

    let result = fridgesMod.deleteItem(f_ID, i_ID);

    if (result !== undefined) {
        res.status(200).send();
    }else if (result === undefined) {
        res.status(404).send("The fridge or the item does not exist...");
    }else{
        res.status(500).send();
    }

});

module.exports = router;