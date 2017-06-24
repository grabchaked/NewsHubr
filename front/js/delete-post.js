$(document).ready(function(){
  $('.delete-post').on('click', function(e){
    $target = $(e.target);
    var id = $target.attr('data-id');
    $.ajax({
      type:'DELETE',
      url: '/post/'+id,
      success: function(response){
        window.location.href='/';
      },
      error: function(err){
        console.log(err);
      }
    });
  });
});
