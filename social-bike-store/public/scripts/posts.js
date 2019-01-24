$(()=>{
    ajaxGetBikes();
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
                        .appendTo("#firstmenu");
                        temp[this.make] = this.models;
                    });
                
                    $("#firstmenu").change(function(){
                        var value = $(this).val();
                        var menu = $("#secondmenu");
                
                        menu.empty();
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
});