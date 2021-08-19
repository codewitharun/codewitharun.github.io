<!doctype html>
<html lang="en">

<head>
    <!-- Required meta tags -->
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Indie+Flower&family=Pacifico&display=swap" rel="stylesheet">
    <link href="https://fonts.googleapis.com/css2?family=Pacifico&display=swap" rel="stylesheet">
    <link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet">
    <link rel="stylesheet" href="./css/custom.css">
    <link rel="stylessheet" href="/bootstrap-5.0.2-dist/css/bootstrap.css">
    <script src="/bootstrap-5.0.2-dist/js/bootstrap.js"></script>
   <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.3/css/all.min.css">

    <script src="//maxcdn.bootstrapcdn.com/bootstrap/4.1.1/js/bootstrap.min.js"> </script>
    <script src="//cdnjs.cloudflare.com/ajax/libs/jquery/3.2.1/jquery.min.js"> </script>
    <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.1.3/css/bootstrap.min.css"
        crossorigin="anonymous">
    <link rel="stylesheet" href="https://use.fontawesome.com/releases/v5.5.0/css/all.css" crossorigin="anonymous">
    </script>
    <!-- Including the bootstrap CDN -->
    <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/4.4.1/css/bootstrap.min.css">
    <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.4.1/jquery.min.js">
    </script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/popper.js/1.16.0/umd/popper.min.js">
    </script>
    <script src="https://maxcdn.bootstrapcdn.com/bootstrap/4.4.1/js/bootstrap.min.js">
    </script>
    <!-- Bootstrap CSS -->
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/css/bootstrap.min.css" rel="stylesheet"
        integrity="sha384-EVSTQN3/azprG1Anm3QDgpJLIm9Nao0Yz1ztcQTwFspd3yD65VohhpuuCOmLASjC" crossorigin="anonymous">

    <title>Contact</title>
</head>
<nav class="navbar sticky-top shadow-sm navbar-expand-lg bg-dark navbar-dark py-3 py-lg-0 px-lg-5">
    <a href="index.html" class="navbar-brand ml-lg-3">
        <h1 class="m-0 display-5"><span class="text-dark">Arun</span>Kumar</h1>
    </a>
    <button type="button" class="navbar-toggler" data-toggle="collapse" data-target="#navbarCollapse">
        <span class="navbar-toggler-icon"></span>
    </button>
    <div class="collapse navbar-collapse px-lg-3" id="navbarCollapse">
        <div class="navbar-nav m-auto py-0">
            <a href="./index.html" class="nav-item nav-link  text-center">Home</a>
            <a href="./about.htm" class="nav-item nav-link text-center">About Me</a>
            <a href="./contact.htm" class="nav-item nav-link text-center active">Contact </a>
            <li class="nav-item dropdown text-center">
                <a class="nav-link dropdown-toggle " href="#" id="navbarDropdown" role="button" data-toggle="dropdown"
                aria-haspopup="true" aria-expanded="false">&nbsp;Others&nbsp;&nbsp;</a>
                <div class="dropdown-menu bg-dark " aria-labelledby="navbarDropdown">
                   
                    <a href="./submenu/portfolio.htm" class="dropdown-item nav-item nav-link text-center text-primary">Portfolio</a>
                    <a href="./submenu/services.htm" class="dropdown-item nav-item nav-link text-center text-primary">Services</a>
                    <a href="./submenu/skill.htm" class="dropdown-item  nav-item nav-link text-center text-primary">Skill</a>
           <a href="./submenu/qualifications.htm" class="dropdown-item nav-item nav-link text-center text-primary">Qualification</a>
                    <a href="./submenu/testimonial.htm" class=" dropdown-item nav-item nav-link text-center text-primary">Testimonial</a>
               
            </div>
        </li>
        </div>
        <a href="wa.link/g7kd5e" class="btn btn-menu d-none d-lg-block" style="background-color:#457efa; color: #ffffff;"><span class="fa fa-sms" aria-hidden="true"></span></a>
    </div>
</nav>


<body>
    <div class="d-none">
        fjk
    </div>
    <br>
    <div>
        
        <marquee class="bg-secondary text-warning"  behavior="alternate">Contact form is disabled</marquee>
    </div>
<!-- Contact Start -->
<div class="container-fluid py-5" id="contact">
    <div class="container" >
        <div class="position-relative d-flex align-items-center justify-content-center">
            <h1 class="display-1 text-uppercase text-white" style="-webkit-text-stroke: 1px #dee2e6;opacity: 10%">Contact</h1>
            <h1 class="position-absolute text-uppercase text-primary">Contact Me</h1>
        </div>
        <div class="row justify-content-center">
            <div class="col-lg-8">
                <div class="contact-form text-center">
                    <div id="success"></div>
                    <form aria-disabled="true" name="sentMessage" id="contactForm" novalidate="novalidate" action="" method="POST">
                        <div class="form-row">
                            <div class="control-group col-sm-6">
                                <input type="text" class="form-control p-4" id="name" placeholder="Your Name"
                                    required="required" data-validation-required-message="Please enter your name" />
                                <p class="help-block text-danger"></p>
                            </div>
                            <div class="control-group col-sm-6">
                                <input type="email" class="form-control p-4" id="email" placeholder="Your Email"
                                    required="required" data-validation-required-message="Please enter your email" />
                                <p class="help-block text-danger"></p>
                            </div>
                        </div>
                        <div class="control-group">
                            <input type="text" class="form-control p-4" id="subject" placeholder="Subject"
                                required="required" data-validation-required-message="Please enter a subject" />
                            <p class="help-block text-danger"></p>
                        </div>
                        <div class="control-group">
                            <textarea class="form-control py-3 px-4" rows="5" id="message" placeholder="Message"
                                required="required"
                                data-validation-required-message="Please enter your message"></textarea>
                            <p class="help-block text-danger"></p>
                        </div>
                        <div>
                            <button class="btn btn-outline-primary" disabled type="submit" id="sendMessageButton">Send
                                Message</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    </div>
</div>


<!-- Option 1: Bootstrap Bundle with Popper -->
<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/js/bootstrap.bundle.min.js"
    integrity="sha384-MrcW6ZMFYlzcLA8Nl+NtUVF0sA7MsXsP1UyJoMp4YLEuNSfAP+JcXn/tWtIaxVXM"
    crossorigin="anonymous"></script>
<a href="#" class="btn btn-outline-dark px-0 back-to-top"><i class="fa fa-angle-double-up"></i></a>
<!-- Footer Start -->
<div class="container-fluid bg-dark text-white mt-5 py-1 px-sm-1 px-md-5">
    <div class="container text-center py-5">

        <div class="d-flex justify-content-center mb-4">
            <a class="btn btn-light btn-social mr-2" href="https://twitter.com/Arunk4it"><i
                    class="fab fa-twitter"></i></a>
            <a class="btn btn-light btn-social mr-2" href="https://facebook.com/aadusdad"><i
                    class="fab fa-facebook-f"></i></a>
            <a class="btn btn-light btn-social mr-2" href="https://www.linkedin.com/in/arunk4it/"><i
                    class="fab fa-linkedin-in"></i></a>
            <a class="btn btn-light btn-social" href="https://instagram.com/arun.py_"><i
                    class="fab fa-instagram"></i></a>
            <div>

                <button id="bn" onclick="myFunction()">Dark</button>

                <script>
                    function myFunction() {
                        var element = document.body;
                        element.classList.toggle("dark");
                    }
                </script>
            </div>
        </div>

        <div class="d-flex justify-content-center mb-3">
            <a class="text-white" href="#">Privacy</a>
            <span class="px-3">|</span>
            <a class="text-white" href="#">Terms</a>
            <span class="px-3">|</span>
            <a class="text-white" href="#">FAQs</a>
            <span class="px-3">|</span>
            <a class="text-white" href="#">Help</a>
        </div>
        <p class="m-0">&copy; <a class="text-white font-weight-bold" href="#">Arun Singh</a>. All Rights Reserved.
            Designed by <a class="text-white font-weight-bold" href="mailto:whoarunsingh@gmail.com">Arun Singh</a>
        </p>

    </div>
</div>
<!-- Footer End -->
</body>

</html>
