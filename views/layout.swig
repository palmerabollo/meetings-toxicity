<!DOCTYPE html>
<html lang='en'>
<head>
    <meta charset='utf-8'>
    <meta http-equiv='X-UA-Compatible' content='IE=edge'>
    <meta name='viewport' content='width=device-width, initial-scale=1'>
    <title>Meetings Are Toxic</title>

    <script src='/bower_components/jquery/dist/jquery.min.js'></script>

    <link href="//maxcdn.bootstrapcdn.com/bootstrap/3.3.2/css/bootstrap.min.css" rel="stylesheet">

    <link href="/bower_components/bootstrap-material-design/dist/css/roboto.min.css" rel="stylesheet">
    <link href="/bower_components/bootstrap-material-design/dist/css/material.min.css" rel="stylesheet">
    <link href="/bower_components/bootstrap-material-design/dist/css/ripples.min.css" rel="stylesheet">

    <link rel='stylesheet' href='/stylesheets/style.css'>
</head>
<body>
    <div class='container-fluid'>
        {% block body %}{% endblock %}
    </div>

    <footer>
        Meetings Are Toxic · 2015<br>
        Keep forwarding your meeting requests to <strong>meetingsaretoxic@gmail.com</strong><br>
    </footer>

    <script src="//maxcdn.bootstrapcdn.com/bootstrap/3.3.2/js/bootstrap.min.js"></script>

    <script src="/bower_components/bootstrap-material-design/dist/js/ripples.min.js"></script>
    <script src="/bower_components/bootstrap-material-design/dist/js/material.min.js"></script>
    <script>
        $(document).ready(function() {
            $.material.init();
        });
    </script>
</body>
</html>
