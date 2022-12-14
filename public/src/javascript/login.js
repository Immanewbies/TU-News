let err = 0;
// submit form
const loginForm = () => {
    const userInput = $(".user-box").val();
    const passInput = $(".pass-box").val();
    var dataJson = { "username": userInput, "password": passInput }

    $.ajax({
        url: `./api/login`,
        method: "POST",
        cache: false,
        data: JSON.stringify(dataJson)
    }).done(function (result) {
        console.log(result);
        if (result.status == 200) {
            //redirecting to main page from here.
            window.location.replace(result.Location);
        }
    }).fail(function (result) {
        if (result.status == 401) {
            alert("Username or Password Incorrect")
        }
    });;
};

$("#login-form").submit((e) => {
    e.preventDefault();
    loginForm();
});