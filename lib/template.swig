<h1>Meeting Toxicity: {{ score.toxicity }}</h1>

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

<a href="http://localhost:3210/score/{{ mail.messageId }}">Details</a>

<hr>

<footer>
	Forward your meetings to meetingsaretoxic@gmail.com !<br>
	Every minute you avoid spending in a meeting is a minute you can get real work done instead.<br>
	<a href="http://meetingsaretoxic.com">Meetings Are Toxic</a>
</footer>