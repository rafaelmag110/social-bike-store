$(()=>{
    ajaxGetBikes();
    ajaxGetPosts();
    monthDropDown();
    yearDropDown();

        function yearDropDown(){
            var years = []
            for(i = 1950; i <= 2019; i++){
                years.push(i)
            }
            $.each(years,(index,value)=>{
                $("<option />")
                .attr("value",value)
                .html(value)
                .appendTo("#yearmenu");
            });
            $("#yearmenu").change()
        }

        function monthDropDown(){
            var months = ["January","February","March","April","May","June","July","August","September","October","November","December"]
            $.each(months,(index,value)=>{
                $("<option />")
                .attr("value",value)
                .html(value)
                .appendTo("#monthmenu");
            });
            $("#monthmenu").change();
        }

        function ajaxGetBikes(){
            var temp = {};        

            $.ajax({
                type:"GET",
                url:`/posts/getBikes`,
                success: bikes => {
                    $.each(bikes, function(){
                        $("<option />")
                        .attr("value", this.make)
                        .html(this.make)
                        .appendTo("#makemenu");
                        temp[this.make] = this.models;
                    });
                
                    $("#makemenu").change(function(){
                        var value = $(this).val();
                        var menu = $("#modelmenu");
                
                        menu.empty();
                        $("<option />").attr("value","all").html("All").appendTo(menu);
                        $.each(temp[value], function(){
                            $("<option />")
                            .attr("value", this.model)
                            .html(this.model)
                            .appendTo(menu);
                        });
                    }).change();
                }
            })
        }

        function ajaxGetPosts(){
            $.ajax({
                type:"GET",
                url:`/posts/getPosts/`,
                success: posts => {
                    $.each(posts,(index,value)=>{

                        var likebtn = $("#like"+value._id)
                        var dislikebtn = $("#dislike"+value._id)
                        var opinion= $("#opinion"+value._id)

                        likebtn.click((e)=>{
                            e.preventDefault();
                            $.ajax({
                                type:"POST",
                                url:`/posts/like/`+value._id,
                                success: () => {
                                }
                            })
                            var likes = likebtn.attr("value");
                            likes++;
                            likebtn.empty();
                            likebtn.attr("value",likes).html("Like ")
                            $('<label />').html("("+ likes+")").appendTo(likebtn);
                        }).change();


                        dislikebtn.click((e)=>{
                            e.preventDefault()
                            $.ajax({
                                type:"POST",
                                url:`/posts/dislike/`+value._id,
                                success: () => {
                                }
                            })
                            var dislikes = dislikebtn.attr("value");
                            dislikes++;
                            dislikebtn.empty();
                            dislikebtn.attr("value",dislikes).html("Dislike ")
                            $('<label />').html("("+ dislikes+")").appendTo(dislikebtn);
                        }).change();

                        $( document ).ready( function() {
                            $( "#comentarios"+value._id ).click( function() {
                              $( "#comentariosContainer"+value._id ).toggle( 'slow' );
                            });
                          });

$("#addOpinion"+value._id).click((e)=>{
                            e.preventDefault();
                            var user =$("input#user"+value._id).val();
                            var username = $("input#username"+value._id).val();
                            var photo = $("input#userphoto"+value._id).val();
                            var text = $("#body"+value._id).val();
                            var link = $("<a href='/users/profileVisit/"+ user +"'/>").append($("<b style='color:black' />").html(username))
                            var texthtml = $("<p class='w3-margin-left' />").html(text)
                            var userhtml = link.appendTo($("<h6 />"))
                            var photohtml = $("<a href='/users/profileVisit/"+ user +"'/>").append($("<img class ='w3-left w3-circle w3-margin-right' src='"+photo+"' width='15' height='15' right='0' alt='Avatar' />"))
                            $.ajax({
                                type:"POST",
                                data:{
                                    user:user,
                                    text:text
                                },
                                url:`/posts/opinion/`+value._id,
                                success: () => {
                                   
                                }
                            })
                            $("#body"+value._id).val("")
                            var newpost = $("<div class='w3-container' />").append(photohtml).append(userhtml).append(texthtml)
                            var header = $("<header />").append($("<br>")).append(newpost)
                            $("#opinions"+value._id).append($("<div class='w3-card' />").append(header)).append("<br>")
                        })

                    })
                }
            })
        }
});