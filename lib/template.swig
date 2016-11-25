<h1>Meeting Toxicity Level: {{ score.toxicity }}</h1>

<h2>
Expert advice:
{% if score.toxicity > 90 %}
	<span style="color: red;">No brainer, reject that meeting. NOW.</span>
{% elseif score.toxicity > 60 %}
	Reject that meeting.
{% elseif score.toxicity > 40 %}
	Be careful, toxicity signs ahead.
{% elseif score.toxicity > 20 %}
	Seems ok, accept it.
{% else %}
	Accept it!
{% endif %}
</h2>

<ul>
{% for factor in score.factors %}
	<li>{{ factor.description }}</li>
{% endfor %}
</ul>

<a href="http://{{ public_endpoint }}/report/{{ mail.messageId }}">Detailed report</a>

<hr>

<footer>
	Forward your meeting requests to meetingsaretoxic@gmail.com !<br>
	Every minute you avoid spending in a meeting is a minute you can get real work done instead.<br>
</footer>
