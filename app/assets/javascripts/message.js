$(function(){
  function buildHTML(message){
    var content = message.content ? `<p class="lower-message__content">${message.content}</p>` : "";
    var image = message.image ? `<img class="lower-message__image" src="${message.image}">` : "";

    var html = `<div class="message" data-message-id="${message.id}">
                <div class="upper-message">
                <div class="upper-message__user-name">
                ${message.user_name}
                </div>
                <div class="upper-message__date">
                ${message.date}
                </div>
                </div>
                <div class="lower-message">
                ${content}
                ${image}
                </div>
                </div>`
    return html;
  }
  $('#new_message').on('submit', function(e){
    e.preventDefault();
    var formData = new FormData(this);
    var url = $(this).attr("action");
    $.ajax({
        url: url,
        type: "POST",
        data: formData,
        dataType: 'json',
        processData: false,
        contentType: false
    })
    .done(function(data){
       var html = buildHTML(data);
       $('.ChatMain__messages').append(html);  
       $('form')[0].reset();    
       $('.ChatMain__messages').animate({ scrollTop: $('.ChatMain__messages')[0].scrollHeight});
       $('.form__submit').prop('disabled', false);
    })
    .fail(function() {
      alert("メッセージ送信に失敗しました");
    })
    return false;
  });
  var reloadMessages = function(){
    last_message_id = $('.message:last').data("message-id");
    $.ajax({
      url: "api/messages",
      type: 'get',
      dataType: 'json',
      data: {id: last_message_id}
    })
    .done(function(messages) {
      if(messages.length !== 0){
        var insertHTML = '';
        $.each(messages, function(i, message) {
          insertHTML += buildHTML(message)
          });
        $('.ChatMain__messages').append(insertHTML);
        $('.ChatMain__messages').animate({ scrollTop: $('.ChatMain__messages')[0].scrollHeight});
      }
    })
    .fail(function() {
      alert('reloadMessageError');
    }); 
  };
  if (document.location.href.match(/\/groups\/\d+\/messages/)) {
    setInterval(reloadMessages, 7000);
  }
});