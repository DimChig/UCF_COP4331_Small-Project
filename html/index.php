<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Login/Signup Modal</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/css/bootstrap.min.css" rel="stylesheet"
        integrity="sha384-EVSTQN3/azprG1Anm3QDgpJLIm9Nao0Yz1ztcQTwFspd3yD65VohhpuuCOmLASjC" crossorigin="anonymous">
    <link rel="stylesheet" href="/css/styles.css">

</head>

<body>

    <div class="container d-flex justify-content-center align-items-center vh-100">
        <button type="button" class="btn btn-primary btn-lg shadow" data-bs-toggle="modal"
            data-bs-target="#exampleModal">
            Login / Signup
        </button>
    </div>

    <!-- Login Modal -->
    <div class="modal fade" id="exampleModal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
        <div class="modal-dialog">
            <div class="modal-content p-3">
                <div class="modal-header">
                    <h5 class="modal-title fw-bold text-primary" id="exampleModalLabel">Login</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body">
                    <form>
                        <div class="mb-3">
                            <label for="exampleInputEmail1" class="form-label">Email Address</label>
                            <input type="email" class="form-control" id="exampleInputEmail1"
                                aria-describedby="emailHelp">
                        </div>
                        <div class="mb-3">
                            <label for="exampleInputPassword1" class="form-label">Password</label>
                            <input type="password" class="form-control" id="exampleInputPassword1">
                        </div>
                        <div class="d-flex justify-content-between">
                            <a href="#" class="text-primary small">Forgot Password?</a>
                            <button type="submit" class="btn btn-primary">Login</button>
                        </div>
                    </form>
                </div>
                <div class="modal-footer justify-content-center">
                    <p class="mb-0">Don't have an account?
                        <button type="button" class="btn btn-link text-primary p-0" data-bs-dismiss="modal"
                            data-bs-toggle="modal" data-bs-target="#SignupModal">Sign Up</button>
                    </p>
                </div>
            </div>
        </div>
    </div>

    <!-- Signup Modal -->
    <div class="modal fade" id="SignupModal" tabindex="-1" aria-labelledby="SignupModalLabel" aria-hidden="true">
        <div class="modal-dialog">
            <div class="modal-content p-3">
                <div class="modal-header">
                    <h5 class="modal-title fw-bold text-primary" id="SignupModalLabel">Sign Up</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body">
                    <form>
                        <div class="mb-3">
                            <label for="SignupModalEmail" class="form-label">Email Address</label>
                            <input type="email" class="form-control" id="SignupModalEmail">
                        </div>
                        <div class="mb-3">
                            <label for="SignupModalPassword" class="form-label">Password</label>
                            <input type="password" class="form-control" id="SignupModalPassword">
                        </div>
                        <button type="submit" class="btn btn-primary w-100">Create Account</button>
                    </form>
                </div>
                <div id="servererror" hidden class="alert alert-danger" role="alert">
                   
                    </div>
                <div class="modal-footer justify-content-center">
                    <p class="mb-0">Already have an account?
                        <button type="button" class="btn btn-link text-primary p-0" data-bs-dismiss="modal"
                            data-bs-toggle="modal" data-bs-target="#exampleModal">Login</button>
                    </p>
                </div>
            </div>
        </div>
    </div>

    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/js/bootstrap.bundle.min.js"
        integrity="sha384-MrcW6ZMFYlzcLA8Nl+NtUVF0sA7MsXsP1UyJoMp4YLEuNSfAP+JcXn/tWtIaxVXM"
        crossorigin="anonymous"></script>
        <script src="/js/home.js"></script>

</body>

</html>
