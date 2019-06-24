var todoType;

var getItemsUrl;
var createItemUrl;
var deleteItemUrl;

var checkmarkImgUrl;


function delete_todo_items(deleteId) {
  var deleteIdWrapper = {'todo_type': todoType, 'id': deleteId};
  $.ajax({ url: deleteItemUrl,
            type: 'POST',
            dataType: 'text',
            data: deleteIdWrapper,
            success: function(response, textStatus, jqXHR) {
              console.log(response);
              $('#item-notification').empty();
              $('#item-notification').append('\
              <div class="alert alert-danger"> \
                <strong>Item was deleted!</strong> \
              </div>');
              var item_notification = setInterval(function(){$('#item-notification').empty(); clearInterval(item_notification);}, 3000);
              get_todo_list_items();
            },
            error: function(jqXHR, textStatus, errorThrown){
              alert(textStatus, errorThrown);
            }
  });
}

function create_todo_item(newItemDescr) {
  var newItemWrapper = {'todo_type': todoType, 'item_descr': newItemDescr};
  $.ajax({ url: createItemUrl,
            type: 'POST',
            dataType: 'text',
            data: newItemWrapper,
            success: function(response, textStatus, jqXHR) {
              console.log(response);
              $('#item-notification').empty();
              $('#item-notification').append('\
              <div class="alert alert-success"> \
                <strong>Item was added!</strong> \
              </div>');
              var item_notification = setInterval(function(){$('#item-notification').empty(); clearInterval(item_notification);}, 3000);
              get_todo_list_items();
            },
            error: function(jqXHR, textStatus, errorThrown){
              alert(textStatus, errorThrown);
            }
  });
}


function set_deletion_handler(itemId) {
  $('#item-row-' + itemId + '-button').click(function(){
    delete_todo_items(itemId);
  });
}

function set_creation_handler() {
  $('#new-item').empty();
  $('#new-item').append('\
    <td id="new-item-text" class="content-text" style="width: 90%; text-align: center;"></td> \
    <td style="width: 10%; text-align: center;"> \
      <button id="new-item-button"> \
        + \
      </button> \
    </td>');
  $('#new-item-text')[0].setAttribute('contenteditable', 'true');
  $('#new-item-button').click(function(){
    create_todo_item($.trim($('#new-item-text').text()));
  });
  $('#new-item-text').focus();
}

function build_todo_list_table(items) {
  $('#todo-list-items-table tbody').empty();
  for (var i = 0; i < items.length; i++) {
    var item = items[i];
    $('#todo-list-items-table tbody').append('\
      <tr id="item-row-' + item['id'] + '"> \
        <td class="content-text" style="width: 90%; text-align: center;">' + item['descr'] + '</td> \
        <td style="width: 10%; text-align: center;"> \
          <button id="item-row-' + item['id'] + '-button"> \
            <span> \
              <img id="item-row-' + item['id'] + '-image" src=' + checkmarkImgUrl + ' aria-hidden="true"/> \
            </span> \
          </button> \
        </td> \
      </tr>');
    set_deletion_handler(item['id']);
  }
  $('#todo-list-items-table tbody').append('\
    <tr id="new-item"> \
      <td style="width: 100%; text-align: center;"> \
        <button id="new-item-button"> \
          + \
        </button> \
      </td> \
    </tr>');
    $('#new-item-button').click(function(){
      set_creation_handler();
    });
}


function get_todo_list_items() {
  $.ajax({ url: getItemsUrl + '?todo_type=' + todoType,
            type: 'GET',
            dataType: 'json',
            success: function(result){
              build_todo_list_table(result['items']);
            },
            error: function(){
              alert('Get Todo List Items Error...');
            }
  });
}


function getCookie(name) {
  var cookieValue = null;
  if (document.cookie && document.cookie != '') {
      var cookies = document.cookie.split(';');
      for (var i = 0; i < cookies.length; i++) {
          var cookie = $.trim(cookies[i]);
          if (cookie.substring(0, name.length + 1) == (name + '=')) {
              cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
              break;
          }
      }
  }
  return cookieValue;
}

function csrfSafeMethod(method) {
  return (/^(GET|HEAD|OPTIONS|TRACE)$/.test(method));
}


function load_todo_list_items(tempTodoType, tempGetItemsUrl, tempCreateItemUrl, tempDeleteItemUrl, tempCheckmarkImgUrl) {
  todoType = tempTodoType;

  getItemsUrl = tempGetItemsUrl;
  createItemUrl = tempCreateItemUrl;
  deleteItemUrl = tempDeleteItemUrl;

  checkmarkImgUrl = tempCheckmarkImgUrl;

  var csrftoken = getCookie('csrftoken');
  $.ajaxSetup({
      crossDomain: false,
      beforeSend: function(xhr, settings) {
          if (!csrfSafeMethod(settings.type)) {
              xhr.setRequestHeader("X-CSRFToken", csrftoken);
          }
      }
  });

  get_todo_list_items();
}
