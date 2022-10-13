$(document).ready(function(){

   
    const url = window.location.pathname;
    if(!url.includes("register") && !url.includes("login") && !url.includes("search")){
        localStorage.setItem('lastUrl', window.location.pathname);
     }

     if(url.includes("search")){
        localStorage.setItem('lastUrl', "/file");
     }
     $("#themenavbar li.nav-item>a").click(function(){
            localStorage.removeItem("searchResult");
     });


    // init select2

    $("#courseType").select2({
        placeholder:"Select a Course Type",
        dropdownPosition: 'below',
        width:"100%",
        allowClear: true
    });
    $("#university").select2({
        placeholder:"Select a University",
        dropdownPosition: 'below',
        width:"100%",
        allowClear: true
    });
    $("#doctype").select2({
        placeholder:"Select a Document Type",
        dropdownPosition: 'below',
        width:"100%",
        allowClear: true
        
    });
      
   

     $("#course_type_modal").select2({
        placeholder:"Select a Course Type",
         dropdownParent: $('#uploaddocsearch'),
         width:"100%"
    });
    $("#university_modal").select2({
        placeholder:"Select a University",
         dropdownParent: $('#uploaddocsearch'),
          width:"100%"
    });
    $("#doctypemodal").select2({
        placeholder:"Select a Document Type",
         dropdownParent: $('#uploaddocsearch'),
          width:"100%",
    });

    
    
    
    $("#uploaddoc").change(function(){
        $(".file_name").text($(this).val().split('\\').pop());
        $(".file_name").fadeIn("slow")
    });
    
    $(".navbar-toggler").click(function(e) {
        if(!$("header").hasClass("theme-bg shadow")){
            $("header").toggleClass("theme-bg shadow");
        }
    }) ;   

    if($(window).scrollTop() > 50){
         $("header").addClass("theme-bg shadow");
    }
    $(window).scroll(function() {    
        var scroll = $(window).scrollTop();
        if (scroll >= 50) {
            $("header").addClass("theme-bg shadow");
        }else{
            $("header").removeClass("theme-bg  shadow");
            $("#themenavbar").removeClass("show")
        }
    });
    
    

      toastr.options = {
            "closeButton": true,
            "debug": false,
            "newestOnTop": false,
            "progressBar": true,
            "positionClass": "toast-top-right",
            "preventDuplicates": true,
            "onclick": null,
            "showDuration": "1000",
            "hideDuration": "500",
            "timeOut": "5000",
            "extendedTimeOut": "1000",
            "showEasing": "swing",
            "hideEasing": "linear",
            "showMethod": "fadeIn",
            "hideMethod": "fadeOut"
            }

    
    });

    (function () {
  'use strict'

  // Fetch all the forms we want to apply custom Bootstrap validation styles to
  var forms = document.querySelectorAll('.needs-validation')

  // Loop over them and prevent submission
  Array.prototype.slice.call(forms)
    .forEach(function (form) {
      form.addEventListener('submit', function (event) {
        if (!form.checkValidity()) {
          event.preventDefault()
          event.stopPropagation()
            
        }else{
            if($("#password").val() != $("#passwordconfirm").val()) {
              event.preventDefault()
              event.stopPropagation()
               $("#passwordconfirm").addClass("is-invalid");
               
          }
        }
       
        
          
         
        form.classList.add('was-validated')
      }, false)
    })
})()

var tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'))
var tooltipList = tooltipTriggerList.map(function (tooltipTriggerEl) {
  return new bootstrap.Tooltip(tooltipTriggerEl)
})
