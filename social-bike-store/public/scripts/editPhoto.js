$(()=>{

    $( document ).ready( function() {
        $( "#editar" ).click( function() {
          $( "#editarFoto" ).toggle( 'slow' );
        });
      });

      $( document ).ready( function() {
        $( "#confirmaredicao" ).click( function() {
          $( "#editarFoto" ).hide();
        });
      });
});