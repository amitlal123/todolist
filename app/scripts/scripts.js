$(document).ready(function(){
// Hide form to add new task when page loads
  $("#newTaskForm").hide();
// Declare Global array to store latest tasks as they are added or moved
  var list = [];
  // Check local storgae to display items from the list on page load
  var listStr = localStorage.getItem("list");
  if(listStr && listStr !== "[]") {
  // Parse the JSON string from local storage to get original list array object
    list = JSON.parse(listStr);
  // Loop through each item in array and populate on page acoording to status of task items
    list.forEach(function(each) {
      if(each.status === "new") {
        $("#newList").append(
        '<a href="#finish" class="" id="item">' +
        '<li class="list-group-item">' +
        '<h3>' + each.item + '</h3>'+
        '<span class="arrow pull-right">' +
        '<i class="glyphicon glyphicon-arrow-right">' +
        '</span>' +
        '</li>' +
        '</a>');
      } else if (each.status === "inProgress") {
        $("#currentList").append(
        '<a href="#finish" class="" id="inProgress">' +
        '<li class="list-group-item">' +
        '<h3>' + each.item + '</h3>'+
        '<span class="arrow pull-right">' +
        '<i class="glyphicon glyphicon-arrow-right">' +
        '</span>' +
        '</li>' +
        '</a>');
      }else {
        $("#archivedList").append(
        '<a href="#finish" class="" id="archived">' +
        '<li class="list-group-item">' +
        '<h3>' + each.item + '</h3>'+
        '<span class="arrow pull-right">' +
        '<i class="glyphicon glyphicon-remove">' +
        '</span>' +
        '</li>' +
        '</a>');
      }
    });
  }
// Constructor function for each task item
  function Item(item) {
    this.item = item;
    this.status = "new";
  }
// Add new task item
  function addItem(item) {
      var validItem = true;
      if(!item) {
        validItem = false;
        alert("Please input task");
        $("#newItemInput").val($("#newItemInput").placeholder);
      }
      if(validItem && list.length > 0){
        for (var i = 0; i < list.length; i++) {
          if(list[i].item === item && (list[i].status === "new" || list[i].status === "inProgress")) {
            validItem = false;
            alert("You already have this task listed as " + list[i].status + " on the list");
            $("#newItemInput").val("");
            break;
          }
        }
      }
      if(validItem){
        var itemObj = new Item(item);
        list.push(itemObj);
        localStorage.setItem("list", JSON.stringify(list));
        $("#newItemInput").val("");
        $("#newList").append(
        '<a href="#finish" class="" id="item">' +
        '<li class="list-group-item">' +
        '<h3>' + itemObj.item + '</h3>'+
        '<span class="arrow pull-right">' +
        '<i class="glyphicon glyphicon-arrow-right">' +
        '</span>' +
        '</li>' +
        '</a>');
        $("#newTaskForm").slideToggle("fast", "linear");
      }
  }
// Logic to move item as it progresses through status change
  function moveItem(item) {
    var changed = item.innerText.trim();
    var statusChange = false;
    for (var i = 0; i < list.length; i++) {
      if(list[i].item === changed) {
        if (list[i].status === "new") {
          list[i].status = "inProgress";
          statusChange = true;
        } else if (list[i].status === "inProgress") {
          list[i].status = "archived";
          statusChange = true;
        } else {
          if(item.id === "archived") {
          list.splice(i, 1);
          statusChange = true;
          }
        }
      }
      if(statusChange){
        if(list.length > 0) {
        localStorage.setItem("list", JSON.stringify(list));
      } else {
        localStorage.clear();
      }
        break;
      }
    }
    item.remove();
  }

  $("#saveNewItem").on("click", function(event) {
    event.preventDefault();
    var item = $("#newItemInput").val().trim().toUpperCase();
    addItem(item);
  });

  $("#add-todo").on("click", function(){
    $("#newTaskForm").fadeToggle("fast", "linear");
  });

  $("#cancel").on("click", function(event){
    event.preventDefault();
    $("#newTaskForm").fadeToggle("fast", "linear");
  });

  $(document).on("click", "#item", function(event){
    event.preventDefault();
    var item = this;
    moveItem(item);
    this.id = "inProgress";
    $("#currentList").append(this.outerHTML);
  });

  $(document).on("click", "#inProgress", function(event){
    event.preventDefault();
    var item = this;
    moveItem(item);
    this.id = "archived";
    var changeIcon = this.outerHTML.replace("glyphicon-arrow-right", "glyphicon-remove");
    $("#archivedList").append(changeIcon);
  });

  $(document).on("click", "#archived", function(event){
    event.preventDefault();
    var item = this;
    moveItem(this);
  });


});
