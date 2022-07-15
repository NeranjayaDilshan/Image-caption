var home = $('#home');
let login = $('#login');
login.show();
home.hide()

function save() {
    console.log("Hello");
    login.hide()
    home.show()

}

function initiate() {

}
function preview(event) {

    var output = document.getElementById('output');
    output.src = URL.createObjectURL(event.target.files[0]);
    output.onload = function() {
      URL.revokeObjectURL(output.src) // free memory
    }

    
}