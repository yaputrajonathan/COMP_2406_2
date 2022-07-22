Name        :   Jonathan.
Student No. :   101161272

-   server.js is the server file.

-   fridges-router.js contains all the route methods.

-   a3-fridges.js contains all the custom modules.

-   addFridges.html and editFridges.html are both new html files.



comm-fridge.js contains the following functions:

    MAIN:

    -   loadItemTypes()     =   to dynamically populate the item types options in editFridges.html and addFridges.html
    -   checkAddFridgeInputs()  =   to make sure all the user-inputted values are correct in editFridges.html and addFridges.html
    -   populateEditFridgeInputs()  =   to automatically populate the input fields with the information of selected fridge
    -   updateFridge()      =   To send the PUT request along with the request body to update a fridge to the router
    -   sendNewFridge()     =   To send the POST request along with the request body to add a new fridge to the router
    -   sendDelete()        =   To send the DELETE request along with the parameters to delete items in a specific fridge
    
    HELPERS:

    -   findFridgeIDByName()  =   finds and return the fridge's ID with the same name as the parameter.


The function names in a3-fridges.js explains what the functions do.

How to run:

to start the server,

node server.js 

to start the page,

go to any browser and go to http://localhost:8000/