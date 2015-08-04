
/*
APP.JS 
MODULO JS PARA LA APLICACION GLOBAL
*/

//PRESENTACION PRINCIPAL
function MaterPage(PAGINA) {
    $("#div_espera").show();
    $('#master_app').hide();
    $('#master_app').html('');
    $("#master_app").load(PAGINA,function(){
        $('#master_app').show(200);
        $("#div_espera").hide();
    });
}

//RETORNO DE OBJETO AJAX DE SERVIDOR
function objetoServidor(page, RESPUESTA) {
    var obj = null;
    $("#FrameCenter").hide();
    $("#div_espera").show();
    $.ajax({
        url: page,
        type: "post", data: '',
        success: function (data) {
            $("#FrameCenter").show();
            $("#div_espera").hide();
            RESPUESTA(data);
        },
        error: function (jqXHR, ajaxOptions, thrownError) {
            $("#div_espera").hide();
            $("#FrameCenter").show();
            alert(formatErrorMessage(jqXHR, ajaxOptions));
        }
    });
}

//LISTA DE EXCEPCIONES DE EJECUCION AJAX
function formatErrorMessage(jqXHR, exception) {
    if (jqXHR.status === 0) {
        return ('Not connected.\nPlease verify your network connection.');
    } else if (jqXHR.status == 404) {
        return ('The requested page not found. [404]');
    } else if (jqXHR.status == 500) {
        return ('Internal Server Error [500].');
    } else if (exception === 'parsererror') {
        return ('Requested JSON parse failed.');
    } else if (exception === 'timeout') {
        return ('Time out error.');
    } else if (exception === 'abort') {
        return ('Ajax request aborted.');
    } else {
        return ('Uncaught Error.\n' + jqXHR.responseText);
    }
}

//FECHA ACTUAL FORMATEADO CLIENTE
function fecActual() {
    var currentdate = new Date();
    var Year    = currentdate.getFullYear();
    var mes     = ((currentdate.getMonth().length + 1) === 1) ?     '0' + (currentdate.getMonth() + 1)    : (currentdate.getMonth() + 1);
    var day     = ((currentdate.getDate().length) === 1) ?          '0' + (currentdate.getDate()) : (currentdate.getDate());
    var hour    = ((currentdate.getHours().length) === 1) ?         '0' + (currentdate.getHours()) : (currentdate.getHours());
    var minute  = ((currentdate.getMinutes().length) === 1) ?       '0' + (currentdate.getMinutes()) : (currentdate.getMinutes());
    var datetime = Year + "-" + mes + "-" + day + " " + hour + ":" + minute;
    return datetime;
}

//LOGIN DE APLICACION TOMANDO EN CUENTA TBL_USUARIO
function Login() {
    BDConsulta("SELECT COUNT(*)CONT FROM TBL_USUARIO WHERE USUARIO='" + $("#txt_usuario").val() + "' AND CLAVE='" + $("#txt_pass").val() + "'", function (obj) {
        if (obj.CONT > 0) {
            BDActualizacion("UPDATE TBL_USUARIO SET ACTIVO='A'");
            MaterPage('pages/main.html');
        } else {
            alert("Error en Credenciales...");
        }
    });
}

//LOGOUT DE APLICACION TOMANDO EN CUENTA TBL_USUARIO
function Logout() {
    BDActualizacion("UPDATE TBL_USUARIO SET ACTIVO='I'");
    MaterPage('pages/login.html');
}

//PRESENTACION DIV CENTRAL MENU
function menuAPP(page) {

    if (page == 'pages/clientes.html') {
        $("#li_0").removeClass("active");
        $("#li_1").removeClass("active");
        $("#li_2").removeClass("active");
        $("#li_3").removeClass("active");
        $("#li_1").addClass("active"); 
    }
    if (page == 'pages/informacion.html') {
        $("#li_0").removeClass("active");
        $("#li_1").removeClass("active");
        $("#li_2").removeClass("active");
        $("#li_3").removeClass("active");
        $("#li_2").addClass("active"); 
    }

    $('#FrameCenter').hide();
    $('#FrameCenter').html('');
    $("#FrameCenter").load(page, function () {
        $('#FrameCenter').show();
        $("#div_espera").hide();
    });
}

//MENU LATERAL APARECE DESAPARECE AL CLICK
var var_menu_lateral = 1;
function menu_lateral() {
    if (var_menu_lateral == 1) {
        $("#menu_lateral").hide(30);
        var_menu_lateral = 0;
    } else {
        $("#menu_lateral").show(30);
        var_menu_lateral = 1;
    }
}

//CAPTURAR LONGITUD Y LATITUD
function CapturarGPS() { 
    
}

//CAPTURAR LONGITUD Y LATITUD
function CapturarCamara() {
    
}
