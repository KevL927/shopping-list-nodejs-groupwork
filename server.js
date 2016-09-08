var express = require('express'),
    bodyParser = require('body-parser'),
    jsonParser = bodyParser.json();

var Storage = {
  
  add: function(name) {
    var item = {name: name, id: this.setId};
    this.items.push(item);
    this.setId += 1;
    return item;
  },
  
  update: function(targetIndex, inputID, inputObjectName) {
    if(targetIndex === -1) {
      var item = {name: inputObjectName, id: inputID};
      this.items.push(item);
      return item;
    } else {
      this.items[targetIndex].name = inputObjectName;
    }
  },
  
  delete: function(targetIndex) {
   return this.items.splice(targetIndex, 1); 
  },
  
  searchIndex: function(inputID) {
    var targetIndex = this.items.findIndex(function(item, index) {
    return item.id === inputID;
    });
  return targetIndex;
  }
  
};

var createStorage = function() {
  var storage = Object.create(Storage);
  storage.items = [];
  storage.setId = 1;
  return storage;
};

var storage = createStorage();

storage.add('Broad beans');
storage.add('Tomatoes');
storage.add('Peppers');




var app = express();
app.use(express.static('public'));

app.get('/items', function(request, response) {
    response.json(storage.items);
});

app.post('/items', jsonParser, function(request, response) {
    if (!request.body.name) {
        return response.sendStatus(400);
    }
    
    var item= storage.add(request.body.name); //add item to the shopping list obj
    response.status(201).json(item); //give status and trigger json method to add/post
});

app.delete('/items/:id', jsonParser, function(request, response) {
    
    var inputID = parseInt(request.params.id);
    
    var targetIndex = storage.searchIndex(inputID);
  	 
    if (targetIndex === -1) { 
      return response.sendStatus(404);
    }
    
    storage.delete(targetIndex);
    response.sendStatus(200);
    
});

app.put('/items/:id',jsonParser, function(request, response){
    var inputID = parseInt(request.params.id);
  
    var targetIndex = storage.searchIndex(inputID);
  
    var inputObjectName = request.body.name,
      inputObjectID = request.body.id;

    if (isNaN(inputID) || inputID !== inputObjectID || inputObjectName === null || inputObjectID === null) {
    return response.sendStatus(400);
    }
    
    storage.update(targetIndex, inputID, inputObjectName);
    response.sendStatus(200);
});
    


app.listen(process.env.PORT || 8080, process.env.IP);
