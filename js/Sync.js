/*
*Sync.JS 
*Manejo de Sincronizacion de Base de datos
*/
var syncServer = 'http://186.5.36.149:94/SyncVentas/';
var PROJECT_ID_GOOGLE = "994360885610";
var admPass = "sa";


//==================================================================================================
//CONFIGURACION DE CLIENTE
function Test() {
    objetoServidor($("#URL_SINCRONIZAR").val(), function (data) {
        alert(data);

        BDActualizacion("DELETE FROM TBL_PARAMETROS");
        BDActualizacion("INSERT INTO TBL_PARAMETROS VALUES('"+$("#URL_SINCRONIZAR").val()+"')");

        UsuariosDisponibles();
        $("#URL_SINCRONIZAR").prop('disabled', true);
    });
}

function UsuariosDisponibles() {
    objetoServidor($("#URL_SINCRONIZAR").val() + '/Sync/UsuariosDisponibles', function (data) {
        var lista_usuarios = "";
        var obj = jQuery.parseJSON(data);
        $.each(obj, function (i, valor) {
            lista_usuarios = lista_usuarios + "<li><a href='#' onclick='fijarUsuario(\"" + valor.CODINTERNO + "\",\"" + valor.NOMBRE + "\")'>" + valor.NOMBRE + "</a></li>";
        });
        $("#lista_usuarios").html(lista_usuarios);
    });
}

function GuardarUsuario() {
    var validacion = 0;
    var CODIGOINTERNO   =$("#CODIGOINTERNO").val();
    var NOMBRE          = $("#NOMBRE").val();
    var URL_SINCRONIZAR = $("#URL_SINCRONIZAR").val();
    var USUARIO         = $("#USUARIO").val();
    var CLAVE           = $("#CLAVE").val();
    var CLAVEADMIN      = $("#CLAVEADMIN").val();
    var IDGOOGLE        = $("#IDGOOGLE").val();

    if (CODIGOINTERNO == "" || NOMBRE == "" || URL_SINCRONIZAR == "" || USUARIO == "" || CLAVE == "" || CLAVEADMIN == "") {alert("Debe ingresar todos los datos del formulario..."); validacion = 1;}
    if (CLAVEADMIN != admPass){alert("Error en Contrasena Administrador"); validacion = 1;}

    if (validacion == 0){
        objetoServidor($("#URL_SINCRONIZAR").val() + '/Sync/GuardarUsuario?CODIGOINTERNO=' + CODIGOINTERNO + '&NOMBRE=' + NOMBRE + '&USUARIO=' + USUARIO + '&CLAVE=' + CLAVE + '&IDGOOGLE=' + IDGOOGLE, function (ID_USUARIO) {
            firstSync(ID_USUARIO, function (res_proceso) {
                alert(res_proceso);
                MaterPage('pages/login.html');
            });
        });
    }
}


//==================================================================================================
//INICIALIZACION DE BASE DE DATOS
function InitBaseDatos() {
    //TBL_PARAMETROS
    BDActualizacion("CREATE TABLE IF NOT EXISTS TBL_PARAMETROS " +
                            "(URL_SINCRONIZAR VARCHAR(20) null)");

    //TBL_USUARIO
    BDActualizacion("CREATE TABLE IF NOT EXISTS TBL_USUARIO " +
                            "(ID integer primary key, " +
                            "CODINTERNO VARCHAR(20) null, " +
                            "NOMBRE VARCHAR(50) null, " +
                            "USUARIO VARCHAR(50) null, " +
                            "CLAVE VARCHAR(50) null, " +
                            "IDGOOGLE VARCHAR(400) null, " +
                            "ACTIVO VARCHAR(1) null, " +
                            "FECUPDATE DATETIME null)");
    //TBL_CLIENTE
    BDActualizacion("CREATE TABLE IF NOT EXISTS TBL_CLIENTE " +
                        "(ID integer, " +
                        "CODINTERNO VARCHAR(50) null, " +
                        "NOMBRE varchar(300) NULL, " +
                        "ESTADO varchar(50) NULL, " +
                        "DIRFACTURA varchar(300) NULL, " +
                        "DIRDESTINO varchar(300) NULL, " +
                        "TELF1 varchar(50) NULL, " +
                        "TELF2 varchar(50) NULL, " +
                        "LATITUD varchar(50) NULL, " +
                        "LONGITUD varchar(50) NULL, " +
                        "IMAGEN TEXT NULL, " +
                        "COMENTARIO varchar(500) NULL, " +
                        "FECUPDATE DATETIME NULL)");

}

//==================================================================================================
//SINCRONIZACION
function firstSync(ID_USUARIO,RESPUESTA) {
    //TBL_USUARIO
    //============================================
    BDActualizacion("DELETE FROM TBL_USUARIO");
    BDActualizacion("INSERT INTO TBL_USUARIO VALUES(" + ID_USUARIO + ",'" + $("#CODIGOINTERNO").val() + "','" + $("#NOMBRE").val() + "','" + $("#USUARIO").val() + "','" + $("#CLAVE").val() + "','" + $("#IDGOOGLE").val() + "','" + "I" + "','" + "" + "')");
    
    //TBL_CLIENTE
    //============================================
    if ($("#ACEPTADISPOSE").val() == "on") {
        BDActualizacion("DELETE FROM TBL_CLIENTE");
        //INSERT CLIENTE
        objetoServidor($("#URL_SINCRONIZAR").val() + '/Sync/ClientesCargaInicial?ID_USUARIO=' + ID_USUARIO, function (data) {
            var obj = jQuery.parseJSON(data);
            $.each(obj, function (i, valor) {
                BDActualizacion("INSERT INTO TBL_CLIENTE VALUES(" + valor.ID + ",'" + valor.CODINTERNO + "','" + valor.NOMBRE + "','" + valor.ESTADO + "','" + valor.DIRFACTURA + "','" + valor.DIRDESTINO + "','" + valor.TELF1 + "','" + valor.TELF2 + "','" + valor.LATITUD + "','" + valor.LONGITUD + "','" + valor.IMAGEN + "','" + valor.COMENTARIO + "','" + valor.FECUPDATE + "')");
            });
        });
    }
    RESPUESTA('Proceso Finalizado');
}


//==================================================================================================
//FUNCIONES BASE DE DATOS
function errorCB(err) {alert("Error processing SQL: " + err.code);}
function successCB() {}

function BDActualizacion(sqlCommand) {
    var db = window.openDatabase("GVS", "1.0", "GVS Gestion Ventas Soyoda", 200000);
    db.transaction(function (tx) { tx.executeSql(sqlCommand) }, errorCB, successCB);
}

function BDConsulta(sqlCommand,RESULTADO) {
    var db = window.openDatabase("GVS", "1.0", "GVS Gestion Ventas Soyoda", 200000);
    db.transaction(function (tx) {
        tx.executeSql(sqlCommand, [], function (tx, rs) {
            var result = [];
            for (var i = 0; i < rs.rows.length; i++) {
                var row = rs.rows.item(i)
            }
            RESULTADO(row);
        })
    }, errorCB, successCB);
}


function BDConsultaOBJ(sqlCommand, RESULTADO) {
    var db = window.openDatabase("GVS", "1.0", "GVS Gestion Ventas Soyoda", 200000);
    db.transaction(function (tx) {
        tx.executeSql(sqlCommand, [], function (tx, rs) {
            RESULTADO(rs);
        })
    }, errorCB, successCB);
}
