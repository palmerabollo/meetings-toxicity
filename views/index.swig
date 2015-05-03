{% extends 'layout.swig' %}

{% block body %}
    <style>
    html, body {
        height: 100%;
        width: 100%;
    }

    body {
        background-image: url('/images/bg_home.jpg');
        background-size: 100% 100%;
    }

    div.info {
        background-color: #AAA939;
        color: #black;
        padding: 2em;
        margin: 5em auto;

    }
    </style>

    <div class='info clearfix'>
        <h1>Meetings Are Toxic</h1>

        <p class='lead'>
        Forward your meeting requests to meetingsaretoxic@gmail.com and get a toxicity
        report for free.
        </p>
    </div>
{% endblock %}
