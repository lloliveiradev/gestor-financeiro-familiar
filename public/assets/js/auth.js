
var currentUser;

function viewPassword() {
    $('.fa-eye-slash').toggle();
    $('.fa-eye').toggle();
    $('#password').attr('type', $('.fa-eye:visible').length > 0 ? 'text' : 'password');
};

async function signUp(email, password) {
    const valid = formValidate('signUp');
    if (!valid) return;
    preloader(true, 'Creating user...');
    firebase.auth().createUserWithEmailAndPassword(email, password).then(async (credential) => {
        var user = credential.user;
        console.info('@user', user);
        const model = {
            access_level: 1,
            birth_date: dateNow($('#birth_date').val()),
            email,
            name: $('#full_name').val(),
            uid: user.id,
        };
        await fetchAPI({
            path: `users`,
            method: 'POST',
            body: model
        });

        Swal.fire({
            text: "Account created successfully!",
            icon: "success",
            buttonsStyling: !1,
            confirmButtonText: "Okay!",
            customClass: { confirmButton: "btn btn-primary" }
        }).then((function (t) {
            window.location.href = "/index.html";
        }));
    }).catch((error) => {
        Swal.fire({
            text: error.message,
            icon: "error",
            buttonsStyling: !1,
            confirmButtonText: "Ok, got it!",
            customClass: { confirmButton: "btn btn-primary" }
        });
    }).finally(() => { preloader() });
};

function login(email, password) {
    console.info('obj', { email, password });
    const valid = formValidate('login');
    if (!valid) return;
    if (currentUser) firebase.auth().signOut();
    preloader(true, 'Loggin in...');
    firebase.auth().signInWithEmailAndPassword(email, password).then(function (result) {
        Swal.fire({
            text: "You've successfully logged in!",
            icon: "success",
            buttonsStyling: !1,
            confirmButtonText: "Okay!",
            customClass: { confirmButton: "btn btn-primary" }
        }).then((function (e) {
            window.location.href = "/pages/home.html";
        }));
    }).catch(function (error) {
        console.error(error);
        Swal.fire({
            text: error.message,
            icon: "error",
            buttonsStyling: !1,
            confirmButtonText: "Ok, got it!",
            customClass: { confirmButton: "btn btn-primary" }
        });
    }).finally(() => { preloader() });
};

function logout() {
    preloader(true, 'Loggin out...');
    firebase.auth().signOut().then(() => {
        window.location.href = "/index.html";
    }).catch((error) => {
        Swal.fire({
            text: error.message,
            icon: "error",
            buttonsStyling: !1,
            confirmButtonText: "Ok, got it!",
            customClass: { confirmButton: "btn btn-primary" }
        });
    }).finally(() => { preloader() });
};

function checkUser() {
    firebase.auth().onAuthStateChanged((user) => {
        if (user) {
            currentUser = user;
            window.location.href = "/pages/home.html";
        };
    });
};

function recoverPassword(email) {
    preloader(true, 'Sending email...');
    firebase.auth().sendPasswordResetEmail(email).then(() => {
        Swal.fire({
            text: "Password redefiniton email sent to your inbox.",
            icon: "success",
            buttonsStyling: !1,
            confirmButtonText: "Okay!",
            customClass: { confirmButton: "btn btn-primary" }
        }).then(function (e) {
            window.location.href = "/index.html";
        });
    }).catch(error => {
        Swal.fire({
            text: error.message,
            icon: "error",
            buttonsStyling: !1,
            confirmButtonText: "Ok, got it!",
            customClass: { confirmButton: "btn btn-primary" }
        });
    }).finally(() => { preloader() });
};