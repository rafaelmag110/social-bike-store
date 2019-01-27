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

                        $("#addOpinion"+value._id).click((e)=>{
                            e.preventDefault();
                            var user =$("#user"+value._id).val();
                            var text = $("#body"+value._id).val();
                            var texthtml = $("<p />").html(text)
                            var userhtml = $("<b />").html(user).appendTo($("<p />"))

                            $.ajax({
                                type:"POST",
                                data:{
                                    // _id:user,
                                    text:text
                                },
                                url:`/posts/opinion/`+value._id,
                                success: () => {
                                    
                                },
                                error: ()=>{
                                    alert("Something went wrong. Your comment could not be saved.")
                                }
                            })
                            $("#user"+value._id).val("")
                            $("#body"+value._id).val("")
                            $("#opinions"+value._id).append(userhtml)
                            $("#opinions"+value._id).append(texthtml)
                        })

                    })
                }
            })
        }
});