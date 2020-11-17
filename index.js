
var pages = [];
var countries = [];
var domains = [];
var masterPages = {};
var masterGeo = {};
var masterDomains = {};
var loopstop = false;
var editlock = false;
var animFlag = true;
global_editing_message = 0;
$(document).ready(function(){

    // ShopifyApp.Bar.initialize({
    //     icon:'https://assets.apphero.co/images/icon.png',
    //     buttons:{
    //         secondary:[{
    //             label:"Dashboard",
    //             href:"index.php"
    //         },
    //         {
    //             label:"Plans & Pricing",
    //             href:"pricing.php"
    //         },
    //         {
    //             label:"Help",
    //             message:"help_btn",
    //             href:"faq.php"
    //         }]
    //     }
    // });

    $('.file-input').change(function(e){
        var file = $(this)[0].files[0];
        var fileSize = file.size/1024;
        if (fileSize <= 100) {
            var reader = new FileReader();
            var type = file.type;
            var validTypes = ['image/gif','image/jpeg','image/png'];
            if ($.inArray(type,validTypes) > 0) {


                reader.readAsDataURL(file);
                reader.filename = file.name;
                reader.SelectorId = $(this).closest('section').attr('id');
                reader.onload = fileUpload;
            }
            else {
                $(this).closest('section').children().find('.upload-error').html('Only image uploads are supported');
            }
        }
        else {
            $(this).closest('section').children().find('.upload-error').text('The file you uploaded is too large');
        }
    });

    $('.user_closable').change(function(){
        if (this.checked) {
            $(this).closest('.section-wrapper').children().find('.bar_dismiss_style').attr('disabled',false);
        }
        else {
            $(this).closest('.section-wrapper').children().find('.bar_dismiss_style').attr('disabled',true);
        }
        var id = $(this).closest('section').attr('id');
        loopstop = true;
        update_iframe(id,false,$(".message-element[data-state='open']").index(".message-element")!= -1? $(".message-element[data-state='open']").index(".message-element"):0);
//	resumeAnimation(0,id);
    });

    $('#opacity').on('input',function(){
        $('#opacity-label').text("Opacity: " + Math.floor($(this).val() * 100) + "%");
        var id = $(this).closest("section").attr("id");
        loopstop = true;
        update_iframe(id,false,$(".message-element[data-state='open']").index(".message-element")!= -1? $(".message-element[data-state='open']").index(".message-element"):0);
        //resumeAnimation(0,id);
    });
    $('.opacity').on('input',function(){
        $(this).prev().text("Opacity: " + Math.floor($(this).val() * 100) + "%");
        var id = $(this).closest("section").attr("id");
        loopstop = true;
        update_iframe(id,false,$(".message-element[data-state='open']").index(".message-element")!= -1? $(".message-element[data-state='open']").index(".message-element"):0);
        //resumeAnimation(0,id);
    });
    $('.posSelector').on('change',function(){
        var checkBox = $(this).parent().parent().children().find('.posOnTop');
        if ($(this).val() == "bottom") {
            checkBox.prop('checked',true);
            checkBox.attr('disabled',true);
            $(".code-row").slideUp();

        }
        else if ($(this).val() == "top"){
            checkBox.attr('disabled',false);
            $(".code-row").slideUp();
        }
        else if ($(this).val() == "custom") {
            checkBox.attr('disabled',false);
            $(".code-row").slideDown();
        }
    });

    $('div[contenteditable]').keydown(function(e) {
        // trap the return key being pressed
        if (e.keyCode === 13) {
            // insert 2 br tags (if only one br tag is inserted the cursor won't go to the next line)
            document.execCommand('insertHTML', false, '<br><br>');
            // prevent the default behaviour of return key pressed
            return false;
        }
    });
    $('div[contenteditable]').on("paste", function(e) {
        // cancel paste
        //  e.preventDefault();

        // get text representation of clipboard
        var text = e.clipboardData.getData("text/plain");

        // insert text manually
        document.execCommand("insertHTML", false, text);
        return false;
    });
    $('.bar_dismiss_style').on('change',function(){
        var id = $(this).closest('section').attr('id');
        update_iframe(id,false,0);
    });

    $('#posSelector').on('change',function(){
        var checkBox = $('#posOnTop');
        if ($(this).val() == "bottom") {
            checkBox.prop('checked',true);
            checkBox.attr('disabled',true);
        }
        else {
            checkBox.attr('disabled',false);
        }
    });


    $(document).on('blur','.btnTarget, .barTarget, .slinkTarget', function() {
        if ($(this).val().indexOf('http://') == -1 && $(this).val().indexOf('https://') == -1 && $(this).val() != "") {
            $(this).val('http://' + $(this).val());
        }
    });

    if ($('input.fonts').length) {
        $('input.fonts').fontselect({
            style: 'font-select',
            placeholder: 'Select a font',
            lookahead: 2
        });
    }
    $('.nav-right').click(function() {
        var scroll = $('.slider-wrapper').scrollLeft();
        $('.slider-wrapper').animate({
            scrollLeft:scroll + 300
        });
    });
    $('.nav-left').click(function() {
        var scroll = $('.slider-wrapper').scrollLeft();
        $('.slider-wrapper').animate({
            scrollLeft:scroll - 300
        });
    });

    $(".upgrade-btn-widget").click(function() {
        window.location.href = "pricing.html";
    });

    $('#nav-right-multi').click(function() {
        var scroll = $('#slider-wrapper-multi').scrollLeft();
        $('#slider-wrapper-multi').animate({
            scrollLeft:scroll + 300
        });
    });
    $('#nav-left-multi').click(function() {
        var scroll = $('#slider-wrapper-multi').scrollLeft();
        $('#slider-wrapper-multi').animate({
            scrollLeft:scroll - 300
        });
    });

    $('#nav-right-counter').click(function() {
        var scroll = $('#slider-wrapper-counter').scrollLeft();
        $('#slider-wrapper-counter').animate({
            scrollLeft:scroll + 300
        });
    });
    $('#nav-left-counter').click(function() {
        var scroll = $('#slider-wrapper-counter').scrollLeft();
        $('#slider-wrapper-counter').animate({
            scrollLeft:scroll - 300
        });
    });

    $(".customLabelCheck").change(function() {
        if ($(this).prop("checked")) {
            $(".labelsRow").slideDown();
            update_iframe_counter($(this).closest("section").attr("id"),false);
        }
        else {
            $(".labelsRow").slideUp();
            $(".daysLabelInput").val("DAYS");
            $(".hoursLabelInput").val("HRS");
            $(".minutesLabelInput").val("MINS");
            $(".secondsLabelInput").val("SECS");
            update_iframe_counter($(this).closest("section").attr("id"),false);
        }
    });

    $(".counter-style").change(function() {
        switch ($(this).val()) {
            case "slot":
                $(".timerBgColor").parent().hide();
                $(".timerBorderColor").parent().hide();

                break;

            case "slot-background":
                $(".timerBgColor").parent().show();
                $(".timerBorderColor").parent().hide();

                break;

            case "slot-bordered":
                $(".timerBgColor").parent().hide();
                $(".timerBorderColor").parent().show();

                break;

            case "flip":
                $(".timerBgColor").parent().show();
                $(".timerBgColor").prev().html("Background Color:");
                $(".timerBorderColor").parent().hide();

                break;

            case "matrix 3x5":
                $(".timerBgColor").parent().hide();
                $(".timerBorderColor").parent().hide();

                break;
        }
    });

    $(".timing_algo_selector").change(function() {
        if ($(this).val() == "all") {
            $(this).parent().next().children(".counter-finish-selector").html("<option value='0'>Do Nothing</option>" +
                "<option value='1'>Hide Bar</option>");
        }
        else if ($(this).val() == "peruser"){
            $(this).parent().next().children(".counter-finish-selector").html("<option value='0'>Do Nothing</option>" +
                "<option value='1'>Hide Bar</option>" +
                "<option value='2'>Repeat Counter</option>");
        }
    });


    $('.clearBgImage').click(function(){
        $('.slide-card').removeClass('card-selected');
        $('.img').val("");
        var id = $(this).closest('section').attr('id');
        loopstop = true;
        update_iframe(id,false,$(".message-element[data-state='open']").index(".message-element")!= -1? $(".message-element[data-state='open']").index(".message-element"):0);
        ///resumeAnimation(0,id);
    });

    $(document).on('click','.edit-btn', function(){

        var elements = $(this).parents().find(".bar-settings").children().find(".barText");
        elements.each(function(i) {
            elements.eq(i).html(elements.eq(i).text().replace("<money>","&lt;money&gt;").replace("</money>","&lt;/money&gt;"));
        });


        $('.createBtn').fadeOut();
        $('.plan-section').fadeOut();
        $('.alert').hide();
        var selector = ".edit";
        if ($(this).closest("section").data("type") == "multi") {
            selector = ".edit-multi";
        }
        else if ($(this).closest("section").data("type") == "counter") {
            selector = ".edit-counter";
        }
        var indexNow = $(this).index(".edit-btn");
        var id = $(this).closest('section').attr('id');
        $(".bar-settings:not(#" + id + ")").remove();
        $(this).closest('section').children(selector).slideDown("slow",function(){
            //var id = $(this).closest('section').attr('id');
            $('.preview-section').fadeIn();

            syncHeights($(this).closest('section'));
            update_iframe(id,false,0);
            if ($("#" + id).children().find(".message-element").length > 1) {
                resumeAnimation(0,id);

            }

        });

        $('.main-card').slideUp();
    });

    $(document).on('click','.btn-cancel', function(){

        $(this).html('<span class="Polaris-Button__Spinner" style="position:relative; left:5; top:0"><svg style="fill:#ccc !important;" viewBox="0 0 20 20" class="Polaris-Spinner Polaris-Spinner--colorInkLightest Polaris-Spinner--sizeSmall" aria-label="Loading" role="status">' +
            '<path style="fill:#ccc !important;" class="Polaris-Spinner--colorInkLightest" d="M7.229 1.173a9.25 9.25 0 1 0 11.655 11.412 1.25 1.25 0 1 0-2.4-.698 6.75 6.75 0 1 1-8.506-8.329 1.25 1.25 0 1 0-.75-2.385z"></path></svg></span>');
        window.location.href="settings";
        $('.preview-section').slideUp('slow');
        $('.createBtn').show();
        $('.main-card').slideDown();
        $(this).closest('section').css('margin-top','inherit');
        if ($(this).closest("section").data("type") == "single") {
            $(this).closest('section').children('.edit').slideUp("slow", function(){

            });
        }
        else {
            $(this).closest('section').children('.edit-multi').slideUp("slow");
        }
        $('.main-card').fadeIn();

    });


    $(document).on('click', '#btn-cancel', function() {
        $('.preview-section').hide();
        $(this).closest('section').css('margin-top','inherit');
        $('#new_bar').hide();
        if (!$('.bar-settings').length) {
            $('body').append('<div class="zero-state full-width">'+
                '<article>' +
                '<h1>Create Your First Bar</h1>' +
                '<p>Looks like you haven\'t created any bars yet. Create your first one now!</p>' +
                '<button class="createBtnEmpty">+ Create New Bar</button>' +
                '</article>' +
                '</div>');
        }
        $(this).html('<span class="Polaris-Button__Spinner" style="position:relative; left:5; top:0"><svg style="fill:#ccc; !important;" viewBox="0 0 20 20" class="Polaris-Spinner Polaris-Spinner--colorInkLightest Polaris-Spinner--sizeSmall" aria-label="Loading" role="status">' +
            '<path style="fill:#ccc; !important;" class="Polaris-Spinner--colorInkLightest" d="M7.229 1.173a9.25 9.25 0 1 0 11.655 11.412 1.25 1.25 0 1 0-2.4-.698 6.75 6.75 0 1 1-8.506-8.329 1.25 1.25 0 1 0-.75-2.385z"></path></svg></span>');
        window.location.href="settings";
    });

    $(document).on('click','.modal-upgrade', function(){
        $(this).html('<span class="Polaris-Button__Spinner" style="position:relative; left:0; top:0"><svg style="fill:#fff !important;" viewBox="0 0 20 20" class="Polaris-Spinner Polaris-Spinner--colorInkLightest Polaris-Spinner--sizeSmall" aria-label="Loading" role="status">' +
            '<path style="fill:#fff !important;" class="Polaris-Spinner--colorInkLightest" d="M7.229 1.173a9.25 9.25 0 1 0 11.655 11.412 1.25 1.25 0 1 0-2.4-.698 6.75 6.75 0 1 1-8.506-8.329 1.25 1.25 0 1 0-.75-2.385z"></path></svg></span>');
        window.location.href="pricing.html";
    });

    $('.dismiss_promotion').click(function(){
        $('.promotion-section').fadeOut();
    });

    $('.device_radio').click(function(e){
        var radio_id = $(this).closest('section').attr('id');
        if ($(this).closest('.targeting-grid').data('plan') != 'PRO') {
            $('input[name=device_target-' + radio_id + ']').first().prop('checked', true);

            $('#ex1').mod({
                showClose:true,
                closeClass:"modal-close"
            });

        }
    });

    $(document).on('change','.call_to_action_selector', function(){

        var id = $(this).closest("section").attr("id");
        switch (Number($(this).val())) {
            case 1:

                $(this).parents(".section-container").children().find('.coupon_prefs').hide();
                $(this).parents(".section-container").children().find('.button_prefs').hide();
                $(this).parents(".section-container").children().find('.slink_prefs').hide();
                $(this).parents(".section-container").children().find('.clickable_bar_prefs').show();
                break;
            case 2:
                $(this).parents(".section-container").children().find('.clickable_bar_prefs').hide();
                $(this).parents(".section-container").children().find('.coupon_prefs').hide();
                $(this).parents(".section-container").children().find('.slink_prefs').hide();
                $(this).parents(".section-container").children().find('.button_prefs').show();
                break;

            case 3:
                $(this).parents(".section-container").children().find('.clickable_bar_prefs').hide();
                $(this).parents(".section-container").children().find('.button_prefs').hide();
                $(this).parents(".section-container").children().find('.coupon_prefs').hide();
                $(this).parents(".section-container").children().find('.slink_prefs').show();
                break;

            case 4:
                $(this).parents(".section-container").children().find('.clickable_bar_prefs').hide();
                $(this).parents(".section-container").children().find('.button_prefs').hide();
                $(this).parents(".section-container").children().find('.slink_prefs').hide();
                $(this).parents(".section-container").children().find('.coupon_prefs').show();
                break;

            default:
                $(this).parents(".section-container").children().find('.clickable_bar_prefs').hide();
                $(this).parents(".section-container").children().find('.button_prefs').hide();
                $(this).parents(".section-container").children().find('.coupon_prefs').hide();
                $(this).parents(".section-container").children().find('.slink_prefs').hide();
                break;
        }

        update_iframe(id,false,$(this).closest(".message-element").index(".message-element"));
    });

    $(document).on('change', '.page-target', function(e) {
        if ($(this).closest('.targeting-grid').data('plan') != 'PRO') {
            $(this).val('all');

            $('#ex1').mod({
                showClose:true,
                closeClass:"modal-close"
            });
        }
        else {
            var id = $(this).closest('section').attr('id');
            if ($(this).val() == "custom") {
                $('#customPageRow' + id).show();
            }
            else {
                $('#customPageRow' + id).hide();
            }
        }
    });


    $(document).on('change','.domain-target', function(e) {

        if ($(this).closest('.targeting-grid').data('plan') != 'PRO') {
            $(this).val('all');

            $('#ex1').mod({
                showClose:true,
                closeClass:"modal-close"
            });
        }
        else {

            var id = $(this).closest('section').attr('id');
            if ($(this).val() == "specific") {
                $('#subDomainRow' + id).show();
            }
            else {
                $('#subDomainRow' + id).hide();
            }
        }
    });

    $('.user_source').change(function() {
        if ($(this).closest('.targeting-grid').data('plan') != 'PRO') {
            $(this).val('disabled');

            $('#ex1').mod({
                showClose:true,
                closeClass:"modal-close"
            });
        }
        else {
            if ($(this).val() == "utm") {
                $('.utm_row').show();
                $('.source_url_row').hide();
            }
            else if ($(this).val() == "custom"){
                $('.source_url_row').show();
                $('.utm_row').hide();
            }

            else {
                $('.source_url_row').hide();
                $('.utm_row').hide();
            }
        }
    });


    $(document).on('click','.pause-btn',function(){

        var e = $(this).closest('section');
        var id = $(this).closest('section').attr('id');
        $('#' + id).children().find('.pause-btn').remove();
        $('#' + id).children().find('.control-btns').prepend(
            '<button type="button" class="pause-btn Polaris-Button Polaris-Button--disabled Polaris-Button--loading" disabled="" role="alert" aria-busy="true"><span class="Polaris-Button__Content">' +
            '<span class="Polaris-Button__Spinner"><svg viewBox="0 0 20 20" class="Polaris-Spinner Polaris-Spinner--colorInkLightest Polaris-Spinner--sizeSmall" aria-label="Loading" role="status">' +
            '<path class="Polaris-Spinner--colorInkLightest" d="M7.229 1.173a9.25 9.25 0 1 0 11.655 11.412 1.25 1.25 0 1 0-2.4-.698 6.75 6.75 0 1 1-8.506-8.329 1.25 1.25 0 1 0-.75-2.385z"></path></svg></span><span></span></span></button>'
        );

        $.ajax({
            type:"POST",
            url:"statu",
            data:{
                bar_id:id,
                bar_statu:"desactivate",
            },
            success:function(result) {
                $('.preview-section').slideUp('slow');
                e.css('margin-top','inherit');
                e.children('.edit').slideUp("slow");
                $('.createBtn').show();
                let json = result.status
                if (json == "success") {
                    $('.preview-section').after('<div class="alert"><dl><a class="close" href="#"></a>'+
                        '<dt>Paused</dt>' +
                        '<dd>Your bar is paused now</dd>' +
                        '</dl></div>');
                    $('body').animate({
                        scrollTop:0
                    },500);
                    setTimeout(function(){
                        update_page();
                    },1000);
                }
                else {
                    if (json == "unauthorized") {
                        $('.preview-section').after('<div class="alert error"><dl><a class="close" href="#"></a>'+
                            '<dt>Unauthorized</dt>' +
                            '<dd>It\'s either you have been logged out, or you don\'t have enought permissions to make these changes</dd>' +
                            '<dd><a href="install.html?shop=' + json.shop + '">Login again</a></dd>' +
                            '</dl></div>');
                    }
                    else {
                        $('.preview-section').after('<div class="alert error"><dl><a class="close" href="#"></a>'+
                            '<dt>Oops!</dt>' +
                            '<dd>Something went wrong. Please refresh this page and try again.</dd>' +
                            '</dl></div>');
                    }
                }
            }
        });
    });

    $(document).on('click','.play-btn',function(){

        var e = $(this).closest('section');
        var id = e.attr('id');
        $('#' + id).children().find('.play-btn').remove();
        $('#' + id).children().find('.control-btns').prepend(
            '<button type="button" class="play-btn Polaris-Button Polaris-Button--disabled Polaris-Button--loading" disabled="" role="alert" aria-busy="true"><span class="Polaris-Button__Content">' +
            '<span class="Polaris-Button__Spinner"><svg viewBox="0 0 20 20" class="Polaris-Spinner Polaris-Spinner--colorInkLightest Polaris-Spinner--sizeSmall" aria-label="Loading" role="status">' +
            '<path class="Polaris-Spinner--colorInkLightest" d="M7.229 1.173a9.25 9.25 0 1 0 11.655 11.412 1.25 1.25 0 1 0-2.4-.698 6.75 6.75 0 1 1-8.506-8.329 1.25 1.25 0 1 0-.75-2.385z"></path></svg></span><span></span></span></button>'
        );
        $.ajax({
            type:"POST",
            url:"statu",
            data:{
                bar_id:id,
                bar_statu:"activate"
            },
            success:function(response) {

                $('.preview-section').slideUp('slow');
                e.css('margin-top','inherit');
                e.children('.edit').slideUp("slow");
                $('.createBtn').show();
                let json = response.status
                if (json == "success") {

                    $('.preview-section').after('<div class="alert success"><dl><a class="close" href="#"></a>'+
                        '<dt>Activated</dt>' +
                        '<dd>Your bar has been activated!</dd>' +
                        '</dl></div>');
                    $('body').animate({
                        scrollTop:0
                    },500);
                    setTimeout(function(){
                        update_page();
                    },500);
                }
                else {
                    if (json.reason == "unauthorized") {
                        $('.preview-section').after('<div class="alert error"><dl><a class="close" href="#"></a>'+
                            '<dt>Unauthorized</dt>' +
                            '<dd>It\'s either you have been logged out, or you don\'t have enought permissions to make these changes</dd>' +
                            '<dd><a href="install.html?shop=' + json.shop + '">Login again</a></dd>' +
                            '</dl></div>');
                    }
                    else {
                        $('.preview-section').after('<div class="alert error"><dl><a class="close" href="#"></a>'+
                            '<dt>Oops!</dt>' +
                            '<dd>Something went wrong. Please refresh this page and try again.</dd>' +
                            '</dl></div>');
                    }
                }
            }
        })
    });

    $(document).on('click','.createBtn, .createBtnEmpty',function(){

//$('#new_bar').css('display','block');
        $('.zero-state').remove();
//$('.preview-section').show();
        $('#new_bar').css('margin-top',$('.preview-section').height());
        window.location.href = 'barType';

    });

    $(".example-link-anchor").on("click",function(e) {
        e.stopImmediatePropagation();
    });




//multi message handlers
    $(document).on('click', '.new_messsage', function(){
        $(".message-element[data-state='open']").children().find(".text-highlight").show();
        $(".message-element[data-state='open']").children().find(".section-container").slideUp();
        $(".message-element[data-state='open']").attr("data-state","closed");
        $(".message-element").children().find(".fas").removeClass("fa-chevron-up").addClass("fa-chevron-down");
        $(".message-element:last").children().find(".fas").removeClass("fa-chevron-up").addClass("fa-chevron-down");

        $('.message-element:first').clone().insertAfter('.message-element:last');
        $('.message-element:last').children().find(".section-container").show();
        $('.message-element:last').attr("data-state","open");
        $(".message-element:last").children().find(".text-highlight").hide();
        $(".message-element:last").children().find(".fas").removeClass("fa-chevron-down").addClass("fa-chevron-up");
        $('.message-element:last').children().find(".icon").removeClass("icon").addClass("icon" + $('.message-element').length);
        $('.message-element:last').children().find(".font-select").remove();
        $('.message-element:last').children().find("input.fonts").val("Helvetica");
        $('.message-element:last').children().find("input.fonts").fontselect();
        $('.message-element:last').children().find(".barText").html("Your Message Goes Here");
        $(".icon-selector").iconSelector({input: '.icon' + $('.message-element').length });
        $('.message-element:last').children().find('.clickable_bar_prefs').hide();
        //$('.message-element:last').children().find('.button_prefs').hide();
        $('.message-element:last').children().find('.coupon_prefs').hide();
        $('.message-element:last').children().find('.slink_prefs').hide();
        $(".message-element:last").children("h4").html("Message " + $('.message-element').length);
        $(".message-element:last").children().find(".textColor").val("e6e6e6");
        $(".message-element:last").children().find(".icon-close-circle").hide();
        $(".message-element:last").children().find(".icon-selector").show();
        $(".message-element:last").children().find(".icon-preview-holder").removeClass();
        $(".message-element:last").children().find(".icon-placeholder").val("");
        $(".message-element:last").children().find(".btnColor").val("ebc73a");
        $(".message-element:last").children().find(".btnTextColor").val("000000");
        $(".message-element:last").children().find(".iconColor").val("FFFFFF");
        $(".message-element:last").children().find(".text-highlight").html("Your Message Goes Here");
        $(".message-element:last").children().find(".call_to_action_selector").val(2);
        $(".message-element:last").children().find(".font-size").val(16);
        $(".message-element:last").children().find(".btnTarget").val("");
        $(".message-element:last").children().find(".slinkTarget").val("");
        $(".message-element:last").children().find(".barTarget").val("");
        $(".message-element[data-state='open']").children().find(".section-container").css("overflow","visible");
        $(window).scrollTop($(".message-element").eq($(".message-element").length - 2).offset().top);

        jscolor.installByClassName("jscolor");

        var id = $(this).closest("section").attr("id");
        loopstop = true;
        update_iframe(id,false,$(".message-element:last").index());
        //loop_messages(0,id);
        if ($(".message-element").length > 1) {
            $(".message-element").children().find(".remove-message-element").show();
        }

    });

    $(document).on('click','.remove-message-element', function() {
        if ($(".message-element").length > 1) {
            var index = $(this).closest(".message-element").index(".message-element");
            let id = $(this).closest("section").attr("id");

            $("#elementId").val(id);
            $("#elementIndex").val(index);

            $('#messageElement_modal').mod({
                showClose:true,
                closeClass:"modal-close"
            });

        }
//update_iframe(id,false);

    });

    $(document).on('click','.highlight-edit',function() {
        var messageElement = $(this).closest(".message-element");
        let id = $(this).closest("section").attr("id");
        if (messageElement.attr('data-state') == "closed") {
            loopstop = true;
            update_iframe(id,false,messageElement.index());
            $(".message-element").children().find(".section-container").slideUp();
            $(".message-element").children().find(".fas").removeClass("fa-chevron-up").addClass("fa-chevron-down");
            $(".message-element").children().find(".text-highlight").show();
            $(".message-element").attr('data-state','closed');

            messageElement.children().find(".text-highlight").hide();
            messageElement.children().find(".section-container").slideDown();

            messageElement.attr('data-state','open');
            $(this).children(".fas").removeClass("fa-chevron-down").addClass("fa-chevron-up");

        }
        else if (messageElement.attr('data-state') == "open") {
            messageElement.children().find(".section-container").slideUp();
            messageElement.children().find(".text-highlight").show();
            messageElement.attr('data-state','closed');
            $(this).children(".fas").removeClass("fa-chevron-up").addClass("fa-chevron-down");
            if ($(".message-element[data-state='open']").length == 0) {
                loopstop = true;
                update_iframe(id,false,0,true);
                resumeAnimation(0,id);
            }
        }



    });



    $(document).on('click','.close',function(e){
//	e.preventDefault();
        $(this).closest('.alert').fadeOut("slow");
        $(this).css('margin-top','12%');
    });

    if ($(".icon-selector").length) {
        $(".icon-selector").iconSelector({input: '.icon' + $('.message-element').length});
    }


    $(document).on('icon:inserted','.icon-placeholder',function(e){
        $(this).closest('.row').children('.icon-selector').eq(0).hide();
        $(this).closest('.row').children('.remove-icon').eq(0).show();


        $(this).closest('.row').children('i').eq(0).addClass($(this).val());
        $(this).closest('.row').children('i').eq(0).text('');
        var id = $(this).closest('section').attr('id');
        loopstop = true;
        update_iframe(id,false,$(this).parents(".message-element").index());
//	resumeAnimation($(this).index(".icon-placeholder"),id);
    });

    $(document).on('click','.remove-icon', function(e) {
        $(this).closest('.row').children('.icon-placeholder').eq(0).val('');
        $(this).prev().removeAttr('class');
        $(this).closest('.row').children(".icon-selector").eq(0).show();
        var id = $(this).closest('section').attr('id');
        loopstop = true;
        update_iframe(id,false,$(e.target).parents(".message-element").index());

//	resumeAnimation($(this).index(".icon-placeholder"),id);
        $(this).hide();
    });

    $(document).on('keyup paste change','input',function() {
        var id = $(this).closest('section').attr('id');
        if ($(this).closest(".message-element").length != 0 || $("#" + id).data("type") == "single") {
            loopstop = true;
            update_iframe(id,false,$(".message-element[data-state='open']").index());

        }

    });


    $(document).on('keydown','.barText',function(e){
        var keycode = e.charCode || e.keyCode;
        if (keycode  == 13) { //Enter key's keycode
            return false;
        }
    });

    $(document).on('keyup','.barText',function(e){
        var id = $(this).closest('section').attr('id');

        update_iframe(id,false,$(this).closest(".message-element").index());
        syncHeights($(this).closest('section'));
        $(this).parents(".message-element").children().find(".text-highlight").html($(this).html().replace("&lt;money&gt;","").replace("<money>","").replace("&lt;/money&gt;","").replace("</money>",""));
        var regex = /<a[\s]+([^>]+)>((?:.(?!\<\/a\>))*.)<\/a>/g;
        var match = regex.exec($(this).html());
        if (match != null) {
            $(this).html($(this).html().replace(match[0],match[2]));
        }


    });


    $(document).on('change', 'select', function() {
        var id = $(this).closest('section').attr('id');
//	if (!($(this).attr('class') == 'page-target' || $(this).attr('class') == 'user_source')) {
//	update_iframe(id,false,$(this).closest(".message-element"));
//}
        if ($(this).closest(".message-element").length != 0 || $("#" + id).data("type") == "single") {
            loopstop = true;
            update_iframe(id,false,$(this).closest(".message-element").index());
//resumeAnimation($(this).closest(".message-element").index(".message-element"),id);
        }
    });

//$(document).on('focus blur','select', focusHandler);

    $(document).on('focus','.jscolor',function(){
        $(this).removeClass('colorShapes');


    });

    $(document).on('blur','.jscolor',function(){
        $(this).addClass('colorShapes');

    });

    $(document).on('change','.bgColor',function() {
        var id = $(this).closest('section').attr('id');
        loopstop = true;
        update_iframe(id,false,$(".message-element[data-state='open']").index()!= -1? $(".message-element[data-state='open']").index(".message-element"):0);

        resumeAnimation(0,id);
    });

    $('.hasIcon').on('change',function(){
        if ($(this).is(':checked')) {
            $(this).closest('.card-section').children('.side-elements').css('opacity',1);
            $(this).closest('.card-section').children().find('.disabler').remove();
            $(this).closest('.section-container').children().find('.side-elements').css('opacity',1);
            $(this).closest('.section-container').children().find('.disabler').remove();

        }
        else {
            $(this).closest('.card-section').children('.side-elements').css('opacity',0.3);
            $(this).closest('.card-section').children('.side-elements').append('<div class="disabler" style="position: absolute;left:0;width: 100%;height:10%;z-index:2;opacity:0.4;filter: alpha(opacity = 50)"></div>');
            $(this).closest('.section-container').children().find('.side-elements').css('opacity',0.3);
            $(this).closest('.section-container').children().find('.side-elements').append('<div class="disabler" style="position: absolute;left:0;width: 100%;height:10%;z-index:2;opacity:0.4;filter: alpha(opacity = 50)"></div>');
        }
    });




    $('.targeting-grid').click(function(){
        if ($(this).data('prem') == '0') {
            $('.preview-section').hide();
            $('#ex1').mod({
                showClose:true,
                closeClass:"modal-close"
            });
        }
    });

    $('#ex1').on($.mod.CLOSE, function(event, mod) {
        $('.preview-section').show();

    });

    $(document).on($.mod.CLOSE, '#rate_modal', function(event, mod) {
        sessionStorage["rate"] = 0;
        location.reload();
    });

    $('#name_modal').on($.mod.CLOSE, function(event, mod) {
        $('.preview-section').show();
    });

    $(document).on('click','.add_review', function(){

        $('.rate_mod-title').remove();
        $('.rate_modal-report').remove();
        $('#rate_modal').prepend('<div class="rate_icon"</div>');
        $('#rate_modal').prepend('<h1 class="rate_mod-title">Review Us</h1>');
        $('.rate_modal-review').text('Review Now!').css('width','100%').removeClass('add_review').addClass('review_redirect');
        $('.rate_mod-body').text('Would you mind taking a moment to review us on Shopify\'s App Store? Each review helps us tremendously!Ã¢â‚¬Â¨');
    });

    $('.rate_modal-report').click(function(){
        sessionStorage["rate"] = 0;
        window.top.location.href = "mailto:contact@apphero.co?subject=Problem Report";
        window.location.href="settings";
    });

    $(document).on('click','.review_redirect', function(){
        localStorage["never_rate"] = 1;
        window.top.location.href = "https://apps.shopify.com/announcement-bar-maker-by-apphero?reveal_new_review=true";
    });

    $(document).on('click', '.bold-btn', function(){
        document.execCommand('bold',false,null);
        var id = $(this).closest('section').attr('id');
        loopstop = true;
        update_iframe(id,false, $(this).closest(".message-element").index());
        resumeAnimation($(this).closest(".message-element").index(),id);
    });

    $(document).on('click','.italic-btn', function(){
        document.execCommand('italic');
        var id = $(this).closest('section').attr('id');
        loopstop = true;
        update_iframe(id,false, $(this).closest(".message-element").index());
        //resumeAnimation($(this).closest(".message-element").index(".message-element"),id);

    });

    $('.slide-card').click(function() {
        var id = $(this).closest('section').attr('id');
//  $(this).toggleClass('slide-selected').siblings().removeClass('slide-selected');
        $(this).toggleClass('card-selected').siblings().removeClass('card-selected');
        $('#'+id).children().find('.img').val('https://assets.apphero.co/images/templates/' + $(this).data('name'));
        loopstop = true;
        update_iframe(id,false,$(".message-element[data-state='open']").index(".message-element")!= -1? $(".message-element[data-state='open']").index(".message-element"):0);
        //resumeAnimation(0,id);
    });


//$(document).on('focus blur','input', focusHandler);

    $('input[name^=cta_type]').on('change',function(){
        var index=0;
        if ($(this).prop('checked')) {
            index = $(this).val();
        }

        if (index == 1) {
            $('.coupon_prefs').hide();
            $('.button_prefs').hide();
            $('.slink_prefs').hide();
            $('.clickable_bar_prefs').show();
        }
        else if (index == 2) {
            $('.clickable_bar_prefs').hide();
            $('.coupon_prefs').hide();
            $('.slink_prefs').hide();
            $('.button_prefs').show();
        }
        else if (index == 3) {
            $('.clickable_bar_prefs').hide();
            $('.button_prefs').hide();
            $('.coupon_prefs').hide();
            $('.slink_prefs').show();
        }
        else if (index == 4) {
            $('.clickable_bar_prefs').hide();
            $('.button_prefs').hide();
            $('.slink_prefs').hide();
            $('.coupon_prefs').show();
        }
        else {
            $('.clickable_bar_prefs').hide();
            $('.button_prefs').hide();
            $('.coupon_prefs').hide();
            $('.slink_prefs').hide();
        }
        $(this).closest('.card').css('height','');
        syncHeights($(this).closest('section'));
        var id = $(this).closest('section').attr('id');

        update_iframe(id,true,$(this).closest(".message-element").index(".message-element"));

    });

    $(document).on('click','.messageElement-mod_confirm', function(){
        var id = $("#elementId").val();
        var index = $("#elementIndex").val();
        $.mod.close();
        $(".message-element").eq(index).fadeOut(function() {
            $(".message-element").eq(index).remove();
            $(".aph_bar_holder").eq(index).remove();
            //	$(".aph_bar_holder").css("top","0").show();
            loopstop = true;
            if ($(".message-element[data-state='open']").length == 0) {
                update_iframe(id,false,0,true);
                resumeAnimation(0,id);
            }
            if ($(".message-element").length == 1) {
                $(".message-element:first").children().find(".remove-message-element").hide();
            }
            $(".message-element").each(function(i,object) {
                $(this).children("h4").html("Message " + (i+1));
            });
        });
    });


    $(document).on('click','.delete-mod_confirm', function() {
        var id = $("#removeId").val();
        $('#' + id).children().find('.btn-del').remove();
        $('#' + id).children().find('.control-btns').append(
            '<button type="button" class="btn-del Polaris-Button Polaris-Button--disabled Polaris-Button--loading" disabled="" role="alert" aria-busy="true"><span class="Polaris-Button__Content">' +
            '<span class="Polaris-Button__Spinner"><svg viewBox="0 0 20 20" class="Polaris-Spinner Polaris-Spinner--colorInkLightest Polaris-Spinner--sizeSmall" aria-label="Loading" role="status">' +
            '<path class="Polaris-Spinner--colorInkLightest" d="M7.229 1.173a9.25 9.25 0 1 0 11.655 11.412 1.25 1.25 0 1 0-2.4-.698 6.75 6.75 0 1 1-8.506-8.329 1.25 1.25 0 1 0-.75-2.385z"></path></svg></span><span></span></span></button>'
        );
        $.mod.close();
        deleteBar(id);
    });
    $(document).on('click', '.name-mod_confirm', function(){

        if ($("#new_bar").data("type") == "single") {
            createSingleBar();
        }
        else if ($("#new_bar").data("type") == "counter") {
            createCounterBar();
        }
        else if ($("#new_bar").data("type") == "multi") {
            createMultiBar();
        }
    });


    $(document).on('click', '#saveBtn', function(){
        saveId = $(this).closest('section').attr('id');
        console.log(saveId);
        $('#name_modal').mod({
            showClose:true,
            closeClass:'name-mod_close'
        });

    });

    $(document).on('click','.btn-save', function(){
        if ($(this).closest("section").data('type') == "multi") {
            modifyBarMulti($(this).closest('.edit-multi'));
        }
        else if ($(this).closest("section").data("type") == "single"){
            modifyBar($(this).closest('section'));
        }
        else if ($(this).closest("section").data("type") == "counter") {
            modifyBarCounter($(this).closest('.edit-counter'));
        }
    });

    $(document).on('click','.btn-del',function(){
        var id = $(this).closest('section').attr('id');
        $('#delete_modal').mod({
            showClose:true,
            closeClass:"modal-close"
        });
        $("#removeId").val(id);
    });



});


function modifyBar(e) {
    $('.btn-save').remove();
    $('.btns-container').prepend(
        '<button type="button" class="btn-save Polaris-Button Polaris-Button--primary Polaris-Button--disabled Polaris-Button--loading" disabled="" role="alert" aria-busy="true"><span class="Polaris-Button__Content">' +
        '<span class="Polaris-Button__Spinner"><svg viewBox="0 0 20 20" class="Polaris-Spinner Polaris-Spinner--colorWhite Polaris-Spinner--sizeSmall" aria-label="Loading" role="status">' +
        '<path class="Polaris-Spinner--colorWhite" d="M7.229 1.173a9.25 9.25 0 1 0 11.655 11.412 1.25 1.25 0 1 0-2.4-.698 6.75 6.75 0 1 1-8.506-8.329 1.25 1.25 0 1 0-.75-2.385z"></path></svg></span><span>Save</span></span></button>'
    );

    var id = e.attr('id');
    var title = e.children().find('.barName').val();
    var description = e.children().find('.barText').html().replace("<br>","").replace("&lt;money&gt;","<span class='money'>").replace("<money>","<span class='money'>").replace("&lt;/money&gt;","</span>").replace("</money>","</span>").replace(/&nbsp;/gi, ' ');
    var bgColor = e.children().find('.bgColor').val();
    var textColor = e.children().find('.textColor').val();
    var btnColor = "";
    var btnTextColor = "";
    var name = "";
    var btn_style = "";
    var btnText = "";
    var btnTarget = "";
    //btnTarget = check_url(btnTarget);
    var position = e.children().find('.posSelector').val();
    var font = e.children().find('.fonts').val();
    var posOnTop = e.children().find('.posOnTop').prop('checked');
    var opacity = e.children().find('.opacity').val();
    var icon = e.children().find('.icon-placeholder').val();
    var pageTarget = e.children().find('.page-target').val();
    var domainTarget = e.children().find('.domain-target').val();
    var domainTargetOptions = JSON.stringify(masterDomains[id]);
    var pageTargetOptions = JSON.stringify(masterPages[id]);
    var countryOptions = JSON.stringify(masterGeo[id]);
    var source_mode = e.children().find('.user_source').val();
    var utm_code = e.children().find('.utm_val').val();
    var source_url = e.children().find('.source_url').val();
    var iconColor = e.children().find('.iconColor').val();
    var hasIcon = e.children().find('.hasIcon').prop('checked');
    var fontSize = e.children().find('.font-size').val();
    var bgImage = e.children().find('.img').val();
    var user_closable = e.children().find('.user_closable').prop('checked');
    var bar_dismiss_style = e.children().find('.bar_dismiss_style').val();
    var cta_type = Number(e.children().find('.call_to_action_selector').val());
    var device_target = Number(e.children().find('input[name=device_target-' + id + ']:checked').val());
    var linkType="";



    switch (cta_type) {
        case 1:
            btnTarget = e.children().find('.barTarget').val();
            linkType = e.children().find('.linkType').eq(cta_type - 1).val();
            break;

        case 2:
            btnColor = e.children().find('.btnColor').val();
            btnText = e.children().find('.btnText').val();
            btnTextColor = e.children().find('.btnTextColor').val();
            btnTarget = e.children().find('.btnTarget').val();
            btn_style = e.children().find('.button_style').val();
            linkType = e.children().find('.linkType').eq(cta_type - 1).val();
            break;

        case 3:
            btnText = e.children().find('.slinkText').val();
            btnTarget = e.children().find('.slinkTarget').val();
            btnTextColor = e.children().find('.slinkTextColor').val();
            linkType = e.children().find('.linkType').eq(cta_type - 1).val();
            break;

        case 4:
            btnColor = e.children().find('.couponColor').val();
            btnText = e.children().find('.couponText').val();
            btnTextColor = e.children().find('.couponTextColor').val();
            btn_style = e.children().find('.coupon_style').val();
            break;
    }

    let modData={
        message:description,
        name:title,
        bgColor:bgColor,
        textColor:textColor,
        btnColor:btnColor,
        position:position,
        posOnTop:posOnTop,
        font:font,
        btnTextColor:btnTextColor,
        btnText:btnText,
        btnTarget:btnTarget,
        opacity:opacity,
        icon:icon,
        pageTarget:pageTarget,
        domainTarget:domainTarget,
        domainTargetOptions:domainTargetOptions,
        pageTargetOptions:pageTargetOptions,
        countryOptions:countryOptions,
        source_mode:source_mode,
        utm_code:utm_code,
        source_url:source_url,
        device_target:device_target,
        iconColor:iconColor,
        hasIcon:hasIcon,
        fontSize:fontSize,
        bgImage:bgImage,
        user_closable:user_closable,
        bar_dismiss_style:bar_dismiss_style,
        cta_type:cta_type,
        btn_style:btn_style,
        linkType:linkType
    }
    modData= JSON.stringify(modData)
    let bar_id = id
    let op = "single-bar";

    var bar;
    $.ajax({
        type:"POST",
        url:"modscript",
        data :{modData:modData,bar_id:bar_id ,op:op},
        success:function(response){
            $('.btn-save').remove();
            $('.btns-container').prepend(
                '<button type="button" class="btn-save Polaris-Button Polaris-Button--primary"><span class="Polaris-Button__Content">' +
                '<span>Save</span></span></button>'
            );
            $('.preview-section').slideUp('slow');
            e.css('margin-top','inherit');
            let json = response.status
            if (json == "success") {
                $('.preview-section').after('<div class="alert success"><dl><a class="close" href="#"></a>'+
                    '<dt>Success</dt>' +
                    '<dd>Your bar was successfully updated. Please refresh your store page to see results.</dd>' +
                    '</dl></div>');
                if (sessionStorage["rate"] != 0 && localStorage["never_rate"] != 1) {
                    setTimeout(function(){
                        $('#rate_modal').mod({
                            showClose:true,
                            closeClass:"modal-close rate_close"
                        });
                    }, 1000);
                }
                else {
                    setTimeout(function(){
                        window.location.href="settings";
                    },1000);

                }
            }
            else {
                if (json == "unauthorized") {
                    //window.location.href="https://" + json.shop + '/admin/auth/login';
                    $('.preview-section').after('<div class="alert error"><dl><a class="close" href="#"></a>'+
                        '<dt>Unauthorized</dt>' +
                        '<dd>It\'s either you have been logged out, or you don\'t have enought permissions to make these changes</dd>' +
                        '<dd><a href="install.html?shop=' + json.shop + '">Login again</a></dd>' +
                        '</dl></div>');
                }
                else {
                    $('.preview-section').after('<div class="alert error"><dl><a class="close" href="#"></a>'+
                        '<dt>Oops!</dt>' +
                        '<dd>Something went wrong. Please refresh this page and try again.</dd>' +
                        '</dl></div>');
                }
            }

            $('body').animate({
                scrollTop:0
            },500);


        }
    });

}

function modifyBarCounter(e) {
    $('.btn-save').remove();
    $('.btns-container').prepend(
        '<button type="button" class="btn-save Polaris-Button Polaris-Button--primary Polaris-Button--disabled Polaris-Button--loading" disabled="" role="alert" aria-busy="true"><span class="Polaris-Button__Content">' +
        '<span class="Polaris-Button__Spinner"><svg viewBox="0 0 20 20" class="Polaris-Spinner Polaris-Spinner--colorWhite Polaris-Spinner--sizeSmall" aria-label="Loading" role="status">' +
        '<path class="Polaris-Spinner--colorWhite" d="M7.229 1.173a9.25 9.25 0 1 0 11.655 11.412 1.25 1.25 0 1 0-2.4-.698 6.75 6.75 0 1 1-8.506-8.329 1.25 1.25 0 1 0-.75-2.385z"></path></svg></span><span>Save</span></span></button>'
    );

    var id = e.parent("section").attr('id');
    var title = e.children().find('.barName').val();
    var description = e.children().find('.barText').html().replace("<br>","").replace("&lt;money&gt;","<span class='money'>").replace("<money>","<span class='money'>").replace("&lt;/money&gt;","</span>").replace("</money>","</span>").replace(/&nbsp;/gi, ' ');
    var bgColor = e.children().find('.bgColor').val();
    var textColor = e.children().find('.textColor').val();
    var btnColor = "";
    var btnTextColor = "";
    var name = "";
    var btn_style = "";
    var btnText = "";
    var btnTarget = "";
    //btnTarget = check_url(btnTarget);
    var position = e.children().find('.posSelector').val();
    var font = e.children().find('.fonts').val();
    var posOnTop = e.children().find('.posOnTop').prop('checked');
    var opacity = e.children().find('.opacity').val();
    var icon = e.children().find('.icon-placeholder').val();
    var pageTarget = e.children().find('.page-target').val();
    var domainTarget = e.children().find('.domain-target').val();
    var domainTargetOptions = JSON.stringify(masterDomains[id]);
    var pageTargetOptions = JSON.stringify(masterPages[id]);
    var countryOptions = JSON.stringify(masterGeo[id]);
    var source_mode = e.children().find('.user_source').val();
    var utm_code = e.children().find('.utm_val').val();
    var source_url = e.children().find('.source_url').val();
    var iconColor = e.children().find('.iconColor').val();
    var hasIcon = e.children().find('.hasIcon').prop('checked');
    var fontSize = e.children().find('.font-size').val();
    var bgImage = e.children().find('.img').val();
    var user_closable = e.children().find('.user_closable').prop('checked');
    var bar_dismiss_style = e.children().find('.bar_dismiss_style').val();
    var cta_type = Number(e.children().find('.call_to_action_selector').val());
    var device_target = Number(e.children().find('input[name=device_target-' + id + ']:checked').val());
    var linkType="";
    var timerFace = e.children().find(".counter-style").val();
    var timerBgColor = e.children().find(".timerBgColor").val();
    var timerTextColor = e.children().find(".timerTextColor").val();
    var timerBorderColor = e.children().find(".timerBorderColor").val();
    //var daysLabel = e.children().find(".daysInput").val() || "Days";
    var labelsHidden = e.children().find(".timerHideLabels").prop("checked")?"label-hidden":"";
    var days = e.children().find(".daysInput").val() || "0";
    var hours = e.children().find(".hoursInput").val() || "0";
    var minutes = e.children().find(".minutesInput").val() || "0";
    var timing_algo = e.children().find(".timing_algo_selector").val();
    var timer_end_action = e.children().find(".counter-finish-selector").val() || "0";
    var layout = e.children().find(".layoutSelector").val();
    var daysLabel = e.children().find(".daysLabelInput").val();
    var hoursLabel = e.children().find(".hoursLabelInput").val();
    var minutesLabel = e.children().find(".minutesLabelInput").val();
    var secondsLabel = e.children().find(".secondsLabelInput").val();
    var useCustomLabels = e.children().find(".customLabelCheck").prop("checked");

    var format = setTimerFormat(days,hours,minutes);



    let due = toMinutes(days,hours,minutes);

    let end_ms = calculateEndTime(due);

    var counterPrefs = {
        timerFace:timerFace,
        timerBgColor:timerBgColor,
        timerBorderColor:timerBorderColor,
        timerTextColor:timerTextColor,
        layout:layout,
        days:days,
        hours:hours,
        minutes:minutes,
        format:format,
        timing_algo:timing_algo,
        end_ms:end_ms,
        timer_end_action:timer_end_action,
        daysLabel:daysLabel,
        hoursLabel:hoursLabel,
        minutesLabel:minutesLabel,
        secondsLabel:secondsLabel,
        useCustomLabels:useCustomLabels,
        fontSize:fontSize
    };
    counterPrefs = JSON.stringify(counterPrefs);
    switch (cta_type) {
        case 1:
            btnTarget = e.children().find('.barTarget').val();
            linkType = e.children().find('.linkType').eq(cta_type - 1).val();
            break;

        case 2:
            btnColor = e.children().find('.btnColor').val();
            btnText = e.children().find('.btnText').val();
            btnTextColor = e.children().find('.btnTextColor').val();
            btnTarget = e.children().find('.btnTarget').val();
            btn_style = e.children().find('.button_style').val();
            linkType = e.children().find('.linkType').eq(cta_type - 1).val();
            break;

        case 3:
            btnText = e.children().find('.slinkText').val();
            btnTarget = e.children().find('.slinkTarget').val();
            btnTextColor = e.children().find('.slinkTextColor').val();
            linkType = e.children().find('.linkType').eq(cta_type - 1).val();
            break;

        case 4:
            btnColor = e.children().find('.couponColor').val();
            btnText = e.children().find('.couponText').val();
            btnTextColor = e.children().find('.couponTextColor').val();
            btn_style = e.children().find('.coupon_style').val();
            break;
    }

    let counterdata = {
        message:description,
        name:title,
        bgColor:bgColor,
        textColor:textColor,
        btnColor:btnColor,
        position:position,
        posOnTop:posOnTop,
        font:font,
        btnTextColor:btnTextColor,
        btnText:btnText,
        btnTarget:btnTarget,
        opacity:opacity,
        icon:icon,
        pageTarget:pageTarget,
        domainTarget:domainTarget,
        domainTargetOptions:domainTargetOptions,
        pageTargetOptions:pageTargetOptions,
        countryOptions:countryOptions,
        source_mode:source_mode,
        utm_code:utm_code,
        source_url:source_url,
        device_target:device_target,
        iconColor:iconColor,
        hasIcon:hasIcon,
        fontSize:fontSize,
        bgImage:bgImage,
        user_closable:user_closable,
        bar_dismiss_style:bar_dismiss_style,
        cta_type:cta_type,
        btn_style:btn_style,
        linkType:linkType,
        counterPrefs:counterPrefs
    }
    counterdata = JSON.stringify(counterdata);
    console.log(counterdata)
    let bar_id = id;
    let op = "mod-counter";
    var bar;
    $.ajax({
        type:"POST",
        url:"modscript",
        data :{counterdata:counterdata,bar_id:bar_id,op:op},
        success:function(response){

            $('.btn-save').remove();
            $('.btns-container').prepend(
                '<button type="button" class="btn-save Polaris-Button Polaris-Button--primary"><span class="Polaris-Button__Content">' +
                '<span>Save</span></span></button>'
            );
            $('.preview-section').slideUp('slow');
            e.css('margin-top','inherit');
            let json = response.status
            if (json == "success") {
                $('.preview-section').after('<div class="alert success"><dl><a class="close" href="#"></a>'+
                    '<dt>Success</dt>' +
                    '<dd>Your bar was successfully updated. Please refresh your store page to see results.</dd>' +
                    '</dl></div>');
                if (sessionStorage["rate"] != 0 && localStorage["never_rate"] != 1) {
                    setTimeout(function(){
                        $('#rate_modal').mod({
                            showClose:true,
                            closeClass:"modal-close rate_close"
                        });
                    }, 1000);
                }
                else {
                    setTimeout(function(){
                        window.location.href="settings";
                    },1000);

                }
            }
            else {
                if (json == "unauthorized") {
                    //window.location.href="https://" + json.shop + '/admin/auth/login';
                    $('.preview-section').after('<div class="alert error"><dl><a class="close" href="#"></a>'+
                        '<dt>Unauthorized</dt>' +
                        '<dd>It\'s either you have been logged out, or you don\'t have enought permissions to make these changes</dd>' +
                        '<dd><a href="install.html?shop=' + json.shop + '">Login again</a></dd>' +
                        '</dl></div>');
                }
                else {
                    $('.preview-section').after('<div class="alert error"><dl><a class="close" href="#"></a>'+
                        '<dt>Oops!</dt>' +
                        '<dd>Something went wrong. Please refresh this page and try again.</dd>' +
                        '</dl></div>');
                }
            }

            $('body').animate({
                scrollTop:0
            },500);


        }
    });

}

function modifyBarMulti(e) {
    var id = e.parent("section").attr('id');
    var title = e.children().find('.barName').val();
    var message = getMessages(e);

    var bgColor = e.children().find('.bgColor').val();

    var posTop = e.children().find('.posSelector').val();
    var posOnTop = e.children().find('.posOnTop').prop('checked');


    var opacity = e.children().find('.opacity').val();
    var domainTarget = e.children().find('.domain-target').val();
    var pageTarget = e.children().find('.page-target').val();
    var domainTargetOptions = JSON.stringify(masterDomains[id]);
    var pageTargetOptions = JSON.stringify(masterPages[id]);
    var countryOptions = JSON.stringify(masterGeo[id]);
    var source_mode = e.children().find('.user_source').val();
    var utm_code = e.children().find('.utm_val').val();
    var source_url = e.children().find('.source_url').val();

    var hasIcon = e.children().find('.hasIcon').prop('checked');

    var bgImage = e.children().find('.img').val();
    var user_closable = e.children().find('.user_closable').prop('checked');
    var bar_dismiss_style = e.children().find('.bar_dismiss_style').val();

    var device_target = Number(e.children().find('input[name="device_target-' + id + '"]:checked').val());




    $('.btn-save').remove();
    $('.btns-container').prepend(
        '<button type="button" id="saveBtn" class="Polaris-Button Polaris-Button--primary Polaris-Button--disabled Polaris-Button--loading" disabled="" role="alert" aria-busy="true"><span class="Polaris-Button__Content">' +
        '<span class="Polaris-Button__Spinner"><svg viewBox="0 0 20 20" class="Polaris-Spinner Polaris-Spinner--colorWhite Polaris-Spinner--sizeSmall" aria-label="Loading" role="status">' +
        '<path class="Polaris-Spinner--colorWhite" d="M7.229 1.173a9.25 9.25 0 1 0 11.655 11.412 1.25 1.25 0 1 0-2.4-.698 6.75 6.75 0 1 1-8.506-8.329 1.25 1.25 0 1 0-.75-2.385z"></path></svg></span><span>Save</span></span></button>'
    );
    let multibar = {
        message:message,
        name:title,
        bgColor:bgColor,
        position:posTop,
        posOnTop:posOnTop,
        opacity:opacity,
        domainTarget:domainTarget,
        domainTargetOptions:domainTargetOptions,
        pageTarget:pageTarget,
        pageTargetOptions:pageTargetOptions,
        countryOptions:countryOptions,
        source_mode:source_mode,
        utm_code:utm_code,
        device_target:device_target,
        source_url:source_url,
        hasIcon:hasIcon,
        bgImage:bgImage,
        user_closable:user_closable,
        bar_dismiss_style:bar_dismiss_style
    }

    multibar = JSON.stringify(multibar);
    console.log(multibar)
    let bar_id = id;
    let op = "mod-multi";
    console.log(op);
    $.ajax({
        type:"POST",
        url:"modscript",
        data :{multibar:multibar,bar_id:bar_id,op:op},
        success:function(result) {
            $('.preview-section').slideUp('slow');
            $('#new_bar').css('margin-top','inherit');
            let json = result.status
            if (json == "success") {
                $('.preview-section').after('<div class="alert success"><dl><a class="close" href="#"></a>'+
                    '<dt>Success</dt>' +
                    '<dd>Your bar was successfully created. Please allow a couple of seconds, then refresh your store page to see results.</dd>' +
                    '</dl></div>');
                if (sessionStorage["rate"] != 0 && localStorage["never_rate"] != 1) {
                    setTimeout(function(){
                        $('#rate_modal').mod({
                            showClose:true,
                            closeClass:"modal-close rate_close"
                        });
                    }, 1000);
                }
                else {
                    setTimeout(function(){
                        window.location.href="settings";
                    }, 1000);

                }
            }
            else {
                if (json.reason == "unauthorized") {
                    $('.preview-section').after('<div class="alert error"><dl><a class="close" href="#"></a>'+
                        '<dt>Unauthorized</dt>' +
                        '<dd>It\'s either you have been logged out, or you don\'t have enought permissions to make these changes</dd>' +
                        '<dd><a href="install.html?shop=' + json.shop + '">Login again</a></dd>' +
                        '</dl></div>');
                }

                else {
                    $('.preview-section').after('<div class="alert error"><dl><a class="close" href="#"></a>'+
                        '<dt>Oops!</dt>' +
                        '<dd>Something went wrong. Please refresh this page and try again.</dd>' +
                        '</dl></div>');
                }
            }
            $('body').animate({
                scrollTop:0
            },500);

        }
    });

}


var loop_messages = function(i,id) {

    if ($('.message-element').length > 1) {
        if (i < $("#bar" + id).children().find('.aph_bar_holder').length) {

            if (!loopstop) {

                $("#bar" + id).children().find('.aph_bar_holder').eq(i).fadeIn();
            }

            setTimeout(function() {

                if (!loopstop && Number($("#bar" + id).children().find('.aph_bar_holder').eq(i).css('top').replace('px','')) == 0) {
                    var delta = -1 * $("#bar" + id).innerHeight();
                    $("#bar" + id).children().find('.aph_bar_holder').eq(i).animate({
                        'top':delta
                    },300,function() {
                        animFlag = true;
                        $("#bar" + id).children().find('.aph_bar_holder').eq(i).css('top',$ ("#bar" + id).innerHeight());
                        loop_messages(i+1,id);
                    });
                }
                if (!loopstop) {
                    $("#bar" + id).children().find('.aph_bar_holder').eq(i).fadeOut(function(){
                        loop_messages(i+1,id);
                    });
                }

            }, 3000);

        }

        else {

            if (!loopstop) {
                loop_messages(0,id);
            }


        }
    }

};

function update_iframe(id,first,editing_message,fade) {

    $('.aph_bar_bar').remove();
    var e = $('#' + id);
    if (e.data("type") == "single") {
        update_iframe_single(id,false);
        return;
    }
    else if (e.data("type") == "counter") {
        update_iframe_counter(id,false);
        return;
    }

    var title = e.children().find('.barName').val();
    var message = getMessages(e.children(".edit-multi"));
    if (message == "") {
        message = getMessages(e);
    }

    var bgColor = e.children().find('.bgColor').val();





    var position = e.children().find('.posSelector').val();

    var posOnTop = e.children().find('.posOnTop').prop('checked');

    var opacity = e.children().find('.opacity').val();

    var homePageOption = e.children().find('.homePageOption').prop('checked');

    var hasIcon = e.children().find('.hasIcon').prop('checked');


    var bgImage = e.children().find('.img').val();
    var user_closable = e.children().find('.user_closable').prop('checked');
    var bar_dismiss_style = e.children().find('.bar_dismiss_style').val();





    var bar;


    bar = "<div id='bar" + id + "' class='aph_bar_bar'><div class='aph_bar_container'>";


    message.forEach(function(item) {
        var holder = "<div class='aph_bar_holder'>";



        switch (Number(item.cta_type)) {
            case 1:
                var iconElement = "<i style='font-size:" + item.fontSize + "px; vertical-align:middle; color:#" + item.iconColor + ";' class='aph_bar_icon aph_bar_icon_nocta " + item.icon + "'></i>";
                var messageText = "<span style='font-size:" + item.fontSize + "; font-family:" + item.font + "; color:#" + item.textColor + ";text-align:center;' class='aph_bar_message aph_bar_message_nocta'>" + iconElement + "&nbsp;" + item.text.replace('<br>','') + "</span>";
                holder = holder.replace("class='aph_bar_holder'","class='aph_bar_holder aph_bar_clickable'") + messageText + "</div>";

                break;

            case 2:
                var btn = "<div class='aph_bar_btn_holder'><a style='background:#" + item.btnColor + ";color:#" + item.btnTextColor +";border-color:" + item.btnColor + ";' class='aph_bar_btn mobile_btn " + item.btn_style + "' href='javascript:void(0);'>" + item.btnText + "</a></div>";

                var iconElement = "<i style='font-size:" + item.fontSize + "px; vertical-align:middle; color:#" + item.iconColor + ";' class='aph_bar_icon aph_bar_icon_cta " + item.icon + "'></i>";
                var messageText = "<span style='font-size:" + item.fontSize + "; font-family:" + item.font + "; color:#" + item.textColor + ";text-align:center;' class='aph_bar_message aph_bar_message_cta left-aligned'>" + iconElement + "<div class='aph_bar_text_holder'>" + item.text.replace('<br>','') + "</div>" + btn + "</span>";
                holder = holder + messageText + "</div>";
                break;


            case 3:
                var slink = "<a style='font-family:" + item.font + "; font-size:" + item.fontSize + "px; color:" + item.btnTextColor + ";' class='slink' href='javascript:void(0);'>" + item.btnText + "</a>";
                var iconElement = "<i style='font-size:" + item.fontSize + "px; vertical-align:middle; color:#" + item.iconColor + ";' class='aph_bar_icon aph_bar_icon_cta " + item.icon + "'></i>";
                var messageText = "<span style='font-size:" + item.fontSize + "px; font-family:" + item.font + "; color:#" + item.textColor + ";text-align:center;' class='aph_bar_message aph_bar_message_nocta left-aligned'>" + iconElement + "&nbsp;" + item.text.replace('<br>','') + "&nbsp;" + slink + "</span>";
                holder = holder + messageText + "</div>";
                break;


            case 4:
                var coupon = "<a style='border-color:#" + item.btnColor + "; color:#" + item.btnTextColor + ";' class='aph_bar_btn coupon " + item.btn_style + " noclick'>" + item.btnText + "</a>";

                var iconElement = "<i style='font-size:" + item.fontSize + "px; vertical-align:middle; color:#" + item.iconColor + ";' class='aph_bar_icon aph_bar_icon_cta " + item.icon + "'></i>";
                var messageText = "<span style='font-size:" + item.fontSize + "; font-family:" + item.font + "; color:#" + item.textColor + ";text-align:center;' class='aph_bar_message aph_bar_message_cta left-aligned'>" + iconElement + "<div class='aph_bar_text_holder'>" + item.text.replace('<br>','') + "</div>" + coupon + "</span>";
                holder = holder + messageText + "</div>";
                break;


            case 0:

                var iconElement = "<i style='font-size:" + item.fontSize + "px; vertical-align:middle; color:#" + item.iconColor + ";' class='aph_bar_icon aph_bar_icon_nocta " + item.icon + "'></i>";
                var messageText = "<span style='font-size:" + item.fontSize + "; font-family:" + item.font + "; color:#" + item.textColor + ";text-align:center;' class='aph_bar_message aph_bar_message_nocta'>" + iconElement + item.text.replace('<br>','') + "</span>";
                holder = holder + messageText + "</div>";
                break;



        }

        bar = bar + holder;
    });
    if (user_closable == true) {
        var dismissBtn = "</div><div id='dismiss" + id +  "' class='dismiss " + bar_dismiss_style + "'>&#xd7;</div>";
        bar = bar + dismissBtn + "</div>";
    }
    else {
        bar = bar + "</div></div>";
    }







    $('.preview-card').append(bar).append(function(){

        //$("#op_height_image" + id).on("load", function(){
        var bar_height = 0;


        $("#bar" + id).children().find('.aph_bar_holder').each(function(i,item) {
            bar_height = Math.max(bar_height,$(this).height());

        });


        bar_height = bar_height + 16;
        $("#bar" + id).css('height',bar_height + 'px');
        $("#bar" + id).children('.aph_bar_container').css('height', bar_height + 'px');


        $("#bar" + id).children().find('.aph_bar_holder').each(function(i,item) {
            var hdiff = bar_height - Number($(this).height());
            $(item).css("padding-top",hdiff/2);

        });



        var rgb = hexToRgb(bgColor);


        var bg_div = "<div class='bg-section'></div>";
        $('#bar' + id).children('.aph_bar_container').prepend(bg_div);

        if (bgImage != '') {



            $('#bar' + id).children().find('.bg-section').css({'top':0,'left':0});
            $('#bar' + id).children().find('.bg-section').css('background','url("' + bgImage + '") left top repeat');
            //  $('#bar' + id).children('.bg-section').css('background-size','auto 150px');
            $('#bar' + id).children().find('.bg-section').css('opacity',opacity);
            $('#bar' + id).children().find('.aph_bar_holder').css('background','transparent');
        }
        else {
            if (rgb != null) {
                $('.aph_bar_bar').css('background','rgba(' + rgb.r + ',' + rgb.g + ',' + rgb.b + ',' + opacity + ')');
            }
        }



        if (first) {

            $('.aph_bar_bar').fadeIn('slow', function(){

                $('.preview-card').height($('.aph_bar_bar').innerHeight() + 20);
                $('.preview-section').height($('.aph_bar_bar').innerHeight() + 20);

                update_iframe(id,false);



            });


        }



        $('.preview-card').height($('.aph_bar_bar').innerHeight() + 20);
        $('.preview-section').height($('.aph_bar_bar').innerHeight() + 20);


        $(".aph_bar_holder").each(function(i,object) {


            if (i != editing_message && $(".aph_bar_holder").length > 1) {

                $(this).hide();
            }
            else {
                $(this).fadeIn();
                global_editing_message = editing_message;
            }

        });



//});
    });


}


function update_iframe_single (id,first) {
//	$('.aph_bar_bar').remove();

    var e = $('#' + id);

    var title = e.children().find('.barName').val();
    var message = e.children().find('.barText').html().replace("&lt;money&gt;","").replace("<money>","").replace("&lt;/money&gt;","").replace("</money>","");
    var bgColor = e.children().find('.bgColor').val();
    var textColor = e.children().find('.textColor').val();


    var btnText = e.children().find('.btnText').val();
    var btnTarget = e.children().find('.btnTarget').val();
    var position = e.children().find('.posSelector').val();
    var font = e.children().find('.fonts').val();
    var posOnTop = e.children().find('.posOnTop').prop('checked');
    var hasBtn = e.children().find('.btnCheck').prop('checked');
    var opacity = e.children().find('.opacity').val();
    var icon = e.children().find('.icon-placeholder').val();
    var homePageOption = e.children().find('.homePageOption').prop('checked');
    var iconColor = e.children().find('.iconColor').val();
    var hasIcon = e.children().find('.hasIcon').prop('checked');
    var fontSize = e.children().find('.font-size').val();
//	var bgImage = e.children().find('.slide-selected').data('name');
    var bgImage = e.children().find('.img').val();
    var user_closable = e.children().find('.user_closable').prop('checked');
    var bar_dismiss_style = e.children().find('.bar_dismiss_style').val();
    var button_style = e.children().find('.button_style').val();
    var cta_type = Number(e.children().find('.call_to_action_selector').val());



    var bar;


    bar = "<div id='bar" + id + "' class='aph_bar_bar'><div id='holder" + id + "' class='aph_bar_holder'><span id='message" + id + "' class='aph_bar_message'><i id='icon" + id + "' style='font-size:" + fontSize + "px;' class='aph_bar_icon " + icon + "'></i><div class='aph_bar_text_holder'>" + message + "</div></span>" +
        "</div></div>";




//	$('.preview_frame').attr('src',url);



    $('.preview-card').append(bar).append(function(){
        if (first) {
            $('.aph_bar_bar').hide();
        }

        if (user_closable) {
            var dismissBtn = "<div id='dismiss" + id + "' class='dismiss " + bar_dismiss_style + "'>&#xd7;</div>";
            $(dismissBtn).css('background', '#' + bgColor).appendTo('#bar' + id);

        }

        switch (cta_type) {
            case 1:
                var barTarget = e.children().find('.barTarget').val();
                $('#bar' + id).children(".aph_bar_holder").addClass("aph_bar_clickable");
                $('#icon' + id).addClass('aph_bar_icon_nocta');
                $('#message' + id).addClass('aph_bar_message_nocta');
                $('#message' + id).css('text-align','center');
                $('#dismiss' + id).addClass('dismiss_reg');
                break;

            case 2:
                var btn_holder = "<div class='aph_bar_btn_holder'></div>";
                var btn = "<a id='button" + id + "' class='aph_bar_btn'>" + btnText + "</a>";
                var button_style = e.children().find('.button_style').val();
                var btnColor = e.children().find('.btnColor').val();
                var btnTextColor = e.children().find('.btnTextColor').val();

                $(btn_holder).appendTo("#message" + id);
                $(btn).appendTo(".aph_bar_btn_holder");
                $("#button" + id).addClass(button_style).css({'background':'#' + btnColor, 'color':'#' + btnTextColor, 'border-color':'#' + btnColor});
                $('#message' + id).addClass('aph_bar_message_cta');
                $('#icon' + id).addClass('aph_bar_icon_cta');
                $('#dismiss' + id).addClass('dismiss_CTA');
                break;

            case 3:

                slinkText = e.children().find('.slinkText').val();
                var slink = "<a id='button" + id + "' style='font-family:" + font + "; font-size:" + fontSize + "px;' class='slink'>" + slinkText + "</a>";
                var slinkTextColor = e.children().find('.slinkTextColor').val();
                $('#message' + id).append("&nbsp;");
                $(slink).css('color','#' + slinkTextColor).appendTo('#message' + id);
                $('#message' + id).addClass('aph_bar_message_nocta');
                $('#icon' + id).addClass('aph_bar_icon_nocta');
                $('#dismiss' + id).addClass('dismiss_CTA');
                break;

            case 4:
                var btn_holder = "<div class='aph_bar_btn_holder'></div>";
                var couponText = e.children().find('.couponText').val();
                var coupon = "<a id='button" + id + "' class='aph_bar_btn'>" + couponText + "</a>";
                var couponColor = e.children().find('.couponColor').val();
                var couponTextColor = e.children().find('.couponTextColor').val();
                var coupon_style = e.children().find('.coupon_style').val();
                $(btn_holder).appendTo("#message" + id);
                $(coupon).appendTo(".aph_bar_btn_holder");
                $("#button" + id).addClass(coupon_style).css({'border-color':'#' + couponColor, 'color':'#' + couponTextColor});
                $('#message' + id).addClass('aph_bar_message_cta');
                $('#icon' + id).addClass('aph_bar_icon_cta');
                $('#dismiss' + id).addClass('dismiss_CTA');
                break;

            case 0:
                $('#icon' + id).addClass('aph_bar_icon_nocta');
                $('#message' + id).addClass('aph_bar_message_nocta');
                $('#message' + id).css('text-align','center');
                $('#dismiss' + id).addClass('dismiss_reg');
        }

        //$('.aph_bar_btn').css('margin-top', ($('.aph_bar_bar').height()/2 - $('.aph_bar_bar').height())/2  + 'px');


        // var sizing_bar = $(bar).css('visibility','hidden');
        //$(this).append(sizing_bar);
        var rgb = hexToRgb(bgColor);
        var bar_height = $("#bar" + id).children(".aph_bar_holder").height();
        bar_height = bar_height + 16;
        $("#bar" + id).css('height', bar_height);
        $("#bar" + id).children(".aph_bar_holder").css("padding-top","8px");

        if (bgImage != '') {
            //$('#bar' + id).css('background','url("' + bgImage + '") left top repeat-x');
            var bg_div = "<div class='bg-section'></div>";

            var bg_height = bar_height + 1;
            //$('.preview-card').height($('.aph_bar_bar').innerHeight() + 20);
            //$('.preview-section').height($('.aph_bar_bar').innerHeight() + 20);
            $('.aph_bar_bar').append(bg_div);
            //$('.aph_bar_bar').children('.bg-section').css('height', bg_height + 'px');
            $('.aph_bar_bar').children('.bg-section').css('top', 0);
            $('.aph_bar_bar').children('.bg-section').css('background','url("' + bgImage + '") left top repeat');
            //$('.aph_bar_bar').children('.bg-section').css('background-size','auto 150px');
            $('.aph_bar_bar').children('.bg-section').css('opacity',opacity);
        }
        else {
            if (rgb != null) {
                $('.aph_bar_bar').css('background','rgba(' + rgb.r + ',' + rgb.g + ',' + rgb.b + ',' + opacity + ')');
            }
        }
        //$('.aph_bar_bar').css('width', $(this).width());


        $('.aph_bar_message').css('color',textColor);
        $('.aph_bar_message').css('font-size',fontSize);




        if (font != "") {
            $('.aph_bar_message').css('font-family',"'" + font.replace('+',' ') + "'");
        }
        $('.aph_bar_icon').css('color','#' + iconColor);




        if (first) {
            //setTimeout(function(){
            $('.aph_bar_bar').fadeIn('slow', function(){
                //$('.aph_bar_bar').css('position','fixed');
                $('.preview-card').height($('.aph_bar_bar').innerHeight() + 20);
                $('.preview-section').height($('.aph_bar_bar').innerHeight() + 20);

                update_iframe(id,false);

            });

            //},400);
        }

        //$("#bar" + id).css('height', $("#bar" + id).children().find(".aph_bar_holder").innerHeight());
        $('.preview-card').height($("#bar" + id).innerHeight() + 20);
        $('.preview-section').height($("#bar" + id).innerHeight() + 20);

    });

}

function update_iframe_counter (id,first) {
//	$('.aph_bar_bar').remove();

    var e = $('#' + id);

    var title = e.children().find('.barName').val();
    var message = e.children().find('.barText').html().replace("&lt;money&gt;","").replace("<money>","").replace("&lt;/money&gt;","").replace("</money>","").replace("<br>","");
    var bgColor = e.children().find('.bgColor').val();
    var textColor = e.children().find('.textColor').val();


    var btnText = e.children().find('.btnText').val();
    var btnTarget = e.children().find('.btnTarget').val();
    var position = e.children().find('.posSelector').val();
    var font = e.children().find('.fonts').val();
    var posOnTop = e.children().find('.posOnTop').prop('checked');
    var hasBtn = e.children().find('.btnCheck').prop('checked');
    var opacity = e.children().find('.opacity').val();
    var icon = e.children().find('.icon-placeholder').val();
    var homePageOption = e.children().find('.homePageOption').prop('checked');
    var iconColor = e.children().find('.iconColor').val();
    var hasIcon = e.children().find('.hasIcon').prop('checked');
    var fontSize = e.children().find('.font-size').val();
//	var bgImage = e.children().find('.slide-selected').data('name');
    var bgImage = e.children().find('.img').val();
    var user_closable = e.children().find('.user_closable').prop('checked');
    var bar_dismiss_style = e.children().find('.bar_dismiss_style').val();
    var button_style = e.children().find('.button_style').val();
    var cta_type = Number(e.children().find('.call_to_action_selector').val());
    var timerFace = e.children().find(".counter-style").val();
    var timerBgColor = e.children().find(".timerBgColor").val();
    var timerTextColor = e.children().find(".timerTextColor").val();
    var timerBorderColor = e.children().find(".timerBorderColor").val();
    //var daysLabel = e.children().find(".daysInput").val() || "Days";
    var days = e.children().find(".daysInput").val() || "0";
    var hours = e.children().find(".hoursInput").val() || "0";
    var minutes = e.children().find(".minutesInput").val() || "0";
    var layout = e.children().find(".layoutSelector").val();
    var daysLabel = e.children().find(".daysLabelInput").val();
    var hoursLabel = e.children().find(".hoursLabelInput").val();
    var minutesLabel = e.children().find(".minutesLabelInput").val();
    var secondsLabel = e.children().find(".secondsLabelInput").val();


    var format = setTimerFormat(days,hours,minutes);


    var minutes = Number(days*24*60) + Number(hours * 60) + Number(minutes);
    console.log(minutes);
    var now = new Date();
    var then = new Date();
    then.setTime(now.getTime() + (minutes*60*1000));
    console.log(then);
    var bar;


    bar = "<div id='bar" + id + "' class='aph_bar_bar'><div id='holder" + id + "' class='aph_bar_holder'><span id='message" + id + "' class='aph_bar_message'><i id='icon" + id + "' style='font-size:" + fontSize + "px;' class='aph_bar_icon " + icon + "'></i><div class='aph_bar_text_holder'>" + message + "</div><div class='aph_bar_counter'></div></span>" +
        "</div></div>";




//	$('.preview_frame').attr('src',url);



    $('.preview-card').append(bar).append(function(){
        if (first) {
            $('.aph_bar_bar').hide();
        }

        if (user_closable) {
            var dismissBtn = "<div id='dismiss" + id + "' class='dismiss " + bar_dismiss_style + "'>&#xd7;</div>";
            $(dismissBtn).css('background', '#' + bgColor).appendTo('#bar' + id);

        }

        switch (cta_type) {
            case 1:
                var barTarget = e.children().find('.barTarget').val();
                $('#bar' + id).children(".aph_bar_holder").addClass("aph_bar_clickable");
                $('#icon' + id).addClass('aph_bar_icon_nocta');
                $('#message' + id).addClass('aph_bar_message_nocta');
                $('#message' + id).css('text-align','center');
                $('#dismiss' + id).addClass('dismiss_reg');
                break;

            case 2:
                var btn_holder = "<div class='aph_bar_btn_holder'></div>";
                var btn = "<a id='button" + id + "' class='aph_bar_btn'>" + btnText + "</a>";
                var button_style = e.children().find('.button_style').val();
                var btnColor = e.children().find('.btnColor').val();
                var btnTextColor = e.children().find('.btnTextColor').val();

                $(btn_holder).appendTo("#message" + id);
                $(btn).appendTo(".aph_bar_btn_holder");
                $("#button" + id).addClass(button_style).css({'background':'#' + btnColor, 'color':'#' + btnTextColor, 'border-color':'#' + btnColor});
                $('#message' + id).addClass('aph_bar_message_cta');
                $('#icon' + id).addClass('aph_bar_icon_cta');
                $('#dismiss' + id).addClass('dismiss_CTA');
                break;

            case 3:

                slinkText = e.children().find('.slinkText').val();
                var slink = "<a id='button" + id + "' style='font-family:" + font + "; font-size:" + fontSize + "px;' class='slink'>" + slinkText + "</a>";
                var slinkTextColor = e.children().find('.slinkTextColor').val();
                $('.aph_bar_text_holder').append("&nbsp;");
                $(slink).css('color','#' + slinkTextColor).insertAfter('.aph_bar_text_holder');
                $('#message' + id).addClass('aph_bar_message_nocta');
                $('#icon' + id).addClass('aph_bar_icon_nocta');
                $('#dismiss' + id).addClass('dismiss_CTA');
                break;

            case 4:
                var btn_holder = "<div class='aph_bar_btn_holder'></div>";
                var couponText = e.children().find('.couponText').val();
                var coupon = "<a id='button" + id + "' class='aph_bar_btn'>" + couponText + "</a>";
                var couponColor = e.children().find('.couponColor').val();
                var couponTextColor = e.children().find('.couponTextColor').val();
                var coupon_style = e.children().find('.coupon_style').val();
                $(btn_holder).appendTo("#message" + id);
                $(coupon).appendTo(".aph_bar_btn_holder");
                $("#button" + id).addClass(coupon_style).css({'border-color':'#' + couponColor, 'color':'#' + couponTextColor});
                $('#message' + id).addClass('aph_bar_message_cta');
                $('#icon' + id).addClass('aph_bar_icon_cta');
                $('#dismiss' + id).addClass('dismiss_CTA');
                break;

            case 0:
                $('#icon' + id).addClass('aph_bar_icon_nocta');
                $('#message' + id).addClass('aph_bar_message_nocta');
                $('#message' + id).css('text-align','center');
                $('#dismiss' + id).addClass('dismiss_reg');
        }


        var counter = document.querySelector(".aph_bar_counter");
        // Soon.destroy(counter);
        console.log(layout);
        Soon.create(counter, {
            due:"in " + minutes + " minutes",
            face:timerFace.replace("-bordered","").replace("-background",""),
            format:format,
            layout:layout,
            separator:":",
            padding:true,
            cascade:true,
            paddingHours:"00",
            paddingDays:"00",
            paddingMinutes:"00",
            labelsDays:daysLabel,
            labelsHours:hoursLabel,
            labelsMinutes:minutesLabel,
            labelsSeconds:secondsLabel,
        });

/// ---- Styling ----
        switch (timerFace) {
            case "slot":
                $('#bar' + id).children().find(".soon-value").css("background","transparent");
                $('#bar' + id).children().find(".soon-value").css("color","#" + timerTextColor);
                $('#bar' + id).children().find(".soon-value").css("border","1px solid transparent");
                $('#bar' + id).children().find(".soon-value").css("font-weight","600");
                break;

            case "slot-background":
                $('#bar' + id).children().find(".soon-value").css("background","#" + timerBgColor);
                $('#bar' + id).children().find(".soon-value").css("color","#" + timerTextColor);
                $('#bar' + id).children().find(".soon-value").css("border","1px solid #" + timerBgColor);
                if (layout == "inline") {
                    $("#bar" + id).children().find(".soon[data-layout*=line] .soon-value, .soon[data-layout*=line] .soon-label").css("margin-right","0.325em");
                }
                break;

            case "slot-bordered":
                $('#bar' + id).children().find(".soon-value").css("border","1px solid #" + timerBorderColor);
                $('#bar' + id).children().find(".soon-value").css("color","#" + timerTextColor);
                if (layout == "inline") {
                    $("#bar" + id).children().find(".soon[data-layout*=line] .soon-value, .soon[data-layout*=line] .soon-label").css("margin-right","0.325em");
                }
                break;

            case "flip":
                $('#bar' + id).children().find(".soon-flip-face").css("background","#" + timerBgColor).css("color","#" + timerTextColor);
                $('#bar' + id).children().find(".soon-flip-face-fallback").css("background","#" + timerBgColor).css("color","#" + timerTextColor);
                break;

            case "matrix 3x5":
                if ($("#aph_added_style").length > 0) {
                    $("#aph_added_style").html("#bar" + id + " .soon-matrix-dot[data-state='1']  {background-color:#" + timerTextColor + "!important;" +
                        "#bar" + id + " .soon-matrix-dot[data-state='0'] {background-color:transparent; }"
                    );
                }
                else {
                    var head = document.getElementsByTagName('head')[0];
                    var aph_added_style = document.createElement("style");
                    aph_added_style.id = "aph_added_style";
                    head.appendChild(aph_added_style);
                    $("#aph_added_style").html("#bar" + id + " .soon-matrix-dot[data-state='1']  {background-color:#" + timerTextColor + "!important;" +
                        "#bar" + id + " .soon-matrix-dot[data-state='0'] {background-color:#" + timerBgColor  + "; }"
                    );
                }
                break;

        }

        if (layout == "inline") {
            $('#bar' + id).children().find(".soon [class*=soon-]").css("vertical-align","middle");

            $("#bar" + id).children().find(".soon-separator").hide();
            $(".soon-group-separator").css("padding-right","5px");
            if (days > 0) {
                $(".soon-group-separator:first").css("padding-right","10px");
            }

        }

        if (days > 0) {
            $('#bar' + id).children().find(".soon-separator:first").hide();
        }

        $(".soon-label").each(function(i,o) {
            let index_diff = $(".timerLabelsInput").length - $(".soon-label").length;
            console.log(index_diff);
            if (($(".timerLabelsInput").eq(i + index_diff).val() == "" && layout != "inline") || ($(".timerLabelsInput").eq(i + index_diff).val() == " " && layout != "inline")) {
                $(".soon-label").eq(i).css("visibility","hidden");
                $(".soon-wrapper [class*='soon-'], .soon [class*='soon-']").css("vertical-align","top");

            }
            else if ($(".timerLabelsInput").eq(i + index_diff).val() == "" && layout == "inline") {
                $(".soon-label").eq(i).css("display","none");
            }

        });
        if (fontSize >= 16 && $(window).width() > 750) {
            $('#bar' + id).children().find(".soon-wrapper[data-layout*='group'] .soon-label, .soon[data-layout*='group'] .soon-label").css("font-size","10px");
        }

        $('#bar' + id).children().find(".aph_bar_counter").css("color",textColor);
        $('#bar' + id).children().find(".aph_bar_counter").css("font-size",fontSize);
        $('#bar' + id).children().find(".aph_bar_counter").css("display","inline-block");
        $('#bar' + id).children().find(".aph_bar_counter").css("padding",0);
        $('#bar' + id).children().find(".aph_bar_counter").css("vertical-align","middle");


///------------------


        var rgb = hexToRgb(bgColor);
        var bar_height = $("#bar" + id).children(".aph_bar_holder").height();
        bar_height = bar_height + 16;
        $("#bar" + id).css('height', bar_height);
        $("#bar" + id).children(".aph_bar_holder").css("padding-top","8px");

        if (bgImage != '') {
            //$('#bar' + id).css('background','url("' + bgImage + '") left top repeat-x');
            var bg_div = "<div class='bg-section'></div>";

            var bg_height = bar_height + 1;
            //$('.preview-card').height($('.aph_bar_bar').innerHeight() + 20);
            //$('.preview-section').height($('.aph_bar_bar').innerHeight() + 20);
            $('.aph_bar_bar').append(bg_div);
            //$('.aph_bar_bar').children('.bg-section').css('height', bg_height + 'px');
            $('.aph_bar_bar').children('.bg-section').css('top', 0);
            $('.aph_bar_bar').children('.bg-section').css('background','url("' + bgImage + '") left top repeat');
            //$('.aph_bar_bar').children('.bg-section').css('background-size','auto 150px');
            $('.aph_bar_bar').children('.bg-section').css('opacity',opacity);
        }
        else {
            if (rgb != null) {
                $('.aph_bar_bar').css('background','rgba(' + rgb.r + ',' + rgb.g + ',' + rgb.b + ',' + opacity + ')');
            }
        }
        //$('.aph_bar_bar').css('width', $(this).width());


        $('.aph_bar_message').css('color',textColor);
        $('.aph_bar_message').css('font-size',fontSize);




        if (font != "") {
            $('.aph_bar_message').css('font-family',"'" + font.replace('+',' ') + "'");
        }
        $('.aph_bar_icon').css('color','#' + iconColor);




        if (first) {
            //setTimeout(function(){
            $('.aph_bar_bar').fadeIn('slow', function(){
                //$('.aph_bar_bar').css('position','fixed');
                $('.preview-card').height($('.aph_bar_bar').innerHeight() + 20);
                $('.preview-section').height($('.aph_bar_bar').innerHeight() + 20);

                update_iframe(id,false);



            });



            //},400);
        }

        //$("#bar" + id).css('height', $("#bar" + id).children().find(".aph_bar_holder").innerHeight());
        $('.preview-card').height($("#bar" + id).innerHeight() + 20);
        $('.preview-section').height($("#bar" + id).innerHeight() + 20);

    });
}

function adjust_icon(id,icon,iconColor) {
    $('#icon' + id).remove();
    $('#message' + id).prepend("<i id='icon" + id + "' class='aph_bar_icon aph_bar_icon_nocta " + icon + "'></icon>");
    $('#icon' + id).css('color',iconColor);
    $('#icon' + id).css('line-height','inherit');
}

function deleteBar(id) {
    $.ajax({
        type:"POST",
        url:"delete",
        data:{
            op:'del',
            bar_id:id
        },
        success:function(result) {
            let json = result.status
            if (json == "failed") {
                if (json.reason == "unauthorized") {
                    $('.preview-section').after('<div class="alert error"><dl><a class="close" href="#"></a>'+
                        '<dt>Unauthorized</dt>' +
                        '<dd>It\'s either you have been logged out, or you don\'t have enought permissions to make these changes</dd>' +
                        '<dd><a href="install.html?shop=' + json.shop + '">Login again</a></dd>' +
                        '</dl></div>');
                }
                else {
                    $('.preview-section').after('<div class="alert error"><dl><a class="close" href="#"></a>'+
                        '<dt>Oops!</dt>' +
                        '<dd>Something went wrong. Please refresh this page and try again.</dd>' +
                        '</dl></div>');
                }
            }
            else {

                $('#' + id).fadeOut("slow",function(){
                    $('.preview-section').slideUp('slow');
                    $('#' + id).remove();
                    //
                    if (!$('.bar-settings').length) {
                        $('.preview-section').after('<div class="zero-state full-width begin">'+
                            '<div class="begin-bg"></div>' +
                            '<article>' +
                            '<h1>Create Your First Bar</h1>' +
                            '<p>Looks like you haven\'t created any bars yet. Create your first one now!</p>' +
                            '<button class="createBtnEmpty">+ Create New Bar</button>' +
                            '</article>' +
                            '</div>');
                        $('.rate-view').remove();
                        $('.copyrights').remove();
                        $('.createBtn').hide();
                        location.reload();
                    }
                });
            }
        }
    });
}


function fileUpload(event) {
    var result = event.target.result;
    var filename = event.target.filename;
    var id = event.target.SelectorId;
    var loadingAnimation = $('#'+id).children().find('.loading');
    loadingAnimation.show();
    $.ajax({
        type:'POST',
        url:'upload.php',
        data:{
            data:result,
            name:filename
        },
        success:function(response){

            loadingAnimation.hide();
            resp_json = JSON.parse(response);
            if (resp_json.result == "success") {
                $('#' + id).children().find('.img').val('https://assets.apphero.co/images/uploads/' + resp_json.serverFile);
                update_iframe(id,false,$(".message-element[data-state='open']").index(".message-element")!= -1? $(".message-element[data-state='open']").index(".message-element"):0);
            }
            else {

            }
            //
        }
    });
}


function syncHeights(e) {
    var elements = e.children().find('.card');;
    for (i=0;i<elements.length;i++) {

        if (i % 2 == 0 && i != 1) {
            var currentHeight = $(elements[i]).children().eq(0).height();
            var nextHeight = $(elements[i+1]).children().eq(0).height();
            if (nextHeight > currentHeight) {
                currentHeight = nextHeight;
                $(elements[i]).children().eq(0).height(currentHeight);
            }
            else {
                nextHeight = currentHeight;
                $(elements[i+1]).children().eq(0).height(nextHeight);
            }
        }
    }

}

function purchase(plan) {
    $.ajax({
        type:"POST",
        url:"billing.php",
        data:{
            plan:plan
        },
        success:function(url) {
            window.location.href=url;
        }
    });
}



function update_page(){

    window.location.reload();

}

function hexToRgb(hex) {
    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
    } : null;
}


function prepareCTA(e,cta_type) {
    if (cta_type == 2) {

    }
}

function parse_string(string) {
    var stripped_string = string.replace('&quot;','');
    var parser = new DOMParser;
    var dom = parser.parseFromString(stripped_string,'text/html');
    var parsed_string = dom.body.textContent;
    return parsed_string;
}


function getMessages(e) {
    var messageArr = [];
    e.children('.message-element').each(function(i,item) {
        var message = {};
        message.text = $(this).children().find('.barText').html().replace("<br>","").replace("&lt;money&gt;","<span class='money'>").replace("<money>","<span class='money'>").replace("&lt;/money&gt;","</span>").replace("</money>","</span>").replace(/&nbsp;/gi, ' ');
        message.font = $(this).children().find('.fonts').val();
        message.cta_type = Number($(this).children().find('.call_to_action_selector').val());
        message.fontSize = $(this).children().find('.font-size').val();
        message.textColor = $(this).children().find('.textColor').val();
        message.icon = $(this).children().find('.icon-placeholder').val();
        message.iconColor = $(this).children().find('.iconColor').val();

        switch (message.cta_type) {
            case 1:
                message.btnTarget = $(this).children().find('.barTarget').val();
                message.linkType = $(this).children().find('.linkType').eq(message.cta_type - 1).val();
                break;

            case 2:
                message.btnColor = $(this).children().find('.btnColor').val();
                message.btnText = $(this).children().find('.btnText').val();
                message.btnTextColor = $(this).children().find('.btnTextColor').val();
                message.btnTarget = $(this).children().find('.btnTarget').val();
                message.btn_style = $(this).children().find('.button_style').val();
                message.linkType = $(this).children().find('.linkType').eq(message.cta_type - 1).val();
                break;

            case 3:
                message.btnText = $(this).children().find('.slinkText').val();
                message.btnTarget = $(this).children().find('.slinkTarget').val();
                message.btnTextColor = $(this).children().find('.slinkTextColor').val();
                message.linkType = $(this).children().find('.linkType').eq(message.cta_type - 1).val();
                break;

            case 4:
                message.btnColor = $(this).children().find('.couponColor').val();
                message.btnText = $(this).children().find('.couponText').val();
                message.btnTextColor = $(this).children().find('.couponTextColor').val();
                message.btn_style = $(this).children().find('.coupon_style').val();
                break;
        }
        messageArr.push(message);
    });
    return messageArr;
}


function focusHandler(e) {
    if ($(e.target).closest(".message-element").length != 0) {
        id = $(e.target).closest("section").attr("id");

        switch(e.type) {
            case 'focusin':
                loopstop = true;
                //editlock = true;
                break;
            case 'focusout':
                //editlock = false;
                //loopstop = false;
                //resumeAnimation($(e.target).closest(".message-element").index(".message-element"),id);

                //	loop_messages($(e.target).closest(".message-element").index(".message-element"),id);
                break;


        }
    }
}

function createMultiBar() {
    if ($('.bar_name').val() != "") {

        $.mod.close();
        var e = $('#new_bar');
        var message = getMessages(e);

        var bgColor = $('#bgColor').val();

        var name = $('.bar_name').val();

        var posTop = $('#posSelector').val();
        var posOnTop = $('#posOnTop').prop('checked');


        var opacity = $('#opacity').val();
        var domainTarget = e.children().find('.domain-target').val();
        var pageTarget = e.children().find('.page-target').val();
        var domainTargetOptions = JSON.stringify(masterDomains['new_bar']);
        var pageTargetOptions = JSON.stringify(masterPages['new_bar']);
        var countryOptions = JSON.stringify(masterGeo['new_bar']);
        var source_mode = e.children().find('.user_source').val();
        var utm_code = e.children().find('.utm_val').val();
        var source_url = e.children().find('.source_url').val();

        var hasIcon = $('.hasIcon').prop('checked');

        var bgImage = $('.img').val();
        var user_closable = e.children().find('.user_closable').prop('checked');
        var bar_dismiss_style = e.children().find('.bar_dismiss_style').val();

        var device_target = Number(e.children().find('input[name=device_target-new_bar]:checked').val());



        $('.preview-section').hide();
        $('#saveBtn').remove();
        $('.btns-container').prepend(
            '<button type="button" id="saveBtn" class="Polaris-Button Polaris-Button--primary Polaris-Button--disabled Polaris-Button--loading" disabled="" role="alert" aria-busy="true"><span class="Polaris-Button__Content">' +
            '<span class="Polaris-Button__Spinner"><svg viewBox="0 0 20 20" class="Polaris-Spinner Polaris-Spinner--colorWhite Polaris-Spinner--sizeSmall" aria-label="Loading" role="status">' +
            '<path class="Polaris-Spinner--colorWhite" d="M7.229 1.173a9.25 9.25 0 1 0 11.655 11.412 1.25 1.25 0 1 0-2.4-.698 6.75 6.75 0 1 1-8.506-8.329 1.25 1.25 0 1 0-.75-2.385z"></path></svg></span><span>Save</span></span></button>'
        );
        let multibar = {
            message:message,
            name:name,
            bgColor:bgColor,
            position:posTop,
            posOnTop:posOnTop,
            opacity:opacity,
            domainTarget:domainTarget,
            domainTargetOptions:domainTargetOptions,
            pageTarget:pageTarget,
            pageTargetOptions:pageTargetOptions,
            countryOptions:countryOptions,
            source_mode:source_mode,
            utm_code:utm_code,
            device_target:device_target,
            source_url:source_url,
            hasIcon:hasIcon,
            bgImage:bgImage,
            user_closable:user_closable,
            bar_dismiss_style:bar_dismiss_style
        }
        let bar_id =   Math.floor(Math.random() * 10000)
        multibar = JSON.stringify(multibar);
        $.ajax({
            type:"POST",
            url:"createMultiBar",
            data:{ multibar : multibar ,bar_id: bar_id,name:multibar.name,bar_statu:"activate" },
            success:function(result) {
                $('.preview-section').slideUp('slow');
                $('#new_bar').css('margin-top','inherit');
                let json = result.status
                if (json == "success") {
                    $('.preview-section').after('<div class="alert success"><dl><a class="close" href="#"></a>'+
                        '<dt>Success</dt>' +
                        '<dd>Your bar was successfully created. Please allow a couple of seconds, then refresh your store page to see results.</dd>' +
                        '</dl></div>');
                    setTimeout(function(){
                        window.location.href="settings";
                    },500);
                }
                else {
                    if (json == "unauthorized") {
                        $('.preview-section').after('<div class="alert error"><dl><a class="close" href="#"></a>'+
                            '<dt>Unauthorized</dt>' +
                            '<dd>It\'s either you have been logged out, or you don\'t have enought permissions to make these changes</dd>' +
                            '<dd><a href="install.html?shop=' + json.shop + '">Login again</a></dd>' +
                            '</dl></div>');
                    }

                    else {
                        $('.preview-section').after('<div class="alert error"><dl><a class="close" href="#"></a>'+
                            '<dt>Oops!</dt>' +
                            '<dd>Something went wrong. Please refresh this page and try again.</dd>' +
                            '</dl></div>');
                    }
                }
                $('body').animate({
                    scrollTop:0
                },500);

            }
        });

    }
    else {
        $('.bar_name').css('outline','2px solid #EF5D60');
    }
}

function createSingleBar() {
    if ($('.bar_name').val() != "") {

        $.mod.close();
        var e = $('#new_bar');
        var message = $('.barText').html().replace("<br>","").replace("&lt;money&gt;","<span class='money'>").replace("<money>","<span class='money'>").replace("&lt;/money&gt;","</span>").replace("</money>","</span>").replace(/&nbsp;/gi, ' ');
        var bgColor = $('#bgColor').val();
        var textColor = $('#textColor').val();
        var btnColor = "";
        var btnTextColor = "";
        var name = $('.bar_name').val();
        var btn_style = "";
        var posTop = $('#posSelector').val();
        var posOnTop = $('#posOnTop').prop('checked');
        var font = $('#fonts').val().replace(/\+/g, ' ').split(':')[0];
        var btnText = "";
        var btnTarget = "";
        var opacity = $('#opacity').val();
        var icon = $('#icon-placeholder').val();
        var domainTarget = e.children().find('.domain-target').val();
        var pageTarget = e.children().find('.page-target').val();
        var domainTargetOptions = JSON.stringify(masterDomains['new_bar']);
        var pageTargetOptions = JSON.stringify(masterPages['new_bar']);
        var countryOptions = JSON.stringify(masterGeo['new_bar']);
        var source_mode = e.children().find('.user_source').val();
        var utm_code = e.children().find('.utm_val').val();
        var source_url = e.children().find('.source_url').val();
        var iconColor = $('#iconColor').val();
        var hasIcon = $('.hasIcon').prop('checked');
        var fontSize = $('.font-size').val();
        var bgImage = $('.img').val();
        var user_closable = e.children().find('.user_closable').prop('checked');
        var bar_dismiss_style = e.children().find('.bar_dismiss_style').val();
        var cta_type = Number(e.children().find('.call_to_action_selector').val());
        var device_target = Number(e.children().find('input[name=device_target-new_bar]:checked').val());
        var linkType = "";

        switch (cta_type) {
            case 1:
                btnTarget = e.children().find('.barTarget').val();
                linkType = $('.clickable_bar_prefs').children().find('.linkType').val();
                break;

            case 2:
                btnColor = e.children().find('.btnColor').val();
                btnText = e.children().find('.btnText').val();
                btnTextColor = e.children().find('.btnTextColor').val();
                btnTarget = e.children().find('.btnTarget').val();
                btn_style = e.children().find('.button_style').val();
                linkType = $('.button_prefs').children().find('.linkType').val();
                break;

            case 3:
                btnText = e.children().find('.slinkText').val();
                btnTarget = e.children().find('.slinkTarget').val();
                btnTextColor = e.children().find('.slinkTextColor').val();
                linkType = $('.slink_prefs').children().find('.linkType').val();
                break;

            case 4:
                btnColor = e.children().find('.couponColor').val();
                btnText = e.children().find('.couponText').val();
                btnTextColor = e.children().find('.couponTextColor').val();
                btn_style = e.children().find('.coupon_style').val();
                break;

        }
        $('.preview-section').hide();
        $('#saveBtn').remove();
        $('.btns-container').prepend(
            '<button type="button" id="saveBtn" class="Polaris-Button Polaris-Button--primary Polaris-Button--disabled Polaris-Button--loading" disabled="" role="alert" aria-busy="true"><span class="Polaris-Button__Content">' +
            '<span class="Polaris-Button__Spinner"><svg viewBox="0 0 20 20" class="Polaris-Spinner Polaris-Spinner--colorWhite Polaris-Spinner--sizeSmall" aria-label="Loading" role="status">' +
            '<path class="Polaris-Spinner--colorWhite" d="M7.229 1.173a9.25 9.25 0 1 0 11.655 11.412 1.25 1.25 0 1 0-2.4-.698 6.75 6.75 0 1 1-8.506-8.329 1.25 1.25 0 1 0-.75-2.385z"></path></svg></span><span>Save</span></span></button>'
        );
        let SingleData = {
            message:message,
            name:name,
            bgColor:bgColor,
            textColor:textColor,
            btnColor:btnColor,
            position:posTop,
            posOnTop:posOnTop,
            font:font,
            btnTextColor:btnTextColor,
            btnText:btnText,
            btnTarget:btnTarget,
            opacity:opacity,
            icon:icon,
            domainTarget:domainTarget,
            domainTargetOptions:domainTargetOptions,
            pageTarget:pageTarget,
            pageTargetOptions:pageTargetOptions,
            countryOptions:countryOptions,
            source_mode:source_mode,
            utm_code:utm_code,
            device_target:device_target,
            source_url:source_url,
            iconColor:iconColor,
            hasIcon:hasIcon,
            fontSize:fontSize,
            bgImage:bgImage,
            user_closable:user_closable,
            bar_dismiss_style:bar_dismiss_style,
            cta_type:cta_type,
            btn_style:btn_style,
            linkType:linkType
        };
        let databar = JSON.stringify(SingleData);

        let bar_id =   Math.floor(Math.random() * 10000)
        $.ajax({
            type:"POST",
            url:"createBar",
            data:{ databar : databar ,bar_id: bar_id,name:SingleData.name,bar_statu:"activate" },
            success:function(result) {
                $('.preview-section').slideUp('slow');
                $('#new_bar').css('margin-top','inherit');

                let json = result.status
                if (json == "success") {
                    $('.preview-section').after('<div class="alert success"><dl><a class="close" href="#"></a>'+
                        '<dt>Success</dt>' +
                        '<dd>Your bar was successfully created. Please allow a couple of seconds, then refresh your store page to see results.</dd>' +
                        '</dl></div>');
                    setTimeout(function(){
                        window.location.href="settings";
                    },500);
                }
                else {
                    if (json == "unauthorized") {
                        $('.preview-section').after('<div class="alert error"><dl><a class="close" href="#"></a>'+
                            '<dt>Unauthorized</dt>' +
                            '<dd>It\'s either you have been logged out, or you don\'t have enought permissions to make these changes</dd>' +
                            '<dd><a href="install.html?shop=' + json.shop + '">Login again</a></dd>' +
                            '</dl></div>');
                    }

                    else {
                        $('.preview-section').after('<div class="alert error"><dl><a class="close" href="#"></a>'+
                            '<dt>Oops!</dt>' +
                            '<dd>Something went wrong. Please refresh this page and try again.</dd>' +
                            '</dl></div>');
                    }
                }
                $('body').animate({
                    scrollTop:0
                },500);

            }
        });

    }
    else {
        $('.bar_name').css('outline','2px solid #EF5D60');
    }
}




//CounterBar
function createCounterBar() {
    if ($('.bar_name').val() != "") {

        $.mod.close();
        var e = $('#new_bar');
        var message = $('.barText').html().replace("<br>","").replace("&lt;money&gt;","<span class='money'>").replace("<money>","<span class='money'>").replace("&lt;/money&gt;","</span>").replace("</money>","</span>").replace(/&nbsp;/gi, ' ');
        var bgColor = $('#bgColor').val();
        var textColor = $('#textColor').val();
        var btnColor = "";
        var btnTextColor = "";
        var name = $('.bar_name').val();
        var btn_style = "";
        var posTop = $('#posSelector').val();
        var posOnTop = $('#posOnTop').prop('checked');
        var font = $('#fonts').val().replace(/\+/g, ' ').split(':')[0];
        var btnText = "";
        var btnTarget = "";
        var opacity = $('#opacity').val();
        var icon = $('#icon-placeholder').val();
        var domainTarget = e.children().find('.domain-target').val();
        var pageTarget = e.children().find('.page-target').val();
        var domainTargetOptions = JSON.stringify(masterDomains['new_bar']);
        var pageTargetOptions = JSON.stringify(masterPages['new_bar']);
        var countryOptions = JSON.stringify(masterGeo['new_bar']);
        var source_mode = e.children().find('.user_source').val();
        var utm_code = e.children().find('.utm_val').val();
        var source_url = e.children().find('.source_url').val();
        var iconColor = $('#iconColor').val();
        var hasIcon = $('.hasIcon').prop('checked');
        var fontSize = $('.font-size').val();
        var bgImage = $('.img').val();
        var user_closable = e.children().find('.user_closable').prop('checked');
        var bar_dismiss_style = e.children().find('.bar_dismiss_style').val();
        var cta_type = Number(e.children().find('.call_to_action_selector').val());
        var device_target = Number(e.children().find('input[name=device_target-new_bar]:checked').val());
        var linkType = "";
        var timerFace = e.children().find(".counter-style").val();
        var timerBgColor = e.children().find(".timerBgColor").val();
        var timerBorderColor = e.children().find(".timerBorderColor").val();
        var timerTextColor = e.children().find(".timerTextColor").val();
        //var daysLabel = e.children().find(".daysInput").val() || "Days";
        var labelsHidden = e.children().find(".timerHideLabels").prop("checked")?"label-hidden":"";
        var days = e.children().find(".daysInput").val() || "0";
        var hours = e.children().find(".hoursInput").val() || "0";
        var minutes = e.children().find(".minutesInput").val() || "0";
        var timing_algo = e.children().find(".timing_algo_selector").val();
        var timer_end_action = e.children().find(".counter-finish-selector").val() || "0";
        var layout = e.children().find(".layoutSelector").val();
        var daysLabel = e.children().find(".daysLabelInput").val();
        var hoursLabel = e.children().find(".hoursLabelInput").val();
        var minutesLabel = e.children().find(".minutesLabelInput").val();
        var secondsLabel = e.children().find(".secondsLabelInput").val();
        var useCustomLabels = e.children().find(".customLabelCheck").prop("checked");

        var format = setTimerFormat(days,hours,minutes);



        let due = toMinutes(days,hours,minutes);

        let end_ms = calculateEndTime(due);

        var counterPrefs = {
            timerFace:timerFace,
            timerBgColor:timerBgColor,
            timerBorderColor:timerBorderColor,
            timerTextColor:timerTextColor,
            layout:layout,
            days:days,
            hours:hours,
            minutes:minutes,
            format:format,
            timing_algo:timing_algo,
            end_ms:end_ms,
            timer_end_action:timer_end_action,
            daysLabel:daysLabel,
            hoursLabel:hoursLabel,
            minutesLabel:minutesLabel,
            secondsLabel:secondsLabel,
            useCustomLabels:useCustomLabels
        };
        counterPrefs = JSON.stringify(counterPrefs);

        switch (cta_type) {
            case 1:
                btnTarget = e.children().find('.barTarget').val();
                linkType = $('.clickable_bar_prefs').children().find('.linkType').val();
                break;

            case 2:
                btnColor = e.children().find('.btnColor').val();
                btnText = e.children().find('.btnText').val();
                btnTextColor = e.children().find('.btnTextColor').val();
                btnTarget = e.children().find('.btnTarget').val();
                btn_style = e.children().find('.button_style').val();
                linkType = $('.button_prefs').children().find('.linkType').val();
                break;

            case 3:
                btnText = e.children().find('.slinkText').val();
                btnTarget = e.children().find('.slinkTarget').val();
                btnTextColor = e.children().find('.slinkTextColor').val();
                linkType = $('.slink_prefs').children().find('.linkType').val();
                break;

            case 4:
                btnColor = e.children().find('.couponColor').val();
                btnText = e.children().find('.couponText').val();
                btnTextColor = e.children().find('.couponTextColor').val();
                btn_style = e.children().find('.coupon_style').val();
                break;

        }
        let counterData ={
            message:message,
            name:name,
            bgColor:bgColor,
            textColor:textColor,
            btnColor:btnColor,
            position:posTop,
            posOnTop:posOnTop,
            font:font,
            btnTextColor:btnTextColor,
            btnText:btnText,
            btnTarget:btnTarget,
            opacity:opacity,
            icon:icon,
            domainTarget:domainTarget,
            domainTargetOptions:domainTargetOptions,
            pageTarget:pageTarget,
            pageTargetOptions:pageTargetOptions,
            countryOptions:countryOptions,
            source_mode:source_mode,
            utm_code:utm_code,
            device_target:device_target,
            source_url:source_url,
            iconColor:iconColor,
            hasIcon:hasIcon,
            fontSize:fontSize,
            bgImage:bgImage,
            user_closable:user_closable,
            bar_dismiss_style:bar_dismiss_style,
            cta_type:cta_type,
            btn_style:btn_style,
            linkType:linkType,
            counterPrefs:counterPrefs
        }
        counterData = JSON.stringify(counterData);

        $('.preview-section').hide();
        $('#saveBtn').remove();
        $('.btns-container').prepend(
            '<button type="button" id="saveBtn" class="Polaris-Button Polaris-Button--primary Polaris-Button--disabled Polaris-Button--loading" disabled="" role="alert" aria-busy="true"><span class="Polaris-Button__Content">' +
            '<span class="Polaris-Button__Spinner"><svg viewBox="0 0 20 20" class="Polaris-Spinner Polaris-Spinner--colorWhite Polaris-Spinner--sizeSmall" aria-label="Loading" role="status">' +
            '<path class="Polaris-Spinner--colorWhite" d="M7.229 1.173a9.25 9.25 0 1 0 11.655 11.412 1.25 1.25 0 1 0-2.4-.698 6.75 6.75 0 1 1-8.506-8.329 1.25 1.25 0 1 0-.75-2.385z"></path></svg></span><span>Save</span></span></button>'
        );
        let bar_id =   Math.floor(Math.random() * 10000)
        $.ajax({
            type:"POST",
            url:"createCounterBar",
            data:{ counterData : counterData ,bar_id: bar_id,name:counterData.name,bar_statu:"activate" },
            success:function(result) {
                $('.preview-section').slideUp('slow');
                $('#new_bar').css('margin-top','inherit');
                let json = result.status
                if (json == "success") {
                    $('.preview-section').after('<div class="alert success"><dl><a class="close" href="#"></a>'+
                        '<dt>Success</dt>' +
                        '<dd>Your bar was successfully created. Please allow a couple of seconds, then refresh your store page to see results.</dd>' +
                        '</dl></div>');
                    setTimeout(function(){
                        window.location.href="settings";
                    },500);
                }
                else {
                    if (json.reason == "unauthorized") {
                        $('.preview-section').after('<div class="alert error"><dl><a class="close" href="#"></a>'+
                            '<dt>Unauthorized</dt>' +
                            '<dd>It\'s either you have been logged out, or you don\'t have enought permissions to make these changes</dd>' +
                            '<dd><a href="install.html?shop=' + json.shop + '">Login again</a></dd>' +
                            '</dl></div>');
                    }

                    else {
                        $('.preview-section').after('<div class="alert error"><dl><a class="close" href="#"></a>'+
                            '<dt>Oops!</dt>' +
                            '<dd>Something went wrong. Please refresh this page and try again.</dd>' +
                            '</dl></div>');
                    }
                }
                $('body').animate({
                    scrollTop:0
                },500);

            }
        });

    }
    else {
        $('.bar_name').css('outline','2px solid #EF5D60');
    }
}








function toMinutes(days,hours,minutes) {
    let mins = (Number(days)*24*60) + (Number(hours) * 60) + Number(minutes);
    return mins;
}

function calculateEndTime(due) {
    let now_ms = new Date().getTime();
    let due_ms = (due * 1000 * 60) + now_ms;
    return due_ms;
}

function setTimerFormat(days,hours,minues) {
    var format = "";
    if (days != "0") {
        format = "d,h,";
    }
    if (hours != "0" && days == 0) {
        format += "h,";
    }

    format += "m,s";
    return format;
}

function barTypeClick(target,prem) {

    if ($(target).data("target") == "announcement") {
        window.top.location.href = "newbar";
    }
    else if ($(target).data("target") == "multi" && prem) {
        window.top.location.href="newbar-multi";
    }
    else if ($(target).data("target") == "multi" && !prem) {
        $('#ex1').mod({
            showClose:true,
            closeClass:"modal-close"
        });
    }
    else if ($(target).data("target") == "counter" && prem) {
        window.top.location.href="newbar-counter";
    }

    else if ($(target).data("target") == "counter" && !prem) {
        $('#ex1').mod({
            showClose:true,
            closeClass:"modal-close"
        });
    }

    else if ($(target).data("target") == "cart") {
        ga('create','UA-140965148-5','auto');

        ga('send','event','Cart Booster','click','Cart Booster');
        window.open("https://apps.shopify.com/sticky-add-to-cart-booster","_blank");
        //window.top.location.href = "https://apps.shopify.com/sticky-add-to-cart-booster";
    }
}

function resumeAnimation(index,id) {
    if ($("#"+id).data("type") == "multi" && $(".message-element[data-state='open']").length == 0) {
        setTimeout(function() {
            loopstop = false;
            loop_messages(index,id);
        },1000);
    }
}

function copyText() {
    var copyText = document.getElementById("markdown-body");
    let text = copyText.innerText;
    let textArea = document.createElement("textarea");
    textArea.value = text;
    textArea.style.width = "1px";
    textArea.style.height = "1px";
    textArea.style.background = "transparent";
    document.body.append(textArea);
    textArea.select();

    document.execCommand("copy");
    document.body.removeChild(textArea);
    var tooltip = document.getElementById("myTooltip");
    tooltip.innerHTML = "Copied";
    tooltip.style.visibility = "visible";
    tooltip.style.opacity = "1";
}

function outFunc() {
    var tooltip = document.getElementById("myTooltip");
    tooltip.style.visibility = "hidden";
    tooltip.style.opacity = "0";
}